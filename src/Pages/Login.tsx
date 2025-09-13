import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Language, i18n } from '@/lib/i18n';
import { getUserByAadhaar, setCurrentUser } from '@/lib/mockData';

export default function Login() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = i18n.getLanguage();
    setCurrentLanguage(savedLanguage);
    i18n.setLanguage(savedLanguage);
  }, []);

  const validateAadhaar = (aadhaar: string): boolean => {
    return /^\d{12}$/.test(aadhaar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.aadhaarNumber) {
      setError(i18n.t('aadhaarRequired'));
      setIsLoading(false);
      return;
    }

    if (!validateAadhaar(formData.aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    // Mock authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const user = getUserByAadhaar(formData.aadhaarNumber);
      
      if (!user) {
        setError(i18n.t('invalidCredentials'));
        setIsLoading(false);
        return;
      }

      // Mock password validation (in real app, this would be done on backend)
      if (formData.password !== 'password123') {
        setError(i18n.t('invalidCredentials'));
        setIsLoading(false);
        return;
      }

      // Set current user and redirect
      setCurrentUser(user);
      navigate('/dashboard');
      
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{i18n.t('appName')}</h1>
          </div>
          <p className="text-gray-600">Digital Farm Management Portal</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {i18n.t('login')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your Aadhaar number and password to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="text-sm font-medium text-gray-700">
                  {i18n.t('aadhaarNumber')} *
                </Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder="Enter 12-digit Aadhaar number"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                  maxLength={12}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500">
                  Demo: Use 123456789012 (Ravi Kumar) or 234567890123 (Lakshmi Devi)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {i18n.t('password')} *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="text-lg pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Demo password: password123
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : i18n.t('login')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-green-600 hover:text-green-700 font-medium"
                  onClick={() => navigate('/register')}
                >
                  {i18n.t('register')} here
                </Button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="p-0 h-auto text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-900 mb-2">Demo Accounts:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Farmer:</strong> 123456789012 / password123</p>
              <p><strong>Farmer (Tamil):</strong> 234567890123 / password123</p>
              <p><strong>Vet:</strong> 345678901234 / password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}