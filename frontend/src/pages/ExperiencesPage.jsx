import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Clock, 
  Users, 
  MessageCircle, 
  Phone, 
  TreePine, 
  Mountain, 
  Compass,
  Camera,
  Utensils,
  Sunrise
} from 'lucide-react';
import { experienceService, whatsappService } from '../services/api';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

export const ExperiencesPage = () => {
  const { isDarkMode } = useTheme();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experienceService.getAll();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        toast.error('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleWhatsApp = (experienceTitle) => {
    const message = `Hi! I'm interested in the ${experienceTitle} experience. Can you provide more details?`;
    whatsappService.sendMessage(message);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-green-50/30'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-green-800'
          }`}>
            Vattavada Experiences
          </h1>
          <p className={`max-w-2xl mx-auto text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-green-600'
          }`}>
            Create unforgettable memories with our curated experiences in Kerala's pristine hill station. 
            From adventure activities to cultural immersions, discover the authentic beauty of Vattavada.
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className={`animate-pulse transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : ''
              }`}>
                <div className={`h-48 rounded-t-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <CardHeader>
                  <div className={`h-6 rounded mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className={`h-4 rounded transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-3/4 transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : experiences.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className={`text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-600'
              }`}>No experiences available at the moment.</p>
            </div>
          ) : (
            experiences.map((experience) => (
            <Card key={experience._id || experience.id} className={`group hover:shadow-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-gray-900/50' 
                : 'border-green-100 hover:border-green-200'
            }`}>
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 left-3 text-white transition-colors duration-300 ${
                  isDarkMode ? 'bg-green-700' : 'bg-green-600'
                }`}>
                  {experience.duration}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className={`text-xl transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-white group-hover:text-green-400' 
                    : 'text-green-800 group-hover:text-green-600'
                }`}>
                  {experience.title}
                </CardTitle>
                <CardDescription className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-green-600'
                }`}>
                  {experience.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {experience.highlights && (
                  <div className="mb-4">
                    <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-green-800'
                    }`}>Highlights:</h4>
                    <ul className="text-sm space-y-1">
                      {experience.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            isDarkMode ? 'bg-green-400' : 'bg-green-600'
                          }`}></div>
                          <span className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-green-700'
                          }`}>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-green-800'
                  }`}>
                    ₹{experience.price}
                    <span className={`text-sm font-normal transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-green-600'
                    }`}>/person</span>
                  </div>
                  <div className={`flex items-center space-x-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-green-600'
                  }`}>
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{experience.duration}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => handleWhatsApp(experience.title)}
                    className={`w-full text-white transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-green-700 hover:bg-green-600' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Book via WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full transition-colors duration-300 ${
                      isDarkMode 
                        ? 'border-green-400 text-green-400 hover:bg-green-400/10' 
                        : 'border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call for Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Features Section */}
        <div className={`rounded-2xl p-8 shadow-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-green-100'
        }`}>
          <h2 className={`text-2xl font-bold text-center mb-8 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-green-800'
          }`}>
            Why Choose Our Experiences?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300 ${
                isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <TreePine className={`h-6 w-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-green-800'
              }`}>Local Guides</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-600'
              }`}>Experienced local guides with deep knowledge of the area</p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300 ${
                isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <Users className={`h-6 w-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-green-800'
              }`}>Small Groups</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-600'
              }`}>Intimate group sizes for personalized experiences</p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300 ${
                isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <Camera className={`h-6 w-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-green-800'
              }`}>Photo Opportunities</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-600'
              }`}>Capture stunning moments at the best locations</p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300 ${
                isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <Utensils className={`h-6 w-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-green-800'
              }`}>Local Cuisine</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-600'
              }`}>Taste authentic Kerala flavors during your experience</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-12 rounded-2xl p-8 text-white transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-green-800 to-emerald-800' 
            : 'bg-gradient-to-r from-green-600 to-emerald-600'
        }`}>
          <h2 className="text-2xl font-bold mb-4">Ready for an Adventure?</h2>
          <p className={`mb-6 max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-green-200' : 'text-green-100'
          }`}>
            Book your Vattavada experience today and create memories that will last a lifetime. 
            Our team is ready to help you plan the perfect adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleWhatsApp("multiple experiences")}
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-white text-green-800 hover:bg-gray-100' 
                  : 'bg-white text-green-600 hover:bg-green-50'
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Us
            </Button>
            <Button
              variant="outline"
              className={`border-white text-white transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};