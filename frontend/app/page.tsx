'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import ChimeraViewer from '../components/ChimeraViewer';
import ContributionPanel from '../components/ContributionPanel';
import AdminPanel from '../components/AdminPanel';
import MintPanel from '../components/MintPanel';
import ChimeraStats from '../components/ChimeraStats';
import DNAVisualizer from '../components/DNAVisualizer';
import { useChimeraContract } from '../hooks/useChimeraContract';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isConnected } = useAccount();
  const { useGetGene, isBorn } = useChimeraContract();
  const [dna, setDna] = useState<{ [key: number]: number }>({});

  // Get all genes
  const gene0 = useGetGene(0);
  const gene1 = useGetGene(1);
  const gene2 = useGetGene(2);
  const gene3 = useGetGene(3);
  const gene4 = useGetGene(4);
  const gene5 = useGetGene(5);

  useEffect(() => {
    const newDna: { [key: number]: number } = {};
    if (gene0.data !== undefined) newDna[0] = Number(gene0.data);
    if (gene1.data !== undefined) newDna[1] = Number(gene1.data);
    if (gene2.data !== undefined) newDna[2] = Number(gene2.data);
    if (gene3.data !== undefined) newDna[3] = Number(gene3.data);
    if (gene4.data !== undefined) newDna[4] = Number(gene4.data);
    if (gene5.data !== undefined) newDna[5] = Number(gene5.data);
    setDna(newDna);
  }, [gene0.data, gene1.data, gene2.data, gene3.data, gene4.data, gene5.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🧬</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cyber Chimera
                </h1>
              </div>
              <nav className="hidden md:flex space-x-4">
                <a href="/" className="text-purple-600 font-medium">
                  Home
                </a>
                <a href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Analytics
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/analytics"
                className="md:hidden px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                📊 Analytics
              </a>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Create a Unique Digital Lifeform Together
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Contribute genes to shape the Chimera's DNA. Once born, all contributors can mint a commemorative NFT.
        </p>
        {isBorn && (
          <div className="mt-4 inline-block bg-green-100 border border-green-300 rounded-lg px-4 py-2">
            <span className="text-green-800 font-semibold">🎉 The Chimera has been born!</span>
          </div>
        )}
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* DNA Visualizer */}
        <div className="mb-8">
          <DNAVisualizer dna={dna} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Chimera Viewer */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">
                <span className="text-3xl mr-2">🎮</span>
                Pixel Chimera
              </h2>
              <ChimeraViewer dna={dna} />
            </div>
            
            {/* Mint Panel (shown after birth) */}
            {isBorn && <MintPanel />}
          </div>

          {/* Right Column - Interaction Panels */}
          <div className="space-y-8">
            {/* Contribution Panel with current DNA passed for preview */}
            <ContributionPanel currentDna={dna} />
            
            {/* Admin Panel */}
            <AdminPanel />
          </div>
        </div>

        {/* Statistics and History */}
        <div className="mt-12">
          <ChimeraStats />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🧬</span>
              <h3 className="text-lg font-semibold">Contribute Genes</h3>
            </div>
            <p className="text-gray-600">
              Select and contribute genes to shape the Chimera's appearance. Each contribution updates the DNA.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🎨</span>
              <h3 className="text-lg font-semibold">Collaborative Creation</h3>
            </div>
            <p className="text-gray-600">
              Watch as the community collectively shapes the Chimera through their gene contributions.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🖼️</span>
              <h3 className="text-lg font-semibold">Mint NFT</h3>
            </div>
            <p className="text-gray-600">
              After birth, all contributors can mint a unique NFT commemorating their participation.
            </p>
          </div>
        </div>

        {/* Contract Info */}
        {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Contract Address: 
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
              </code>
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Cyber Chimera - A collaborative NFT experiment
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Built with Next.js, RainbowKit, and deployed on Ethereum
          </p>
        </div>
      </footer>
    </div>
  );
}