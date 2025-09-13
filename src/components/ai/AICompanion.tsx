import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';
import { aiAPI, alertAPI } from '@/lib/api';
import { translate, Language } from '@/lib/i18n';
import { User, PriceForecast, Anomaly } from '@/lib/types';

interface AICompanionProps {
  user: User;
  language: Language;
}

export const AICompanion: React.FC<AICompanionProps> = ({ user, language }) => {
  const [priceForecasts, setPriceForecasts] = useState<PriceForecast[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const t = (key: string) => translate(key, language);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Get price forecasts for common commodities
      const commodities = ['Milk', 'Meat', 'Eggs'];
      const forecasts = await Promise.all(
        commodities.map(commodity => 
          aiAPI.getPriceForecast(commodity, user.address?.district || 'Local Market')
        )
      );
      setPriceForecasts(forecasts);

      // Check for anomalies
      const userAnomalies = await aiAPI.checkAnomalies(user.id);
      setAnomalies(userAnomalies);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('Hold')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (recommendation.includes('Sell')) return 'bg-red-100 text-red-800 border-red-200';
    if (recommendation.includes('Monitor')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <TrendingUp className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span>{t('ai.companion')}</span>
          </h2>
          <p className="text-gray-600">AI-powered insights and recommendations for your farm</p>
        </div>
        <Button onClick={loadAIInsights} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}

      {/* AI Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>{t('ai.dontSellToday')}</strong>
            <br />
            <span className="text-sm">Market analysis suggests waiting for better prices</span>
          </AlertDescription>
        </Alert>

        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{t('ai.labTestFailed')}</strong>
            <br />
            <span className="text-sm">Check recent lab results for compliance issues</span>
          </AlertDescription>
        </Alert>

        <Alert className="border-yellow-200 bg-yellow-50">
          <Shield className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{t('ai.dosageTooHigh')}</strong>
            <br />
            <span className="text-sm">Recent treatment may require extended withdrawal</span>
          </AlertDescription>
        </Alert>
      </div>

      {/* Price Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>{t('ai.priceForcast')}</span>
          </CardTitle>
          <CardDescription>
            AI-powered market price predictions for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priceForecasts.map((forecast, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{forecast.commodity}</h4>
                      <p className="text-sm text-gray-600">{forecast.region}</p>
                    </div>
                    {getChangeIcon(forecast.changePercent)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current:</span>
                      <span className="font-medium">₹{forecast.currentPrice}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Forecast:</span>
                      <span className="font-medium">₹{forecast.forecastPrice}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Change:</span>
                      <span className={`font-medium ${forecast.changePercent > 0 ? 'text-green-600' : forecast.changePercent < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {forecast.changePercent > 0 ? '+' : ''}{forecast.changePercent}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Badge className={getRecommendationColor(forecast.recommendation)}>
                      {forecast.recommendation}
                    </Badge>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${forecast.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(forecast.confidence * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span>{t('ai.withdrawalSuggestion')}</span>
          </CardTitle>
          <CardDescription>
            Smart withdrawal period recommendations based on treatment data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Recent Recommendations</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Bot className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Oxytetracycline Treatment
                    </p>
                    <p className="text-xs text-purple-700">
                      Recommended 16 days withdrawal (vs standard 14 days)
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Based on dose and route analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Bot className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Penicillin Treatment
                    </p>
                    <p className="text-xs text-green-700">
                      Safe to market in 2 days (7-day withdrawal complete)
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Compliance verified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Compliance Insights</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Compliance Rate</p>
                    <p className="text-xs text-gray-600">Last 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">94%</p>
                    <Badge variant="default" className="bg-green-600">Excellent</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Avg. Withdrawal</p>
                    <p className="text-xs text-gray-600">AI vs Manual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">12.5 days</p>
                    <p className="text-xs text-gray-600">vs 10.2 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Usage Anomalies Detected</span>
            </CardTitle>
            <CardDescription>
              AI has identified potential issues with antimicrobial usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{anomaly.message}</strong>
                    <br />
                    <span className="text-sm">
                      Consider consulting with a veterinarian to review treatment protocols
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <span>AI Learning Insights</span>
          </CardTitle>
          <CardDescription>
            How AI is improving recommendations for your farm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-indigo-900">45</p>
              <p className="text-sm text-indigo-700">Days of data analyzed</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-900">87%</p>
              <p className="text-sm text-green-700">Prediction accuracy</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-900">₹2,340</p>
              <p className="text-sm text-purple-700">Estimated savings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};