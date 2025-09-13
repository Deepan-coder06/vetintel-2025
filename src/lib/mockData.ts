export interface User {
  id: string;
  aadhaarNumber: string;
  mobileNumber: string;
  fullName: string;
  address: string;
  preferredLanguage: 'en' | 'ta' | 'hi';
  role: 'farmer' | 'vet' | 'lab' | 'regulator' | 'admin';
  isVerified: boolean;
}

export interface Treatment {
  id: string;
  farmerId: string;
  animalId: string;
  antimicrobialName: string;
  dosage: string;
  treatmentDate: string;
  withdrawalPeriod: number;
  veterinarian: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface LabResult {
  id: string;
  batchId: string;
  farmerId: string;
  animalId: string;
  testDate: string;
  antimicrobialName: string;
  residueLevel: number;
  mrlLimit: number;
  status: 'passed' | 'failed' | 'pending';
  labName: string;
}

export interface CodexMRL {
  antimicrobialName: string;
  animalType: string;
  tissueType: string;
  mrlLimit: number;
  unit: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    aadhaarNumber: '123456789012',
    mobileNumber: '+919876543210',
    fullName: 'Ravi Kumar',
    address: 'Village Kothapalli, Guntur, Andhra Pradesh',
    preferredLanguage: 'en',
    role: 'farmer',
    isVerified: true
  },
  {
    id: '2',
    aadhaarNumber: '234567890123',
    mobileNumber: '+919876543211',
    fullName: 'Lakshmi Devi',
    address: 'Thanjavur, Tamil Nadu',
    preferredLanguage: 'ta',
    role: 'farmer',
    isVerified: true
  },
  {
    id: '3',
    aadhaarNumber: '345678901234',
    mobileNumber: '+919876543212',
    fullName: 'Dr. Suresh Sharma',
    address: 'Jaipur, Rajasthan',
    preferredLanguage: 'hi',
    role: 'vet',
    isVerified: true
  }
];

// Mock Treatments
export const mockTreatments: Treatment[] = [
  {
    id: '1',
    farmerId: '1',
    animalId: 'COW001',
    antimicrobialName: 'Amoxicillin',
    dosage: '500mg',
    treatmentDate: '2024-01-15',
    withdrawalPeriod: 7,
    veterinarian: 'Dr. Suresh Sharma',
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    farmerId: '1',
    animalId: 'COW002',
    antimicrobialName: 'Oxytetracycline',
    dosage: '200mg',
    treatmentDate: '2024-01-20',
    withdrawalPeriod: 14,
    veterinarian: 'Dr. Suresh Sharma',
    status: 'active',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    farmerId: '2',
    animalId: 'BUF001',
    antimicrobialName: 'Penicillin G',
    dosage: '300mg',
    treatmentDate: '2024-01-18',
    withdrawalPeriod: 10,
    veterinarian: 'Dr. Rajesh Kumar',
    status: 'completed',
    createdAt: '2024-01-18T09:15:00Z'
  }
];

// Mock Lab Results
export const mockLabResults: LabResult[] = [
  {
    id: '1',
    batchId: 'BATCH001',
    farmerId: '1',
    animalId: 'COW001',
    testDate: '2024-01-25',
    antimicrobialName: 'Amoxicillin',
    residueLevel: 0.05,
    mrlLimit: 0.1,
    status: 'passed',
    labName: 'Central Lab, Hyderabad'
  },
  {
    id: '2',
    batchId: 'BATCH002',
    farmerId: '1',
    animalId: 'COW002',
    testDate: '2024-01-28',
    antimicrobialName: 'Oxytetracycline',
    residueLevel: 0.15,
    mrlLimit: 0.1,
    status: 'failed',
    labName: 'Regional Lab, Guntur'
  },
  {
    id: '3',
    batchId: 'BATCH003',
    farmerId: '2',
    animalId: 'BUF001',
    testDate: '2024-01-30',
    antimicrobialName: 'Penicillin G',
    residueLevel: 0.03,
    mrlLimit: 0.05,
    status: 'passed',
    labName: 'State Lab, Chennai'
  }
];

// Mock Codex MRL Data
export const mockCodexMRL: CodexMRL[] = [
  {
    antimicrobialName: 'Amoxicillin',
    animalType: 'Cattle',
    tissueType: 'Milk',
    mrlLimit: 0.1,
    unit: 'mg/kg'
  },
  {
    antimicrobialName: 'Oxytetracycline',
    animalType: 'Cattle',
    tissueType: 'Milk',
    mrlLimit: 0.1,
    unit: 'mg/kg'
  },
  {
    antimicrobialName: 'Penicillin G',
    animalType: 'Buffalo',
    tissueType: 'Milk',
    mrlLimit: 0.05,
    unit: 'mg/kg'
  },
  {
    antimicrobialName: 'Streptomycin',
    animalType: 'Cattle',
    tissueType: 'Meat',
    mrlLimit: 0.5,
    unit: 'mg/kg'
  },
  {
    antimicrobialName: 'Chloramphenicol',
    animalType: 'All',
    tissueType: 'All',
    mrlLimit: 0.0,
    unit: 'mg/kg'
  }
];

// Analytics Mock Data
export const mockAnalytics = {
  usageTrends: [
    { month: 'Jan', amoxicillin: 45, oxytetracycline: 32, penicillin: 28 },
    { month: 'Feb', amoxicillin: 52, oxytetracycline: 28, penicillin: 35 },
    { month: 'Mar', amoxicillin: 38, oxytetracycline: 41, penicillin: 22 },
    { month: 'Apr', amoxicillin: 61, oxytetracycline: 35, penicillin: 31 },
    { month: 'May', amoxicillin: 55, oxytetracycline: 29, penicillin: 28 },
    { month: 'Jun', amoxicillin: 48, oxytetracycline: 38, penicillin: 33 }
  ],
  complianceRates: [
    { region: 'Andhra Pradesh', passed: 85, failed: 15 },
    { region: 'Tamil Nadu', passed: 78, failed: 22 },
    { region: 'Karnataka', passed: 92, failed: 8 },
    { region: 'Kerala', passed: 88, failed: 12 },
    { region: 'Telangana', passed: 81, failed: 19 }
  ],
  labTurnaroundTimes: [
    { lab: 'Central Lab, Hyderabad', avgDays: 3.2 },
    { lab: 'Regional Lab, Guntur', avgDays: 4.1 },
    { lab: 'State Lab, Chennai', avgDays: 2.8 },
    { lab: 'District Lab, Bangalore', avgDays: 3.7 },
    { lab: 'Private Lab, Kochi', avgDays: 2.5 }
  ]
};

// Utility functions
export const getUserByAadhaar = (aadhaarNumber: string): User | undefined => {
  return mockUsers.find(user => user.aadhaarNumber === aadhaarNumber);
};

export const getTreatmentsByFarmer = (farmerId: string): Treatment[] => {
  return mockTreatments.filter(treatment => treatment.farmerId === farmerId);
};

export const getLabResultsByFarmer = (farmerId: string): LabResult[] => {
  return mockLabResults.filter(result => result.farmerId === farmerId);
};

export const getMRLLimit = (antimicrobialName: string, animalType: string = 'Cattle'): number => {
  const mrl = mockCodexMRL.find(
    item => item.antimicrobialName === antimicrobialName && 
    (item.animalType === animalType || item.animalType === 'All')
  );
  return mrl?.mrlLimit || 0.1; // Default limit
};

// Local storage helpers
export const saveToLocalStorage = (key: string, data: unknown) => {
  localStorage.setItem(`viat-${key}`, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string): unknown => {
  const data = localStorage.getItem(`viat-${key}`);
  return data ? JSON.parse(data) : null;
};

export const getCurrentUser = (): User | null => {
  return getFromLocalStorage('currentUser') as User | null;
};

export const setCurrentUser = (user: User) => {
  saveToLocalStorage('currentUser', user);
};

export const logout = () => {
  localStorage.removeItem('viat-currentUser');
};