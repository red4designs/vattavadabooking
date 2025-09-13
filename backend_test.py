#!/usr/bin/env python3
"""
VattavadaBooking Backend API Test Suite
Tests all backend endpoints with realistic data
"""

import requests
import json
import sys
from datetime import datetime, timedelta
from typing import Dict, Any, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get the backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://hill-stays.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class VattavadaAPITester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.session = requests.Session()
        self.test_results = {
            'properties': {'passed': 0, 'failed': 0, 'errors': []},
            'bookings': {'passed': 0, 'failed': 0, 'errors': []},
            'contact': {'passed': 0, 'failed': 0, 'errors': []},
            'experiences': {'passed': 0, 'failed': 0, 'errors': []},
            'testimonials': {'passed': 0, 'failed': 0, 'errors': []}
        }
        self.created_ids = {
            'properties': [],
            'bookings': [],
            'contacts': [],
            'experiences': [],
            'testimonials': []
        }

    def log_test(self, category: str, test_name: str, success: bool, error: str = None):
        """Log test results"""
        if success:
            self.test_results[category]['passed'] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results[category]['failed'] += 1
            self.test_results[category]['errors'].append(f"{test_name}: {error}")
            print(f"❌ {test_name}: {error}")

    def test_api_health(self):
        """Test basic API health"""
        print("\n🔍 Testing API Health...")
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                print("✅ API is accessible")
                return True
            else:
                print(f"❌ API health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ API health check failed: {str(e)}")
            return False

    def test_properties_api(self):
        """Test Properties API endpoints"""
        print("\n🏠 Testing Properties API...")
        
        # Test GET /api/properties/
        try:
            response = self.session.get(f"{self.base_url}/properties/")
            if response.status_code == 200:
                properties = response.json()
                if isinstance(properties, list):
                    self.log_test('properties', 'GET /properties/ - Fetch all properties', True)
                    print(f"   Found {len(properties)} properties")
                    
                    # Store a property ID for later tests
                    if properties:
                        self.test_property_id = properties[0].get('id') or properties[0].get('_id')
                else:
                    self.log_test('properties', 'GET /properties/ - Response format', False, "Response is not a list")
            else:
                self.log_test('properties', 'GET /properties/', False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test('properties', 'GET /properties/', False, str(e))

        # Test GET /api/properties/featured
        try:
            response = self.session.get(f"{self.base_url}/properties/featured")
            if response.status_code == 200:
                featured = response.json()
                if isinstance(featured, list):
                    self.log_test('properties', 'GET /properties/featured - Fetch featured properties', True)
                    print(f"   Found {len(featured)} featured properties")
                else:
                    self.log_test('properties', 'GET /properties/featured - Response format', False, "Response is not a list")
            else:
                self.log_test('properties', 'GET /properties/featured', False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test('properties', 'GET /properties/featured', False, str(e))

        # Test search filters
        filter_tests = [
            {'type': 'cottage', 'name': 'Type filter (cottage)'},
            {'min_price': 2000, 'max_price': 5000, 'name': 'Price range filter'},
            {'capacity': 4, 'name': 'Capacity filter'},
            {'search': 'mountain', 'name': 'Search term filter'}
        ]

        for filter_test in filter_tests:
            try:
                params = {k: v for k, v in filter_test.items() if k != 'name'}
                response = self.session.get(f"{self.base_url}/properties/", params=params)
                if response.status_code == 200:
                    results = response.json()
                    if isinstance(results, list):
                        self.log_test('properties', f"GET /properties/ - {filter_test['name']}", True)
                        print(f"   Filter returned {len(results)} properties")
                    else:
                        self.log_test('properties', f"GET /properties/ - {filter_test['name']}", False, "Response is not a list")
                else:
                    self.log_test('properties', f"GET /properties/ - {filter_test['name']}", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test('properties', f"GET /properties/ - {filter_test['name']}", False, str(e))

        # Test GET specific property by ID
        if hasattr(self, 'test_property_id') and self.test_property_id:
            try:
                response = self.session.get(f"{self.base_url}/properties/{self.test_property_id}")
                if response.status_code == 200:
                    property_data = response.json()
                    if isinstance(property_data, dict) and ('id' in property_data or '_id' in property_data):
                        self.log_test('properties', 'GET /properties/{id} - Fetch specific property', True)
                    else:
                        self.log_test('properties', 'GET /properties/{id} - Response format', False, "Invalid property format")
                else:
                    self.log_test('properties', 'GET /properties/{id}', False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test('properties', 'GET /properties/{id}', False, str(e))

    def test_booking_inquiry_api(self):
        """Test Booking Inquiry API"""
        print("\n📅 Testing Booking Inquiry API...")
        
        # Test POST /api/bookings/inquiry
        booking_data = {
            "name": "Rajesh Kumar",
            "phone": "+91-9876543210",
            "email": "rajesh.kumar@email.com",
            "guests": 4,
            "message": "Looking for a peaceful weekend getaway with family. Would prefer mountain view rooms.",
            "property_id": getattr(self, 'test_property_id', None),
            "property_title": "Mountain View Cottage",
            "check_in_date": (datetime.now() + timedelta(days=7)).isoformat(),
            "check_out_date": (datetime.now() + timedelta(days=9)).isoformat()
        }

        try:
            response = self.session.post(
                f"{self.base_url}/bookings/inquiry",
                json=booking_data,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                booking_response = response.json()
                if isinstance(booking_response, dict) and ('id' in booking_response or '_id' in booking_response):
                    self.log_test('bookings', 'POST /bookings/inquiry - Submit booking inquiry', True)
                    booking_id = booking_response.get('id') or booking_response.get('_id')
                    self.created_ids['bookings'].append(booking_id)
                    print(f"   Created booking inquiry with ID: {booking_id}")
                else:
                    self.log_test('bookings', 'POST /bookings/inquiry - Response format', False, "Invalid response format")
            else:
                error_detail = response.text
                self.log_test('bookings', 'POST /bookings/inquiry', False, f"Status code: {response.status_code}, Detail: {error_detail}")
        except Exception as e:
            self.log_test('bookings', 'POST /bookings/inquiry', False, str(e))

        # Test with minimal data
        minimal_booking_data = {
            "name": "Priya Sharma",
            "phone": "+91-8765432109",
            "guests": 2
        }

        try:
            response = self.session.post(
                f"{self.base_url}/bookings/inquiry",
                json=minimal_booking_data,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                booking_response = response.json()
                if isinstance(booking_response, dict) and ('id' in booking_response or '_id' in booking_response):
                    self.log_test('bookings', 'POST /bookings/inquiry - Minimal data submission', True)
                    booking_id = booking_response.get('id') or booking_response.get('_id')
                    self.created_ids['bookings'].append(booking_id)
                else:
                    self.log_test('bookings', 'POST /bookings/inquiry - Minimal data format', False, "Invalid response format")
            else:
                self.log_test('bookings', 'POST /bookings/inquiry - Minimal data', False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test('bookings', 'POST /bookings/inquiry - Minimal data', False, str(e))

    def test_contact_api(self):
        """Test Contact Form API"""
        print("\n📞 Testing Contact Form API...")
        
        # Test POST /api/contact/
        contact_data = {
            "name": "Anita Desai",
            "email": "anita.desai@email.com",
            "phone": "+91-9123456789",
            "subject": "Inquiry about group bookings",
            "message": "Hi, I'm planning a corporate retreat for 20 people. Could you please provide information about group discounts and available dates in March?"
        }

        try:
            response = self.session.post(
                f"{self.base_url}/contact/",
                json=contact_data,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                contact_response = response.json()
                if isinstance(contact_response, dict) and ('id' in contact_response or '_id' in contact_response):
                    self.log_test('contact', 'POST /contact/ - Submit contact form', True)
                    contact_id = contact_response.get('id') or contact_response.get('_id')
                    self.created_ids['contacts'].append(contact_id)
                    print(f"   Created contact message with ID: {contact_id}")
                else:
                    self.log_test('contact', 'POST /contact/ - Response format', False, "Invalid response format")
            else:
                error_detail = response.text
                self.log_test('contact', 'POST /contact/', False, f"Status code: {response.status_code}, Detail: {error_detail}")
        except Exception as e:
            self.log_test('contact', 'POST /contact/', False, str(e))

        # Test with minimal required data
        minimal_contact_data = {
            "name": "Vikram Singh",
            "email": "vikram.singh@email.com",
            "subject": "Quick question",
            "message": "What are your check-in and check-out timings?"
        }

        try:
            response = self.session.post(
                f"{self.base_url}/contact/",
                json=minimal_contact_data,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                contact_response = response.json()
                if isinstance(contact_response, dict) and ('id' in contact_response or '_id' in contact_response):
                    self.log_test('contact', 'POST /contact/ - Minimal data submission', True)
                    contact_id = contact_response.get('id') or contact_response.get('_id')
                    self.created_ids['contacts'].append(contact_id)
                else:
                    self.log_test('contact', 'POST /contact/ - Minimal data format', False, "Invalid response format")
            else:
                self.log_test('contact', 'POST /contact/ - Minimal data', False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test('contact', 'POST /contact/ - Minimal data', False, str(e))

    def test_experiences_api(self):
        """Test Experiences API"""
        print("\n🏔️ Testing Experiences API...")
        
        # Test GET /api/experiences/
        try:
            response = self.session.get(f"{self.base_url}/experiences/")
            if response.status_code == 200:
                experiences = response.json()
                if isinstance(experiences, list):
                    self.log_test('experiences', 'GET /experiences/ - Fetch all experiences', True)
                    print(f"   Found {len(experiences)} experiences")
                    
                    # Store an experience ID for later tests
                    if experiences:
                        self.test_experience_id = experiences[0].get('id') or experiences[0].get('_id')
                else:
                    self.log_test('experiences', 'GET /experiences/ - Response format', False, "Response is not a list")
            else:
                self.log_test('experiences', 'GET /experiences/', False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test('experiences', 'GET /experiences/', False, str(e))

        # Test GET specific experience by ID
        if hasattr(self, 'test_experience_id') and self.test_experience_id:
            try:
                response = self.session.get(f"{self.base_url}/experiences/{self.test_experience_id}")
                if response.status_code == 200:
                    experience_data = response.json()
                    if isinstance(experience_data, dict) and ('id' in experience_data or '_id' in experience_data):
                        self.log_test('experiences', 'GET /experiences/{id} - Fetch specific experience', True)
                    else:
                        self.log_test('experiences', 'GET /experiences/{id} - Response format', False, "Invalid experience format")
                else:
                    self.log_test('experiences', 'GET /experiences/{id}', False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_test('experiences', 'GET /experiences/{id}', False, str(e))

    def test_testimonials_api(self):
        """Test Testimonials API"""
        print("\n⭐ Testing Testimonials API...")
        
        # Test GET /api/testimonials/
        try:
            response = self.session.get(f"{self.base_url}/testimonials/")
            if response.status_code == 200:
                testimonials = response.json()
                if isinstance(testimonials, list):
                    self.log_test('testimonials', 'GET /testimonials/ - Fetch approved testimonials', True)
                    print(f"   Found {len(testimonials)} approved testimonials")
                else:
                    self.log_test('testimonials', 'GET /testimonials/ - Response format', False, "Response is not a list")
            else:
                self.log_test('testimonials', 'GET /testimonials/', False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test('testimonials', 'GET /testimonials/', False, str(e))

        # Test POST /api/testimonials/ - Create new testimonial
        testimonial_data = {
            "name": "Meera Patel",
            "location": "Mumbai, Maharashtra",
            "rating": 5,
            "text": "Had an absolutely wonderful stay at the mountain cottage! The views were breathtaking and the hospitality was exceptional. The property was clean, well-maintained, and had all the amenities we needed. Highly recommend for anyone looking for a peaceful getaway in nature.",
            "image": "https://example.com/testimonial-image.jpg"
        }

        try:
            response = self.session.post(
                f"{self.base_url}/testimonials/",
                json=testimonial_data,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                testimonial_response = response.json()
                if isinstance(testimonial_response, dict) and ('id' in testimonial_response or '_id' in testimonial_response):
                    self.log_test('testimonials', 'POST /testimonials/ - Submit new testimonial', True)
                    testimonial_id = testimonial_response.get('id') or testimonial_response.get('_id')
                    self.created_ids['testimonials'].append(testimonial_id)
                    print(f"   Created testimonial with ID: {testimonial_id}")
                else:
                    self.log_test('testimonials', 'POST /testimonials/ - Response format', False, "Invalid response format")
            else:
                error_detail = response.text
                self.log_test('testimonials', 'POST /testimonials/', False, f"Status code: {response.status_code}, Detail: {error_detail}")
        except Exception as e:
            self.log_test('testimonials', 'POST /testimonials/', False, str(e))

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting VattavadaBooking API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False

        # Run all API tests
        self.test_properties_api()
        self.test_booking_inquiry_api()
        self.test_contact_api()
        self.test_experiences_api()
        self.test_testimonials_api()

        # Print summary
        self.print_summary()
        return self.get_overall_success()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.test_results.items():
            passed = results['passed']
            failed = results['failed']
            total_passed += passed
            total_failed += failed
            
            status = "✅" if failed == 0 else "❌"
            print(f"{status} {category.upper()}: {passed} passed, {failed} failed")
            
            if results['errors']:
                for error in results['errors']:
                    print(f"   • {error}")
        
        print("-" * 60)
        overall_status = "✅ ALL TESTS PASSED" if total_failed == 0 else f"❌ {total_failed} TESTS FAILED"
        print(f"OVERALL: {total_passed} passed, {total_failed} failed - {overall_status}")
        print("=" * 60)

    def get_overall_success(self):
        """Check if all tests passed"""
        return all(results['failed'] == 0 for results in self.test_results.values())

if __name__ == "__main__":
    tester = VattavadaAPITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)