# VattavadaBooking.com - API Contracts & Integration Guide

## Overview
This document outlines the API contracts, data models, and integration points between frontend and backend for the Vattavada booking website.

## Current Mock Data Structure

### 1. Properties (mockProperties)
```javascript
{
  id: number,
  title: string,
  type: string, // "Cottage", "Resort", "Homestay", "Tent", "Farmstay"
  price: number,
  capacity: string, // "4 guests"
  rating: number,
  reviews: number,
  image: string,
  gallery: string[],
  description: string,
  amenities: string[],
  location: string,
  attractions: string[],
  featured: boolean
}
```

### 2. Experiences (mockExperiences + additional)
```javascript
{
  id: number,
  title: string,
  price: number,
  duration: string,
  description: string,
  image: string,
  highlights?: string[]
}
```

### 3. Testimonials (mockTestimonials)
```javascript
{
  id: number,
  name: string,
  location: string,
  rating: number,
  text: string,
  image: string
}
```

### 4. Booking Inquiries
```javascript
{
  name: string,
  phone: string,
  email: string,
  guests: number,
  message: string,
  propertyId?: number,
  propertyTitle?: string,
  checkInDate?: string,
  checkOutDate?: string,
  timestamp: string
}
```

### 5. Contact Form Submissions
```javascript
{
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  timestamp: string
}
```

## Backend API Endpoints to Implement

### Properties API
- `GET /api/properties` - Get all properties with optional filters
  - Query params: `type`, `minPrice`, `maxPrice`, `capacity`, `search`
- `GET /api/properties/:id` - Get property by ID
- `GET /api/properties/featured` - Get featured properties
- `POST /api/properties` - Admin: Create new property
- `PUT /api/properties/:id` - Admin: Update property
- `DELETE /api/properties/:id` - Admin: Delete property

### Experiences API
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience by ID

### Testimonials API
- `GET /api/testimonials` - Get all testimonials

### Booking Inquiries API
- `POST /api/bookings/inquiry` - Submit booking inquiry
- `GET /api/bookings/inquiries` - Admin: Get all inquiries

### Contact API
- `POST /api/contact` - Submit contact form

### Search API
- `GET /api/search/properties` - Search properties with filters

## MongoDB Models

### Property Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  type: String (required, enum: ['Cottage', 'Resort', 'Homestay', 'Tent', 'Farmstay']),
  price: Number (required),
  capacity: String (required),
  rating: Number (default: 0),
  reviews: Number (default: 0),
  image: String (required),
  gallery: [String],
  description: String (required),
  amenities: [String],
  location: String (required),
  attractions: [String],
  featured: Boolean (default: false),
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Experience Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  price: Number (required),
  duration: String (required),
  description: String (required),
  image: String (required),
  highlights: [String],
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  location: String (required),
  rating: Number (required, min: 1, max: 5),
  text: String (required),
  image: String,
  approved: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### BookingInquiry Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required),
  email: String,
  guests: Number (required),
  message: String,
  propertyId: ObjectId (ref: 'Property'),
  propertyTitle: String,
  checkInDate: Date,
  checkOutDate: Date,
  status: String (enum: ['pending', 'contacted', 'confirmed', 'cancelled'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'replied'], default: 'new'),
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration Points

### Files to Update:
1. **Remove mock.js imports** from all components
2. **Update API calls** to use actual endpoints
3. **Handle loading states** and error handling
4. **Update form submissions** to use real APIs

### Components with API Integration:
- `HomePage.jsx` - Featured properties, search functionality
- `PropertiesPage.jsx` - Property listings with filters
- `PropertyDetailsPage.jsx` - Property details, booking form
- `ExperiencesPage.jsx` - Experience listings
- `ContactPage.jsx` - Contact form submission

### API Service Layer
Create `/frontend/src/services/api.js`:
```javascript
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const propertyService = {
  getAll: (filters) => fetch(...),
  getById: (id) => fetch(...),
  getFeatured: () => fetch(...),
  search: (filters) => fetch(...)
};

export const bookingService = {
  submitInquiry: (data) => fetch(...)
};

export const contactService = {
  submit: (data) => fetch(...)
};
```

## Implementation Priority

### Phase 1: Core Functionality
1. Set up MongoDB models
2. Implement Properties API (GET endpoints)
3. Implement search and filtering
4. Update frontend to use property APIs

### Phase 2: Forms & Submissions
1. Implement Booking Inquiry API
2. Implement Contact Form API
3. Update frontend forms to submit to backend
4. Add proper error handling and loading states

### Phase 3: Additional Features
1. Implement Experiences API
2. Implement Testimonials API
3. Add data seeding for initial content
4. Add admin functionality (future enhancement)

## Error Handling Strategy
- Return consistent error format: `{ success: false, message: string, error?: any }`
- Handle validation errors appropriately
- Return proper HTTP status codes
- Frontend should display user-friendly error messages

## Environment Variables
Backend `.env` additions needed:
- `DB_NAME=vattavada_booking`
- `JWT_SECRET=your-jwt-secret` (if admin features added later)

## Testing Checklist
- [ ] All property CRUD operations work
- [ ] Search and filtering work correctly
- [ ] Booking inquiries are saved and retrievable
- [ ] Contact forms are submitted successfully
- [ ] Frontend displays data from backend correctly
- [ ] Error handling works properly
- [ ] WhatsApp integration still works (frontend only)