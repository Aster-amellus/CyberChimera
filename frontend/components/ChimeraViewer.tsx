'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GENE_VALUES } from '../utils/constants';
import {
  PIXEL_SIZE,
  CANVAS_SIZE,
  COLORS,
  BODY_SHAPES,
  EYES,
  MOUTHS,
  generateFuzz,
  drawPixel,
  drawOutline
} from '../utils/pixelArt';
import {
  BODY_SHAPES_EXTENDED,
  EYES_EXTENDED,
  MOUTHS_EXTENDED,
  drawPattern,
  drawAccessory
} from '../utils/pixelArtExtended';

interface ChimeraViewerProps {
  dna: { [key: number]: number };
  previewDna?: { [key: number]: number }; // For preview mode
  isPreview?: boolean;
}

export default function ChimeraViewer({ dna, previewDna, isPreview = false }: ChimeraViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use preview DNA if provided, otherwise use actual DNA
  const displayDna = previewDna || dna;
  
  const bodyShape = displayDna[0] || 0;
  const bodyColorValue = displayDna[1] || 0;
  const eyes = displayDna[2] || 0;
  const mouth = displayDna[3] || 0;
  const pattern = displayDna[4] || 0;
  const accessory = displayDna[5] || 0;

  const bodyColor = GENE_VALUES.bodyColor[bodyColorValue as keyof typeof GENE_VALUES.bodyColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add grid background for pixel art feel
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= CANVAS_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * PIXEL_SIZE, 0);
      ctx.lineTo(i * PIXEL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * PIXEL_SIZE);
      ctx.lineTo(canvas.width, i * PIXEL_SIZE);
      ctx.stroke();
    }

    // Get body shape data
    const allBodyShapes = { ...BODY_SHAPES, ...BODY_SHAPES_EXTENDED };
    const bodyData = allBodyShapes[bodyShape as keyof typeof allBodyShapes];
    
    // Draw body outline
    drawOutline(ctx, bodyData.pixels);
    
    // Draw body
    bodyData.pixels.forEach(pixel => {
      drawPixel(ctx, pixel.x, pixel.y, pixel.w, pixel.h, bodyColor);
    });

    // Draw fins for aquatic type
    if (bodyShape === 1 && bodyData.fins) {
      bodyData.fins.forEach(pixel => {
        drawPixel(ctx, pixel.x, pixel.y, pixel.w, pixel.h, bodyColor);
      });
      // Fin patterns (deterministic)
      ctx.fillStyle = COLORS.outline;
      bodyData.fins.forEach((pixel, index) => {
        if (index % 3 === 0) { // Deterministic pattern instead of random
          ctx.fillRect(
            (pixel.x + Math.floor(pixel.w/2)) * PIXEL_SIZE,
            (pixel.y + Math.floor(pixel.h/2)) * PIXEL_SIZE,
            PIXEL_SIZE,
            PIXEL_SIZE
          );
        }
      });
    }

    // Draw fuzz for fuzzy type
    if (bodyShape === 2) {
      // Use DNA as seed for consistent fuzz generation
      const seed = bodyShape + bodyColorValue * 10 + eyes * 100 + mouth * 1000;
      const fuzzParticles = generateFuzz(bodyColor, seed);
      fuzzParticles.forEach((particle, index) => {
        if (index % 3 !== 0) { // Deterministic density pattern
          drawPixel(ctx, particle.x, particle.y, particle.w, particle.h, particle.color);
        }
      });
    }

    // Draw pattern overlay
    drawPattern(ctx, pattern, bodyColor);
    
    // Draw eyes
    const allEyes = { ...EYES, ...EYES_EXTENDED };
    const eyeData = allEyes[eyes as keyof typeof allEyes];
    eyeData.pixels.forEach(pixel => {
      const color = pixel.color ? COLORS[pixel.color as keyof typeof COLORS] : COLORS.black;
      drawPixel(ctx, pixel.x, pixel.y, pixel.w, pixel.h, color);
    });

    // Add eye sparkle for cuteness
    if (eyes === 0 || eyes === 2) {
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(27 * PIXEL_SIZE, 23 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      ctx.fillRect(35 * PIXEL_SIZE, 23 * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }

    // Draw mouth
    const allMouths = { ...MOUTHS, ...MOUTHS_EXTENDED };
    const mouthData = allMouths[mouth as keyof typeof allMouths];
    mouthData.pixels.forEach(pixel => {
      const color = pixel.color ? COLORS[pixel.color as keyof typeof COLORS] : COLORS.black;
      drawPixel(ctx, pixel.x, pixel.y, pixel.w, pixel.h, color);
    });

    // Draw accessory (on top)
    drawAccessory(ctx, accessory);
    
    // Add animation effect for preview
    if (isPreview) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

  }, [displayDna, bodyShape, bodyColorValue, eyes, mouth, pattern, accessory, bodyColor, isPreview]);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${isPreview ? 'border-2 border-purple-400' : ''} ${isAnimating ? 'animate-pulse' : ''}`}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE * PIXEL_SIZE}
          height={CANVAS_SIZE * PIXEL_SIZE}
          className="bg-gray-100 rounded-lg shadow-lg image-rendering-pixelated"
          style={{
            imageRendering: 'pixelated',
            width: CANVAS_SIZE * PIXEL_SIZE,
            height: CANVAS_SIZE * PIXEL_SIZE
          }}
        />
        {isPreview && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
            Preview
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold mb-2">
          {isPreview ? 'Preview DNA' : 'Current DNA'}
        </h3>
        <div className="grid grid-cols-3 gap-2 text-sm bg-white rounded-lg p-3 shadow">
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">Body:</span>
            <span className="text-xs">{GENE_VALUES.bodyShape[bodyShape as keyof typeof GENE_VALUES.bodyShape] || 'Normal'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">Color:</span>
            <span 
              className="px-1 py-0.5 rounded text-white text-xs"
              style={{ backgroundColor: bodyColor }}
            >
              {bodyColor}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">Eyes:</span>
            <span className="text-xs">{GENE_VALUES.eyes[eyes as keyof typeof GENE_VALUES.eyes] || 'Default'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">Mouth:</span>
            <span className="text-xs">{GENE_VALUES.mouth[mouth as keyof typeof GENE_VALUES.mouth] || 'Smile'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">Pattern:</span>
            <span className="text-xs">{GENE_VALUES.pattern[pattern as keyof typeof GENE_VALUES.pattern] || 'None'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-xs">Accessory:</span>
            <span className="text-xs">{GENE_VALUES.accessory[accessory as keyof typeof GENE_VALUES.accessory] || 'None'}</span>
          </div>
        </div>
      </div>
      
      {isPreview && (
        <div className="mt-2 text-xs text-purple-600 text-center">
          This is how your Chimera will look with these genes
        </div>
      )}
    </div>
  );
}