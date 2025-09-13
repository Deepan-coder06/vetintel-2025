import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, AlertTriangle } from 'lucide-react';
import { i18n } from '@/lib/i18n';
import { getMRLLimit, saveToLocalStorage, getFromLocalStorage } from '@/lib/mockData';

interface TreatmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treatmentData: {
    animalId: string;
    antimicrobialName: string;
    dosage: string;
    treatmentDate: string;
    withdrawalPeriod: number;
    veterinarian: string;
  }) => void;
}

const antimicrobials = [
  { name: 'Amoxicillin', withdrawalDays: 7 },
  { name: 'Oxytetracycline', withdrawalDays: 14 },
  { name: 'Penicillin G', withdrawalDays: 10 },
  { name: 'Streptomycin', withdrawalDays: 21 },
  { name: 'Chloramphenicol', withdrawalDays: 0 }, // Banned
  { name: 'Enrofloxacin', withdrawalDays: 12 },
  { name: 'Tylosin', withdrawalDays: 5 },
  { name: 'Cephalexin', withdrawalDays: 8 }
];

export default function TreatmentForm({ isOpen, onClose, onSubmit }: TreatmentFormProps) {
  const [formData, setFormData] = useState({
    animalId: '',
    antimicrobialName: '',
    dosage: '',
    treatmentDate: new Date().toISOString().split('T')[0],
    veterinarian: ''
  });
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');

    // Auto-calculate withdrawal period when antimicrobial is selected
    if (field === 'antimicrobialName') {
      const antimicrobial = antimicrobials.find(a => a.name === value);
      if (antimicrobial) {
        setWithdrawalPeriod(antimicrobial.withdrawalDays);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.animalId.trim()) {
      setError(i18n.t('animalId') + ' is required');
      setIsLoading(false);
      return;
    }

    if (!formData.antimicrobialName) {
      setError('Antimicrobial selection is required');
      setIsLoading(false);
      return;
    }

    if (!formData.dosage.trim()) {
      setError('Dosage is required');
      setIsLoading(false);
      return;
    }

    if (!formData.treatmentDate) {
      setError('Treatment date is required');
      setIsLoading(false);
      return;
    }

    if (!formData.veterinarian.trim()) {
      setError('Veterinarian name is required');
      setIsLoading(false);
      return;
    }

    // Check for banned substances
    if (formData.antimicrobialName === 'Chloramphenicol') {
      setError('Chloramphenicol is banned for use in food-producing animals');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage for offline capability
      const treatments = (getFromLocalStorage('treatments') as any[] || []);
      const newTreatment = {
        ...formData,
        withdrawalPeriod,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      treatments.push(newTreatment);
      saveToLocalStorage('treatments', treatments);

      // Submit to parent component
      onSubmit({
        ...formData,
        withdrawalPeriod
      });

      // Reset form
      setFormData({
        animalId: '',
        antimicrobialName: '',
        dosage: '',
        treatmentDate: new Date().toISOString().split('T')[0],
        veterinarian: ''
      });
      setWithdrawalPeriod(0);
      
    } catch (err) {
      setError('Failed to save treatment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWithdrawalEnd = () => {
    if (formData.treatmentDate && withdrawalPeriod > 0) {
      const treatmentDate = new Date(formData.treatmentDate);
      const endDate = new Date(treatmentDate);
      endDate.setDate(endDate.getDate() + withdrawalPeriod);
      return endDate.toLocaleDateString();
    }
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>{i18n.t('addTreatment')}</span>
          </DialogTitle>
          <DialogDescription>
            Record antimicrobial treatment with automatic withdrawal period calculation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="animalId" className="text-sm font-medium text-gray-700">
                {i18n.t('animalId')} *
              </Label>
              <Input
                id="animalId"
                type="text"
                placeholder="e.g., COW001, BUF002"
                value={formData.animalId}
                onChange={(e) => handleInputChange('animalId', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="antimicrobial" className="text-sm font-medium text-gray-700">
                {i18n.t('antimicrobialName')} *
              </Label>
              <Select 
                value={formData.antimicrobialName} 
                onValueChange={(value) => handleInputChange('antimicrobialName', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select antimicrobial" />
                </SelectTrigger>
                <SelectContent>
                  {antimicrobials.map((antimicrobial) => (
                    <SelectItem 
                      key={antimicrobial.name} 
                      value={antimicrobial.name}
                      className={antimicrobial.name === 'Chloramphenicol' ? 'text-red-600' : ''}
                    >
                      {antimicrobial.name}
                      {antimicrobial.name === 'Chloramphenicol' && ' (BANNED)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dosage" className="text-sm font-medium text-gray-700">
                {i18n.t('dosage')} *
              </Label>
              <Input
                id="dosage"
                type="text"
                placeholder="e.g., 500mg, 10ml"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentDate" className="text-sm font-medium text-gray-700">
                {i18n.t('treatmentDate')} *
              </Label>
              <Input
                id="treatmentDate"
                type="date"
                value={formData.treatmentDate}
                onChange={(e) => handleInputChange('treatmentDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian" className="text-sm font-medium text-gray-700">
              {i18n.t('veterinarian')} *
            </Label>
            <Input
              id="veterinarian"
              type="text"
              placeholder="Name of treating veterinarian"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
            />
          </div>

          {/* Withdrawal Period Display */}
          {withdrawalPeriod > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Withdrawal Information</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">
                    <strong>Withdrawal Period:</strong> {withdrawalPeriod} days
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">
                    <strong>Safe to sell after:</strong> {calculateWithdrawalEnd()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Do not sell milk/meat from this animal until the withdrawal period ends
              </p>
            </div>
          )}

          {/* Banned Substance Warning */}
          {formData.antimicrobialName === 'Chloramphenicol' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>WARNING:</strong> Chloramphenicol is banned for use in food-producing animals. 
                Products from treated animals cannot be sold for human consumption.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : i18n.t('save') + ' Treatment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {i18n.t('cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}