from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from models.Property import PropertyService, Property, PropertyCreate, PropertyUpdate
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

router = APIRouter(prefix="/properties", tags=["properties"])

def get_property_service():
    return PropertyService(db)

@router.get("/", response_model=List[Property])
async def get_properties(
    type: Optional[str] = Query(None, description="Property type filter"),
    min_price: Optional[int] = Query(None, description="Minimum price filter"),
    max_price: Optional[int] = Query(None, description="Maximum price filter"),
    capacity: Optional[int] = Query(None, description="Minimum capacity filter"),
    search: Optional[str] = Query(None, description="Search term"),
    service: PropertyService = Depends(get_property_service)
):
    """Get all properties with optional filters"""
    try:
        filters = {}
        if type and type != "all":
            filters["type"] = type
        if min_price is not None:
            filters["min_price"] = min_price
        if max_price is not None:
            filters["max_price"] = max_price
        if capacity is not None:
            filters["capacity"] = capacity
        if search:
            filters["search"] = search
            
        properties = await service.get_all_properties(filters)
        return properties
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching properties: {str(e)}")

@router.get("/featured", response_model=List[Property])
async def get_featured_properties(service: PropertyService = Depends(get_property_service)):
    """Get featured properties"""
    try:
        properties = await service.get_featured_properties()
        return properties
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching featured properties: {str(e)}")

@router.get("/{property_id}", response_model=Property)
async def get_property(
    property_id: str,
    service: PropertyService = Depends(get_property_service)
):
    """Get property by ID"""
    try:
        property = await service.get_property_by_id(property_id)
        if not property:
            raise HTTPException(status_code=404, detail="Property not found")
        return property
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching property: {str(e)}")

@router.post("/", response_model=Property)
async def create_property(
    property_data: PropertyCreate,
    service: PropertyService = Depends(get_property_service)
):
    """Create a new property (admin function)"""
    try:
        property = await service.create_property(property_data)
        return property
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating property: {str(e)}")

@router.put("/{property_id}", response_model=Property)
async def update_property(
    property_id: str,
    property_data: PropertyUpdate,
    service: PropertyService = Depends(get_property_service)
):
    """Update property (admin function)"""
    try:
        property = await service.update_property(property_id, property_data)
        if not property:
            raise HTTPException(status_code=404, detail="Property not found")
        return property
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating property: {str(e)}")

@router.delete("/{property_id}")
async def delete_property(
    property_id: str,
    service: PropertyService = Depends(get_property_service)
):
    """Delete property (admin function)"""
    try:
        success = await service.delete_property(property_id)
        if not success:
            raise HTTPException(status_code=404, detail="Property not found")
        return {"message": "Property deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting property: {str(e)}")

@router.get("/search/filter", response_model=List[Property])
async def search_properties(
    q: Optional[str] = Query(None, description="Search query"),
    type: Optional[str] = Query(None, description="Property type"),
    min_price: Optional[int] = Query(None, description="Minimum price"),
    max_price: Optional[int] = Query(None, description="Maximum price"),
    service: PropertyService = Depends(get_property_service)
):
    """Search properties with advanced filters"""
    try:
        filters = {}
        if q:
            filters["search"] = q
        if type and type != "all":
            filters["type"] = type
        if min_price is not None:
            filters["min_price"] = min_price
        if max_price is not None:
            filters["max_price"] = max_price
            
        properties = await service.get_all_properties(filters)
        return properties
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching properties: {str(e)}")