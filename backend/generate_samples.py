"""
Generates synthetic sample FIR files in TXT, DOCX, and PDF formats for testing.
"""

import os
from pathlib import Path
import docx
import pypdf

OUTPUT_DIR = Path(__file__).resolve().parent / "sample_firs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 1. TXT Sample: Cyber Extortion & Mule Network
TXT_CONTENT = """FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C. / Section 173 Bharatiya Nagarik Suraksha Sanhita 2023)

1. District: New Delhi, Police Station: Connaught Place PS, Year: 2026
2. FIR Number: FIR-2026-DL-00189, Date & Time Reported: 01-Mar-2026 14:20 hrs
3. Acts & Sections: BNS Section 318, 308, 61 | IPC Section 420, 384, 120B | Sec 66D Information Technology Act
4. Complainant / Informant: Rajiv Mehra (Director, Apex FinTech Pvt Ltd)
5. Suspects / Persons of Interest: Karan Malhotra @ Tiger, Sameer Qureshi (Banker / Mule Distributor)
6. Place of Occurrence: Connaught Place, Central Delhi (Coordinates: 28.6315 N, 77.2167 E)
7. Financial Entity: Flagged Beneficiary Account HDFC-MULE-4819 and ICICI-MULE-9021
8. Involved Vehicles: Black Scorpio DL-3C-AZ-9901 observed conducting surveillance
9. Flagged Phone Numbers: +91 98711 02934, +91 99102 38472

Brief Narrative:
The complainant reported that starting 27-Feb-2026, an organized criminal syndicate impersonating central financial enforcement directorate officials contacted executive management. Utilizing spoofed VOIP lines and forged arrest warrants, the syndicate coerced Rajiv Mehra to authorize two emergency RTGS transfers totaling INR 1,45,00,000 to primary mule account HDFC-MULE-4819. Telecommunication records indicate burner number +91 98711 02934 was utilized for coercive transmission. ANPR cameras logged suspect vehicle DL-3C-AZ-9901 in Connaught Place inner circle at 22:42 hours. Investigative analysis suggests an interstate syndicate involving suspect Karan Malhotra and mule operator Sameer Qureshi.
"""

txt_path = OUTPUT_DIR / "FIR_2026_DL_00189_Cyber_Fraud.txt"
with open(txt_path, "w", encoding="utf-8") as f:
    f.write(TXT_CONTENT)
print(f"Generated TXT: {txt_path}")

# 2. DOCX Sample: Armed Highway Dacoity
doc = docx.Document()
doc.add_heading("DELHI POLICE - FIRST INFORMATION REPORT", level=0)
doc.add_paragraph("POLICE STATION: Hauz Khas PS, South District, New Delhi")
doc.add_paragraph("FIR NUMBER: FIR-2026-DL-00190 | CASE REF: CR-2026-HK-8812")
doc.add_paragraph("STATUTES: Bharatiya Nyaya Sanhita Sec 309 (Robbery), Sec 311 (Deadly Weapon), Sec 3(5) (Joint Liability) | IPC 392, 397 | Arms Act 25/27")
doc.add_paragraph("OCCURRENCE OF OFFENCE: Date: 02-Mar-2026, Time: 23:15 hours at AIIMS Flyover Ring Road, South Delhi")
doc.add_paragraph("COMPLAINANT: Sunil Verma (Logistics Supervisor, SecureVault Cash Transit)")

doc.add_heading("Suspects & Vehicles Identified:", level=2)
doc.add_paragraph("• Primary Person of Interest: Vikky Pehelwan (Alias: The Enforcer)")
doc.add_paragraph("• Accompanying Person of Interest: Unidentified Male associate")
doc.add_paragraph("• Suspect Escape Conveyance: White Toyota Fortuner HR-26-CR-4412 (Reported stolen)")
doc.add_paragraph("• Intercepted Cash Consignment: INR 45,00,000 in currency bundles")
doc.add_paragraph("• Cellular Contact Traced: +91 97182 99012")

doc.add_heading("Incident Summary Statement:", level=2)
doc.add_paragraph(
    "On 02-Mar-2026 at 23:15 hours, while the cash van of SecureVault was transiting towards the AIIMS South Ring Road flyover, "
    "a white Fortuner HR-26-CR-4412 forcibly overtook and blocked the transit corridor. Two armed individuals exited displaying "
    "a country pistol (Desi Katta) and iron rods. The driver was assaulted and cash trunks containing INR 45 Lakhs were looted. "
    "The assailants fled towards the Gurgaon border toll. Witnesses identified the primary suspect matching the dossier of Vikky Pehelwan."
)
docx_path = OUTPUT_DIR / "FIR_2026_DL_00190_Highway_Interception.docx"
doc.save(str(docx_path))
print(f"Generated DOCX: {docx_path}")

# 3. PDF Sample: Generated using minimal pure-python canvas or pypdf stream
# Since reportlab is not required, we can write a valid PDF text stream using Python
pdf_content = (
    b"%PDF-1.4\n"
    b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
    b"4 0 obj\n<< /Length 580 >>\nstream\n"
    b"BT\n/F1 12 Tf\n50 720 Td\n(MUMBAI POLICE CRIME BRANCH - FIR DOSSIER) Tj\n"
    b"0 -25 Td\n(FIR No: FIR-2026-MH-00412 | Police Station: Bandra Kurla Complex BKC PS) Tj\n"
    b"0 -20 Td\n(Crime Classification: Organized Contraband Trafficking & NDPS Act Sec 8/21/29) Tj\n"
    b"0 -20 Td\n(BNS Sections: Section 61 Criminal Conspiracy, Special NDPS Provisions) Tj\n"
    b"0 -20 Td\n(Suspect / Person of Interest: Iqbal Ansari @ Bhaijaan, Karan Malhotra @ Tiger) Tj\n"
    b"0 -20 Td\n(Location: Kurla West Industrial Zone, Mumbai) Tj\n"
    b"0 -20 Td\n(Corporate Front: Shadow Logistics LLP | Reg: U74999MH2022PTC8912) Tj\n"
    b"0 -20 Td\n(Vehicle Sighted: Dark Blue Tata Nexon EV MH-02-EE-8899) Tj\n"
    b"0 -20 Td\n(Communication SIM: +91 98200 44321) Tj\n"
    b"0 -25 Td\n(Case Summary: Consignment of illicit contraband valued at INR 3.2 Crores intercepted) Tj\n"
    b"0 -15 Td\n(at Kurla godown leased by Shadow Logistics LLP. Direct links to suspect Karan Malhotra.) Tj\n"
    b"ET\nendstream\nendobj\n"
    b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    b"xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000244 00000 n \n0000000877 00000 n \n"
    b"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n948\n%%EOF\n"
)
pdf_path = OUTPUT_DIR / "FIR_2026_MH_00412_Narcotics_Syndicate.pdf"
with open(pdf_path, "wb") as f:
    f.write(pdf_content)
print(f"Generated PDF: {pdf_path}")
