import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Phone, MessageCircle, Moon, Sun } from 'lucide-react';
import { whatsappNumber, whatsappMessage } from '../mock';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/experiences', label: 'Experiences' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/admin', label: 'Admin' }
  ];

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 backdrop-blur ${
      isDarkMode 
        ? 'border-gray-700 bg-gray-900/95 supports-[backdrop-filter]:bg-gray-900/60' 
        : 'border-green-100 bg-white/95 supports-[backdrop-filter]:bg-white/60'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className={`font-bold text-lg transition-colors duration-200 ${
              isDarkMode ? 'text-green-400' : 'text-green-800'
            }`}>VattavadaBooking</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-green-500'
                    : isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-green-800 hover:text-green-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-green-800 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-green-500 text-green-400 hover:bg-gray-800' 
                  : 'border-green-600 text-green-600 hover:bg-green-50'
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`w-[300px] sm:w-[400px] transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-green-500'
                        : isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-green-800 hover:text-green-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className={`flex flex-col space-y-3 pt-4 border-t transition-colors duration-200 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={toggleDarkMode}
                    className={`justify-start transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                        : 'text-green-800 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWhatsApp}
                    className={`justify-start transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-green-500 text-green-400 hover:bg-gray-800' 
                        : 'border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};