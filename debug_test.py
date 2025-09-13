#!/usr/bin/env python3
"""
Debug script to check actual API responses
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get the backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://hill-stays.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

def debug_booking_inquiry():
    """Debug booking inquiry endpoint"""
    print("🔍 Debugging Booking Inquiry API...")
    
    booking_data = {
        "name": "Test User",
        "phone": "+91-9876543210",
        "guests": 2
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/bookings/inquiry",
            json=booking_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Raw Response: {response.text}")
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                print(f"JSON Response: {json.dumps(json_response, indent=2)}")
                print(f"Response Type: {type(json_response)}")
                if isinstance(json_response, dict):
                    print(f"Keys: {list(json_response.keys())}")
            except Exception as e:
                print(f"JSON Parse Error: {e}")
        
    except Exception as e:
        print(f"Request Error: {e}")

def debug_contact():
    """Debug contact endpoint"""
    print("\n🔍 Debugging Contact API...")
    
    contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "Test message"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/contact/",
            json=contact_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Raw Response: {response.text}")
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                print(f"JSON Response: {json.dumps(json_response, indent=2)}")
                print(f"Response Type: {type(json_response)}")
                if isinstance(json_response, dict):
                    print(f"Keys: {list(json_response.keys())}")
            except Exception as e:
                print(f"JSON Parse Error: {e}")
        
    except Exception as e:
        print(f"Request Error: {e}")

def debug_testimonials():
    """Debug testimonials endpoint"""
    print("\n🔍 Debugging Testimonials API...")
    
    testimonial_data = {
        "name": "Test User",
        "location": "Test Location",
        "rating": 5,
        "text": "Test testimonial"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/testimonials/",
            json=testimonial_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Raw Response: {response.text}")
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                print(f"JSON Response: {json.dumps(json_response, indent=2)}")
                print(f"Response Type: {type(json_response)}")
                if isinstance(json_response, dict):
                    print(f"Keys: {list(json_response.keys())}")
            except Exception as e:
                print(f"JSON Parse Error: {e}")
        
    except Exception as e:
        print(f"Request Error: {e}")

if __name__ == "__main__":
    print(f"🚀 Debugging API Responses")
    print(f"📍 Testing against: {API_BASE_URL}")
    print("=" * 60)
    
    debug_booking_inquiry()
    debug_contact()
    debug_testimonials()