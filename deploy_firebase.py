import os
import hashlib
import gzip
import json
import mimetypes
from pathlib import Path
import google.auth.transport.requests
import google.oauth2.service_account
import requests

PROJECT_ID = 'criminal-analysis-13de4'
SITE_ID = 'astra-crime-matrix'
DIST_DIR = Path(r'C:\xampp\htdocs\Criminal_Analysis\dist')
SA_PATH = Path(r'C:\xampp\htdocs\Criminal_Analysis\backend\serviceAccountKey.json')

def deploy():
    print(f'[*] Authenticating with service account for {PROJECT_ID}...')
    creds = google.oauth2.service_account.Credentials.from_service_account_file(
        str(SA_PATH),
        scopes=['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/firebase']
    )
    req = google.auth.transport.requests.Request()
    creds.refresh(req)
    token = creds.token
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    print('[*] Creating new Firebase Hosting version...')
    version_url = f'https://firebasehosting.googleapis.com/v1beta1/sites/{SITE_ID}/versions'
    version_config = {
        'config': {
            'rewrites': [
                {
                    'glob': '**',
                    'path': '/index.html'
                }
            ]
        }
    }
    r = requests.post(version_url, headers=headers, json=version_config)
    r.raise_for_status()
    version_data = r.json()
    version_name = version_data['name']
    print(f'[+] Version created: {version_name}')

    print('[*] Compressing files (gzip) and calculating sha256 hashes in frontend/dist...')
    files_map = {}
    path_to_gz = {}
    for p in DIST_DIR.rglob('*'):
        if p.is_file():
            rel_path = '/' + p.relative_to(DIST_DIR).as_posix()
            raw_bytes = p.read_bytes()
            gz_bytes = gzip.compress(raw_bytes)
            gz_hash = hashlib.sha256(gz_bytes).hexdigest()
            files_map[rel_path] = gz_hash
            path_to_gz[gz_hash] = (p, gz_bytes)

    print(f'[*] Found {len(files_map)} files to deploy. Populating files to version...')
    populate_url = f'https://firebasehosting.googleapis.com/v1beta1/{version_name}:populateFiles'
    r = requests.post(populate_url, headers=headers, json={'files': files_map})
    r.raise_for_status()
    pop_res = r.json()
    upload_url = pop_res.get('uploadUrl')
    required_hashes = pop_res.get('uploadRequiredHashes', [])
    print(f'[+] Upload required for {len(required_hashes)} files (Upload URL: {upload_url})')

    for h in required_hashes:
        file_path, gz_data = path_to_gz[h]
        upload_endpoint = f'{upload_url}/{h}'
        up_headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/octet-stream'
        }
        up_res = requests.post(upload_endpoint, headers=up_headers, data=gz_data)
        up_res.raise_for_status()
        print(f'    -> Uploaded {file_path.name} ({len(gz_data)} bytes gzipped)')

    print('[*] Finalizing version status to FINALIZED...')
    patch_url = f'https://firebasehosting.googleapis.com/v1beta1/{version_name}?update_mask=status'
    r = requests.patch(patch_url, headers=headers, json={'status': 'FINALIZED'})
    r.raise_for_status()
    print('[+] Version finalized!')

    print('[*] Releasing version to live hosting site...')
    release_url = f'https://firebasehosting.googleapis.com/v1beta1/sites/{SITE_ID}/releases?versionName={version_name}'
    r = requests.post(release_url, headers=headers)
    r.raise_for_status()
    print('[+] Release published successfully!')

    site_url = f'https://{SITE_ID}.web.app'
    alt_url = f'https://{PROJECT_ID}.firebaseapp.com'
    print('=======================================================')
    print('SUCCESS! Project deployed to Firebase Hosting:')
    print(f'Hosting URL: {site_url}')
    print(f'Firebase URL: {alt_url}')
    print('=======================================================')

if __name__ == '__main__':
    deploy()
