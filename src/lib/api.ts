// Mock API services for VIAT prototype
export interface User {
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

export interface Treatment {
  id: string;
  farmerId: string;
  drug: string;
  dose: string;
  route: string;
  species: string;
  withdrawalDays: number;
  aiSuggestedDays: number;
  recordedAt: string;
  batchId?: string;
}

export interface LabResult {
  id: string;
  farmerId: string;
  analyte: string;
  measuredValue: number;
  mrlValue: number;
  passFail: 'pass' | 'fail';
  uploadedBy: string;
  uploadedAt: string;
}

export interface AIAlert {
  id: string;
  type: 'withdrawal' | 'price' | 'lab' | 'dosage';
  message: string;
  severity: 'info' | 'warning' | 'error';
  farmerId: string;
  createdAt: string;
}

// Mock data storage
const STORAGE_KEYS = {
  users: 'viat_users',
  treatments: 'viat_treatments',
  labResults: 'viat_lab_results',
  alerts: 'viat_alerts',
  currentUser: 'viat_current_user',
  rememberMe: 'viat_remember_me'
};

// Utility functions
const generateId = () => crypto.randomUUID();
const hashPassword = (password: string) => btoa(password); // Simple encoding for demo
const maskAadhaar = (aadhaar: string) => `****-****-${aadhaar.slice(-4)}`;

// Authentication API
export const authAPI = {
  async register(userData: {
    farmerName: string;
    mobile: string;
    aadhaar: string;
    password: string;
    address: {
      state: string;
      district: string;
      village: string;
      pincode: string;
    };
    preferredLanguage: string;
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    
    // Check if user already exists
    if (users.find((u: User) => u.aadhaar === userData.aadhaar)) {
      throw new Error('User already exists with this Aadhaar number');
    }
    
    const newUser: User = {
      id: generateId(),
      farmerName: userData.farmerName,
      mobile: userData.mobile,
      aadhaar: userData.aadhaar,
      address: userData.address,
      preferredLanguage: userData.preferredLanguage,
      role: 'farmer',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    
    return { success: true, user: { ...newUser, aadhaar: maskAadhaar(newUser.aadhaar) } };
  },

  async sendOTP(mobile: string) {
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 500));
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`viat_otp_${mobile}`, otp);
    console.log(`OTP for ${mobile}: ${otp}`); // For demo purposes
    return { success: true, message: 'OTP sent successfully' };
  },

  async verifyOTP(mobile: string, otp: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedOTP = localStorage.getItem(`viat_otp_${mobile}`);
    if (storedOTP === otp) {
      localStorage.removeItem(`viat_otp_${mobile}`);
      return { success: true, message: 'OTP verified successfully' };
    }
    throw new Error('Invalid OTP');
  },

  async login(aadhaar: string, password: string, rememberMe: boolean = false) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    const user = users.find((u: User) => u.aadhaar === aadhaar);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Simple password check (in real app, compare hashed passwords)
    const hashedPassword = hashPassword(password);
    const storedPassword = localStorage.getItem(`viat_password_${user.id}`);
    
    if (!storedPassword) {
      // First time login, store password
      localStorage.setItem(`viat_password_${user.id}`, hashedPassword);
    } else if (storedPassword !== hashedPassword) {
      throw new Error('Invalid password');
    }
    
    const userSession = { ...user, aadhaar: maskAadhaar(user.aadhaar) };
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(userSession));
    
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.rememberMe, 'true');
    }
    
    return { success: true, user: userSession };
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    localStorage.removeItem(STORAGE_KEYS.rememberMe);
    return { success: true };
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.currentUser);
    return user ? JSON.parse(user) : null;
  },

  isRemembered(): boolean {
    return localStorage.getItem(STORAGE_KEYS.rememberMe) === 'true';
  }
};

// Treatment API
export const treatmentAPI = {
  async recordTreatment(treatment: Omit<Treatment, 'id' | 'recordedAt' | 'aiSuggestedDays'>) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get AI suggestion for withdrawal period
    const aiSuggestion = await aiAPI.getWithdrawalSuggestion(
      treatment.drug,
      treatment.dose,
      treatment.route,
      treatment.species
    );
    
    const newTreatment: Treatment = {
      ...treatment,
      id: generateId(),
      aiSuggestedDays: aiSuggestion.suggestedDays,
      recordedAt: new Date().toISOString()
    };
    
    const treatments = JSON.parse(localStorage.getItem(STORAGE_KEYS.treatments) || '[]');
    treatments.push(newTreatment);
    localStorage.setItem(STORAGE_KEYS.treatments, JSON.stringify(treatments));
    
    return { success: true, treatment: newTreatment };
  },

  async getTreatments(farmerId: string): Promise<Treatment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const treatments = JSON.parse(localStorage.getItem(STORAGE_KEYS.treatments) || '[]');
    return treatments.filter((t: Treatment) => t.farmerId === farmerId);
  }
};

// Lab Results API
export const labAPI = {
  async uploadResults(results: Omit<LabResult, 'id' | 'uploadedAt'>[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const labResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.labResults) || '[]');
    const newResults = results.map(result => ({
      ...result,
      id: generateId(),
      uploadedAt: new Date().toISOString()
    }));
    
    labResults.push(...newResults);
    localStorage.setItem(STORAGE_KEYS.labResults, JSON.stringify(labResults));
    
    // Generate alerts for failed tests
    const failedResults = newResults.filter(r => r.passFail === 'fail');
    for (const result of failedResults) {
      await alertAPI.createAlert({
        type: 'lab',
        message: `Lab test failed: ${result.analyte} ${(result.measuredValue / result.mrlValue).toFixed(1)}× above MRL limit`,
        severity: 'error',
        farmerId: result.farmerId
      });
    }
    
    return { success: true, results: newResults };
  },

  async getResults(farmerId: string): Promise<LabResult[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.labResults) || '[]');
    return results.filter((r: LabResult) => r.farmerId === farmerId);
  }
};

// AI API
export const aiAPI = {
  async getWithdrawalSuggestion(drug: string, dose: string, route: string, species: string) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock AI logic for withdrawal period suggestion
    const baseWithdrawal = {
      'Oxytetracycline': 14,
      'Penicillin': 7,
      'Streptomycin': 21,
      'Enrofloxacin': 10,
      'Tylosin': 14
    };
    
    const baseDays = baseWithdrawal[drug as keyof typeof baseWithdrawal] || 14;
    const routeMultiplier = route === 'Intramuscular' ? 1.2 : route === 'Intravenous' ? 0.8 : 1.0;
    const speciesMultiplier = species === 'Cattle' ? 1.0 : species === 'Poultry' ? 0.7 : 1.1;
    
    const suggestedDays = Math.ceil(baseDays * routeMultiplier * speciesMultiplier);
    
    return {
      suggestedDays,
      confidence: 0.85,
      reasoning: `Based on ${drug} pharmacokinetics in ${species} via ${route} route`
    };
  },

  async getPriceForecast(commodity: string, region: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentPrice = Math.floor(Math.random() * 100) + 50;
    const forecast = currentPrice * (0.95 + Math.random() * 0.1);
    const change = ((forecast - currentPrice) / currentPrice) * 100;
    
    return {
      commodity,
      region,
      currentPrice,
      forecastPrice: Math.round(forecast),
      changePercent: Math.round(change * 10) / 10,
      confidence: 0.78,
      recommendation: change > 2 ? 'Hold - Price expected to rise' : change < -2 ? 'Sell - Price may fall' : 'Monitor market'
    };
  },

  async checkAnomalies(farmerId: string) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const treatments = await treatmentAPI.getTreatments(farmerId);
    const recentTreatments = treatments.filter(t => 
      new Date(t.recordedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    const anomalies = [];
    if (recentTreatments.length > 10) {
      anomalies.push({
        type: 'high_frequency',
        message: 'High treatment frequency detected in last 30 days',
        severity: 'warning' as const
      });
    }
    
    return anomalies;
  }
};

// Alert API
export const alertAPI = {
  async createAlert(alert: Omit<AIAlert, 'id' | 'createdAt'>) {
    const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.alerts) || '[]');
    const newAlert: AIAlert = {
      ...alert,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    alerts.push(newAlert);
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
    
    return newAlert;
  },

  async getAlerts(farmerId: string): Promise<AIAlert[]> {
    const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.alerts) || '[]');
    return alerts
      .filter((a: AIAlert) => a.farmerId === farmerId)
      .sort((a: AIAlert, b: AIAlert) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markAsRead(alertId: string) {
    // Implementation for marking alerts as read
    return { success: true };
  }
};

// Initialize with sample data
export const initializeSampleData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    // Add sample MRL data
    const sampleMRLs = [
      { analyte: 'Oxytetracycline', product: 'Milk', mrlValue: 100 },
      { analyte: 'Penicillin', product: 'Milk', mrlValue: 4 },
      { analyte: 'Streptomycin', product: 'Milk', mrlValue: 200 },
      { analyte: 'Enrofloxacin', product: 'Meat', mrlValue: 100 },
      { analyte: 'Tylosin', product: 'Meat', mrlValue: 100 }
    ];
    localStorage.setItem('viat_mrl_data', JSON.stringify(sampleMRLs));
  }
};