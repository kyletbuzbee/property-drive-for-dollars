import httpx
import os
import hashlib
import time


class StreetViewService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://maps.googleapis.com/maps/api/streetview"
        os.makedirs("temp_images", exist_ok=True)

    async def get_street_view_image(
        self,
        lat: float,
        lng: float,
        address: str,
        size: str = "640x480",
        heading: int = 0,
        fov: int = 90,
    ) -> str | None:
        safe_name = hashlib.md5(f"{address}_{heading}".encode()).hexdigest()
        filepath = f"temp_images/{safe_name}.jpg"

        if os.path.exists(filepath):
            return filepath

        params = {
            "size": size,
            "location": f"{lat},{lng}",
            "heading": heading,
            "fov": fov,
            "pitch": 0,
            "key": self.api_key,
        }

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(self.base_url, params=params)

                if response.status_code == 200:
                    with open(filepath, "wb") as f:
                        f.write(response.content)
                    time.sleep(1.5)
                    return filepath
                elif response.status_code == 403:
                    print(f"Street View API quota exceeded or invalid key")
                    return None
                elif response.status_code == 404:
                    print(f"No Street View available for {address}")
                    return None
                else:
                    print(f"Street View error {response.status_code} for {address}")
                    return None
        except Exception as e:
            print(f"Error fetching Street View for {address}: {e}")
            return None
