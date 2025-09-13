import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { 
  Star, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Calendar as CalendarIcon,
  Wifi,
  Car,
  Coffee,
  Flame,
  Home,
  TreePine,
  Mountain,
  Clock,
  CheckCircle
} from 'lucide-react';
import { propertyService, bookingService, whatsappService } from '../services/api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

export const PropertyDetailsPage = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch property details on component mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getById(id);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className={`h-8 rounded mb-4 w-1/3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-12 rounded mb-6 w-2/3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className={`h-96 rounded-xl mb-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`h-24 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className={`h-6 rounded w-1/4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded w-3/4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className={`h-96 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-green-400' : 'text-green-800'
          }`}>Property Not Found</h1>
          <Link to="/properties">
            <Button className={`text-white transition-colors duration-200 ${
              isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700'
            }`}>
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inquiryData = {
      ...formData,
      propertyId: property._id || property.id,
      propertyTitle: property.title,
      checkInDate: checkInDate ? format(checkInDate, 'yyyy-MM-dd') : null,
      checkOutDate: checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : null,
      timestamp: new Date().toISOString()
    };

    try {
      await bookingService.submitInquiry(inquiryData);
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        guests: 2,
        message: ''
      });
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in ${property.title}. Can you provide more details?`;
    whatsappService.sendMessage(message);
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Hot Water': Coffee,
    'Campfire': Flame,
    'Garden': TreePine,
    'Mountain View': Mountain,
    'Home-cooked Meals': Home
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm">
          <Link to="/properties" className={`flex items-center transition-colors duration-200 ${
            isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
          }`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-green-400' : 'text-green-800'
          }`}>
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className={`font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{property.rating}</span>
              <span className={`transition-colors duration-200 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>({property.reviews} reviews)</span>
            </div>
            <div className={`flex items-center space-x-1 transition-colors duration-200 ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
            <div className={`flex items-center space-x-1 transition-colors duration-200 ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              <Users className="h-4 w-4" />
              <span>{property.capacity}</span>
            </div>
            <Badge className={`text-white transition-colors duration-200 ${
              isDarkMode ? 'bg-green-600' : 'bg-green-600'
            }`}>{property.type}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative mb-4">
                <img
                  src={property.gallery[selectedImage]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {property.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg ${
                      selectedImage === index ? 'ring-2 ring-green-600' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-24 object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>About This Property</h2>
              <p className={`leading-relaxed mb-6 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>
                {property.description}
              </p>
              
              <div className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>
                ₹{property.price.toLocaleString()}
                <span className={`text-lg font-normal ml-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-green-300' : 'text-green-600'
                }`}>per night</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || CheckCircle;
                  return (
                    <div key={index} className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-green-50'
                    }`}>
                      <IconComponent className={`h-5 w-5 transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-200' : 'text-green-800'
                      }`}>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>Nearby Attractions</h2>
              <div className="space-y-3">
                {property.attractions.map((attraction, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-green-50'
                  }`}>
                    <MapPin className={`h-5 w-5 transition-colors duration-200 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-200' : 'text-green-800'
                    }`}>{attraction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className={`shadow-lg transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
              }`}>
                <CardHeader>
                  <CardTitle className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-green-400' : 'text-green-800'
                  }`}>Book Your Stay</CardTitle>
                  <CardDescription className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Fill out the form below and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={`transition-colors duration-200 ${
                          isDarkMode ? 'text-green-400' : 'text-green-800'
                        }`}>Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={`w-full justify-start text-left font-normal transition-colors duration-200 ${
                              isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                            }`}>
                              <CalendarIcon className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                                isDarkMode ? 'text-green-400' : 'text-green-600'
                              }`} />
                              {checkInDate ? format(checkInDate, 'MMM dd') : 'Select'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkInDate}
                              onSelect={setCheckInDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className={`transition-colors duration-200 ${
                          isDarkMode ? 'text-green-400' : 'text-green-800'
                        }`}>Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={`w-full justify-start text-left font-normal transition-colors duration-200 ${
                              isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                            }`}>
                              <CalendarIcon className={`h-4 w-4 mr-2 transition-colors duration-200 ${
                                isDarkMode ? 'text-green-400' : 'text-green-600'
                              }`} />
                              {checkOutDate ? format(checkOutDate, 'MMM dd') : 'Select'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkOutDate}
                              onSelect={setCheckOutDate}
                              disabled={(date) => date < new Date() || (checkInDate && date <= checkInDate)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className={`transition-colors duration-200 ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-green-500' : 'border-green-200 focus:border-green-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className={`transition-colors duration-200 ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-green-500' : 'border-green-200 focus:border-green-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`transition-colors duration-200 ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-green-500' : 'border-green-200 focus:border-green-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests" className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                        className={`transition-colors duration-200 ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-green-500' : 'border-green-200 focus:border-green-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className={`transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Any special requests or questions..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`transition-colors duration-200 ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder:text-gray-400 focus:border-green-500' : 'border-green-200 focus:border-green-500'
                        }`}
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full text-white transition-colors duration-200 ${
                        isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    </Button>
                  </form>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className={`w-full transition-colors duration-200 ${
                        isDarkMode ? 'border-green-600 text-green-400 hover:bg-gray-700' : 'border-green-600 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Inquiry
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 text-center">
                      <Clock className="h-4 w-4 inline mr-1" />
                      We typically respond within 2 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};