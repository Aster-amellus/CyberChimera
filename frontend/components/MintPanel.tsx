'use client';

import React from 'react';
import { useChimeraContract } from '../hooks/useChimeraContract';
import { useAccount } from 'wagmi';

export default function MintPanel() {
  const { isConnected } = useAccount();
  const { 
    isBorn, 
    isContributor, 
    hasMinted, 
    mintNFT, 
    isMinting, 
    mintSuccess 
  } = useChimeraContract();

  const handleMint = async () => {
    if (!isConnected || !isContributor || hasMinted || !isBorn) return;
    
    try {
      await mintNFT();
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  if (!isBorn) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">Connect your wallet to check mint eligibility</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border border-green-200">
      <h2 className="text-2xl font-bold mb-4 text-green-900">Mint Your Chimera NFT</h2>
      
      {!isContributor ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            You are not eligible to mint. Only contributors who added genes can mint NFTs.
          </p>
        </div>
      ) : hasMinted ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            🎉 You have already minted your Chimera NFT!
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Check your wallet or OpenSea to view your NFT.
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg p-4 mb-4 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">You are eligible to mint!</h3>
            <p className="text-gray-600">
              As a contributor to the Chimera's DNA, you can mint one commemorative NFT.
            </p>
          </div>
          
          <button
            onClick={handleMint}
            disabled={isMinting}
            className={`w-full py-4 px-6 rounded-md font-bold text-lg transition-all transform hover:scale-105 ${
              isMinting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg'
            }`}
          >
            {isMinting ? 'Minting...' : '🎨 Mint NFT'}
          </button>
          
          {mintSuccess && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-bold">
                🎉 Minting successful!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your Chimera NFT has been minted. It should appear in your wallet shortly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}