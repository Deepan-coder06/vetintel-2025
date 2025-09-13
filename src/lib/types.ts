export interface User {
  user: string;
  id: string;
  farmerName: string;
  mobile: string;
  aadhaar: string;
  address: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
  preferredLanguage: string;
  role: 'farmer' | 'lab' | 'vet' | 'regulator';
  createdAt: string;
}

export interface PriceForecast {
  commodity: string;
  region: string;
  currentPrice: number;
  forecastPrice: number;
  changePercent: number;
  confidence: number;
  recommendation: string;
}

export interface Anomaly {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface AISuggestion {
  suggestedDays: number;
  confidence: number;
  reasoning: string;
}