# Criminal Analysis Platform (Team Astra)

> AI-Powered Forensic Crime Analytics, Syndicate Link Analysis & Investigative Copilot Platform.

[![Live App](https://img.shields.io/badge/Live_Deployment-Firebase_Hosting-blue?style=for-the-badge&logo=firebase)](https://astra-crime-matrix.web.app)

---

## 🌟 Key Features

1. **Spider-Web Entity Link Network (`/network`)**
   - High-performance Cytoscape force-directed graph.
   - 1-Click dynamic filters: *Only Names*, *Only Locations*, *Only Vehicles*, *Only Phones*, and *All Entities*.
   - Forensic BFS shortest-path triangulation between suspects and criminal hubs.

2. **Crime Hotspots GIS Map (`/hotspots`)**
   - Real-world interactive GIS mapping with crime clusters, danger indices, and jurisdictional search.

3. **FIR Ingestion & Forensic Extraction (`/fir/upload`)**
   - Support for CSV and Excel files.
   - Automatic entity extraction (Suspects, Phones, Locations, Vehicles, Penal Codes).

4. **AI Investigation Copilot (`/investigation-assistant`)**
   - Chatbot assistant grounded in ingested dossiers and chargesheet evidence.

5. **Crime Analytics & Predictive Radar (`/crime-analytics`, `/predictions`)**
   - Interactive charts, crime category breakdowns, and recidivism risk radar.

6. **Role-Based Access Control**
   - Isolated profiles for **Inspector** and **Senior Official** roles.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Run with 1-Click (Windows)
Double-click:
```text
start_criminal_analysis.bat
```
*(Automatically starts both Frontend on port 5173 and Backend on port 8000, and opens your browser)*

### 3. Manual Run

#### Frontend:
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

#### Backend:
```bash
cd backend
python -m uvicorn astra_api:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ☁️ Cloud Deployment
Deployed on Firebase Hosting:
👉 **[https://astra-crime-matrix.web.app](https://astra-crime-matrix.web.app)**
