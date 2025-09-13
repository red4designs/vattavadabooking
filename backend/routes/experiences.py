from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.Experience import ExperienceService, Experience, ExperienceCreate
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

router = APIRouter(prefix="/experiences", tags=["experiences"])

def get_experience_service():
    return ExperienceService(db)

@router.get("/", response_model=List[Experience])
async def get_experiences(service: ExperienceService = Depends(get_experience_service)):
    """Get all experiences"""
    try:
        experiences = await service.get_all_experiences()
        return experiences
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching experiences: {str(e)}")

@router.get("/{experience_id}", response_model=Experience)
async def get_experience(
    experience_id: str,
    service: ExperienceService = Depends(get_experience_service)
):
    """Get experience by ID"""
    try:
        experience = await service.get_experience_by_id(experience_id)
        if not experience:
            raise HTTPException(status_code=404, detail="Experience not found")
        return experience
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching experience: {str(e)}")

@router.post("/", response_model=Experience)
async def create_experience(
    experience_data: ExperienceCreate,
    service: ExperienceService = Depends(get_experience_service)
):
    """Create a new experience (admin function)"""
    try:
        experience = await service.create_experience(experience_data)
        return experience
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating experience: {str(e)}")