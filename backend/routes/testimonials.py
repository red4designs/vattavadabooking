from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.Testimonial import TestimonialService, Testimonial, TestimonialCreate
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

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

def get_testimonial_service():
    return TestimonialService(db)

@router.get("/", response_model=List[Testimonial])
async def get_testimonials(service: TestimonialService = Depends(get_testimonial_service)):
    """Get all approved testimonials"""
    try:
        testimonials = await service.get_approved_testimonials()
        return testimonials
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching testimonials: {str(e)}")

@router.post("/", response_model=Testimonial)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    service: TestimonialService = Depends(get_testimonial_service)
):
    """Submit a new testimonial (requires admin approval)"""
    try:
        testimonial = await service.create_testimonial(testimonial_data)
        return testimonial
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating testimonial: {str(e)}")

@router.get("/all", response_model=List[Testimonial])
async def get_all_testimonials(service: TestimonialService = Depends(get_testimonial_service)):
    """Get all testimonials including unapproved ones (admin function)"""
    try:
        testimonials = await service.get_all_testimonials()
        return testimonials
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching all testimonials: {str(e)}")

@router.put("/{testimonial_id}/approve", response_model=Testimonial)
async def approve_testimonial(
    testimonial_id: str,
    service: TestimonialService = Depends(get_testimonial_service)
):
    """Approve a testimonial (admin function)"""
    try:
        testimonial = await service.approve_testimonial(testimonial_id)
        if not testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error approving testimonial: {str(e)}")