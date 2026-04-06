from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from db.session import Base


class DistressedLead(Base):
    __tablename__ = "distressed_leads"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False, index=True)
    city = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    indicators = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    zestimate = Column(Float, nullable=True)
    year_built = Column(Integer, nullable=True)
    distressed = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "address": self.address,
            "city": self.city,
            "image_url": self.image_url,
            "indicators": self.indicators.split(",") if self.indicators else [],
            "confidence": self.confidence,
            "zestimate": self.zestimate,
            "yearBuilt": self.year_built,
            "distressed": self.distressed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
