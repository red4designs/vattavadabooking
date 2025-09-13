import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def fix_properties():
    try:
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        # Update all properties to have active=True
        result = await db.properties.update_many(
            {},  # Update all documents
            {"$set": {"active": True}}  # Set active to True
        )
        print(f'Updated {result.modified_count} properties with active=True')
        
        # Update all experiences to have active=True
        result = await db.experiences.update_many(
            {},  # Update all documents
            {"$set": {"active": True}}  # Set active to True
        )
        print(f'Updated {result.modified_count} experiences with active=True')
        
        # Update all testimonials to have approved=True (if they exist)
        result = await db.testimonials.update_many(
            {},  # Update all documents
            {"$set": {"approved": True}}  # Set approved to True
        )
        print(f'Updated {result.modified_count} testimonials with approved=True')
        
        # Verify the updates
        prop_count = await db.properties.count_documents({"active": True})
        exp_count = await db.experiences.count_documents({"active": True})
        test_count = await db.testimonials.count_documents({"approved": True})
        
        print(f'Properties with active=True: {prop_count}')
        print(f'Experiences with active=True: {exp_count}')
        print(f'Testimonials with approved=True: {test_count}')
        
        client.close()
        
    except Exception as e:
        print(f'Error fixing data: {e}')

if __name__ == '__main__':
    asyncio.run(fix_properties())