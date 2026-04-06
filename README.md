# Property Drive for Dollars

A comprehensive property intelligence platform that uses AI computer vision to identify distressed real estate opportunities from satellite imagery.

## 🚨 Security Notice

**This application contains sensitive information that has been exposed in the repository. Immediate action required:**

- API keys and service account credentials have been committed to version control
- These must be removed and proper environment variable management implemented
- The application has been secured but you must configure your own credentials

## Features

- **AI-Powered Detection**: Uses YOLOv8 to analyze street view imagery for distress indicators
- **Comprehensive Scanning**: Processes neighborhoods by ZIP code or custom address lists
- **Real-time Intelligence**: Provides confidence scores and distress indicators
- **Lead Management**: Tracks and stores identified opportunities
- **Rate Limiting**: Built-in API quota management

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google Maps Platform API Key

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Run the backend:**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit with your backend URL
   ```

4. **Run the frontend:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)

```bash
# Google Maps Platform API Key
GOOGLE_MAPS_API_KEY=your_api_key_here

# Monthly API request cap
MONTHLY_REQUEST_CAP=28000

# Backend server configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
BACKEND_URL=http://localhost:8000

# CORS allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Logging
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Google Sheets Integration (optional)
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account.json
```

## API Endpoints

- `GET /health` - Health check
- `POST /scout` - Scan properties
- `GET /rate-limit` - Check API usage
- `GET /leads` - Retrieve stored leads

## Architecture

### Backend (FastAPI)
- **Street View Service**: Fetches Google Street View imagery
- **YOLO Detector**: Analyzes images for distress indicators
- **Property Scraper**: Extracts property data (currently disabled)
- **Rate Limiter**: Manages API quota
- **Address Fetcher**: Resolves ZIP codes to addresses (currently disabled)

### Frontend (Next.js)
- **Dashboard**: Main scanning interface
- **Property Table**: Results display
- **Lead Storage**: Google Sheets integration (optional)

## Security Considerations

- All sensitive credentials have been removed from version control
- Web scraping functionality is disabled due to legal concerns
- CORS is configured for specific origins
- Input validation implemented
- Rate limiting prevents abuse

## Development Status

✅ **Completed:**
- Removed exposed credentials
- Implemented proper environment variable management
- Added comprehensive error handling and logging
- Input validation for all endpoints
- Configurable CORS settings
- Made API endpoints configurable
- Thread-safe rate limiting
- Disabled illegal web scraping

🔄 **In Progress:**
- Database integration (Google Sheets optional)
- Authentication system
- Comprehensive testing
- Containerization

## Legal Notice

This application is for educational and research purposes. Web scraping of real estate websites violates terms of service and may be illegal. Property data should be obtained through licensed APIs or official sources.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.