import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle
} from 'lucide-react';
import { contactService, whatsappService } from '../services/api';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

export const ContactPage = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactService.submitForm(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleWhatsApp = () => {
    const message = 'Hi! I have a question about Vattavada bookings. Can you help me?';
    whatsappService.sendMessage(message);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      content: "Vattavada, Munnar\nIdukki District, Kerala 685565",
      action: null
    },
    {
      icon: Phone,
      title: "Phone Number",
      content: "+91 98765 43210",
      action: () => window.open('tel:+919876543210')
    },
    {
      icon: Mail,
      title: "Email Address",
      content: "info@vattavadabooking.com",
      action: () => window.open('mailto:info@vattavadabooking.com')
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Sun: 6:00 AM - 10:00 PM\n24/7 WhatsApp Support",
      action: null
    }
  ];

  const faqs = [
    {
      question: "How do I make a booking?",
      answer: "You can make a booking by filling out the inquiry form on any property page, calling us directly, or messaging us on WhatsApp. We'll respond quickly with availability and booking details."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Our cancellation policy varies by property and season. Generally, we offer flexible cancellation up to 48 hours before check-in. Specific terms will be shared during booking confirmation."
    },
    {
      question: "Do you provide transportation?",
      answer: "Yes, we can arrange transportation from nearby airports and railway stations. We also offer jeep safari services and guided tours. Contact us for pricing and availability."
    },
    {
      question: "What activities are available in Vattavada?",
      answer: "Vattavada offers trekking, tea plantation visits, jeep safaris, camping, bird watching, photography tours, and visits to nearby attractions like Top Station and Pampadum Shola."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-green-50/30'
    }`}>
      {/* Hero Section */}
      <section className={`bg-gradient-to-br from-green-800 to-emerald-700 text-white py-16 transition-colors duration-300 ${
        isDarkMode ? 'from-gray-800 to-gray-700' : ''
      }`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-green-100'
          }`}>
            Have questions about Vattavada or need help planning your stay? 
            We're here to help make your mountain getaway perfect.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-green-800'
            }`}>
              Contact Information
            </h2>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className={`hover:shadow-md transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-green-100'
                        }`}>
                          <Icon className={`h-5 w-5 transition-colors duration-300 ${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-green-800'
                          }`}>
                            {info.title}
                          </h3>
                          <p className={`text-sm whitespace-pre-line transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-green-600'
                          }`}>
                            {info.content}
                          </p>
                          {info.action && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={info.action}
                              className={`p-0 h-auto transition-colors duration-300 ${
                                isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                              }`}
                            >
                              {info.title === "Phone Number" ? "Call Now" : "Send Email"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleWhatsApp}
                className={`w-full text-white transition-colors duration-300 ${
                  isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
                }`}
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Us
              </Button>
              <Button
                variant="outline"
                className={`w-full transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-green-400 text-green-400 hover:bg-green-400/10' 
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
                size="lg"
                onClick={() => window.open('tel:+919876543210')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className={`shadow-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
            }`}>
              <CardHeader>
                <CardTitle className={`text-2xl transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-green-800'
                }`}>
                  Send us a Message
                </CardTitle>
                <CardDescription className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : ''
                }`}>
                  Fill out the form below and we'll get back to you within 2 hours during business hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-green-800'
                      }`}>Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-400' 
                            : 'border-green-200 focus:border-green-500'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-green-800'
                      }`}>Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-400' 
                            : 'border-green-200 focus:border-green-500'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-green-800'
                      }`}>Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-400' 
                            : 'border-green-200 focus:border-green-500'
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-green-800'
                      }`}>Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-400' 
                            : 'border-green-200 focus:border-green-500'
                        }`}
                        placeholder="What is this regarding?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-green-800'
                    }`}>Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      className={`transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-green-400' 
                          : 'border-green-200 focus:border-green-500'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-white transition-colors duration-300 ${
                      isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-green-800'
          }`}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className={`hover:shadow-md transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'border-green-100'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-green-100'
                    }`}>
                      <CheckCircle className={`h-4 w-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-green-800'
                      }`}>
                        {faq.question}
                      </h3>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-green-600'
                      }`}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={`mt-12 rounded-xl p-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-3 mb-3">
            <Phone className={`h-6 w-6 transition-colors duration-300 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`} />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-red-300' : 'text-red-800'
            }`}>Emergency Contact</h3>
          </div>
          <p className={`mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-red-200' : 'text-red-700'
          }`}>
            For urgent matters during your stay or travel emergencies, please contact us immediately:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'border-red-400 text-red-400 hover:bg-red-400/10' 
                  : 'border-red-600 text-red-600 hover:bg-red-50'
              }`}
              onClick={() => window.open('tel:+919876543210')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Emergency Hotline: +91 98765 43210
            </Button>
            <Button
              variant="outline"
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'border-red-400 text-red-400 hover:bg-red-400/10' 
                  : 'border-red-600 text-red-600 hover:bg-red-50'
              }`}
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              24/7 WhatsApp Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};