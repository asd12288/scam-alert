"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";
import type { ScoringWeights, RiskFactorPenalties } from "@/lib/services/settingsService";

export default function AdminSettings() {
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({
    safeBrowsing: 30,
    domainAge: 20,
    ssl: 15,
    dns: 15,
    patternAnalysis: 20,
    baselineScore: 70
  });
  const [riskFactors, setRiskFactors] = useState<RiskFactorPenalties>({
    manyRiskFactors: 8,
    severalRiskFactors: 4,
    privacyProtection: 2,
    whoisError: 3
  });
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [totalWeight, setTotalWeight] = useState(100);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Calculate the total weight whenever scoring weights change
  useEffect(() => {
    const total = Object.entries(scoringWeights)
      .filter(([key]) => key !== 'baselineScore')
      .reduce((sum, [_, value]) => sum + value, 0);
    setTotalWeight(total);
  }, [scoringWeights]);

  // Fetch initial settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setDataLoaded(false);
        setFetchError(null);
        console.log('[AdminSettings] Fetching settings from API...');
        
        const response = await fetch('/api/admin/settings', {
          cache: 'no-store' // Prevent caching
        });
        
        if (!response.ok) {
          // If the server returns an error, still continue with defaults
          const errorData = await response.json();
          console.error('Failed to fetch settings:', errorData);
          setFetchError(errorData.error || 'Failed to fetch settings, using defaults');
          setDataLoaded(true);
          return;
        }
        
        const data = await response.json();
        console.log('[AdminSettings] Settings received:', data);
        
        if (data.scoring_weights) {
          setScoringWeights(data.scoring_weights);
        }
        if (data.risk_penalties) {
          setRiskFactors(data.risk_penalties);
        }
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setFetchError('Network error while fetching settings');
        // Ensure we still mark data as loaded even if there's an error
        setDataLoaded(true);
      }
    };

    if (!dataLoaded) {
      // No auth check - just fetch settings directly
      fetchSettings();
    }
  }, [dataLoaded]);

  const handleScoringChange = (key: keyof ScoringWeights, value: number) => {
    setScoringWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleRiskFactorChange = (key: keyof RiskFactorPenalties, value: number) => {
    setRiskFactors(prev => ({ ...prev, [key]: value }));
  };

  // Save settings with better error handling
  const saveSettings = async () => {
    setSavingState('saving');
    try {
      // Save scoring weights
      const scoringResponse = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'scoring_weights',
          data: scoringWeights
        })
      });

      if (!scoringResponse.ok) {
        const errorData = await scoringResponse.json();
        throw new Error(errorData.error || 'Failed to save scoring weights');
      }

      // Save risk factors
      const riskResponse = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'risk_penalties',
          data: riskFactors
        })
      });

      if (!riskResponse.ok) {
        const errorData = await riskResponse.json();
        throw new Error(errorData.error || 'Failed to save risk factors');
      }

      setSavingState('success');
      setTimeout(() => setSavingState('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavingState('error');
      setTimeout(() => setSavingState('idle'), 5000);
    }
  };

  const resetToDefaults = () => {
    setScoringWeights({
      safeBrowsing: 30,
      domainAge: 20,
      ssl: 15,
      dns: 15,
      patternAnalysis: 20,
      baselineScore: 70
    });
    setRiskFactors({
      manyRiskFactors: 8,
      severalRiskFactors: 4,
      privacyProtection: 2,
      whoisError: 3
    });
  };

  const renderSaveStatus = () => {
    switch (savingState) {
      case 'saving':
        return <div className="flex items-center text-yellow-600"><div className="h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div> Saving...</div>;
      case 'success':
        return <div className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-2" /> Settings saved!</div>;
      case 'error':
        return <div className="flex items-center text-red-600"><AlertTriangle className="h-4 w-4 mr-2" /> Error saving settings</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {fetchError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{fetchError}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex items-center space-x-2">
          {renderSaveStatus()}
          <button 
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <RotateCcw size={16} className="mr-2" /> Reset to Defaults
          </button>
          <button 
            onClick={saveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={savingState === 'saving'}
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </div>
      </div>

      {/* Scoring Weight Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Security Score Weights</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            Configure the weight of each factor in the security score calculation. The total weight should add up to 100.
          </p>
          
          {totalWeight !== 100 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm text-yellow-700">
                    Warning: The total weight is {totalWeight}. It should be 100 for balanced scoring.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium mb-1 block">Google Safe Browsing</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={scoringWeights.safeBrowsing} 
                  onChange={(e) => handleScoringChange('safeBrowsing', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 w-12 text-center">{scoringWeights.safeBrowsing}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Google's detection of malicious websites</p>
            </div>

            <div>
              <label className="font-medium mb-1 block">Domain Age</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={scoringWeights.domainAge} 
                  onChange={(e) => handleScoringChange('domainAge', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 w-12 text-center">{scoringWeights.domainAge}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">How long the domain has existed</p>
            </div>

            <div>
              <label className="font-medium mb-1 block">SSL Certificate</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={scoringWeights.ssl} 
                  onChange={(e) => handleScoringChange('ssl', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 w-12 text-center">{scoringWeights.ssl}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Website's SSL certificate quality</p>
            </div>

            <div>
              <label className="font-medium mb-1 block">DNS Configuration</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={scoringWeights.dns} 
                  onChange={(e) => handleScoringChange('dns', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 w-12 text-center">{scoringWeights.dns}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">DNS record configuration quality</p>
            </div>

            <div>
              <label className="font-medium mb-1 block">Pattern Analysis</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={scoringWeights.patternAnalysis} 
                  onChange={(e) => handleScoringChange('patternAnalysis', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 w-12 text-center">{scoringWeights.patternAnalysis}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Domain name pattern suspicious features</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <div>
              <label className="font-medium mb-1 block">Baseline Score</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="50" 
                  max="90" 
                  value={scoringWeights.baselineScore} 
                  onChange={(e) => handleScoringChange('baselineScore', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 w-12 text-center">{scoringWeights.baselineScore}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Starting score before adjustments (50-90)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factor Penalties */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-xl font-semibold">Risk Factor Penalties</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Configure penalty values subtracted from the security score when risk factors are detected.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium mb-1 block">Many Risk Factors (>5)</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={riskFactors.manyRiskFactors} 
                onChange={(e) => handleRiskFactorChange('manyRiskFactors', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 w-12 text-center">-{riskFactors.manyRiskFactors}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Penalty when more than 5 risk factors are detected</p>
          </div>

          <div>
            <label className="font-medium mb-1 block">Several Risk Factors (>2)</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={riskFactors.severalRiskFactors} 
                onChange={(e) => handleRiskFactorChange('severalRiskFactors', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 w-12 text-center">-{riskFactors.severalRiskFactors}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Penalty when 3-5 risk factors are detected</p>
          </div>

          <div>
            <label className="font-medium mb-1 block">Privacy Protection</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={riskFactors.privacyProtection} 
                onChange={(e) => handleRiskFactorChange('privacyProtection', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 w-12 text-center">-{riskFactors.privacyProtection}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Penalty for domains using WHOIS privacy protection</p>
          </div>

          <div>
            <label className="font-medium mb-1 block">WHOIS Data Error</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={riskFactors.whoisError} 
                onChange={(e) => handleRiskFactorChange('whoisError', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 w-12 text-center">-{riskFactors.whoisError}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Penalty when WHOIS data couldn't be retrieved</p>
          </div>
        </div>
      </div>

      {/* Preview Section - Shows a simulated score */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Score Previews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div className="text-center mb-2">
              <div className="inline-block w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold">
                {Math.min(100, Math.max(0, scoringWeights.baselineScore + 20))}
              </div>
            </div>
            <h3 className="text-center font-medium">Legitimate Site</h3>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Older domain with good security
            </p>
          </div>

          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div className="text-center mb-2">
              <div className="inline-block w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center text-2xl font-bold">
                {Math.min(100, Math.max(0, scoringWeights.baselineScore - 15))}
              </div>
            </div>
            <h3 className="text-center font-medium">Suspicious Site</h3>
            <p className="text-xs text-gray-500 mt-1 text-center">
              New domain with some issues
            </p>
          </div>

          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
            <div className="text-center mb-2">
              <div className="inline-block w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl font-bold">
                {Math.min(100, Math.max(0, scoringWeights.baselineScore - 40))}
              </div>
            </div>
            <h3 className="text-center font-medium">Malicious Site</h3>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Flagged by Google Safe Browsing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}