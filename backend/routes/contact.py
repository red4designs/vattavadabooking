from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.Contact import ContactService, Contact, ContactCreate
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

router = APIRouter(prefix="/contact", tags=["contact"])

def get_contact_service():
    return ContactService(db)

@router.post("/", response_model=Contact)
async def submit_contact_form(
    contact_data: ContactCreate,
    service: ContactService = Depends(get_contact_service)
):
    """Submit a contact form"""
    try:
        contact = await service.create_contact(contact_data)
        return contact
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting contact form: {str(e)}")

@router.get("/messages", response_model=List[Contact])
async def get_contact_messages(
    limit: int = 100,
    service: ContactService = Depends(get_contact_service)
):
    """Get all contact messages (admin function)"""
    try:
        contacts = await service.get_all_contacts(limit)
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contact messages: {str(e)}")

@router.put("/messages/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    status: str,
    service: ContactService = Depends(get_contact_service)
):
    """Update contact message status (admin function)"""
    try:
        contact = await service.update_contact_status(contact_id, status)
        if not contact:
            raise HTTPException(status_code=404, detail="Contact message not found")
        return {"message": "Status updated successfully", "contact": contact}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating contact status: {str(e)}")