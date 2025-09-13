import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (!formData.loginId || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Attempt login
    const result = login(formData.loginId, formData.password);
    
    if (result.success) {
      toast.success('Login successful! Welcome to admin panel.');
    } else {
      setError(result.error);
      toast.error('Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Login
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sign in to access the property management dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg`}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login ID Field */}
              <div className="space-y-2">
                <Label htmlFor="loginId">Login ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="loginId"
                    type="text"
                    value={formData.loginId}
                    onChange={(e) => handleInputChange('loginId', e.target.value)}
                    placeholder="Enter your login ID"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className={`mt-6 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Lock className="inline h-3 w-3 mr-1" />
                Your session is secure and will be remembered on this device.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            VattavadaBooking Admin Panel © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;