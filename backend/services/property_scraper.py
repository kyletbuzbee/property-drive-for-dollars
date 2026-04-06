import httpx
from bs4 import BeautifulSoup
import re
import asyncio
import json
from typing import Optional, Dict, Any, TypedDict


class PropertyData(TypedDict, total=False):
    zestimate: Optional[int]
    year_built: Optional[int]
    beds: Optional[int]
    baths: Optional[int]
    sqft: Optional[int]


class PropertyScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Cache-Control": "max-age=0",
        }

    async def scrape_property(self, address: str) -> Dict[str, Any]:
        result: Dict[str, Any] = {
            "zestimate": None,
            "year_built": None,
            "beds": None,
            "baths": None,
            "sqft": None,
        }

        try:
            result = await self._scrape_redfin(address)
            if result["zestimate"]:
                return result
        except Exception as e:
            print(f"Redfin scrape failed for {address}: {e}")

        try:
            await asyncio.sleep(2)
            result = await self._scrape_zillow(address)
            if result["zestimate"]:
                return result
        except Exception as e:
            print(f"Zillow scrape failed for {address}: {e}")

        return result

    async def _scrape_redfin(self, address: str) -> Dict[str, Any]:
        search_addr = address.replace(" ", "-").replace(",", "").lower()
        url = f"https://www.redfin.com/stingray/do/google-autocomplete?term={search_addr}&location_type=address"

        async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()

            try:
                data = response.json()
                if data.get("payload") and data["payload"].get("sections"):
                    for section in data["payload"]["sections"]:
                        if section.get("rows"):
                            for row in section["rows"]:
                                if row.get("url"):
                                    property_url = f"https://www.redfin.com{row['url']}"
                                    return await self._scrape_redfin_page(property_url)
            except:
                pass

        return {
            "zestimate": None,
            "year_built": None,
            "beds": None,
            "baths": None,
            "sqft": None,
        }

    async def _scrape_redfin_page(self, url: str) -> Dict[str, Any]:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        result: Dict[str, Any] = {
            "zestimate": None,
            "year_built": None,
            "beds": None,
            "baths": None,
            "sqft": None,
        }

        price_elem = soup.select_one('[data-rf-test-id="abp-price"]')
        if price_elem:
            price_text = price_elem.get_text(strip=True)
            price_match = re.search(r"[\$]?([\d,]+)", price_text.replace("$", ""))
            if price_match:
                result["zestimate"] = int(price_match.group(1).replace(",", ""))

        year_elem = soup.select_one(".homeInfoV2 .year-built")
        if not year_elem:
            year_elem = soup.select_one('[data-rf-test-id="abp-year-built"]')
        if year_elem:
            year_text = year_elem.get_text(strip=True)
            year_match = re.search(r"(\d{4})", year_text)
            if year_match:
                result["year_built"] = int(year_match.group(1))

        return result

    async def _scrape_zillow(self, address: str) -> Dict[str, Any]:
        search_query = address.replace(" ", "+")
        url = f"https://www.zillow.com/homes/{search_query}_rb/"

        async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        result: Dict[str, Any] = {
            "zestimate": None,
            "year_built": None,
            "beds": None,
            "baths": None,
            "sqft": None,
        }

        price_scripts = soup.find_all("script", type="application/json")
        for script in price_scripts:
            if script.string and "zestimate" in script.string.lower():
                try:
                    data = json.loads(script.string)
                    zestimate = self._extract_zestimate_from_json(data)
                    if zestimate:
                        result["zestimate"] = zestimate
                except:
                    continue

        zestimate_elem = soup.select_one('[data-testid="price-info"]')
        if zestimate_elem and not result["zestimate"]:
            price_text = zestimate_elem.get_text()
            price_match = re.search(
                r"\$?([\d,]+)", price_text.replace("$", "").replace(",", "")
            )
            if price_match:
                result["zestimate"] = int(price_match.group(1))

        year_elem = soup.select_one('[data-testid="home-facts-year-built"]')
        if year_elem:
            year_text = year_elem.get_text(strip=True)
            year_match = re.search(r"(\d{4})", year_text)
            if year_match:
                result["year_built"] = int(year_match.group(1))

        return result

    def _extract_zestimate_from_json(self, data) -> Optional[int]:
        if isinstance(data, dict):
            for key, value in data.items():
                if "zestimate" in key.lower():
                    try:
                        return int(value)
                    except:
                        pass
                result = self._extract_zestimate_from_json(value)
                if result:
                    return result
        elif isinstance(data, list):
            for item in data:
                result = self._extract_zestimate_from_json(item)
                if result:
                    return result
        return None
