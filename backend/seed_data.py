import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models.Property import PropertyService, PropertyCreate
from models.Experience import ExperienceService, ExperienceCreate
from models.Testimonial import TestimonialService, TestimonialCreate
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample data based on mock.js
PROPERTIES_DATA = [
    {
        "title": "Paradise Resort - Budget Cottage",
        "type": "Cottage",
        "price": 2500,
        "capacity": "4 guests",
        "rating": 4.5,
        "reviews": 23,
        "image": "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"
        ],
        "description": "Cozy budget cottage nestled in the heart of Vattavada hills. Perfect for families seeking comfortable accommodation with stunning mountain views.",
        "amenities": ["Hot Water", "WiFi", "Parking", "Campfire", "BBQ Area"],
        "location": "Vattavada, Munnar",
        "attractions": ["Top Station - 5km", "Pampadum Shola - 3km", "Strawberry Farm - 2km"],
        "featured": True
    },
    {
        "title": "Misty Mountains Homestay",
        "type": "Homestay",
        "price": 3200,
        "capacity": "6 guests",
        "rating": 4.7,
        "reviews": 31,
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop"
        ],
        "description": "Experience authentic local hospitality in this charming homestay. Enjoy home-cooked meals and warm Kerala hospitality.",
        "amenities": ["Hot Water", "Home-cooked Meals", "WiFi", "Parking", "Garden"],
        "location": "Vattavada Village",
        "attractions": ["Village Walk - 0km", "Spice Garden - 1km", "Tea Plantation - 2km"],
        "featured": True
    },
    {
        "title": "Adventure Camp Tents",
        "type": "Tent",
        "price": 1800,
        "capacity": "2 guests",
        "rating": 4.3,
        "reviews": 18,
        "image": "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=600&h=400&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=600&h=400&fit=crop"
        ],
        "description": "Perfect for couples seeking adventure! Sleep under the stars in comfortable tents with all essential facilities.",
        "amenities": ["Shared Restroom", "Campfire", "Adventure Activities", "Breakfast Included"],
        "location": "Vattavada Hills",
        "attractions": ["Trekking Trails - 0km", "Sunrise Point - 1km", "Rock Climbing - 500m"],
        "featured": True
    },
    {
        "title": "Luxury Hill Resort",
        "type": "Resort",
        "price": 5500,
        "capacity": "4 guests",
        "rating": 4.8,
        "reviews": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
        ],
        "description": "Indulge in luxury amidst nature. Premium resort with world-class amenities and breathtaking valley views.",
        "amenities": ["Hot Water", "WiFi", "Restaurant", "Spa", "Parking", "Room Service"],
        "location": "Vattavada Peak",
        "attractions": ["Valley Viewpoint - 100m", "Tea Museum - 3km", "Elephant Safari - 5km"],
        "featured": False
    },
    {
        "title": "Honeymoon Cottage Retreat",
        "type": "Cottage",
        "price": 4200,
        "capacity": "2 guests",
        "rating": 4.9,
        "reviews": 28,
        "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"
        ],
        "description": "Romantic getaway for couples. Private cottage with exclusive amenities and stunning mountain views perfect for honeymoon.",
        "amenities": ["Hot Water", "Private Balcony", "WiFi", "Romantic Decoration", "Candlelit Dinner"],
        "location": "Vattavada Hills",
        "attractions": ["Sunset Point - 200m", "Private Trek - 0km", "Photography Spots - 100m"],
        "featured": True
    },
    {
        "title": "Farm Stay Experience",
        "type": "Farmstay",
        "price": 2800,
        "capacity": "8 guests",
        "rating": 4.4,
        "reviews": 35,
        "image": "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=600&h=400&fit=crop",
        "gallery": [
            "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
        ],
        "description": "Experience rural life with modern comforts. Perfect for large families and groups seeking authentic farm experiences.",
        "amenities": ["Hot Water", "Farm Activities", "WiFi", "Parking", "Organic Meals", "Animal Interaction"],
        "location": "Vattavada Farmlands",
        "attractions": ["Organic Farm Tour - 0km", "Dairy Experience - 100m", "Village Market - 2km"],
        "featured": False
    }
]

EXPERIENCES_DATA = [
    {
        "title": "Jeep Trekking Adventure",
        "price": 1500,
        "duration": "4 hours",
        "description": "Thrilling jeep safari through rugged mountain terrain",
        "image": "https://images.unsplash.com/photo-1544969304-5d7e7dfcdab8?w=600&h=400&fit=crop",
        "highlights": ["Professional guide", "Light refreshments", "Photography stops", "Small groups"]
    },
    {
        "title": "Campfire & BBQ Night",
        "price": 800,
        "duration": "3 hours",
        "description": "Cozy evening around bonfire with delicious BBQ",
        "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
        "highlights": ["BBQ dinner", "Campfire stories", "Music & games", "Stargazing"]
    },
    {
        "title": "Tea Plantation Tour",
        "price": 600,
        "duration": "2 hours",
        "description": "Guided tour through lush tea gardens with tasting session",
        "image": "https://images.unsplash.com/photo-1597318110364-24ac0a91a2e4?w=600&h=400&fit=crop",
        "highlights": ["Guided tour", "Tea tasting", "Factory visit", "Take home samples"]
    },
    {
        "title": "Sunrise Trekking",
        "price": 1200,
        "duration": "5 hours",
        "description": "Early morning trek to catch the spectacular sunrise over the Western Ghats",
        "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
        "highlights": ["Professional guide", "Light breakfast", "Photography spots", "Small groups"]
    },
    {
        "title": "Spice Plantation Walk",
        "price": 400,
        "duration": "2 hours",
        "description": "Guided walk through organic spice plantations with tastings",
        "image": "https://images.unsplash.com/photo-1596040226097-b5cde5d72421?w=600&h=400&fit=crop",
        "highlights": ["Organic spices", "Local guide", "Tasting session", "Take home samples"]
    },
    {
        "title": "Village Cultural Tour",
        "price": 800,
        "duration": "4 hours",
        "description": "Immerse yourself in local culture and traditional Kerala lifestyle",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        "highlights": ["Village interactions", "Traditional crafts", "Local cuisine", "Cultural insights"]
    }
]

TESTIMONIALS_DATA = [
    {
        "name": "Priya & Raj",
        "location": "Bangalore",
        "rating": 5,
        "text": "Perfect honeymoon destination! The cottage was romantic and the views were breathtaking. Highly recommend for couples.",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
        "name": "Sharma Family",
        "location": "Chennai",
        "rating": 5,
        "text": "Amazing family vacation! Kids loved the farm activities and we enjoyed the peaceful environment. Will definitely return.",
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
        "name": "Adventure Group",
        "location": "Kochi",
        "rating": 4,
        "text": "Great experience with jeep trekking and camping. The staff was very helpful and the food was delicious.",
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    }
]

async def seed_database():
    """Seed the database with initial data"""
    try:
        print("Starting database seeding...")
        
        # Initialize services
        property_service = PropertyService(db)
        experience_service = ExperienceService(db)
        testimonial_service = TestimonialService(db)
        
        # Check if data already exists
        existing_properties = await property_service.get_all_properties()
        if existing_properties:
            print("Database already contains properties. Skipping seeding.")
            return
        
        # Seed Properties
        print("Seeding properties...")
        for prop_data in PROPERTIES_DATA:
            property_create = PropertyCreate(**prop_data)
            await property_service.create_property(property_create)
            print(f"Created property: {prop_data['title']}")
        
        # Seed Experiences
        print("Seeding experiences...")
        for exp_data in EXPERIENCES_DATA:
            experience_create = ExperienceCreate(**exp_data)
            await experience_service.create_experience(experience_create)
            print(f"Created experience: {exp_data['title']}")
        
        # Seed Testimonials (and approve them)
        print("Seeding testimonials...")
        for test_data in TESTIMONIALS_DATA:
            testimonial_create = TestimonialCreate(**test_data)
            testimonial = await testimonial_service.create_testimonial(testimonial_create)
            # Approve the testimonial
            await testimonial_service.approve_testimonial(testimonial.id)
            print(f"Created and approved testimonial: {test_data['name']}")
        
        print("Database seeding completed successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())