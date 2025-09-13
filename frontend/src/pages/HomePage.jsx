import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Search, 
  MapPin, 
  Users, 
  Star, 
  Shield, 
  Phone, 
  TreePine, 
  Mountain, 
  Tent, 
  Home,
  CalendarDays,
  ChevronRight,
  Wifi,
  Car,
  Coffee,
  Campfire
} from 'lucide-react';
import { propertyService } from '../services/api';
import { mockTestimonials } from '../mock';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

export const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [guests, setGuests] = useState(2);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured properties on component mount
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const properties = await propertyService.getFeatured();
        setFeaturedProperties(properties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        toast.error('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = () => {
    // Navigate to properties page with search params
    const searchParams = new URLSearchParams();
    if (checkInDate) searchParams.set('checkin', format(checkInDate, 'yyyy-MM-dd'));
    if (checkOutDate) searchParams.set('checkout', format(checkOutDate, 'yyyy-MM-dd'));
    if (guests) searchParams.set('guests', guests.toString());
    
    window.location.href = `/properties?${searchParams.toString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1920&h=1080&fit=crop')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/40 to-emerald-800/60"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover
              <span className="block text-emerald-300">Vattavada</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-green-100 leading-relaxed">
              Experience the pristine beauty of Kerala's highest hill station. From cozy cottages to luxury resorts, find your perfect mountain retreat.
            </p>
            
            {/* Search Bar */}
            <div className={`backdrop-blur rounded-2xl p-6 shadow-2xl transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-green-400' : 'text-green-800'
                  }`}>Destination</Label>
                  <div className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-green-50'
                  }`}>
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className={`font-medium transition-colors duration-200 ${
                      isDarkMode ? 'text-green-400' : 'text-green-800'
                    }`}>Vattavada</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-green-400' : 'text-green-800'
                  }`}>Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarDays className="h-4 w-4 mr-2 text-green-600" />
                        {checkInDate ? format(checkInDate, 'MMM dd') : 'Select date'}
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
                  <Label className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-green-400' : 'text-green-800'
                  }`}>Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarDays className="h-4 w-4 mr-2 text-green-600" />
                        {checkOutDate ? format(checkOutDate, 'MMM dd') : 'Select date'}
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
                
                <div className="space-y-2">
                  <Label className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-green-400' : 'text-green-800'
                  }`}>Guests</Label>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className={`py-16 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-green-400' : 'text-green-800'
            }`}>
              Featured Properties
            </h2>
            <p className={`max-w-2xl mx-auto transition-colors duration-200 ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              Handpicked accommodations that offer the best of Vattavada's natural beauty and comfort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className={`transition-colors duration-200 ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-green-100 bg-white'
                }`}>
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                    <CardHeader className="pb-3">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between mb-4">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-14"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </CardContent>
                  </div>
                </Card>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <Card key={property._id || property.id} className={`group hover:shadow-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600 bg-gray-800' 
                    : 'border-green-100 hover:border-green-200 bg-white'
                }`}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                      {property.type}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-xl group-hover:text-green-600 transition-colors ${
                      isDarkMode ? 'text-green-400' : 'text-green-800'
                    }`}>
                      {property.title}
                    </CardTitle>
                    <CardDescription className={`flex items-center space-x-4 ${
                      isDarkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{property.capacity}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}</span>
                      </span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-2xl font-bold ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>
                        ₹{property.price.toLocaleString()}
                        <span className={`text-sm font-normal ${
                          isDarkMode ? 'text-green-300' : 'text-green-600'
                        }`}>/night</span>
                      </div>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-green-300' : 'text-green-600'
                      }`}>
                        {property.reviews} reviews
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className={`text-xs ${
                          isDarkMode ? 'bg-gray-700 text-green-300' : 'bg-green-50 text-green-700'
                        }`}>
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="secondary" className={`text-xs ${
                          isDarkMode ? 'bg-gray-700 text-green-300' : 'bg-green-50 text-green-700'
                        }`}>
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Link to={`/property/${property._id || property.id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white group">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className={`${
                  isDarkMode ? 'text-green-300' : 'text-green-600'
                }`}>No featured properties available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/properties">
              <Button size="lg" variant="outline" className={`transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-green-500 text-green-400 hover:bg-gray-800' 
                  : 'border-green-600 text-green-600 hover:bg-green-50'
              }`}>
                View All Properties
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className={`py-16 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800' : 'bg-green-50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-green-400' : 'text-green-800'
            }`}>
              Why Choose VattavadaBooking?
            </h2>
            <p className={`max-w-2xl mx-auto transition-colors duration-200 ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              Your trusted partner for authentic Vattavada experiences with local expertise and verified stays
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>Safe & Verified</h3>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>All properties are personally verified for safety and quality standards</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                <TreePine className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>Local Expertise</h3>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>Deep local knowledge to help you discover hidden gems and experiences</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>24/7 Support</h3>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>Round-the-clock assistance for all your travel needs and queries</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                <Mountain className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-green-400' : 'text-green-800'
              }`}>Best Locations</h3>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>Handpicked properties in the most scenic and accessible locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-16 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-green-400' : 'text-green-800'
            }`}>
              What Our Guests Say
            </h2>
            <p className={`max-w-2xl mx-auto transition-colors duration-200 ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              Real experiences from travelers who discovered the magic of Vattavada with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className={`hover:shadow-lg transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className={`mb-4 italic transition-colors duration-200 ${
                    isDarkMode ? 'text-green-300' : 'text-green-800'
                  }`}>"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className={`font-medium transition-colors duration-200 ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      }`}>{testimonial.name}</p>
                      <p className={`text-sm transition-colors duration-200 ${
                        isDarkMode ? 'text-green-300' : 'text-green-600'
                      }`}>{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};