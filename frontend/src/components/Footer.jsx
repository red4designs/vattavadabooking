import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { whatsappNumber, whatsappMessage } from '../mock';
import { useTheme } from '../contexts/ThemeContext';

export const Footer = () => {
  const { isDarkMode } = useTheme();
  
  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-green-50 border-green-100'
    }`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gradient-to-r from-green-700 to-emerald-700' : 'bg-gradient-to-r from-green-600 to-emerald-600'
              }`}>
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className={`font-bold text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-green-800'
              }`}>VattavadaBooking</span>
            </div>
            <p className={`text-sm leading-relaxed transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-green-700'
            }`}>
              Your trusted partner for authentic Vattavada experiences. Discover the beauty of Kerala's hill station with our verified stays and local expertise.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-green-100'
              }`}>
                <Facebook className={`h-4 w-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </Button>
              <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-green-100'
              }`}>
                <Instagram className={`h-4 w-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </Button>
              <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-green-100'
              }`} onClick={handleWhatsApp}>
                <MessageCircle className={`h-4 w-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-sm uppercase tracking-wide transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-green-800'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-green-700 hover:text-green-800'
                }`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-green-700 hover:text-green-800'
                }`}>
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/experiences" className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-green-700 hover:text-green-800'
                }`}>
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-green-700 hover:text-green-800'
                }`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-sm uppercase tracking-wide transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-green-800'
            }`}>Stay Types</h3>
            <div className="flex flex-col space-y-2">
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>Budget Cottages</span>
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>Luxury Resorts</span>
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>Homestays</span>
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>Adventure Tents</span>
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>Farm Stays</span>
              <span className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-green-700'
              }`}>Honeymoon Suites</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className={`font-semibold text-sm uppercase tracking-wide transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-green-800'
            }`}>Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-green-700'
                }`}>Vattavada, Munnar, Kerala</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-green-700'
                }`}>+91 73067 59301</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-green-700'
                }`}>info@vattavadabooking.com</span>
              </div>
              <Button
                onClick={handleWhatsApp}
                className={`w-full text-white mt-3 transition-colors duration-300 ${
                  isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'
                }`}
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>

        <Separator className={`my-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-green-200'
        }`} />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-green-700'
          }`}>
            © 2024 VattavadaBooking.com. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <span className={`cursor-pointer transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-green-700 hover:text-green-600'
            }`}>
              Privacy Policy
            </span>
            <span className={`cursor-pointer transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-green-700 hover:text-green-600'
            }`}>
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};