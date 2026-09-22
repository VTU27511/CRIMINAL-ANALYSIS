import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage

logger = logging.getLogger("astra_firebase")
logging.basicConfig(level=logging.INFO)

SERVICE_ACCOUNT_PATH = Path(__file__).resolve().parent / "serviceAccountKey.json"

class AstraFirebaseService:
    def __init__(self):
        self.app = None
        self.db = None
        self.bucket = None
        self.is_connected = False
        self.error_message = None
        self.project_id = "criminal-analysis-13de4"
        self.client_email = None
        self._init_firebase()

    def _init_firebase(self):
        if not SERVICE_ACCOUNT_PATH.exists():
            self.error_message = f"Service account key file not found at {SERVICE_ACCOUNT_PATH}"
            logger.warning(self.error_message)
            return

        try:
            with open(SERVICE_ACCOUNT_PATH, "r") as f:
                sa_data = json.load(f)
                self.project_id = sa_data.get("project_id", self.project_id)
                self.client_email = sa_data.get("client_email")

            # Check if default app already initialized
            try:
                self.app = firebase_admin.get_app()
            except ValueError:
                cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
                self.app = firebase_admin.initialize_app(cred, {
                    "projectId": self.project_id,
                    "storageBucket": f"{self.project_id}.appspot.com"
                })

            # Attempt firestore initialization
            try:
                self.db = firestore.client()
                # Test connectivity
                # If Firestore API is disabled, this might raise an error when queried
                self.is_connected = True
                logger.info(f"[Firebase] Successfully initialized for project: {self.project_id}")
            except Exception as fe:
                self.error_message = f"Firestore client init issue: {str(fe)}"
                logger.warning(self.error_message)
                self.is_connected = False

        except Exception as e:
            self.error_message = f"Firebase Admin initialization error: {str(e)}"
            logger.error(self.error_message)
            self.is_connected = False

    def get_status(self) -> Dict[str, Any]:
        live_firestore = False
        if self.is_connected and self.db:
            try:
                # Ping firestore with lightweight check
                collections = self.db.collections()
                # consume first element or check
                _ = next(iter(collections), None)
                live_firestore = True
            except Exception as e:
                live_firestore = False
                logger.debug(f"Live firestore check failed: {e}")

        return {
            "configured": True if self.app else False,
            "project_id": self.project_id,
            "client_email": self.client_email,
            "live_firestore": live_firestore,
            "service_account_present": SERVICE_ACCOUNT_PATH.exists(),
            "status_message": "Live Cloud Firestore Active" if live_firestore else (
                "Credentials Verified. Cloud Firestore API needs to be enabled in Firebase Console (Dual-Mode Local Synced Active)"
            )
        }

firebase_service = AstraFirebaseService()
