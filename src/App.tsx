import React, { useState, useEffect } from 'react';
import { AuthSystem } from '@/components/auth/AuthSystem';
import Dashboard from '@/Pages/Dashboard';
import { authAPI, initializeSampleData } from '@/lib/api';
import { Language } from '@/lib/i18n';
import { User } from '@/lib/types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();
    
    // Check if user is already logged in
    const currentUser = authAPI.getCurrentUser();
    if (currentUser && authAPI.isRemembered()) {
      // Map currentUser to the expected User shape if needed
      setUser({
        ...currentUser,
        user: currentUser.user ?? currentUser, // Adjust this line based on your actual structure
      });
      setLanguage(currentUser.preferredLanguage as Language || 'en');
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setLanguage(userData.preferredLanguage as Language || 'en');
  };

  const handleLogout = () => {
    setUser(null);
    setLanguage('en');
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // In a real app, you might want to save this preference to the user's profile
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading VetIntelAgriTech...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthSystem 
        onLogin={handleLogin} 
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout}
      language={language}
      onLanguageChange={handleLanguageChange}
    />
  );
}

export default App;