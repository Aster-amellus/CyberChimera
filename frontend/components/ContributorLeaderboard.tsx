'use client';

import React, { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';

interface ContributorData {
  address: string;
  contributionCount: number;
  lastContribution?: number;
  geneTypes: Set<number>;
}

export default function ContributorLeaderboard() {
  const publicClient = usePublicClient();
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  useEffect(() => {
    if (!publicClient || !CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      setLoading(false);
      return;
    }

    fetchContributors();
  }, [publicClient, CONTRACT_ADDRESS]);

  const fetchContributors = async () => {
    try {
      setLoading(true);
      
      // Get contribution events
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event GeneContributed(address indexed contributor, uint8 geneType, uint8 value)'),
        fromBlock: 'earliest',
        toBlock: 'latest',
      });

      // Process contributors
      const contributorMap = new Map<string, ContributorData>();

      for (const log of logs) {
        const contributor = (log.args.contributor as string).toLowerCase();
        const geneType = log.args.geneType as number;
        
        if (!contributorMap.has(contributor)) {
          contributorMap.set(contributor, {
            address: contributor,
            contributionCount: 0,
            geneTypes: new Set(),
          });
        }
        
        const data = contributorMap.get(contributor)!;
        data.contributionCount++;
        data.geneTypes.add(geneType);
        data.lastContribution = Number(log.blockNumber);
      }

      // Convert to array and sort by contribution count
      const sortedContributors = Array.from(contributorMap.values())
        .sort((a, b) => b.contributionCount - a.contributionCount)
        .slice(0, 10); // Top 10

      setContributors(sortedContributors);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getContributorTitle = (count: number) => {
    if (count >= 20) return 'DNA Master';
    if (count >= 10) return 'Gene Expert';
    if (count >= 5) return 'Active Contributor';
    if (count >= 2) return 'Contributor';
    return 'New Contributor';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="text-3xl mr-2">🏆</span>
        Top Contributors
      </h2>
      
      {contributors.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No contributors yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {contributors.map((contributor, index) => {
            const rank = index + 1;
            const title = getContributorTitle(contributor.contributionCount);
            
            return (
              <div
                key={contributor.address}
                className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-102 ${
                  rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300' :
                  rank === 2 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300' :
                  rank === 3 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300' :
                  'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold">
                    {getMedal(rank)}
                  </div>
                  <div>
                    <div className="font-mono font-medium">
                      {formatAddress(contributor.address)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {title}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {contributor.contributionCount} contributions
                  </div>
                  <div className="text-xs text-gray-600">
                    {contributor.geneTypes.size} different genes
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {contributors.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <span className="font-medium">Pro tip:</span> Contribute different gene types to increase your ranking!
          </p>
        </div>
      )}
    </div>
  );
}