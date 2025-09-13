from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class Property(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    type: str  # Cottage, Resort, Homestay, Tent, Farmstay
    price: int
    capacity: str
    rating: float = 0.0
    reviews: int = 0
    image: str
    gallery: List[str] = []
    description: str
    amenities: List[str] = []
    location: str
    attractions: List[str] = []
    room_categories: List[str] = []  # Multiple room types like Deluxe, Standard, Suite
    min_guests: int = 1
    max_guests: int = 4
    featured: bool = False
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class PropertyCreate(BaseModel):
    title: str
    type: str
    price: int
    capacity: str
    image: str
    gallery: List[str] = []
    description: str
    amenities: List[str] = []
    location: str
    attractions: List[str] = []
    room_categories: List[str] = []
    min_guests: int = 1
    max_guests: int = 4
    featured: bool = False

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    price: Optional[int] = None
    capacity: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    description: Optional[str] = None
    amenities: Optional[List[str]] = None
    location: Optional[str] = None
    attractions: Optional[List[str]] = None
    room_categories: Optional[List[str]] = None
    min_guests: Optional[int] = None
    max_guests: Optional[int] = None
    featured: Optional[bool] = None
    active: Optional[bool] = None

class PropertyService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.properties

    async def create_property(self, property_data: PropertyCreate) -> Property:
        """Create a new property"""
        try:
            property_dict = property_data.dict()
            property_dict["created_at"] = datetime.utcnow()
            property_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(property_dict)
            property_dict["_id"] = str(result.inserted_id)
            
            return Property(**property_dict)
        except Exception as e:
            logger.error(f"Error creating property: {e}")
            raise

    async def get_all_properties(self, filters: dict = None) -> List[Property]:
        """Get all active properties with optional filters"""
        try:
            query = {"active": True}
            
            if filters:
                if "type" in filters and filters["type"] != "all":
                    query["type"] = {"$regex": f"^{filters['type']}$", "$options": "i"}
                
                if "min_price" in filters:
                    query["price"] = {"$gte": int(filters["min_price"])}
                
                if "max_price" in filters:
                    if "price" not in query:
                        query["price"] = {}
                    query["price"]["$lte"] = int(filters["max_price"])
                
                if "capacity" in filters:
                    # Extract number from capacity string like "4 guests"
                    try:
                        min_capacity = int(filters["capacity"])
                        query["$expr"] = {
                            "$gte": [
                                {"$toInt": {"$arrayElemAt": [{"$split": ["$capacity", " "]}, 0]}},
                                min_capacity
                            ]
                        }
                    except:
                        pass
                
                if "search" in filters and filters["search"]:
                    search_term = filters["search"]
                    query["$or"] = [
                        {"title": {"$regex": search_term, "$options": "i"}},
                        {"description": {"$regex": search_term, "$options": "i"}},
                        {"location": {"$regex": search_term, "$options": "i"}}
                    ]
            
            cursor = self.collection.find(query).sort("created_at", -1)
            properties = []
            
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                properties.append(Property(**doc))
            
            return properties
        except Exception as e:
            logger.error(f"Error getting properties: {e}")
            raise

    async def get_property_by_id(self, property_id: str) -> Optional[Property]:
        """Get property by ID"""
        try:
            if not ObjectId.is_valid(property_id):
                return None
                
            doc = await self.collection.find_one({
                "_id": ObjectId(property_id), 
                "active": True
            })
            
            if doc:
                doc["_id"] = str(doc["_id"])
                return Property(**doc)
            return None
        except Exception as e:
            logger.error(f"Error getting property by ID: {e}")
            raise

    async def get_featured_properties(self) -> List[Property]:
        """Get featured properties"""
        try:
            cursor = self.collection.find({
                "featured": True, 
                "active": True
            }).sort("created_at", -1)
            
            properties = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                properties.append(Property(**doc))
            
            return properties
        except Exception as e:
            logger.error(f"Error getting featured properties: {e}")
            raise

    async def update_property(self, property_id: str, update_data: PropertyUpdate) -> Optional[Property]:
        """Update property"""
        try:
            if not ObjectId.is_valid(property_id):
                return None
            
            update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(property_id)},
                {"$set": update_dict},
                return_document=True
            )
            
            if result:
                result["_id"] = str(result["_id"])
                return Property(**result)
            return None
        except Exception as e:
            logger.error(f"Error updating property: {e}")
            raise

    async def delete_property(self, property_id: str) -> bool:
        """Soft delete property"""
        try:
            if not ObjectId.is_valid(property_id):
                return False
            
            result = await self.collection.update_one(
                {"_id": ObjectId(property_id)},
                {"$set": {"active": False, "updated_at": datetime.utcnow()}}
            )
            
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error deleting property: {e}")
            raise