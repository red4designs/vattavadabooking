import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Star, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { propertyService } from '../services/api';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

export const PropertiesPage = () => {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [1000, 6000],
    type: 'all',
    capacity: '',
    search: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getAll();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters when filters or properties change
  useEffect(() => {
    let filtered = [...properties];
    
    // Search filter
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Price range filter
    filtered = filtered.filter(property => 
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );
    
    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Capacity filter
    if (filters.capacity) {
      filtered = filtered.filter(property => {
        const capacityNum = parseInt(property.capacity.replace(/\D/g, ''));
        return capacityNum >= parseInt(filters.capacity);
      });
    }
    
    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [1000, 6000],
      type: 'all',
      capacity: '',
      search: ''
    });
  };

  const FilterPanel = ({ className = '' }) => (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
          isDarkMode ? 'text-green-400' : 'text-green-800'
        }`}>Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className={`transition-colors duration-200 ${
          isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-600'
        }`}>
          Clear All
        </Button>
      </div>
      
      <Separator />
      
      {/* Search */}
      <div className="space-y-2">
        <Label className={`font-medium transition-colors duration-200 ${
          isDarkMode ? 'text-green-400' : 'text-green-800'
        }`}>Search Properties</Label>
        <div className="relative">
          <Search className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${
            isDarkMode ? 'text-green-400' : 'text-green-500'
          }`} />
          <Input
            placeholder="Search by name or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={`pl-10 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-600 text-green-300 focus:border-green-400' : 'border-green-200 focus:border-green-500'
            }`}
          />
        </div>
      </div>
      
      {/* Price Range */}
      <div className="space-y-3">
        <Label className={`font-medium transition-colors duration-200 ${
          isDarkMode ? 'text-green-400' : 'text-green-800'
        }`}>Price Range (per night)</Label>
        <div className="px-3 py-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            max={6000}
            min={1000}
            step={50}
            className="w-full"
            aria-label="Price range slider"
          />
          <div className={`flex justify-between mt-2 text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      {/* Property Type */}
      <div className="space-y-2">
        <Label className={`font-medium transition-colors duration-200 ${
          isDarkMode ? 'text-green-400' : 'text-green-800'
        }`}>Property Type</Label>
        <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
          <SelectTrigger className={`transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-600 text-green-300' : 'border-green-200 focus:border-green-500'
          }`}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="cottage">Cottage</SelectItem>
            <SelectItem value="resort">Resort</SelectItem>
            <SelectItem value="homestay">Homestay</SelectItem>
            <SelectItem value="tent">Tent</SelectItem>
            <SelectItem value="farmstay">Farmstay</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Capacity */}
      <div className="space-y-2">
        <Label className={`font-medium transition-colors duration-200 ${
          isDarkMode ? 'text-green-400' : 'text-green-800'
        }`}>Minimum Guests</Label>
        <Input
          type="number"
          placeholder="Number of guests"
          value={filters.capacity}
          onChange={(e) => handleFilterChange('capacity', e.target.value)}
          className={`transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-600 text-green-300 focus:border-green-400' : 'border-green-200 focus:border-green-500'
          }`}
          min="1"
          max="10"
        />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-green-50/30'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-green-400' : 'text-green-800'
          }`}>
            Properties in Vattavada
          </h1>
          <p className={`mb-6 transition-colors duration-200 ${
            isDarkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            Discover {filteredProperties.length} amazing stays in Kerala's pristine hill station
          </p>
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`transition-colors duration-200 ${
                isDarkMode ? 'border-green-400 text-green-400 hover:bg-gray-800' : 'border-green-600 text-green-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Card className={`transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
              }`}>
                <CardContent className="p-6">
                  <FilterPanel />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden col-span-1 mb-6">
              <Card className={`transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
              }`}>
                <CardContent className="p-6">
                  <FilterPanel />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className={`transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
                  }`}>
                    <div className="animate-pulse">
                      <div className={`h-48 rounded-t-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <CardHeader className="pb-3">
                        <div className={`h-5 rounded mb-2 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                        <div className={`h-4 rounded w-3/4 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className={`h-3 rounded mb-4 w-full ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                        <div className="flex justify-between mb-4">
                          <div className={`h-6 rounded w-20 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}></div>
                          <div className={`h-4 rounded w-16 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}></div>
                        </div>
                        <div className="flex gap-1 mb-4">
                          <div className={`h-5 rounded w-12 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}></div>
                          <div className={`h-5 rounded w-16 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}></div>
                        </div>
                        <div className={`h-10 rounded ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className={`text-lg mb-4 transition-colors duration-200 ${
                  isDarkMode ? 'text-green-300' : 'text-green-600'
                }`}>
                  {properties.length === 0 ? 'No properties available at the moment' : 'No properties found matching your criteria'}
                </p>
                {properties.length > 0 && (
                  <Button onClick={clearFilters} className={`text-white transition-colors duration-200 ${
                    isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700'
                  }`}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property._id || property.id} className={`group hover:shadow-xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'border-green-100 hover:border-green-200'
                  }`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                        {property.type}
                      </Badge>
                      <div className={`absolute top-3 right-3 backdrop-blur rounded-full p-2 ${
                        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                            isDarkMode ? 'text-green-300' : 'text-gray-900'
                          }`}>{property.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className={`text-lg transition-colors line-clamp-2 ${
                        isDarkMode ? 'text-green-400 group-hover:text-green-300' : 'text-green-800 group-hover:text-green-600'
                      }`}>
                        {property.title}
                      </CardTitle>
                      <CardDescription className={`flex items-center space-x-4 transition-colors duration-200 ${
                        isDarkMode ? 'text-green-300' : 'text-green-600'
                      }`}>
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{property.capacity}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{property.location}</span>
                        </span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-200 ${
                        isDarkMode ? 'text-green-300' : 'text-green-700'
                      }`}>
                        {property.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className={`text-xl font-bold transition-colors duration-200 ${
                          isDarkMode ? 'text-green-400' : 'text-green-800'
                        }`}>
                          ₹{property.price.toLocaleString()}
                          <span className={`text-sm font-normal transition-colors duration-200 ${
                            isDarkMode ? 'text-green-300' : 'text-green-600'
                          }`}>/night</span>
                        </div>
                        <span className={`text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-green-300' : 'text-green-600'
                        }`}>
                          {property.reviews} reviews
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {property.amenities.slice(0, 2).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className={`text-xs transition-colors duration-200 ${
                            isDarkMode ? 'bg-gray-700 text-green-300' : 'bg-green-50 text-green-700'
                          }`}>
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 2 && (
                          <Badge variant="secondary" className={`text-xs transition-colors duration-200 ${
                            isDarkMode ? 'bg-gray-700 text-green-300' : 'bg-green-50 text-green-700'
                          }`}>
                            +{property.amenities.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <Link to={`/property/${property._id || property.id}`}>
                        <Button className={`w-full text-white group transition-colors duration-200 ${
                          isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700'
                        }`}>
                          View Details
                          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};