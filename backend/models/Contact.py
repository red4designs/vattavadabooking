from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class Contact(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    status: str = "new"  # new, read, replied
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.contacts

    async def create_contact(self, contact_data: ContactCreate) -> Contact:
        """Create a new contact message"""
        try:
            contact_dict = contact_data.dict()
            contact_dict["created_at"] = datetime.utcnow()
            contact_dict["updated_at"] = datetime.utcnow()
            contact_dict["status"] = "new"
            
            result = await self.collection.insert_one(contact_dict)
            contact_dict["_id"] = str(result.inserted_id)
            
            return Contact(**contact_dict)
        except Exception as e:
            logger.error(f"Error creating contact message: {e}")
            raise

    async def get_all_contacts(self, limit: int = 100) -> list:
        """Get all contact messages (admin function)"""
        try:
            cursor = self.collection.find({}).sort("created_at", -1).limit(limit)
            contacts = []
            
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                contacts.append(Contact(**doc))
            
            return contacts
        except Exception as e:
            logger.error(f"Error getting contact messages: {e}")
            raise

    async def update_contact_status(self, contact_id: str, status: str) -> Optional[Contact]:
        """Update contact message status"""
        try:
            if not ObjectId.is_valid(contact_id):
                return None
            
            valid_statuses = ["new", "read", "replied"]
            if status not in valid_statuses:
                raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
            
            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(contact_id)},
                {"$set": {"status": status, "updated_at": datetime.utcnow()}},
                return_document=True
            )
            
            if result:
                result["_id"] = str(result["_id"])
                return Contact(**result)
            return None
        except Exception as e:
            logger.error(f"Error updating contact status: {e}")
            raise