import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, BarChart3, Globe, Smartphone, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { i18n, Language } from '@/lib/i18n';
import { getCurrentUser } from '@/lib/mockData';

export default function Index() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLanguage = i18n.getLanguage();
    setCurrentLanguage(savedLanguage);
    i18n.setLanguage(savedLanguage);
    
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    i18n.setLanguage(language);
    window.location.reload(); // Reload to apply language changes
  };

  const features = [
    {
      icon: Shield,
      title: "MRL Compliance",
      description: "Monitor Maximum Residue Limits and ensure food safety standards"
    },
    {
      icon: Users,
      title: "Multi-User Platform",
      description: "Farmers, Vets, Lab Technicians, and Regulators in one system"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights on antimicrobial usage and compliance trends"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Available in English, Tamil, Hindi and other Indian languages"
    },
    {
      icon: Smartphone,
      title: "Mobile & Web Access",
      description: "Offline-capable mobile app and responsive web portal"
    },
    {
      icon: Database,
      title: "Secure Data Management",
      description: "Encrypted storage with audit trails and compliance reporting"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{i18n.t('appName')}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
            
            {isLoggedIn ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-green-600 hover:bg-green-700">
                {i18n.t('dashboard')}
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  {i18n.t('login')}
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
                  {i18n.t('register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {i18n.t('farmManagement')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Digital solution for monitoring Maximum Residue Limits (MRL) and Antimicrobial Usage (AMU) in livestock. 
            Ensuring food safety and regulatory compliance for Indian farmers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLoggedIn ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                >
                  Get Started - {i18n.t('register')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 text-lg"
                >
                  {i18n.t('login')}
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
              >
                Go to {i18n.t('dashboard')}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h3>
          <p className="text-lg text-gray-600">Comprehensive tools for modern farm management and compliance</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Registered Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Veterinarians</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">{i18n.t('appName')}</h4>
              </div>
              <p className="text-gray-400">
                Empowering Indian farmers with digital tools for livestock management and regulatory compliance.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Email: sivadeepan06@gmail.com</li>
                <li>Phone: +91-94446-52215</li>
                <li>Address: Chennai, Tamil Nadu, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VetIntelAgriTech (VIAT). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}