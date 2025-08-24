'use client';

import React, { useState } from 'react';
import { useChimeraContract } from '../hooks/useChimeraContract';
import { useAccount } from 'wagmi';

export default function AdminPanel() {
  const { address } = useAccount();
  const { 
    isOwner, 
    isBorn, 
    birthChimera, 
    updateBaseURI,
    isBirthing,
    birthSuccess,
    isSettingURI,
    setURISuccess
  } = useChimeraContract();
  
  const [baseURI, setBaseURI] = useState('');

  const handleBirth = async () => {
    if (!isOwner) return;
    
    if (window.confirm('Are you sure you want to finalize the Chimera? This action cannot be undone.')) {
      try {
        await birthChimera();
      } catch (error) {
        console.error('Birth failed:', error);
      }
    }
  };

  const handleSetBaseURI = async () => {
    if (!isOwner || !baseURI) return;
    
    try {
      await updateBaseURI(baseURI);
    } catch (error) {
      console.error('Setting base URI failed:', error);
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border border-purple-200">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-900">Admin Panel</h2>
        <span className="ml-3 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">Owner Only</span>
      </div>
      
      <div className="space-y-6">
        {/* Birth Section */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="text-lg font-semibold mb-3">Finalize Chimera</h3>
          
          {!isBorn ? (
            <>
              <p className="text-gray-600 mb-4">
                Once you call birth, the Chimera's DNA will be locked forever and contributors can mint their NFTs.
              </p>
              <button
                onClick={handleBirth}
                disabled={isBirthing}
                className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                  isBirthing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {isBirthing ? 'Birthing...' : '🧬 Birth Chimera'}
              </button>
              
              {birthSuccess && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 font-medium">
                    Chimera has been born! Contributors can now mint their NFTs.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700">
                ✅ The Chimera has already been born. DNA is permanently locked.
              </p>
            </div>
          )}
        </div>

        {/* Base URI Section */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="text-lg font-semibold mb-3">Set Metadata Base URI</h3>
          <p className="text-gray-600 mb-4">
            After generating and uploading metadata to IPFS, set the base URI here. Format: ipfs://[CID]/
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={baseURI}
              onChange={(e) => setBaseURI(e.target.value)}
              placeholder="ipfs://QmXXX.../"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSetBaseURI}
              disabled={isSettingURI || !baseURI}
              className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                isSettingURI || !baseURI
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isSettingURI ? 'Setting...' : 'Set URI'}
            </button>
          </div>
          
          {setURISuccess && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 font-medium">
                Base URI has been updated successfully!
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">📝 Admin Instructions:</h3>
          <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Allow contributors to add genes</li>
            <li>Call "Birth Chimera" to finalize the DNA</li>
            <li>Run the metadata generation script locally</li>
            <li>Upload generated files to IPFS (using Pinata)</li>
            <li>Set the Base URI with the IPFS hash</li>
            <li>Contributors can now mint their NFTs!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}