from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.models import DistressedLead
from typing import Optional


async def create_lead(
    db: AsyncSession,
    address: str,
    city: str,
    image_url: str,
    indicators: list[str],
    confidence: float,
    zestimate: Optional[float] = None,
    year_built: Optional[int] = None,
    distressed: bool = True,
) -> DistressedLead:
    lead = DistressedLead(
        address=address,
        city=city,
        image_url=image_url,
        indicators=",".join(indicators),
        confidence=confidence,
        zestimate=zestimate,
        year_built=year_built,
        distressed=distressed,
    )
    db.add(lead)
    await db.flush()
    await db.refresh(lead)
    return lead


async def get_all_leads(
    db: AsyncSession, limit: int = 100, offset: int = 0
) -> list[DistressedLead]:
    result = await db.execute(
        select(DistressedLead)
        .order_by(DistressedLead.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(result.scalars().all())


async def get_lead_by_id(db: AsyncSession, lead_id: int) -> DistressedLead | None:
    result = await db.execute(
        select(DistressedLead).where(DistressedLead.id == lead_id)
    )
    return result.scalar_one_or_none()


async def get_distressed_leads(
    db: AsyncSession, limit: int = 100
) -> list[DistressedLead]:
    result = await db.execute(
        select(DistressedLead)
        .where(DistressedLead.distressed == True)
        .order_by(DistressedLead.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())
