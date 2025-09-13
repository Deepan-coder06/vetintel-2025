import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { i18n } from '@/lib/i18n';
import { mockCodexMRL, getMRLLimit } from '@/lib/mockData';

interface LabResult {
  id: string;
  batchId: string;
  farmerId: string;
  animalId: string;
  testDate: string;
  antimicrobialName: string;
  residueLevel: number;
  mrlLimit: number;
  status: 'passed' | 'failed';
  labName: string;
}

export default function LabUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<LabResult[]>([]);
  const [error, setError] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError('');
      setResults([]);
      setUploadComplete(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setError('');
      setResults([]);
      setUploadComplete(false);
    }
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setError('');

    try {
      // Simulate file processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Mock processing results - in real app, this would parse CSV/XLSX
      const mockResults: LabResult[] = [
        {
          id: '1',
          batchId: 'BATCH001',
          farmerId: '1',
          animalId: 'COW001',
          testDate: '2024-01-25',
          antimicrobialName: 'Amoxicillin',
          residueLevel: 0.05,
          mrlLimit: getMRLLimit('Amoxicillin'),
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
          mrlLimit: getMRLLimit('Oxytetracycline'),
          status: 'failed',
          labName: 'Central Lab, Hyderabad'
        },
        {
          id: '3',
          batchId: 'BATCH003',
          farmerId: '2',
          animalId: 'BUF001',
          testDate: '2024-01-30',
          antimicrobialName: 'Penicillin G',
          residueLevel: 0.03,
          mrlLimit: getMRLLimit('Penicillin G'),
          status: 'passed',
          labName: 'Central Lab, Hyderabad'
        },
        {
          id: '4',
          batchId: 'BATCH004',
          farmerId: '3',
          animalId: 'COW003',
          testDate: '2024-02-01',
          antimicrobialName: 'Streptomycin',
          residueLevel: 0.8,
          mrlLimit: getMRLLimit('Streptomycin'),
          status: 'failed',
          labName: 'Central Lab, Hyderabad'
        }
      ];

      // Auto-determine pass/fail based on MRL limits
      const processedResults = mockResults.map(result => ({
        ...result,
        status: result.residueLevel <= result.mrlLimit ? 'passed' : 'failed'
      })) as LabResult[];

      setResults(processedResults);
      setUploadComplete(true);

    } catch (err) {
      setError('Failed to process file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResults([]);
    setUploadComplete(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `Batch ID,Farmer ID,Animal ID,Test Date,Antimicrobial Name,Residue Level (mg/kg),Lab Name
BATCH001,1,COW001,2024-01-25,Amoxicillin,0.05,Central Lab Hyderabad
BATCH002,1,COW002,2024-01-28,Oxytetracycline,0.15,Central Lab Hyderabad`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lab_results_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lab Result Upload</h1>
              <p className="text-sm text-gray-600">Upload and process lab test results</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Instructions */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Upload Instructions</span>
              </CardTitle>
              <CardDescription>
                Upload CSV or XLSX files containing lab test results for automatic MRL compliance checking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Batch ID</li>
                    <li>• Farmer ID</li>
                    <li>• Animal ID</li>
                    <li>• Test Date</li>
                    <li>• Antimicrobial Name</li>
                    <li>• Residue Level (mg/kg)</li>
                    <li>• Lab Name</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Supported Formats:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CSV (.csv)</li>
                    <li>• Excel (.xlsx, .xls)</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Maximum 1000 records per file</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports CSV and Excel files up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing file...</span>
                        <span>{processingProgress}%</span>
                      </div>
                      <Progress value={processingProgress} className="w-full" />
                    </div>
                  )}

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  {!uploadComplete && !isProcessing && (
                    <Button
                      onClick={processFile}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Process File
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {uploadComplete && results.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Processing Results</span>
                  <div className="flex space-x-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {passedCount} Passed
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      {failedCount} Failed
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Automatic MRL compliance checking completed for {results.length} samples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className={`p-4 rounded-lg border ${
                        result.status === 'passed' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {result.batchId} - {result.animalId}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {result.antimicrobialName} | {result.labName}
                          </p>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Test Date</p>
                          <p className="font-medium">{new Date(result.testDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Residue Level</p>
                          <p className="font-medium">{result.residueLevel} mg/kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">MRL Limit</p>
                          <p className="font-medium">{result.mrlLimit} mg/kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Compliance</p>
                          <p className={`font-medium ${
                            result.status === 'passed' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.status === 'passed' ? 'Within Limits' : 'Exceeds MRL'}
                          </p>
                        </div>
                      </div>

                      {result.status === 'failed' && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                          <p className="text-sm text-red-800">
                            <strong>MRL Violation:</strong> Residue level ({result.residueLevel} mg/kg) 
                            exceeds maximum allowed limit ({result.mrlLimit} mg/kg). 
                            This batch should not be released for human consumption.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Processing completed at {new Date().toLocaleString()}
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => window.print()}>
                        Print Report
                      </Button>
                      <Button 
                        onClick={() => {
                          // In real app, this would generate and download a detailed report
                          const csvContent = results.map(r => 
                            `${r.batchId},${r.animalId},${r.antimicrobialName},${r.residueLevel},${r.mrlLimit},${r.status}`
                          ).join('\n');
                          const blob = new Blob([`Batch ID,Animal ID,Antimicrobial,Residue Level,MRL Limit,Status\n${csvContent}`], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'mrl_compliance_report.csv';
                          a.click();
                          window.URL.revokeObjectURL(url);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* MRL Reference */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>MRL Reference Table</CardTitle>
              <CardDescription>
                Current Maximum Residue Limits (MRL) for common antimicrobials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Antimicrobial</th>
                      <th className="text-left p-2">Animal Type</th>
                      <th className="text-left p-2">Tissue</th>
                      <th className="text-left p-2">MRL Limit</th>
                      <th className="text-left p-2">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCodexMRL.map((mrl, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{mrl.antimicrobialName}</td>
                        <td className="p-2">{mrl.animalType}</td>
                        <td className="p-2">{mrl.tissueType}</td>
                        <td className="p-2">
                          {mrl.mrlLimit === 0 ? (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">BANNED</Badge>
                          ) : (
                            mrl.mrlLimit
                          )}
                        </td>
                        <td className="p-2">{mrl.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}