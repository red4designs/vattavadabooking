from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.BookingInquiry import BookingInquiryService, BookingInquiry, BookingInquiryCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

router = APIRouter(prefix="/bookings", tags=["bookings"])

def get_booking_service():
    return BookingInquiryService(db)

@router.post("/inquiry", response_model=BookingInquiry)
async def submit_booking_inquiry(
    inquiry_data: BookingInquiryCreate,
    service: BookingInquiryService = Depends(get_booking_service)
):
    """Submit a booking inquiry"""
    try:
        inquiry = await service.create_inquiry(inquiry_data)
        return inquiry
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting inquiry: {str(e)}")

@router.get("/inquiries", response_model=List[BookingInquiry])
async def get_booking_inquiries(
    limit: int = 100,
    service: BookingInquiryService = Depends(get_booking_service)
):
    """Get all booking inquiries (admin function)"""
    try:
        inquiries = await service.get_all_inquiries(limit)
        return inquiries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inquiries: {str(e)}")

@router.get("/inquiries/{inquiry_id}", response_model=BookingInquiry)
async def get_booking_inquiry(
    inquiry_id: str,
    service: BookingInquiryService = Depends(get_booking_service)
):
    """Get booking inquiry by ID"""
    try:
        inquiry = await service.get_inquiry_by_id(inquiry_id)
        if not inquiry:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return inquiry
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inquiry: {str(e)}")

@router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(
    inquiry_id: str,
    status: str,
    service: BookingInquiryService = Depends(get_booking_service)
):
    """Update inquiry status (admin function)"""
    try:
        inquiry = await service.update_inquiry_status(inquiry_id, status)
        if not inquiry:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return {"message": "Status updated successfully", "inquiry": inquiry}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating inquiry status: {str(e)}")