from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import os
import sys
from dotenv import load_dotenv

from db.session import async_session, init_db
from db.models import DistressedLead
from db import crud
from services.street_view import StreetViewService
from services.yolo_detector import YOLODetector
from services.property_scraper import PropertyScraper
from services.rate_limiter import RateLimiter

load_dotenv()

required_env_vars = {
    "GOOGLE_MAPS_API_KEY": "Required for Street View imagery",
}

missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    print("ERROR: Missing required environment variables:")
    for var in missing_vars:
        print(f"  - {var}: {required_env_vars[var]}")
    print("\nPlease configure your .env file (see .env.example for reference)")
    sys.exit(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="PropertyDrive Scout API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("temp_images", exist_ok=True)
app.mount("/images", StaticFiles(directory="temp_images"), name="images")

street_view = StreetViewService(api_key=os.getenv("GOOGLE_MAPS_API_KEY", ""))
yolo_detector = YOLODetector()
property_scraper = PropertyScraper()
rate_limiter = RateLimiter(monthly_cap=int(os.getenv("MONTHLY_REQUEST_CAP", 28000)))


class ScoutRequest(BaseModel):
    zip_code: Optional[str] = None
    addresses: Optional[list[str]] = None


class LeadResponse(BaseModel):
    id: int
    address: str
    city: str
    image_url: Optional[str] = None
    indicators: list[str]
    confidence: float
    zestimate: Optional[float] = None
    yearBuilt: Optional[int] = None
    distressed: bool


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "requests_remaining": rate_limiter.get_remaining(),
        "monthly_cap": rate_limiter.monthly_cap,
    }


@app.post("/scout")
async def scout_properties(request: ScoutRequest):
    if not request.zip_code and not request.addresses:
        raise HTTPException(status_code=400, detail="Provide zip_code or addresses")

    addresses = []
    if request.addresses:
        addresses = request.addresses
    elif request.zip_code:
        from services.address_fetcher import get_addresses_for_zip

        addresses = await get_addresses_for_zip(request.zip_code)

    if not addresses:
        raise HTTPException(status_code=404, detail="No addresses found")

    properties = []
    scanned = 0
    distressed_count = 0
    total_value = 0

    for addr in addresses:
        if not rate_limiter.can_make_request():
            break

        try:
            from geopy.geocoders import Nominatim

            geolocator = Nominatim(user_agent="propertydrive")
            location = geolocator.geocode(addr, timeout=10)  # type: ignore
            if not location:
                continue

            rate_limiter.increment()
            scanned += 1

            image_path = await street_view.get_street_view_image(
                lat=location.latitude,  # type: ignore
                lng=location.longitude,  # type: ignore
                address=addr,
            )

            if not image_path:
                continue

            detection = yolo_detector.detect_distress(image_path)

            image_url = f"http://localhost:8000/images/{os.path.basename(image_path)}"

            zestimate = None
            year_built = None
            if detection["distressed"]:
                scrape_result = await property_scraper.scrape_property(addr)
                zestimate = scrape_result.get("zestimate")
                year_built = scrape_result.get("year_built")
                distressed_count += 1
                if zestimate:
                    total_value += zestimate

            address_parts = location.address.split(",") if location.address else []  # type: ignore
            city = address_parts[1].strip() if len(address_parts) > 1 else ""

            async with async_session() as db:
                lead = await crud.create_lead(
                    db=db,
                    address=addr,
                    city=city,
                    image_url=image_url,
                    indicators=detection["indicators"],
                    confidence=detection["max_confidence"],
                    zestimate=zestimate,
                    year_built=year_built,
                    distressed=detection["distressed"],
                )
                await db.commit()
                properties.append(lead.to_dict())

        except Exception as e:
            print(f"Error processing {addr}: {e}")
            continue

    return {
        "properties": properties,
        "stats": {
            "scanned": scanned,
            "distressed": distressed_count,
            "totalValue": total_value,
        },
        "rate_limit": {
            "remaining": rate_limiter.get_remaining(),
            "used": rate_limiter.get_used(),
        },
    }


@app.get("/leads", response_model=list[LeadResponse])
async def get_leads(limit: int = 100, offset: int = 0):
    async with async_session() as db:
        leads = await crud.get_all_leads(db, limit=limit, offset=offset)
        return [lead.to_dict() for lead in leads]


@app.get("/leads/distressed", response_model=list[LeadResponse])
async def get_distressed_leads(limit: int = 100):
    async with async_session() as db:
        leads = await crud.get_distressed_leads(db, limit=limit)
        return [lead.to_dict() for lead in leads]


@app.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int):
    async with async_session() as db:
        lead = await crud.get_lead_by_id(db, lead_id)
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead.to_dict()


@app.get("/rate-limit")
async def get_rate_limit():
    return {
        "remaining": rate_limiter.get_remaining(),
        "used": rate_limiter.get_used(),
        "monthly_cap": rate_limiter.monthly_cap,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("BACKEND_HOST", "0.0.0.0"),
        port=int(os.getenv("BACKEND_PORT", 8000)),
        reload=True,
    )
