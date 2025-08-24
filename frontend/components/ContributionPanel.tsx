'use client';

import React, { useState } from 'react';
import { GENE_OPTIONS } from '../utils/constants';
import { useChimeraContract } from '../hooks/useChimeraContract';
import { useAccount } from 'wagmi';
import ChimeraViewer from './ChimeraViewer';

interface ContributionPanelProps {
  currentDna: { [key: number]: number };
}

export default function ContributionPanel({ currentDna }: ContributionPanelProps) {
  const { isConnected } = useAccount();
  const { 
    contributeGene, 
    isContributing, 
    contributionSuccess,
    isBorn 
  } = useChimeraContract();
  
  const [selectedGene, setSelectedGene] = useState({
    type: 0,
    value: 0
  });

  const [previewDna, setPreviewDna] = useState<{ [key: number]: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGeneTypeChange = (type: number) => {
    setSelectedGene(prev => ({
      ...prev,
      type,
      value: 0
    }));
    updatePreview(type, 0);
  };

  const handleGeneValueChange = (value: number) => {
    setSelectedGene(prev => ({
      ...prev,
      value
    }));
    updatePreview(selectedGene.type, value);
  };

  const updatePreview = (type: number, value: number) => {
    const newPreviewDna = { ...currentDna, [type]: value };
    setPreviewDna(newPreviewDna);
    setShowPreview(true);
  };

  const handleContribute = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      await contributeGene(selectedGene.type, selectedGene.value);
      setShowPreview(false);
      setPreviewDna(null);
    } catch (error) {
      console.error('Contribution failed:', error);
    }
  };

  const selectedGeneOption = GENE_OPTIONS.find(g => g.type === selectedGene.type);

  if (isBorn) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Chimera Has Been Born!</h2>
        <p className="text-yellow-700">
          The Chimera's DNA has been finalized. Contributors can now mint their commemorative NFT.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Contribution Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🧬 Contribute a Gene</h2>
        
        {!isConnected ? (
          <div className="bg-gray-50 rounded p-4 text-center">
            <p className="text-gray-600">Please connect your wallet to contribute genes</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {/* Gene Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Gene Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {GENE_OPTIONS.map((gene) => (
                    <button
                      key={gene.type}
                      onClick={() => handleGeneTypeChange(gene.type)}
                      className={`px-4 py-3 rounded-md border-2 transition-all transform hover:scale-105 ${
                        selectedGene.type === gene.type
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-purple-500 shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-lg mr-2">
                        {(gene as any).icon || '🧬'}
                      </span>
                      {gene.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gene Value Selector with Visual Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose {selectedGeneOption?.name} Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {selectedGeneOption?.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleGeneValueChange(option.value)}
                      onMouseEnter={() => updatePreview(selectedGene.type, option.value)}
                      onMouseLeave={() => {
                        if (selectedGene.value !== option.value) {
                          updatePreview(selectedGene.type, selectedGene.value);
                        }
                      }}
                      className={`relative px-4 py-3 rounded-md border-2 transition-all transform hover:scale-105 ${
                        selectedGene.value === option.value
                          ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-teal-500 shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {/* Show color preview for body color */}
                      {selectedGene.type === 1 && (
                        <div 
                          className="w-4 h-4 rounded-full inline-block mr-2 border border-gray-300"
                          style={{ backgroundColor: (option as any).color || '#000' }}
                        />
                      )}
                      {option.label}
                      {selectedGene.value === option.value && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Gene Display */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Your Selection:</p>
                <p className="text-xl font-bold text-purple-900">
                  {selectedGeneOption?.name}: {selectedGeneOption?.options.find(o => o.value === selectedGene.value)?.label}
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  This will replace the current {selectedGeneOption?.name.toLowerCase()} in the Chimera's DNA
                </p>
              </div>

              {/* Contribute Button */}
              <button
                onClick={handleContribute}
                disabled={isContributing}
                className={`w-full py-4 px-6 rounded-md font-bold text-lg transition-all transform hover:scale-105 ${
                  isContributing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                }`}
              >
                {isContributing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Contributing...
                  </span>
                ) : (
                  '🧬 Contribute Gene to Chimera'
                )}
              </button>

              {/* Success Message */}
              {contributionSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
                  <p className="text-green-700 font-medium flex items-center">
                    <span className="text-2xl mr-2">🎉</span>
                    Gene contribution successful! You are now a contributor.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Preview Panel */}
      {showPreview && previewDna && isConnected && !isBorn && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-purple-900">🔮 Live Preview</h3>
          <ChimeraViewer 
            dna={currentDna} 
            previewDna={previewDna}
            isPreview={true}
          />
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <span className="text-xl mr-2">ℹ️</span>
          How Gene Contribution Works
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Each contribution replaces the previous value for that gene type</li>
          <li>• Hover over options to preview how they'll look</li>
          <li>• All contributors can mint an NFT after the Chimera is born</li>
          <li>• The final DNA is locked when the owner calls birth</li>
        </ul>
      </div>
    </div>
  );
}