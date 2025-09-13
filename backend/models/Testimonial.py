from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class Testimonial(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    location: str
    rating: int = Field(..., ge=1, le=5)
    text: str
    image: Optional[str] = None
    approved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class TestimonialCreate(BaseModel):
    name: str
    location: str
    rating: int = Field(..., ge=1, le=5)
    text: str
    image: Optional[str] = None

class TestimonialService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.testimonials

    async def create_testimonial(self, testimonial_data: TestimonialCreate) -> Testimonial:
        """Create a new testimonial"""
        try:
            testimonial_dict = testimonial_data.dict()
            testimonial_dict["created_at"] = datetime.utcnow()
            testimonial_dict["updated_at"] = datetime.utcnow()
            testimonial_dict["approved"] = False  # Needs admin approval
            
            result = await self.collection.insert_one(testimonial_dict)
            testimonial_dict["_id"] = str(result.inserted_id)
            
            return Testimonial(**testimonial_dict)
        except Exception as e:
            logger.error(f"Error creating testimonial: {e}")
            raise

    async def get_approved_testimonials(self) -> list:
        """Get all approved testimonials"""
        try:
            cursor = self.collection.find({"approved": True}).sort("created_at", -1)
            testimonials = []
            
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                testimonials.append(Testimonial(**doc))
            
            return testimonials
        except Exception as e:
            logger.error(f"Error getting approved testimonials: {e}")
            raise

    async def get_all_testimonials(self) -> list:
        """Get all testimonials (admin function)"""
        try:
            cursor = self.collection.find({}).sort("created_at", -1)
            testimonials = []
            
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                testimonials.append(Testimonial(**doc))
            
            return testimonials
        except Exception as e:
            logger.error(f"Error getting testimonials: {e}")
            raise

    async def approve_testimonial(self, testimonial_id: str) -> Optional[Testimonial]:
        """Approve a testimonial"""
        try:
            if not ObjectId.is_valid(testimonial_id):
                return None
            
            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(testimonial_id)},
                {"$set": {"approved": True, "updated_at": datetime.utcnow()}},
                return_document=True
            )
            
            if result:
                result["_id"] = str(result["_id"])
                return Testimonial(**result)
            return None
        except Exception as e:
            logger.error(f"Error approving testimonial: {e}")
            raise