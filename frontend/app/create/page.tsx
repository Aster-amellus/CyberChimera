'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import CustomMintPanel from '../../components/CustomMintPanel';
import Link from 'next/link';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3">
                <span className="text-3xl">🧬</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cyber Chimera
                </h1>
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <Link href="/create" className="text-purple-600 font-medium">
                  Create
                </Link>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Analytics
                </Link>
              </nav>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Create Your Own Pixel Art NFT
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Design unique pixel art characters from scratch or use templates. 
          Express your creativity and mint your creations as NFTs!
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <CustomMintPanel />
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