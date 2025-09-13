from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class Experience(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    price: int
    duration: str
    description: str
    image: str
    highlights: List[str] = []
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class ExperienceCreate(BaseModel):
    title: str
    price: int
    duration: str
    description: str
    image: str
    highlights: List[str] = []

class ExperienceService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.experiences

    async def create_experience(self, experience_data: ExperienceCreate) -> Experience:
        """Create a new experience"""
        try:
            experience_dict = experience_data.dict()
            experience_dict["created_at"] = datetime.utcnow()
            experience_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(experience_dict)
            experience_dict["_id"] = str(result.inserted_id)
            
            return Experience(**experience_dict)
        except Exception as e:
            logger.error(f"Error creating experience: {e}")
            raise

    async def get_all_experiences(self) -> List[Experience]:
        """Get all active experiences"""
        try:
            cursor = self.collection.find({"active": True}).sort("created_at", -1)
            experiences = []
            
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                experiences.append(Experience(**doc))
            
            return experiences
        except Exception as e:
            logger.error(f"Error getting experiences: {e}")
            raise

    async def get_experience_by_id(self, experience_id: str) -> Optional[Experience]:
        """Get experience by ID"""
        try:
            if not ObjectId.is_valid(experience_id):
                return None
                
            doc = await self.collection.find_one({
                "_id": ObjectId(experience_id), 
                "active": True
            })
            
            if doc:
                doc["_id"] = str(doc["_id"])
                return Experience(**doc)
            return None
        except Exception as e:
            logger.error(f"Error getting experience by ID: {e}")
            raise