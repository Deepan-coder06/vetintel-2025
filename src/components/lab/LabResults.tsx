import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Upload, 
  FlaskConical, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileSpreadsheet,
  Loader2,
  Shield
} from 'lucide-react';
import { labAPI, LabResult } from '@/lib/api';
import { translate, Language } from '@/lib/i18n';
import { User } from '@/lib/types';

interface LabResultsProps {
  user: User;
  language: Language;
  onAlertsUpdate: () => void;
}

export const LabResults: React.FC<LabResultsProps> = ({ user, language, onAlertsUpdate }) => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const t = (key: string) => translate(key, language);

  // Mock MRL values for demonstration
  const mrlDatabase = {
    'Oxytetracycline': { milk: 100, meat: 200 },
    'Penicillin': { milk: 4, meat: 50 },
    'Streptomycin': { milk: 200, meat: 500 },
    'Enrofloxacin': { milk: 100, meat: 100 },
    'Tylosin': { milk: 50, meat: 100 },
    'Gentamicin': { milk: 100, meat: 100 }
  };

  useEffect(() => {
    loadLabResults();
  }, []);

  const loadLabResults = async () => {
    try {
      const results = await labAPI.getResults(user.id);
      setLabResults(results);
    } catch (error) {
      console.error('Failed to load lab results:', error);
    }
  };

  const simulateLabUpload = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate CSV/XLSX upload with sample data
      const sampleResults = [
        {
          farmerId: user.id,
          analyte: 'Oxytetracycline',
          measuredValue: 85,
          mrlValue: 100,
          passFail: 'pass' as const,
          uploadedBy: 'Lab Technician'
        },
        {
          farmerId: user.id,
          analyte: 'Penicillin',
          measuredValue: 12,
          mrlValue: 4,
          passFail: 'fail' as const,
          uploadedBy: 'Lab Technician'
        },
        {
          farmerId: user.id,
          analyte: 'Streptomycin',
          measuredValue: 150,
          mrlValue: 200,
          passFail: 'pass' as const,
          uploadedBy: 'Lab Technician'
        }
      ];

      await labAPI.uploadResults(sampleResults);
      setSuccess('Lab results uploaded successfully');
      setShowUpload(false);
      await loadLabResults();
      onAlertsUpdate();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload results');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'pass') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pass') {
      return <Badge className="bg-green-600">{t('lab.passed')}</Badge>;
    } else {
      return <Badge variant="destructive">{t('lab.failed')}</Badge>;
    }
  };

  const getRiskLevel = (measured: number, mrl: number) => {
    const ratio = measured / mrl;
    if (ratio <= 0.5) return { level: 'Low', color: 'text-green-600' };
    if (ratio <= 0.8) return { level: 'Medium', color: 'text-yellow-600' };
    if (ratio <= 1.0) return { level: 'High', color: 'text-orange-600' };
    return { level: 'Critical', color: 'text-red-600' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FlaskConical className="h-8 w-8 text-blue-600" />
            <span>{t('lab.results')}</span>
          </h2>
          <p className="text-gray-600">Monitor MRL compliance and lab test results</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          {t('lab.upload')}
        </Button>
      </div>

      {/* Success/Error Messages */}
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

      {/* Upload Simulation */}
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5" />
              <span>Simulate Lab Upload</span>
            </CardTitle>
            <CardDescription>
              This simulates uploading CSV/XLSX lab results with automatic MRL compliance checking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  In a real implementation, you would upload CSV/XLSX files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  For demo purposes, click below to simulate uploading sample lab results
                </p>
                <Button onClick={simulateLabUpload} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simulate Upload Sample Results
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Sample data will include:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Oxytetracycline: 85 µg/kg (Pass - under 100 µg/kg MRL)</li>
                  <li>Penicillin: 12 µg/kg (Fail - over 4 µg/kg MRL)</li>
                  <li>Streptomycin: 150 µg/kg (Pass - under 200 µg/kg MRL)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Tests</p>
                <p className="text-2xl font-bold">{labResults.length}</p>
              </div>
              <FlaskConical className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Passed</p>
                <p className="text-2xl font-bold">
                  {labResults.filter(r => r.passFail === 'pass').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Failed</p>
                <p className="text-2xl font-bold">
                  {labResults.filter(r => r.passFail === 'fail').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Compliance</p>
                <p className="text-2xl font-bold">
                  {labResults.length > 0 
                    ? Math.round((labResults.filter(r => r.passFail === 'pass').length / labResults.length) * 100)
                    : 0}%
                </p>
              </div>
              <Shield className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lab Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Lab Results</CardTitle>
          <CardDescription>
            Detailed view of all lab test results and MRL compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {labResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No lab results available</p>
              <p className="text-sm">Upload lab results to see compliance status</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('lab.analyte')}</TableHead>
                    <TableHead>{t('lab.measured')}</TableHead>
                    <TableHead>{t('lab.mrl')}</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>{t('lab.status')}</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labResults.map((result) => {
                    const risk = getRiskLevel(result.measuredValue, result.mrlValue);
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.analyte}</TableCell>
                        <TableCell>{result.measuredValue} µg/kg</TableCell>
                        <TableCell>{result.mrlValue} µg/kg</TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${risk.color}`}>
                            {risk.level}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(result.passFail)}
                            {getStatusBadge(result.passFail)}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(result.uploadedAt)}</TableCell>
                        <TableCell>{result.uploadedBy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Failed Results Alert */}
      {labResults.some(r => r.passFail === 'fail') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Compliance Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {labResults
                .filter(r => r.passFail === 'fail')
                .map((result) => (
                  <Alert key={result.id} variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{result.analyte}</strong> exceeded MRL limit
                      <br />
                      <span className="text-sm">
                        Measured: {result.measuredValue} µg/kg | 
                        MRL: {result.mrlValue} µg/kg | 
                        Ratio: {(result.measuredValue / result.mrlValue).toFixed(1)}×
                      </span>
                      <br />
                      <span className="text-sm font-medium">
                        Action Required: Hold product, extend withdrawal period
                      </span>
                    </AlertDescription>
                  </Alert>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MRL Reference */}
      <Card>
        <CardHeader>
          <CardTitle>MRL Reference Guide</CardTitle>
          <CardDescription>
            Maximum Residue Limits for common antimicrobials in livestock products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Antimicrobial</TableHead>
                  <TableHead>Milk (µg/kg)</TableHead>
                  <TableHead>Meat (µg/kg)</TableHead>
                  <TableHead>Regulatory Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(mrlDatabase).map(([drug, limits]) => (
                  <TableRow key={drug}>
                    <TableCell className="font-medium">{drug}</TableCell>
                    <TableCell>{limits.milk}</TableCell>
                    <TableCell>{limits.meat}</TableCell>
                    <TableCell className="text-sm text-gray-600">Codex/FSSAI</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};