// API service layer for VattavadaBooking frontend

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api`;

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Property Service
export const propertyService = {
  // Get all properties with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters.priceRange && filters.priceRange.length === 2) {
      params.append('min_price', filters.priceRange[0]);
      params.append('max_price', filters.priceRange[1]);
    }
    if (filters.capacity) {
      params.append('capacity', filters.capacity);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/properties/?${queryString}` : '/properties/';
    
    return await apiRequest(endpoint);
  },

  // Get property by ID
  getById: async (id) => {
    return await apiRequest(`/properties/${id}`);
  },

  // Get featured properties
  getFeatured: async () => {
    return await apiRequest('/properties/featured');
  },

  // Search properties with filters
  search: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.q) params.append('q', filters.q);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/properties/search/filter?${queryString}` : '/properties/search/filter';
    
    return await apiRequest(endpoint);
  },

  // Admin functions for property management
  create: async (propertyData) => {
    return await apiRequest('/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  update: async (id, propertyData) => {
    return await apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/properties/${id}`, {
      method: 'DELETE',
    });
  }
};

// Booking Service
export const bookingService = {
  // Submit booking inquiry
  submitInquiry: async (inquiryData) => {
    return await apiRequest('/bookings/inquiry', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  },

  // Get booking inquiries (for admin use)
  getInquiries: async () => {
    return await apiRequest('/bookings/');
  }
};

// Contact Service
export const contactService = {
  // Submit contact form
  submit: async (contactData) => {
    return await apiRequest('/contact/', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
};

// Experience Service
export const experienceService = {
  // Get all experiences
  getAll: async () => {
    return await apiRequest('/experiences/');
  },

  // Get experience by ID
  getById: async (id) => {
    return await apiRequest(`/experiences/${id}`);
  }
};

// Testimonial Service
export const testimonialService = {
  // Get approved testimonials
  getApproved: async () => {
    return await apiRequest('/testimonials/');
  },

  // Submit new testimonial
  submit: async (testimonialData) => {
    return await apiRequest('/testimonials/', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }
};

// WhatsApp integration
export const whatsappService = {
  // Generate WhatsApp URL for booking inquiry
  generateBookingURL: (propertyTitle, checkIn, checkOut, guests) => {
    const message = `Hi! I'm interested in booking ${propertyTitle} for ${guests} guests from ${checkIn} to ${checkOut}. Can you help me with availability and pricing?`;
    const phoneNumber = "+919876543210"; // Replace with actual WhatsApp number
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  },

  // Generate general inquiry WhatsApp URL
  generateGeneralURL: (message = "Hi! I'm interested in booking a stay at Vattavada. Can you help me?") => {
    const phoneNumber = "+919876543210"; // Replace with actual WhatsApp number
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }
};

// Export constants
export const API_CONFIG = {
  BASE_URL: API_BASE,
  API_URL: API_URL,
  WHATSAPP_NUMBER: "+919876543210" // Replace with actual WhatsApp number
};

// Mock data fallback (for development)
export const useMockData = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_BACKEND_URL;