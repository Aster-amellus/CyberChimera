'use client';

import React, { useState, useEffect } from 'react';
import { useChimeraContract } from '../hooks/useChimeraContract';
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { GENE_OPTIONS } from '../utils/constants';

interface Contribution {
  contributor: string;
  geneType: number;
  value: number;
  blockNumber: bigint;
  transactionHash: string;
  timestamp?: number;
}

export default function ChimeraStats() {
  const { isBorn } = useChimeraContract();
  const publicClient = usePublicClient();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [geneStats, setGeneStats] = useState<{ [key: number]: { [key: number]: number } }>({});
  const [uniqueContributors, setUniqueContributors] = useState<Set<string>>(new Set());
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  useEffect(() => {
    if (!publicClient || !CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      setLoading(false);
      return;
    }

    fetchContributions();
  }, [publicClient, CONTRACT_ADDRESS]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      
      // Get contribution events
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event GeneContributed(address indexed contributor, uint8 geneType, uint8 value)'),
        fromBlock: 'earliest',
        toBlock: 'latest',
      });

      // Process logs
      const contributionList: Contribution[] = [];
      const stats: { [key: number]: { [key: number]: number } } = {};
      const contributors = new Set<string>();

      for (const log of logs) {
        const contributor = log.args.contributor as string;
        const geneType = log.args.geneType as number;
        const value = log.args.value as number;
        
        contributionList.push({
          contributor,
          geneType,
          value,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        });

        contributors.add(contributor.toLowerCase());

        // Track stats
        if (!stats[geneType]) {
          stats[geneType] = {};
        }
        stats[geneType][value] = (stats[geneType][value] || 0) + 1;
      }

      // Get timestamps for recent contributions
      const recentContributions = contributionList.slice(-10).reverse();
      for (const contribution of recentContributions) {
        try {
          const block = await publicClient.getBlock({ blockNumber: contribution.blockNumber });
          contribution.timestamp = Number(block.timestamp);
        } catch (error) {
          console.error('Error fetching block:', error);
        }
      }

      setContributions(recentContributions);
      setGeneStats(stats);
      setUniqueContributors(contributors);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getGeneInfo = (geneType: number) => {
    return GENE_OPTIONS.find(g => g.type === geneType);
  };

  const getGeneValueLabel = (geneType: number, value: number) => {
    const gene = getGeneInfo(geneType);
    const option = gene?.options.find(o => o.value === value);
    return option?.label || `Value ${value}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="text-3xl mr-2">📊</span>
          Chimera Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600">
              {contributions.length}
            </div>
            <div className="text-sm text-gray-600">Total Contributions</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-600">
              {uniqueContributors.size}
            </div>
            <div className="text-sm text-gray-600">Unique Contributors</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-600">
              {Object.keys(geneStats).length}
            </div>
            <div className="text-sm text-gray-600">Gene Types Modified</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-3xl font-bold text-orange-600">
              {isBorn ? '🎉 Born' : '🥚 Growing'}
            </div>
            <div className="text-sm text-gray-600">Current Status</div>
          </div>
        </div>

        {/* Most Selected Genes */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Most Popular Selections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(geneStats).slice(0, 4).map(([geneType, values]) => {
              const gene = getGeneInfo(Number(geneType));
              const mostPopular = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
              
              if (!mostPopular) return null;
              
              return (
                <div key={geneType} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{gene?.icon}</span>
                    <span className="font-medium">{gene?.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {getGeneValueLabel(Number(geneType), Number(mostPopular[0]))}
                    </span>
                    <span className="text-gray-500 ml-1">
                      ({mostPopular[1]} times)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Contributions Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="text-3xl mr-2">⏱️</span>
          Recent Contributions
        </h2>
        
        {contributions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No contributions yet. Be the first to contribute a gene!
          </p>
        ) : (
          <div className="space-y-3">
            {contributions.map((contribution, index) => {
              const gene = getGeneInfo(contribution.geneType);
              return (
                <div 
                  key={`${contribution.transactionHash}-${index}`}
                  className="flex items-center justify-between border-l-4 border-purple-400 bg-gray-50 rounded-r-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{gene?.icon}</div>
                    <div>
                      <div className="font-medium">
                        {formatAddress(contribution.contributor)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Changed <span className="font-medium">{gene?.name}</span> to{' '}
                        <span className="font-medium text-purple-600">
                          {getGeneValueLabel(contribution.geneType, contribution.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {contribution.timestamp ? formatTime(contribution.timestamp) : 'Loading...'}
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${contribution.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      View TX ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contribution Heatmap */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="text-3xl mr-2">🔥</span>
          Gene Contribution Heatmap
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Gene Type</th>
                <th className="text-left p-2">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {GENE_OPTIONS.map(gene => {
                const stats = geneStats[gene.type] || {};
                const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
                
                return (
                  <tr key={gene.type} className="border-t">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span>{gene.icon}</span>
                        <span className="font-medium">{gene.name}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1 flex-wrap">
                        {gene.options.map(option => {
                          const count = stats[option.value] || 0;
                          const percentage = total > 0 ? (count / total) * 100 : 0;
                          const opacity = percentage > 0 ? Math.max(0.2, percentage / 100) : 0.1;
                          
                          return (
                            <div
                              key={option.value}
                              className="relative group"
                              title={`${option.label}: ${count} contributions (${percentage.toFixed(1)}%)`}
                            >
                              <div
                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xs font-medium"
                                style={{
                                  backgroundColor: `rgba(147, 51, 234, ${opacity})`,
                                  color: opacity > 0.5 ? 'white' : 'black'
                                }}
                              >
                                {count}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {option.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}