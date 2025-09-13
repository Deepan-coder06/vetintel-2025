export interface Translation {
  [key: string]: string;
}

export const translations = {
  en: {
    // Authentication
    'auth.register': 'Register',
    'auth.login': 'Login',
    'auth.farmerName': 'Farmer Name',
    'auth.mobile': 'Mobile Number',
    'auth.aadhaar': 'Aadhaar Number',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.address': 'Address',
    'auth.state': 'State',
    'auth.district': 'District',
    'auth.village': 'Village',
    'auth.pincode': 'Pincode',
    'auth.language': 'Preferred Language',
    'auth.sendOtp': 'Send OTP',
    'auth.verifyOtp': 'Verify OTP',
    'auth.rememberMe': 'Remember Me',
    'auth.otpSent': 'OTP sent to your mobile number',
    'auth.loginSuccess': 'Login successful',
    'auth.registrationSuccess': 'Registration successful',
    
    // Dashboard
    'dashboard.title': 'VetIntelAgriTech Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.treatments': 'Treatments',
    'dashboard.labResults': 'Lab Results',
    'dashboard.aiSuggestions': 'AI Suggestions',
    'dashboard.offline': 'Offline Mode',
    'dashboard.online': 'Online',
    
    // Treatments
    'treatment.record': 'Record Treatment',
    'treatment.drug': 'Drug Name',
    'treatment.dose': 'Dose',
    'treatment.route': 'Route',
    'treatment.species': 'Species',
    'treatment.withdrawalDays': 'Withdrawal Days',
    'treatment.aiSuggestion': 'AI Suggested Withdrawal',
    'treatment.save': 'Save Treatment',
    'treatment.history': 'Treatment History',
    
    // AI Companion
    'ai.companion': 'AI Companion',
    'ai.withdrawalSuggestion': 'Withdrawal Suggestion',
    'ai.priceForcast': 'Price Forecast',
    'ai.alerts': 'Alerts',
    'ai.dontSellToday': "Don't sell today, price expected to rise tomorrow",
    'ai.labTestFailed': 'Lab test failed: High residues detected',
    'ai.dosageTooHigh': 'Dosage too high, extend withdrawal period',
    
    // Lab Results
    'lab.upload': 'Upload Lab Results',
    'lab.results': 'Lab Results',
    'lab.analyte': 'Analyte',
    'lab.measured': 'Measured Value',
    'lab.mrl': 'MRL Value',
    'lab.status': 'Status',
    'lab.passed': 'Passed',
    'lab.failed': 'Failed',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.logout': 'Logout',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
  },
  
  hi: {
    // (your Hindi translations — unchanged)
    'auth.register': 'पंजीकरण',
    'auth.login': 'लॉगिन',
    'auth.farmerName': 'किसान का नाम',
    'auth.mobile': 'मोबाइल नंबर',
    'auth.aadhaar': 'आधार नंबर',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.address': 'पता',
    'auth.state': 'राज्य',
    'auth.district': 'जिला',
    'auth.village': 'गांव',
    'auth.pincode': 'पिनकोड',
    'auth.language': 'पसंदीदा भाषा',
    'auth.sendOtp': 'OTP भेजें',
    'auth.verifyOtp': 'OTP सत्यापित करें',
    'auth.rememberMe': 'मुझे याद रखें',
    'auth.otpSent': 'आपके मोबाइल नंबर पर OTP भेजा गया',
    'auth.loginSuccess': 'लॉगिन सफल',
    'auth.registrationSuccess': 'पंजीकरण सफल',
    'dashboard.title': 'वेटइंटेलएग्रीटेक डैशबोर्ड',
    'dashboard.welcome': 'स्वागत',
    'dashboard.treatments': 'उपचार',
    'dashboard.labResults': 'लैब परिणाम',
    'dashboard.aiSuggestions': 'AI सुझाव',
    'dashboard.offline': 'ऑफलाइन मोड',
    'dashboard.online': 'ऑनलाइन',
    'treatment.record': 'उपचार रिकॉर्ड करें',
    'treatment.drug': 'दवा का नाम',
    'treatment.dose': 'खुराक',
    'treatment.route': 'मार्ग',
    'treatment.species': 'प्रजाति',
    'treatment.withdrawalDays': 'वापसी के दिन',
    'treatment.aiSuggestion': 'AI सुझावित वापसी',
    'treatment.save': 'उपचार सहेजें',
    'treatment.history': 'उपचार इतिहास',
    'ai.companion': 'AI साथी',
    'ai.withdrawalSuggestion': 'वापसी सुझाव',
    'ai.priceForcast': 'मूल्य पूर्वानुमान',
    'ai.alerts': 'अलर्ट',
    'ai.dontSellToday': 'आज न बेचें, कल कीमत बढ़ने की उम्मीद',
    'ai.labTestFailed': 'लैब टेस्ट असफल: उच्च अवशेष का पता चला',
    'ai.dosageTooHigh': 'खुराक बहुत अधिक, वापसी अवधि बढ़ाएं',
    'lab.upload': 'लैब परिणाम अपलोड करें',
    'lab.results': 'लैब परिणाम',
    'lab.analyte': 'विश्लेषक',
    'lab.measured': 'मापा गया मान',
    'lab.mrl': 'MRL मान',
    'lab.status': 'स्थिति',
    'lab.passed': 'पास',
    'lab.failed': 'असफल',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.submit': 'जमा करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.logout': 'लॉगआउट',
    'common.profile': 'प्रोफ़ाइल',
    'common.settings': 'सेटिंग्स',
  },
  
  ta: {
    // (your Tamil translations — unchanged)
    'auth.register': 'பதிவு',
    'auth.login': 'உள்நுழைவு',
    'auth.farmerName': 'விவசாயி பெயர்',
    'auth.mobile': 'மொபைல் எண்',
    'auth.aadhaar': 'ஆதார் எண்',
    'auth.password': 'கடவுச்சொல்',
    'auth.confirmPassword': 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    'auth.address': 'முகவரி',
    'auth.state': 'மாநிலம்',
    'auth.district': 'மாவட்டம்',
    'auth.village': 'கிராமம்',
    'auth.pincode': 'பின்கோட்',
    'auth.language': 'விருப்ப மொழி',
    'auth.sendOtp': 'OTP அனுப்பவும்',
    'auth.verifyOtp': 'OTP சரிபார்க்கவும்',
    'auth.rememberMe': 'என்னை நினைவில் வைத்துக்கொள்',
    'auth.otpSent': 'உங்கள் மொபைல் எண்ணுக்கு OTP அனுப்பப்பட்டது',
    'auth.loginSuccess': 'உள்நுழைவு வெற்றிகரமாக',
    'auth.registrationSuccess': 'பதிவு வெற்றிகரமாக',
    'dashboard.title': 'வெட்இன்டெல்அக்ரிடெக் டாஷ்போர்டு',
    'dashboard.welcome': 'வரவேற்கிறோம்',
    'dashboard.treatments': 'சிகிச்சைகள்',
    'dashboard.labResults': 'ஆய்வக முடிவுகள்',
    'dashboard.aiSuggestions': 'AI பரிந்துரைகள்',
    'dashboard.offline': 'ஆஃப்லைன் பயன்முறை',
    'dashboard.online': 'ஆன்லைன்',
    'treatment.record': 'சிகிச்சை பதிவு செய்யவும்',
    'treatment.drug': 'மருந்து பெயர்',
    'treatment.dose': 'அளவு',
    'treatment.route': 'வழி',
    'treatment.species': 'இனம்',
    'treatment.withdrawalDays': 'திரும்பப் பெறும் நாட்கள்',
    'treatment.aiSuggestion': 'AI பரிந்துரைக்கப்பட்ட திரும்பப் பெறுதல்',
    'treatment.save': 'சிகிச்சையை சேமிக்கவும்',
    'treatment.history': 'சிகிச்சை வரலாறு',
    'ai.companion': 'AI துணை',
    'ai.withdrawalSuggestion': 'திரும்பப் பெறும் பரிந்துரை',
    'ai.priceForcast': 'விலை முன்னறிவிப்பு',
    'ai.alerts': 'எச்சரிக்கைகள்',
    'ai.dontSellToday': 'இன்று விற்காதீர்கள், நாளை விலை உயரும் என எதிர்பார்க்கப்படுகிறது',
    'ai.labTestFailed': 'ஆய்வக சோதனை தோல்வி: அதிக எச்சங்கள் கண்டறியப்பட்டன',
    'ai.dosageTooHigh': 'அளவு மிக அதிகம், திரும்பப் பெறும் காலத்தை நீட்டிக்கவும்',
    'lab.upload': 'ஆய்வக முடிவுகளை பதிவேற்றவும்',
    'lab.results': 'ஆய்வக முடிவுகள்',
    'lab.analyte': 'பகுப்பாய்வி',
    'lab.measured': 'அளவிடப்பட்ட மதிப்பு',
    'lab.mrl': 'MRL மதிப்பு',
    'lab.status': 'நிலை',
    'lab.passed': 'தேர்ச்சி',
    'lab.failed': 'தோல்வி',
    'common.save': 'சேமிக்கவும்',
    'common.cancel': 'ரத்து செய்யவும்',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.logout': 'வெளியேறு',
    'common.profile': 'சுயவிவரம்',
    'common.settings': 'அமைப்புகள்',
  }
};

export type Language = 'en' | 'hi' | 'ta';

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
];

export const translate = (key: string, language: Language = 'en'): string => {
  // safe lookup with fallback
  return (translations as any)[language]?.[key] ?? translations.en[key] ?? key;
};

/* ------------------------------
   Simple runtime i18n wrapper
   ------------------------------ */
let currentLanguage: Language = 'en';

export const i18n = {
  t(key: string) {
    return translate(key, currentLanguage);
  },
  setLanguage(lang: Language) {
    currentLanguage = lang;
  },
  getLanguage(): Language {
    return currentLanguage;
  }
};