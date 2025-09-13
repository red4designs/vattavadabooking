import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check_database():
    try:
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        # Check properties collection
        count = await db.properties.count_documents({})
        print(f'Properties count: {count}')
        
        # Get sample documents
        docs = await db.properties.find({}).to_list(length=3)
        for i, doc in enumerate(docs):
            print(f'Property {i+1}: {doc.get("title", "No title")} - Active: {doc.get("active", "Unknown")}')
        
        # Check all collections
        collections = await db.list_collection_names()
        print(f'Available collections: {collections}')
        
        client.close()
        
    except Exception as e:
        print(f'Database error: {e}')

if __name__ == '__main__':
    asyncio.run(check_database())