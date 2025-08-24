'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PIXEL_SIZE, CANVAS_SIZE, COLORS } from '../utils/pixelArt';

interface PixelArtEditorProps {
  onSave?: (pixelData: number[][]) => void;
  initialData?: number[][];
}

export default function PixelArtEditor({ onSave, initialData }: PixelArtEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'fill'>('pen');
  const [pixelData, setPixelData] = useState<number[][]>(() => {
    if (initialData) return initialData;
    // Initialize with empty grid (64x64)
    return Array(CANVAS_SIZE).fill(null).map(() => Array(CANVAS_SIZE).fill(0));
  });
  const [history, setHistory] = useState<number[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Color palette
  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#FFD700', '#4B0082', '#008080', '#F0E68C'
  ];

  useEffect(() => {
    drawGrid();
    renderPixels();
  }, [pixelData]);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
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
  };

  const renderPixels = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    pixelData.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== 0) {
          ctx.fillStyle = typeof color === 'string' ? color : colorPalette[color] || '#000000';
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      });
    });
  };

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(pixelData)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPixelData(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPixelData(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const getPixelPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    
    if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
      return { x, y };
    }
    return null;
  };

  const drawPixel = (x: number, y: number) => {
    const newData = [...pixelData];
    if (currentTool === 'eraser') {
      newData[y][x] = 0;
    } else if (currentTool === 'pen') {
      newData[y][x] = currentColor;
    }
    setPixelData(newData);
  };

  const floodFill = (startX: number, startY: number, targetColor: any, fillColor: string) => {
    if (targetColor === fillColor) return;
    
    const newData = [...pixelData];
    const stack = [[startX, startY]];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= CANVAS_SIZE || y < 0 || y >= CANVAS_SIZE) continue;
      if (newData[y][x] !== targetColor) continue;
      
      visited.add(key);
      newData[y][x] = fillColor;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    setPixelData(newData);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPixelPosition(e);
    if (!pos) return;
    
    saveToHistory();
    setIsDrawing(true);
    
    if (currentTool === 'fill') {
      floodFill(pos.x, pos.y, pixelData[pos.y][pos.x], currentColor);
    } else {
      drawPixel(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'fill') return;
    
    const pos = getPixelPosition(e);
    if (pos) {
      drawPixel(pos.x, pos.y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    saveToHistory();
    setPixelData(Array(CANVAS_SIZE).fill(null).map(() => Array(CANVAS_SIZE).fill(0)));
  };

  const exportPixelData = () => {
    if (onSave) {
      onSave(pixelData);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTool('pen')}
              className={`px-3 py-2 rounded ${
                currentTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              title="Pen"
            >
              ✏️
            </button>
            <button
              onClick={() => setCurrentTool('eraser')}
              className={`px-3 py-2 rounded ${
                currentTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              title="Eraser"
            >
              🧹
            </button>
            <button
              onClick={() => setCurrentTool('fill')}
              className={`px-3 py-2 rounded ${
                currentTool === 'fill' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              title="Fill"
            >
              🪣
            </button>
          </div>

          {/* History */}
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
              title="Undo"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
              title="Redo"
            >
              ↷
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={clearCanvas}
              className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Clear
            </button>
            <button
              onClick={downloadImage}
              className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
              Download
            </button>
            {onSave && (
              <button
                onClick={exportPixelData}
                className="px-3 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
              >
                Save Design
              </button>
            )}
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Color:</span>
            <div className="flex flex-wrap gap-1">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded border-2 ${
                    currentColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                title="Custom color"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg shadow p-4">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE * PIXEL_SIZE}
          height={CANVAS_SIZE * PIXEL_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="border-2 border-gray-300 cursor-crosshair"
          style={{
            imageRendering: 'pixelated',
            maxWidth: '100%',
            height: 'auto'
          }}
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Select a tool (Pen, Eraser, or Fill)</li>
          <li>• Choose a color from the palette or use custom color</li>
          <li>• Click and drag to draw (Pen/Eraser) or click to fill an area</li>
          <li>• Use Undo/Redo to correct mistakes</li>
          <li>• Save your design when you're happy with it!</li>
        </ul>
      </div>
    </div>
  );
}