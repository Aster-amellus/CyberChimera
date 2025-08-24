'use client';

import React, { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { GENE_OPTIONS } from '../utils/constants';
import ChimeraViewer from './ChimeraViewer';

interface DNASnapshot {
  blockNumber: number;
  dna: { [key: number]: number };
  timestamp?: number;
  contributionCount: number;
}

export default function DNAEvolution() {
  const publicClient = usePublicClient();
  const [snapshots, setSnapshots] = useState<DNASnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  useEffect(() => {
    if (!publicClient || !CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      setLoading(false);
      return;
    }

    fetchEvolution();
  }, [publicClient, CONTRACT_ADDRESS]);

  const fetchEvolution = async () => {
    try {
      setLoading(true);
      
      // Get contribution events
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event GeneContributed(address indexed contributor, uint8 geneType, uint8 value)'),
        fromBlock: 'earliest',
        toBlock: 'latest',
      });

      // Build DNA evolution timeline
      const dnaHistory: DNASnapshot[] = [];
      let currentDNA: { [key: number]: number } = {};
      let contributionCount = 0;
      let currentBlock = 0n;

      // Initial state
      dnaHistory.push({
        blockNumber: 0,
        dna: { ...currentDNA },
        contributionCount: 0,
      });

      for (const log of logs) {
        const geneType = log.args.geneType as number;
        const value = log.args.value as number;
        
        currentDNA[geneType] = value;
        contributionCount++;
        
        // Create snapshot at significant intervals
        if (contributionCount % 5 === 0 || log.blockNumber - currentBlock > 100n) {
          dnaHistory.push({
            blockNumber: Number(log.blockNumber),
            dna: { ...currentDNA },
            contributionCount,
          });
          currentBlock = log.blockNumber;
        }
      }

      // Add final state
      if (contributionCount > 0 && contributionCount % 5 !== 0) {
        dnaHistory.push({
          blockNumber: Number(currentBlock),
          dna: { ...currentDNA },
          contributionCount,
        });
      }

      setSnapshots(dnaHistory);
      setSelectedSnapshot(dnaHistory.length - 1);
    } catch (error) {
      console.error('Error fetching evolution:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDNAChanges = (oldDNA: { [key: number]: number }, newDNA: { [key: number]: number }) => {
    const changes = [];
    for (let i = 0; i < 6; i++) {
      if (oldDNA[i] !== newDNA[i]) {
        const gene = GENE_OPTIONS[i];
        const oldOption = gene?.options.find(o => o.value === (oldDNA[i] || 0));
        const newOption = gene?.options.find(o => o.value === (newDNA[i] || 0));
        changes.push({
          gene: gene?.name,
          icon: gene?.icon,
          from: oldOption?.label || 'Default',
          to: newOption?.label || 'Default',
        });
      }
    }
    return changes;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">DNA Evolution</h2>
        <p className="text-gray-500 text-center py-8">
          No evolution data available yet.
        </p>
      </div>
    );
  }

  const currentSnapshot = snapshots[selectedSnapshot];
  const previousSnapshot = selectedSnapshot > 0 ? snapshots[selectedSnapshot - 1] : null;
  const changes = previousSnapshot ? getDNAChanges(previousSnapshot.dna, currentSnapshot.dna) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
        <span className="flex items-center">
          <span className="text-3xl mr-2">📈</span>
          DNA Evolution Timeline
        </span>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
        >
          {showComparison ? 'Hide' : 'Show'} Comparison
        </button>
      </h2>

      {/* Timeline Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Genesis</span>
          <span className="text-sm font-medium">
            Snapshot {selectedSnapshot + 1} of {snapshots.length}
          </span>
          <span className="text-sm text-gray-600">Current</span>
        </div>
        <input
          type="range"
          min="0"
          max={snapshots.length - 1}
          value={selectedSnapshot}
          onChange={(e) => setSelectedSnapshot(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #9333EA 0%, #9333EA ${(selectedSnapshot / (snapshots.length - 1)) * 100}%, #E5E7EB ${(selectedSnapshot / (snapshots.length - 1)) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between mt-1">
          {snapshots.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === selectedSnapshot ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Snapshot Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-600">Block</div>
            <div className="font-medium">#{currentSnapshot.blockNumber}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Contributions</div>
            <div className="font-medium">{currentSnapshot.contributionCount}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Changes</div>
            <div className="font-medium">{changes.length} genes</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Progress</div>
            <div className="font-medium">{Math.round((selectedSnapshot / (snapshots.length - 1)) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Changes from Previous */}
      {changes.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="font-medium mb-2 text-yellow-800">Changes from Previous:</div>
          <div className="space-y-1">
            {changes.map((change, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span>{change.icon}</span>
                <span className="font-medium">{change.gene}:</span>
                <span className="text-gray-600">{change.from}</span>
                <span>→</span>
                <span className="text-green-600 font-medium">{change.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Comparison */}
      {showComparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previousSnapshot && (
            <div>
              <h3 className="text-lg font-medium mb-3 text-center">Previous State</h3>
              <div className="scale-75 origin-top">
                <ChimeraViewer dna={previousSnapshot.dna} />
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium mb-3 text-center">Current State</h3>
            <div className="scale-75 origin-top">
              <ChimeraViewer dna={currentSnapshot.dna} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setSelectedSnapshot(Math.max(0, selectedSnapshot - 1))}
          disabled={selectedSnapshot === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedSnapshot === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={() => setSelectedSnapshot(snapshots.length - 1)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Current State
        </button>
        <button
          onClick={() => setSelectedSnapshot(Math.min(snapshots.length - 1, selectedSnapshot + 1))}
          disabled={selectedSnapshot === snapshots.length - 1}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedSnapshot === snapshots.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}