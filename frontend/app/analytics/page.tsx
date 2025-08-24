'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import ChimeraStats from '../../components/ChimeraStats';
import ContributorLeaderboard from '../../components/ContributorLeaderboard';
import DNAEvolution from '../../components/DNAEvolution';
import { useChimeraContract } from '../../hooks/useChimeraContract';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const { useGetGene } = useChimeraContract();
  const [currentDna, setCurrentDna] = useState<{ [key: number]: number }>({});
  
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
    setCurrentDna(newDna);
  }, [gene0.data, gene1.data, gene2.data, gene3.data, gene4.data, gene5.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <span className="text-3xl">🧬</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chimera Analytics
                </h1>
              </Link>
              <nav className="flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <Link href="/analytics" className="text-purple-600 font-medium">
                  Analytics
                </Link>
              </nav>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-8 px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          On-Chain Chimera Analytics
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the complete history of genetic contributions, contributor statistics, and DNA evolution.
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* DNA Evolution */}
        <div className="mb-8">
          <DNAEvolution />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChimeraStats />
          </div>
          <div>
            <ContributorLeaderboard />
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-2">📡</span>
            Blockchain Data
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Contract Address</div>
              <div className="font-mono text-xs break-all">
                {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not deployed'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Network</div>
              <div className="font-medium">Sepolia Testnet</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">View on Explorer</div>
              <a
                href={`https://sepolia.etherscan.io/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Etherscan ↗
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Cyber Chimera - On-Chain Analytics
          </p>
        </div>
      </footer>
    </div>
  );
}