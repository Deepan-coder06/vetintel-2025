import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Smartphone, User, MapPin } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { translate, Language, languages } from '@/lib/i18n';
import { User as UserType } from '@/lib/types';

interface AuthSystemProps {
  onLogin: (user: UserType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuthSystem: React.FC<AuthSystemProps> = ({ onLogin, language, onLanguageChange }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loginData, setLoginData] = useState({
    aadhaar: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    farmerName: '',
    mobile: '',
    aadhaar: '',
    password: '',
    confirmPassword: '',
    address: {
      state: '',
      district: '',
      village: '',
      pincode: ''
    },
    preferredLanguage: 'en'
  });

  const t = (key: string) => translate(key, language);

  useEffect(() => {
    // Check if user is remembered
    if (authAPI.isRemembered()) {
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        onLogin(currentUser);
      }
    }
  }, [onLogin]);

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile);
  };

  const handleSendOTP = async () => {
    if (!validateMobile(registerData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authAPI.sendOTP(registerData.mobile);
      setSuccess(t('auth.otpSent'));
      setMode('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authAPI.verifyOTP(registerData.mobile, otp);
      await handleRegister();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateAadhaar(registerData.aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await authAPI.register(registerData);
      setSuccess(t('auth.registrationSuccess'));
      setTimeout(() => {
        setMode('login');
        setLoginData({ aadhaar: registerData.aadhaar, password: '' });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateAadhaar(loginData.aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    if (!loginData.password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await authAPI.login(loginData.aadhaar, loginData.password, rememberMe);
      setSuccess(t('auth.loginSuccess'));
      setTimeout(() => onLogin(result.user), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const renderLogin = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">
          VetIntelAgriTech
        </CardTitle>
        <CardDescription>{t('auth.login')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="aadhaar">{t('auth.aadhaar')}</Label>
          <Input
            id="aadhaar"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            value={loginData.aadhaar}
            onChange={(e) => setLoginData({ ...loginData, aadhaar: e.target.value })}
            maxLength={12}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm">
            {t('auth.rememberMe')}
          </Label>
        </div>

        <div className="space-y-2">
          <Label>{t('auth.language')}</Label>
          <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleLogin} 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('auth.login')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setMode('register')}
          className="w-full"
        >
          {t('auth.register')}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderRegister = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <User className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">
          {t('auth.register')}
        </CardTitle>
        <CardDescription>Create your VIAT account</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="farmerName">{t('auth.farmerName')}</Label>
          <Input
            id="farmerName"
            value={registerData.farmerName}
            onChange={(e) => setRegisterData({ ...registerData, farmerName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mobile">{t('auth.mobile')}</Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="9876543210"
            value={registerData.mobile}
            onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
            maxLength={10}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="regAadhaar">{t('auth.aadhaar')}</Label>
          <Input
            id="regAadhaar"
            type="text"
            placeholder="123456789012"
            value={registerData.aadhaar}
            onChange={(e) => setRegisterData({ ...registerData, aadhaar: e.target.value })}
            maxLength={12}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="state">{t('auth.state')}</Label>
            <Input
              id="state"
              value={registerData.address.state}
              onChange={(e) => setRegisterData({ 
                ...registerData, 
                address: { ...registerData.address, state: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">{t('auth.district')}</Label>
            <Input
              id="district"
              value={registerData.address.district}
              onChange={(e) => setRegisterData({ 
                ...registerData, 
                address: { ...registerData.address, district: e.target.value }
              })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
          />
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleSendOTP} 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Smartphone className="mr-2 h-4 w-4" />
          {t('auth.sendOtp')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setMode('login')}
          className="w-full"
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );

  const renderOTP = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Smartphone className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">
          {t('auth.verifyOtp')}
        </CardTitle>
        <CardDescription>
          Enter the OTP sent to {registerData.mobile}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleVerifyOTP} 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('auth.verifyOtp')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setMode('register')}
          className="w-full"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {mode === 'login' && renderLogin()}
      {mode === 'register' && renderRegister()}
      {mode === 'otp' && renderOTP()}
    </div>
  );
};