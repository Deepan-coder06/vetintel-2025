import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { i18n, Language } from '@/lib/i18n';
import { User, mockUsers, setCurrentUser } from '@/lib/mockData';

export default function Register() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaarNumber: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    preferredLanguage: 'en' as Language
  });

  useEffect(() => {
    const savedLanguage = i18n.getLanguage();
    setCurrentLanguage(savedLanguage);
    i18n.setLanguage(savedLanguage);
  }, []);

  const validateAadhaar = (aadhaar: string): boolean => {
    return /^\d{12}$/.test(aadhaar);
  };

  const validateMobile = (mobile: string): boolean => {
    return /^\+91\d{10}$/.test(mobile) || /^\d{10}$/.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

    if (!validateAadhaar(formData.aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      setIsLoading(false);
      return;
    }

    if (!validateMobile(formData.mobileNumber)) {
      setError('Please enter a valid mobile number');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      setError('Address is required');
      setIsLoading(false);
      return;
    }

    // Check if Aadhaar already exists
    const existingUser = mockUsers.find(user => user.aadhaarNumber === formData.aadhaarNumber);
    if (existingUser) {
      setError('An account with this Aadhaar number already exists');
      setIsLoading(false);
      return;
    }

    // Simulate sending OTP
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setShowOtpDialog(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otp !== '123456') {
      setError('Invalid OTP. Please try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate OTP verification and user creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        aadhaarNumber: formData.aadhaarNumber,
        mobileNumber: formData.mobileNumber.startsWith('+91') ? formData.mobileNumber : `+91${formData.mobileNumber}`,
        fullName: formData.fullName,
        address: formData.address,
        preferredLanguage: formData.preferredLanguage,
        role: 'farmer',
        isVerified: true
      };

      // Add to mock users (in real app, this would be saved to database)
      mockUsers.push(newUser);
      
      // Set as current user
      setCurrentUser(newUser);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{i18n.t('appName')}</h1>
          </div>
          <p className="text-gray-600">Create your farmer account</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {i18n.t('register')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    {i18n.t('fullName')} *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar" className="text-sm font-medium text-gray-700">
                    {i18n.t('aadhaarNumber')} *
                  </Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="12-digit Aadhaar number"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                    maxLength={12}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                    {i18n.t('mobileNumber')} *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+91 or 10-digit number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                    {i18n.t('preferredLanguage')} *
                  </Label>
                  <Select 
                    value={formData.preferredLanguage} 
                    onValueChange={(value) => handleInputChange('preferredLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {i18n.t('password')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pr-10"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    {i18n.t('confirmPassword')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  {i18n.t('address')} *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : i18n.t('register')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-green-600 hover:text-green-700 font-medium"
                  onClick={() => navigate('/login')}
                >
                  {i18n.t('login')} here
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
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>{i18n.t('otpVerification')}</span>
            </DialogTitle>
            <DialogDescription>
              We've sent a 6-digit OTP to your mobile number {formData.mobileNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">{i18n.t('enterOtp')}</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-gray-500 text-center">
                Demo OTP: 123456
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleOtpVerification}
                disabled={otp.length !== 6 || isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Verifying...' : i18n.t('verifyOtp')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Simulate resending OTP
                  setOtp('');
                }}
                disabled={isLoading}
              >
                {i18n.t('resendOtp')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}