import { COLORS, PIXEL_SIZE, drawPixel } from './pixelArt';

// Extended body shapes
export const BODY_SHAPES_EXTENDED = {
  3: { // Chunky
    name: 'Chunky',
    pixels: [
      // Big round head
      { x: 26, y: 14, w: 12, h: 2 },
      { x: 24, y: 16, w: 16, h: 2 },
      { x: 22, y: 18, w: 20, h: 6 },
      { x: 22, y: 24, w: 20, h: 2 },
      // Wide body
      { x: 18, y: 26, w: 28, h: 2 },
      { x: 16, y: 28, w: 32, h: 18 },
      { x: 18, y: 46, w: 28, h: 2 },
      { x: 20, y: 48, w: 24, h: 2 },
    ]
  },
  4: { // Slim
    name: 'Slim',
    pixels: [
      // Small head
      { x: 30, y: 16, w: 4, h: 2 },
      { x: 28, y: 18, w: 8, h: 4 },
      { x: 28, y: 22, w: 8, h: 2 },
      // Thin body
      { x: 26, y: 24, w: 12, h: 2 },
      { x: 24, y: 26, w: 16, h: 20 },
      { x: 26, y: 46, w: 12, h: 2 },
      { x: 28, y: 48, w: 8, h: 2 },
    ]
  }
};

// Extended eye patterns
export const EYES_EXTENDED = {
  3: { // Sleepy
    name: 'Sleepy',
    pixels: [
      // Half-closed left eye
      { x: 26, y: 24, w: 6, h: 2, color: 'black' },
      { x: 27, y: 25, w: 4, h: 1, color: 'gray' },
      // Half-closed right eye
      { x: 32, y: 24, w: 6, h: 2, color: 'black' },
      { x: 33, y: 25, w: 4, h: 1, color: 'gray' },
    ]
  },
  4: { // Heart
    name: 'Heart',
    pixels: [
      // Left heart eye
      { x: 26, y: 22, w: 2, h: 2, color: 'pink' },
      { x: 28, y: 22, w: 2, h: 2, color: 'pink' },
      { x: 26, y: 24, w: 4, h: 2, color: 'pink' },
      { x: 27, y: 26, w: 2, h: 1, color: 'pink' },
      // Right heart eye
      { x: 34, y: 22, w: 2, h: 2, color: 'pink' },
      { x: 36, y: 22, w: 2, h: 2, color: 'pink' },
      { x: 34, y: 24, w: 4, h: 2, color: 'pink' },
      { x: 35, y: 26, w: 2, h: 1, color: 'pink' },
    ]
  },
  5: { // Star
    name: 'Star',
    pixels: [
      // Left star eye
      { x: 28, y: 22, w: 2, h: 1, color: 'yellow' },
      { x: 27, y: 23, w: 4, h: 2, color: 'yellow' },
      { x: 28, y: 25, w: 2, h: 1, color: 'yellow' },
      { x: 26, y: 24, w: 1, h: 1, color: 'yellow' },
      { x: 31, y: 24, w: 1, h: 1, color: 'yellow' },
      // Right star eye
      { x: 36, y: 22, w: 2, h: 1, color: 'yellow' },
      { x: 35, y: 23, w: 4, h: 2, color: 'yellow' },
      { x: 36, y: 25, w: 2, h: 1, color: 'yellow' },
      { x: 34, y: 24, w: 1, h: 1, color: 'yellow' },
      { x: 39, y: 24, w: 1, h: 1, color: 'yellow' },
    ]
  }
};

// Extended mouth patterns
export const MOUTHS_EXTENDED = {
  3: { // Kiss
    name: 'Kiss',
    pixels: [
      // Puckered lips
      { x: 30, y: 34, w: 4, h: 2, color: 'pink' },
      { x: 29, y: 35, w: 6, h: 2, color: 'pink' },
      { x: 30, y: 37, w: 4, h: 1, color: 'pink' },
    ]
  },
  4: { // Grin
    name: 'Grin',
    pixels: [
      // Wide grin
      { x: 24, y: 34, w: 16, h: 1, color: 'black' },
      { x: 24, y: 35, w: 1, h: 2, color: 'black' },
      { x: 39, y: 35, w: 1, h: 2, color: 'black' },
      // Teeth
      { x: 26, y: 35, w: 12, h: 1, color: 'white' },
    ]
  },
  5: { // Surprised
    name: 'Surprised',
    pixels: [
      // O-shaped mouth
      { x: 30, y: 34, w: 4, h: 1, color: 'black' },
      { x: 30, y: 38, w: 4, h: 1, color: 'black' },
      { x: 29, y: 35, w: 1, h: 3, color: 'black' },
      { x: 34, y: 35, w: 1, h: 3, color: 'black' },
      // Inner mouth
      { x: 30, y: 35, w: 4, h: 3, color: 'darkRed' },
    ]
  }
};

// Pattern overlays
export const PATTERNS = {
  1: { // Spots
    name: 'Spots',
    generate: (bodyColor: string) => {
      const spots = [];
      const positions = [
        { x: 25, y: 30 },
        { x: 35, y: 32 },
        { x: 30, y: 38 },
        { x: 22, y: 35 },
        { x: 38, y: 36 },
      ];
      positions.forEach(pos => {
        spots.push({ x: pos.x, y: pos.y, w: 2, h: 2, color: 'rgba(0,0,0,0.2)' });
      });
      return spots;
    }
  },
  2: { // Stripes
    name: 'Stripes',
    generate: (bodyColor: string) => {
      const stripes = [];
      for (let y = 28; y < 44; y += 4) {
        stripes.push({ x: 22, y: y, w: 20, h: 1, color: 'rgba(0,0,0,0.15)' });
      }
      return stripes;
    }
  },
  3: { // Stars
    name: 'Stars',
    generate: (bodyColor: string) => {
      const stars = [];
      const positions = [
        { x: 26, y: 31 },
        { x: 34, y: 29 },
        { x: 30, y: 36 },
        { x: 23, y: 38 },
        { x: 37, y: 35 },
      ];
      positions.forEach(pos => {
        // Star center
        stars.push({ x: pos.x, y: pos.y, w: 1, h: 1, color: 'rgba(255,255,255,0.6)' });
        // Star points
        stars.push({ x: pos.x - 1, y: pos.y, w: 1, h: 1, color: 'rgba(255,255,255,0.3)' });
        stars.push({ x: pos.x + 1, y: pos.y, w: 1, h: 1, color: 'rgba(255,255,255,0.3)' });
        stars.push({ x: pos.x, y: pos.y - 1, w: 1, h: 1, color: 'rgba(255,255,255,0.3)' });
        stars.push({ x: pos.x, y: pos.y + 1, w: 1, h: 1, color: 'rgba(255,255,255,0.3)' });
      });
      return stars;
    }
  },
  4: { // Hearts
    name: 'Hearts',
    generate: (bodyColor: string) => {
      const hearts = [];
      const positions = [
        { x: 25, y: 30 },
        { x: 35, y: 33 },
        { x: 30, y: 37 },
      ];
      positions.forEach(pos => {
        // Heart shape (simplified)
        hearts.push({ x: pos.x, y: pos.y, w: 1, h: 1, color: 'rgba(255,105,180,0.5)' });
        hearts.push({ x: pos.x + 2, y: pos.y, w: 1, h: 1, color: 'rgba(255,105,180,0.5)' });
        hearts.push({ x: pos.x, y: pos.y + 1, w: 3, h: 1, color: 'rgba(255,105,180,0.5)' });
        hearts.push({ x: pos.x + 1, y: pos.y + 2, w: 1, h: 1, color: 'rgba(255,105,180,0.5)' });
      });
      return hearts;
    }
  }
};

// Accessories
export const ACCESSORIES = {
  1: { // Hat
    name: 'Hat',
    pixels: [
      // Top hat
      { x: 26, y: 10, w: 12, h: 4, color: 'black' },
      { x: 24, y: 14, w: 16, h: 1, color: 'black' },
      // Hat band
      { x: 26, y: 12, w: 12, h: 1, color: 'darkRed' },
    ]
  },
  2: { // Bow
    name: 'Bow',
    pixels: [
      // Bow tie on head
      { x: 28, y: 12, w: 3, h: 3, color: 'pink' },
      { x: 33, y: 12, w: 3, h: 3, color: 'pink' },
      { x: 31, y: 13, w: 2, h: 1, color: 'pink' },
    ]
  },
  3: { // Glasses
    name: 'Glasses',
    pixels: [
      // Left lens
      { x: 24, y: 22, w: 8, h: 1, color: 'black' },
      { x: 24, y: 27, w: 8, h: 1, color: 'black' },
      { x: 24, y: 22, w: 1, h: 6, color: 'black' },
      { x: 31, y: 22, w: 1, h: 6, color: 'black' },
      // Right lens
      { x: 32, y: 22, w: 8, h: 1, color: 'black' },
      { x: 32, y: 27, w: 8, h: 1, color: 'black' },
      { x: 32, y: 22, w: 1, h: 6, color: 'black' },
      { x: 39, y: 22, w: 1, h: 6, color: 'black' },
      // Bridge
      { x: 31, y: 24, w: 2, h: 1, color: 'black' },
    ]
  },
  4: { // Crown
    name: 'Crown',
    pixels: [
      // Crown base
      { x: 26, y: 12, w: 12, h: 2, color: 'yellow' },
      // Crown points
      { x: 26, y: 10, w: 2, h: 2, color: 'yellow' },
      { x: 31, y: 9, w: 2, h: 3, color: 'yellow' },
      { x: 36, y: 10, w: 2, h: 2, color: 'yellow' },
      // Jewels
      { x: 31, y: 13, w: 2, h: 1, color: 'red' },
    ]
  }
};

// Helper to draw patterns
export function drawPattern(
  ctx: CanvasRenderingContext2D,
  patternType: number,
  bodyColor: string
) {
  if (patternType === 0) return; // No pattern
  
  const pattern = PATTERNS[patternType as keyof typeof PATTERNS];
  if (pattern) {
    const patternPixels = pattern.generate(bodyColor);
    patternPixels.forEach(pixel => {
      ctx.fillStyle = pixel.color;
      ctx.fillRect(
        pixel.x * PIXEL_SIZE,
        pixel.y * PIXEL_SIZE,
        pixel.w * PIXEL_SIZE,
        pixel.h * PIXEL_SIZE
      );
    });
  }
}

// Helper to draw accessories
export function drawAccessory(
  ctx: CanvasRenderingContext2D,
  accessoryType: number
) {
  if (accessoryType === 0) return; // No accessory
  
  const accessory = ACCESSORIES[accessoryType as keyof typeof ACCESSORIES];
  if (accessory) {
    accessory.pixels.forEach(pixel => {
      const color = pixel.color ? COLORS[pixel.color as keyof typeof COLORS] || pixel.color : COLORS.black;
      drawPixel(ctx, pixel.x, pixel.y, pixel.w, pixel.h, color);
    });
  }
}