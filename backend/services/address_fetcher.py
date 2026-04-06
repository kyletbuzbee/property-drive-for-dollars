import httpx
from bs4 import BeautifulSoup
import re


async def get_addresses_for_zip(zip_code: str) -> list[str]:
    """
    Fetch addresses for a given zip code using free sources.
    Tries multiple sources to build an address list.
    """
    addresses = []

    try:
        addresses = await _fetch_from_usps_zip_lookup(zip_code)
    except Exception as e:
        print(f"USPS lookup failed: {e}")

    if not addresses:
        try:
            addresses = await _fetch_from_city_data(zip_code)
        except Exception as e:
            print(f"City-data lookup failed: {e}")

    if not addresses:
        addresses = await _generate_sample_addresses(zip_code)

    return addresses


async def _generate_sample_addresses(zip_code: str) -> list[str]:
    """
    Generate sample addresses for testing.
    In production, replace with a proper address data source.
    """
    streets = [
        "Main St",
        "Oak Ave",
        "Elm St",
        "Pine Rd",
        "Maple Dr",
        "Cedar Ln",
        "Washington Blvd",
        "Park Ave",
        "Lake Dr",
        "River Rd",
    ]

    import random

    addresses = []
    for i in range(10):
        num = random.randint(100, 9999)
        street = random.choice(streets)
        addresses.append(f"{num} {street}")

    return addresses
