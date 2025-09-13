import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Separator } from '../components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  Star, 
  Eye,
  Save,
  X,
  Search,
  Filter,
  LogOut,
  Upload,
  Image,
  Trash
} from 'lucide-react';
import { propertyService } from '../services/api';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const { logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    capacity: '',
    description: '',
    image: '',
    gallery: '',
    amenities: '',
    location: '',
    attractions: '',
    room_categories: '',
    min_guests: 1,
    max_guests: 4,
    featured: false,
    active: true
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);

  // Property types for dropdown
  const propertyTypes = ['Cottage', 'Resort', 'Homestay', 'Tent', 'Farmstay'];
  
  // Room categories for selection
  const roomCategories = ['Standard', 'Deluxe', 'Suite', 'Premium', 'Family Room', 'Honeymoon Suite', 'Dormitory'];

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties');
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter properties based on search and type
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      price: '',
      capacity: '',
      description: '',
      image: '',
      gallery: '',
      amenities: '',
      location: '',
      attractions: '',
      room_categories: '',
      min_guests: 1,
      max_guests: 4,
      featured: false,
      active: true
    });
    setUploadedImages([]);
    setMainImageFile(null);
  };

  // Handle image upload
  const handleImageUpload = (event, isMainImage = false) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (isMainImage) {
            setMainImageFile(e.target.result);
            handleInputChange('image', e.target.result);
          } else {
            setUploadedImages(prev => [...prev, {
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name
            }]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove uploaded image
  const removeUploadedImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Handle create property
  const handleCreateProperty = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.price || !formData.capacity || !formData.description || !formData.image || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (formData.min_guests > formData.max_guests) {
      alert('Minimum guests cannot be greater than maximum guests');
      return;
    }

      // Prepare gallery from uploaded images
      const galleryUrls = uploadedImages.map(img => img.url);
      if (formData.gallery) {
        galleryUrls.push(...formData.gallery.split(',').map(url => url.trim()));
      }

      // Prepare data for API
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        min_guests: parseInt(formData.min_guests),
        max_guests: parseInt(formData.max_guests),
        gallery: galleryUrls,
        amenities: formData.amenities ? formData.amenities.split(',').map(amenity => amenity.trim()) : [],
        attractions: formData.attractions ? formData.attractions.split(',').map(attraction => attraction.trim()) : [],
        room_categories: formData.room_categories ? formData.room_categories.split(',').map(cat => cat.trim()) : []
      };

      await propertyService.create(propertyData);
      toast.success('Property created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      loadProperties();
    } catch (error) {
      toast.error('Failed to create property');
      console.error('Error creating property:', error);
    }
  };

  // Handle edit property
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      price: property.price.toString(),
      capacity: property.capacity,
      description: property.description,
      image: property.image,
      gallery: property.gallery ? property.gallery.join(', ') : '',
      amenities: property.amenities ? property.amenities.join(', ') : '',
      location: property.location,
      attractions: property.attractions ? property.attractions.join(', ') : '',
      room_categories: property.room_categories ? property.room_categories.join(', ') : '',
      min_guests: property.min_guests || 1,
      max_guests: property.max_guests || 4,
      featured: property.featured || false,
      active: property.active !== false
    });
    setMainImageFile(property.image);
    setUploadedImages([]);
    setIsEditDialogOpen(true);
  };

  // Handle update property
  const handleUpdateProperty = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.price || !formData.capacity || !formData.description || !formData.image || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (formData.min_guests > formData.max_guests) {
        alert('Minimum guests cannot be greater than maximum guests');
        return;
      }

      // Prepare gallery from uploaded images
      const galleryUrls = uploadedImages.map(img => img.url);
      if (formData.gallery) {
        galleryUrls.push(...formData.gallery.split(',').map(url => url.trim()));
      }

      // Prepare data for API
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        min_guests: parseInt(formData.min_guests),
        max_guests: parseInt(formData.max_guests),
        gallery: galleryUrls,
        amenities: formData.amenities ? formData.amenities.split(',').map(amenity => amenity.trim()) : [],
        attractions: formData.attractions ? formData.attractions.split(',').map(attraction => attraction.trim()) : [],
        room_categories: formData.room_categories ? formData.room_categories.split(',').map(cat => cat.trim()) : []
      };

      await propertyService.update(editingProperty._id, propertyData);
      toast.success('Property updated successfully!');
      setIsEditDialogOpen(false);
      setEditingProperty(null);
      resetForm();
      loadProperties();
    } catch (error) {
      toast.error('Failed to update property');
      console.error('Error updating property:', error);
    }
  };

  // Handle delete property
  const handleDeleteProperty = async (propertyId) => {
    try {
      await propertyService.delete(propertyId);
      toast.success('Property deleted successfully!');
      loadProperties();
    } catch (error) {
      toast.error('Failed to delete property');
      console.error('Error deleting property:', error);
    }
  };

  // Property form component
  const PropertyForm = ({ isEdit = false }) => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Property title"
          />
        </div>
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="Price per night"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="e.g., 2-4 guests"
          />
        </div>
      </div>

      <div>
        <Label>Room Categories</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {roomCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={formData.room_categories.includes(category)}
                onChange={(e) => {
                  const updatedCategories = e.target.checked
                    ? [...formData.room_categories, category]
                    : formData.room_categories.filter(c => c !== category);
                  handleInputChange('room_categories', updatedCategories);
                }}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_guests">Minimum Guests</Label>
          <Input
            id="min_guests"
            type="number"
            value={formData.min_guests}
            onChange={(e) => handleInputChange('min_guests', parseInt(e.target.value) || 1)}
            min="1"
            max={formData.max_guests || 10}
          />
        </div>
        <div>
          <Label htmlFor="max_guests">Maximum Guests</Label>
          <Input
            id="max_guests"
            type="number"
            value={formData.max_guests}
            onChange={(e) => handleInputChange('max_guests', parseInt(e.target.value) || 4)}
            min={formData.min_guests || 1}
            max="20"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Property location"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Property description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">Main Image *</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg or upload from device"
              className="flex-1"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>
          {mainImageFile && (
            <div className="relative inline-block">
              <img
                src={mainImageFile}
                alt="Main preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setMainImageFile(null);
                  handleInputChange('image', '');
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="gallery">Gallery Images</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              id="gallery"
              value={formData.gallery}
              onChange={(e) => handleInputChange('gallery', e.target.value)}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              rows={2}
              className="flex-1"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button type="button" variant="outline" className="flex items-center gap-2 h-full">
                <Image className="w-4 h-4" />
                Add Images
              </Button>
            </div>
          </div>
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(image.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Textarea
          id="amenities"
          value={formData.amenities}
          onChange={(e) => handleInputChange('amenities', e.target.value)}
          placeholder="WiFi, Parking, Kitchen, AC"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="attractions">Nearby Attractions (comma-separated)</Label>
        <Textarea
          id="attractions"
          value={formData.attractions}
          onChange={(e) => handleInputChange('attractions', e.target.value)}
          placeholder="Tea Gardens, Waterfalls, Trekking Trails"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="featured">Featured Property</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => handleInputChange('active', e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingProperty(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={isEdit ? handleUpdateProperty : handleCreateProperty}>
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update' : 'Create'} Property
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Property Management Dashboard</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage your property listings with ease
              </p>
            </div>
            <Button
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
              }}
              variant="outline"
              className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Property</DialogTitle>
                <DialogDescription>
                  Add a new property to your listings. Fill in all required fields marked with *.
                </DialogDescription>
              </DialogHeader>
              <PropertyForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property._id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{property.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    {property.featured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={property.active ? "default" : "destructive"} className="text-xs">
                      {property.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{property.type}</Badge>
                    <span className="font-semibold text-lg">₹{property.price}/night</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 mr-1" />
                    {property.capacity}
                  </div>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                    {property.description}
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProperty(property)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{property.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProperty(property._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    ID: {property._id.slice(-6)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No properties found</p>
              <p className="text-sm">
                {searchTerm || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first property'}
              </p>
            </div>
            {!searchTerm && typeFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>
                Update the property details. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <PropertyForm isEdit={true} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;