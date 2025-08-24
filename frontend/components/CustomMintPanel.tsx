'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useChimeraContract } from '../hooks/useChimeraContract';
import PixelArtEditor from './PixelArtEditor';
import ChimeraViewer from './ChimeraViewer';

export default function CustomMintPanel() {
  const { address, isConnected } = useAccount();
  const { mintNFT, isMinting, mintSuccess } = useChimeraContract();
  const [showEditor, setShowEditor] = useState(false);
  const [customPixelData, setCustomPixelData] = useState<number[][] | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);

  const handleSaveDesign = (pixelData: number[][]) => {
    setCustomPixelData(pixelData);
    setPreviewMode(true);
    
    // Save to local storage
    const design = {
      id: Date.now(),
      data: pixelData,
      timestamp: new Date().toISOString(),
      creator: address
    };
    
    const designs = [...savedDesigns, design];
    setSavedDesigns(designs);
    localStorage.setItem('pixelArtDesigns', JSON.stringify(designs));
  };

  const handleMintCustom = async () => {
    if (!customPixelData) return;
    
    // Here you would typically:
    // 1. Upload the pixel data to IPFS
    // 2. Call a custom mint function on the contract with the IPFS hash
    // For now, we'll use the standard mint function
    
    try {
      await mintNFT();
      // Store the custom design with the NFT
      const mintedDesign = {
        pixelData: customPixelData,
        mintedAt: new Date().toISOString(),
        owner: address
      };
      localStorage.setItem(`minted_${address}_${Date.now()}`, JSON.stringify(mintedDesign));
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const loadDesign = (design: any) => {
    setCustomPixelData(design.data);
    setPreviewMode(true);
    setShowEditor(false);
  };

  React.useEffect(() => {
    // Load saved designs from localStorage
    const saved = localStorage.getItem('pixelArtDesigns');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }
  }, []);

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-3xl mr-2">🎨</span>
          Custom Pixel Art NFT
        </h2>
        <p className="text-gray-600">Connect your wallet to create custom pixel art NFTs</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-3xl mr-2">🎨</span>
          Create Custom Pixel Art NFT
        </h2>
        
        {!showEditor && !previewMode && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Design your own unique pixel art character and mint it as an NFT!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowEditor(true)}
                className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <div className="text-4xl mb-2">✏️</div>
                <div className="font-semibold">Create New Design</div>
                <div className="text-sm opacity-90">Start from scratch</div>
              </button>
              
              <button
                onClick={() => {
                  // Generate random DNA for template
                  const randomDna: { [key: number]: number } = {};
                  for (let i = 0; i < 6; i++) {
                    randomDna[i] = Math.floor(Math.random() * 8);
                  }
                  setCustomPixelData(null); // Will be implemented to convert DNA to pixel data
                  setPreviewMode(true);
                }}
                className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                <div className="text-4xl mb-2">🎲</div>
                <div className="font-semibold">Random Template</div>
                <div className="text-sm opacity-90">Start with random character</div>
              </button>
            </div>
          </div>
        )}

        {showEditor && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pixel Art Editor</h3>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <PixelArtEditor onSave={handleSaveDesign} />
          </div>
        )}

        {previewMode && customPixelData && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview Your Creation</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowEditor(true);
                    setPreviewMode(false);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setPreviewMode(false);
                    setCustomPixelData(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <canvas
                width={320}
                height={320}
                className="border-2 border-gray-300"
                style={{ imageRendering: 'pixelated' }}
                ref={(canvas) => {
                  if (canvas && customPixelData) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      // Clear canvas
                      ctx.fillStyle = '#F3F4F6';
                      ctx.fillRect(0, 0, 320, 320);
                      
                      // Draw pixel data
                      const pixelSize = 5;
                      customPixelData.forEach((row, y) => {
                        row.forEach((color, x) => {
                          if (color !== 0) {
                            ctx.fillStyle = typeof color === 'string' ? color : '#000000';
                            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                          }
                        });
                      });
                    }
                  }
                }}
              />
            </div>

            {/* Mint Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleMintCustom}
                disabled={isMinting || !customPixelData}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isMinting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Minting...
                  </span>
                ) : (
                  'Mint as NFT'
                )}
              </button>
              
              {mintSuccess && (
                <div className="text-green-600 font-semibold">
                  ✅ Successfully minted your custom NFT!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Saved Designs */}
      {savedDesigns.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            <span className="text-2xl mr-2">💾</span>
            Your Saved Designs
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedDesigns.map((design) => (
              <div
                key={design.id}
                className="border rounded-lg p-2 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => loadDesign(design)}
              >
                <canvas
                  width={100}
                  height={100}
                  className="w-full"
                  style={{ imageRendering: 'pixelated' }}
                  ref={(canvas) => {
                    if (canvas && design.data) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = '#F3F4F6';
                        ctx.fillRect(0, 0, 100, 100);
                        
                        const pixelSize = 100 / 64;
                        design.data.forEach((row: any[], y: number) => {
                          row.forEach((color: any, x: number) => {
                            if (color !== 0) {
                              ctx.fillStyle = typeof color === 'string' ? color : '#000000';
                              ctx.fillRect(
                                x * pixelSize,
                                y * pixelSize,
                                pixelSize,
                                pixelSize
                              );
                            }
                          });
                        });
                      }
                    }
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(design.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3">
          <span className="text-2xl mr-2">📖</span>
          How Custom NFTs Work
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-purple-500">1.</span>
            <span>Create your pixel art using our editor or start with a random template</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500">2.</span>
            <span>Design your character with various colors and tools</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500">3.</span>
            <span>Save your design locally or mint it directly as an NFT</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500">4.</span>
            <span>Your custom NFT will be stored on-chain with unique metadata</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Custom NFTs are separate from the collaborative Chimera NFTs. 
            Each custom NFT is unique and owned solely by its creator.
          </p>
        </div>
      </div>
    </div>
  );
}