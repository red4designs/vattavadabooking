from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class BookingInquiry(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    phone: str
    email: Optional[EmailStr] = None
    guests: int
    message: Optional[str] = None
    property_id: Optional[str] = None
    property_title: Optional[str] = None
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    status: str = "pending"  # pending, contacted, confirmed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class BookingInquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    guests: int
    message: Optional[str] = None
    property_id: Optional[str] = None
    property_title: Optional[str] = None
    check_in_date: Optional[str] = None  # ISO string from frontend
    check_out_date: Optional[str] = None  # ISO string from frontend

class BookingInquiryService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.booking_inquiries

    async def create_inquiry(self, inquiry_data: BookingInquiryCreate) -> BookingInquiry:
        """Create a new booking inquiry"""
        try:
            inquiry_dict = inquiry_data.dict()
            
            # Convert date strings to datetime objects
            if inquiry_dict.get("check_in_date"):
                try:
                    inquiry_dict["check_in_date"] = datetime.fromisoformat(
                        inquiry_dict["check_in_date"].replace('Z', '+00:00')
                    )
                except:
                    inquiry_dict["check_in_date"] = None
            
            if inquiry_dict.get("check_out_date"):
                try:
                    inquiry_dict["check_out_date"] = datetime.fromisoformat(
                        inquiry_dict["check_out_date"].replace('Z', '+00:00')
                    )
                except:
                    inquiry_dict["check_out_date"] = None
            
            inquiry_dict["created_at"] = datetime.utcnow()
            inquiry_dict["updated_at"] = datetime.utcnow()
            inquiry_dict["status"] = "pending"
            
            result = await self.collection.insert_one(inquiry_dict)
            inquiry_dict["_id"] = str(result.inserted_id)
            
            return BookingInquiry(**inquiry_dict)
        except Exception as e:
            logger.error(f"Error creating booking inquiry: {e}")
            raise

    async def get_all_inquiries(self, limit: int = 100) -> list:
        """Get all booking inquiries (admin function)"""
        try:
            cursor = self.collection.find({}).sort("created_at", -1).limit(limit)
            inquiries = []
            
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                inquiries.append(BookingInquiry(**doc))
            
            return inquiries
        except Exception as e:
            logger.error(f"Error getting booking inquiries: {e}")
            raise

    async def get_inquiry_by_id(self, inquiry_id: str) -> Optional[BookingInquiry]:
        """Get inquiry by ID"""
        try:
            if not ObjectId.is_valid(inquiry_id):
                return None
                
            doc = await self.collection.find_one({"_id": ObjectId(inquiry_id)})
            
            if doc:
                doc["_id"] = str(doc["_id"])
                return BookingInquiry(**doc)
            return None
        except Exception as e:
            logger.error(f"Error getting inquiry by ID: {e}")
            raise

    async def update_inquiry_status(self, inquiry_id: str, status: str) -> Optional[BookingInquiry]:
        """Update inquiry status"""
        try:
            if not ObjectId.is_valid(inquiry_id):
                return None
            
            valid_statuses = ["pending", "contacted", "confirmed", "cancelled"]
            if status not in valid_statuses:
                raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
            
            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(inquiry_id)},
                {"$set": {"status": status, "updated_at": datetime.utcnow()}},
                return_document=True
            )
            
            if result:
                result["_id"] = str(result["_id"])
                return BookingInquiry(**result)
            return None
        except Exception as e:
            logger.error(f"Error updating inquiry status: {e}")
            raise