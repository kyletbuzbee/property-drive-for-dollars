# PropertyDrive for Dollars - AI Real Estate Scout

## Project Overview
PropertyDrive is an AI-powered real estate scouting system designed to identify distressed properties at zero cost. It automates the "driving for dollars" process by virtually navigating neighborhoods using Google Street View and analyzing imagery with YOLOv8 computer vision to detect signs of property neglect (e.g., roof tarps, boarded windows, overgrown grass).

### Architecture
- **Frontend**: Next.js (App Router) dashboard for input and visualization.
- **Backend**: FastAPI (Python) service for image processing, AI detection, and data enrichment.
- **AI Model**: Local YOLOv8 (Ultralytics) running on CPU/GPU.
- **Data Pipeline**:
    1. Geocode addresses/zip codes via Geopy.
    2. Fetch Street View images via Google Maps Static API.
    3. Run YOLOv8 to detect distress indicators.
    4. Scrape Zillow/Redfin for Zestimate and property details.
    5. Sync flagged leads to Google Sheets via the Google Sheets API.

---

## Technical Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide React, Google APIs Client.
- **Backend**: Python 3.10+, FastAPI, Ultralytics (YOLOv8), BeautifulSoup4, Geopy, Uvicorn.
- **External APIs**: 
    - Google Street View Static API (Imagery)
    - Google Sheets API (Database)
    - OpenStreetMap/Nominatim (Geocoding)

---

## Building and Running

### Backend Setup
1. Navigate to `backend/`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` (copy from `.env.example`):
   - `GOOGLE_MAPS_API_KEY`: Required for Street View imagery.
   - `MONTHLY_REQUEST_CAP`: Default 28,000 (Google Maps free tier limit).
5. Start the server:
   ```bash
   python main.py
   ```
   *The backend runs at `http://localhost:8000`.*

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env.local` (copy from `.env.example`):
   - `GOOGLE_SHEET_ID`: Target spreadsheet ID.
   - `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`: Path to your Google Cloud JSON key.
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend runs at `http://localhost:3000`.*

---

## Development Conventions

### Backend
- **Service-Oriented Architecture**: Business logic is encapsulated in `backend/services/`.
- **Static Assets**: Street View images are cached in `backend/temp_images/` and served via `/images` mount.
- **AI Threshold**: The distress detection confidence threshold (default 60%) is managed in `backend/services/yolo_detector.py`.
- **Rate Limiting**: API usage is tracked in-memory via `services/rate_limiter.py` to stay within Google's free tier.

### Frontend
- **App Router**: Uses Next.js App Router pattern (`app/` directory).
- **Client Components**: Interactive dashboard and sidebar use `'use client'`.
- **API Routes**: Lead synchronization to Google Sheets is handled via `app/api/leads/route.js` to protect service account credentials.

### Database (Google Sheets)
- Flagged properties are appended to `Sheet1` with columns: `Timestamp`, `Address`, `Image URL`, `Indicators`, `Confidence`, `Zestimate`, `Year Built`, `Distressed`.

---

## Key Files
- `backend/main.py`: Entry point for FastAPI and the `/scout` endpoint logic.
- `backend/services/yolo_detector.py`: Core YOLOv8 implementation and label mapping.
- `frontend/components/Dashboard.js`: Main frontend logic for triggerring scouts and syncing leads.
- `frontend/app/api/leads/route.js`: Server-side integration with Google Sheets.
