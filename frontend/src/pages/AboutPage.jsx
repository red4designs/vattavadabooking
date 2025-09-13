import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Shield, 
  Heart, 
  TreePine, 
  Users, 
  Award, 
  MapPin, 
  Phone, 
  MessageCircle,
  CheckCircle,
  Star,
  Globe,
  Clock
} from 'lucide-react';
import { whatsappNumber, whatsappMessage } from '../mock';

export const AboutPage = () => {
  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All our properties are personally verified for safety standards and quality assurance."
    },
    {
      icon: Heart,
      title: "Authentic Experiences",
      description: "We believe in providing genuine local experiences that connect you with Kerala's culture."
    },
    {
      icon: TreePine,
      title: "Eco-Friendly",
      description: "Committed to sustainable tourism that preserves Vattavada's natural beauty."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Supporting local communities and promoting responsible tourism practices."
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Guests" },
    { number: "50+", label: "Properties" },
    { number: "4.8", label: "Average Rating" },
    { number: "24/7", label: "Support" }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & Local Guide",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      description: "Born and raised in Vattavada, Rajesh has been sharing his love for the hills for over 10 years."
    },
    {
      name: "Priya Nair",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      description: "Ensures every guest has a seamless experience from booking to checkout."
    },
    {
      name: "Suresh Thomas",
      role: "Adventure Coordinator",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      description: "Plans and coordinates all adventure activities and trekking experiences."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-green-800 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Trusted Partner for 
              <span className="block text-emerald-300">Vattavada Adventures</span>
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              We are passionate locals who believe in sharing the pristine beauty and authentic culture 
              of Kerala's highest hill station with travelers from around the world.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
                {stat.number}
              </div>
              <div className="text-green-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-green-700">
              <p>
                VattavadaBooking.com was born from a simple dream - to share the untouched beauty 
                of Vattavada with travelers seeking authentic experiences in Kerala's pristine hill station.
              </p>
              <p>
                Founded by locals who grew up among these misty mountains, we understand what makes 
                Vattavada special. From the rolling tea plantations to the crisp mountain air, 
                every corner of this region tells a story.
              </p>
              <p>
                Over the years, we've carefully curated a collection of properties that represent 
                the best of Vattavada - from cozy family cottages to luxury mountain retreats, 
                each offering a unique window into our beloved hill station.
              </p>
              <p>
                Today, we're proud to be the most trusted booking platform for Vattavada, 
                helping hundreds of families create unforgettable memories while supporting 
                our local community and preserving the natural beauty we all cherish.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
              alt="Vattavada landscape"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-green-100 hover:shadow-lg transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-green-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-green-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {member.name}
                  </h3>
                  <Badge className="bg-green-100 text-green-700 mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-green-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-green-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-8">
            Why Book With VattavadaBooking?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Personally Verified Properties</h4>
                <p className="text-green-600 text-sm">Every property is personally inspected by our team for quality and safety.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Local Expertise</h4>
                <p className="text-green-600 text-sm">Deep local knowledge to help you discover hidden gems and authentic experiences.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">24/7 Support</h4>
                <p className="text-green-600 text-sm">Round-the-clock assistance for all your travel needs and emergencies.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Best Price Guarantee</h4>
                <p className="text-green-600 text-sm">We ensure you get the best rates without compromising on quality.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Seamless Booking</h4>
                <p className="text-green-600 text-sm">Easy inquiry process with quick responses and confirmations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Sustainable Tourism</h4>
                <p className="text-green-600 text-sm">Supporting local communities while preserving natural beauty.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Experience Vattavada?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Let us help you plan your perfect mountain getaway. Our team is ready to assist you 
            with bookings, recommendations, and everything you need for an unforgettable stay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleWhatsApp}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat on WhatsApp
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Us Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};