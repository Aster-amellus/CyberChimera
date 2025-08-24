'use client';

import React from 'react';
import { GENE_OPTIONS } from '../utils/constants';

interface DNAVisualizerProps {
  dna: { [key: number]: number };
  compact?: boolean;
}

export default function DNAVisualizer({ dna, compact = false }: DNAVisualizerProps) {
  const getDNASequence = () => {
    // Create a visual DNA sequence representation
    const sequence = [];
    for (let i = 0; i < 6; i++) {
      const value = dna[i] || 0;
      sequence.push(value);
    }
    return sequence;
  };

  const getGeneColor = (geneType: number, value: number) => {
    // Special handling for body color
    if (geneType === 1) {
      const colorOption = GENE_OPTIONS[1].options.find(o => o.value === value);
      return (colorOption as any)?.color || '#808080';
    }
    
    // Color coding for other genes based on value
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#FFB6C1'
    ];
    return colors[value % colors.length];
  };

  const sequence = getDNASequence();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {sequence.map((value, index) => (
          <div
            key={index}
            className="relative group"
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: getGeneColor(index, value) }}
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {GENE_OPTIONS[index]?.name}: {GENE_OPTIONS[index]?.options.find(o => o.value === value)?.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">🧬</span>
        Current DNA Sequence
      </h3>
      
      {/* DNA Helix Visualization */}
      <div className="mb-6">
        <div className="flex justify-center items-center gap-2">
          {sequence.map((value, index) => {
            const gene = GENE_OPTIONS[index];
            const option = gene?.options.find(o => o.value === value);
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-2xl mb-1">{gene?.icon}</div>
                <div
                  className="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-white relative group"
                  style={{ backgroundColor: getGeneColor(index, value) }}
                >
                  {value}
                  <div className="absolute top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {option?.label}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1 text-center">
                  {gene?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DNA Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GENE_OPTIONS.map((gene, index) => {
          const value = dna[index] || 0;
          const option = gene.options.find(o => o.value === value);
          
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{gene.icon}</span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getGeneColor(index, value) }}
                />
              </div>
              <div className="text-sm font-medium">{gene.name}</div>
              <div className="text-xs text-gray-600">{option?.label || 'Unknown'}</div>
            </div>
          );
        })}
      </div>

      {/* DNA Code */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <div className="font-mono text-xs text-green-400">
          <span className="text-gray-500">// Chimera DNA Signature</span>
          <br />
          <span className="text-blue-400">const</span> dna = [
          {sequence.map((v, i) => (
            <span key={i}>
              {i === 0 ? ' ' : ', '}
              <span className="text-yellow-400">{v}</span>
            </span>
          ))}
          {' ]'}
          <br />
          <span className="text-gray-500">// Unique ID: </span>
          <span className="text-purple-400">
            {sequence.map(v => v.toString(16).toUpperCase()).join('')}
          </span>
        </div>
      </div>
    </div>
  );
}