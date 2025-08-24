// Pixel art definitions for Chimera parts
export const PIXEL_SIZE = 4; // Each pixel will be 4x4 actual pixels
export const CANVAS_SIZE = 64; // 64x64 pixel grid

// Color palette
export const COLORS = {
  bodyColors: {
    0: '#FF5733', // Fiery Orange
    1: '#33FF57', // Neon Green
    2: '#3357FF'  // Cyber Blue
  },
  outline: '#2C1810',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  lightGray: '#C0C0C0',
  red: '#FF0000',
  yellow: '#FFFF00',
  pink: '#FF69B4',
  darkRed: '#8B0000',
};

// Pixel art patterns for body shapes (64x64 grid)
export const BODY_SHAPES = {
  0: { // Normal
    name: 'Normal',
    pixels: [
      // Head (circle-ish)
      { x: 28, y: 16, w: 8, h: 2 },
      { x: 26, y: 18, w: 12, h: 2 },
      { x: 24, y: 20, w: 16, h: 4 },
      { x: 24, y: 24, w: 16, h: 4 },
      // Body (rectangular with rounded edges)
      { x: 22, y: 28, w: 20, h: 2 },
      { x: 20, y: 30, w: 24, h: 16 },
      { x: 22, y: 46, w: 20, h: 2 },
      { x: 24, y: 48, w: 16, h: 2 },
    ]
  },
  1: { // Aquatic
    name: 'Aquatic',
    pixels: [
      // Streamlined head
      { x: 30, y: 16, w: 4, h: 2 },
      { x: 28, y: 18, w: 8, h: 2 },
      { x: 26, y: 20, w: 12, h: 2 },
      { x: 24, y: 22, w: 16, h: 4 },
      // Sleek body
      { x: 22, y: 26, w: 20, h: 2 },
      { x: 20, y: 28, w: 24, h: 14 },
      { x: 22, y: 42, w: 20, h: 2 },
      { x: 24, y: 44, w: 16, h: 2 },
      { x: 26, y: 46, w: 12, h: 2 },
      { x: 28, y: 48, w: 8, h: 2 },
    ],
    fins: [
      // Left fin
      { x: 16, y: 30, w: 4, h: 2 },
      { x: 14, y: 32, w: 6, h: 4 },
      { x: 16, y: 36, w: 4, h: 2 },
      // Right fin
      { x: 44, y: 30, w: 4, h: 2 },
      { x: 44, y: 32, w: 6, h: 4 },
      { x: 44, y: 36, w: 4, h: 2 },
    ]
  },
  2: { // Fuzzy
    name: 'Fuzzy',
    pixels: [
      // Fuzzy head with rough edges
      { x: 28, y: 14, w: 8, h: 2 },
      { x: 26, y: 16, w: 12, h: 2 },
      { x: 24, y: 18, w: 16, h: 2 },
      { x: 22, y: 20, w: 20, h: 6 },
      // Fuzzy body
      { x: 20, y: 26, w: 24, h: 2 },
      { x: 18, y: 28, w: 28, h: 16 },
      { x: 20, y: 44, w: 24, h: 2 },
      { x: 22, y: 46, w: 20, h: 2 },
      { x: 24, y: 48, w: 16, h: 2 },
    ],
    fuzz: [] // Will be generated dynamically
  }
};

// Eye patterns
export const EYES = {
  0: { // Default
    name: 'Default',
    pixels: [
      // Left eye white
      { x: 26, y: 22, w: 6, h: 6, color: 'white' },
      // Left pupil
      { x: 28, y: 24, w: 2, h: 2, color: 'black' },
      // Right eye white
      { x: 32, y: 22, w: 6, h: 6, color: 'white' },
      // Right pupil
      { x: 34, y: 24, w: 2, h: 2, color: 'black' },
    ]
  },
  1: { // Laser
    name: 'Laser',
    pixels: [
      // Left laser beam
      { x: 24, y: 24, w: 8, h: 2, color: 'red' },
      // Left laser core
      { x: 28, y: 23, w: 2, h: 4, color: 'yellow' },
      // Right laser beam
      { x: 32, y: 24, w: 8, h: 2, color: 'red' },
      // Right laser core
      { x: 36, y: 23, w: 2, h: 4, color: 'yellow' },
    ]
  },
  2: { // Googly
    name: 'Googly',
    pixels: [
      // Left eye white (bigger)
      { x: 24, y: 20, w: 8, h: 8, color: 'white' },
      // Left eye outline
      { x: 24, y: 20, w: 8, h: 1, color: 'black' },
      { x: 24, y: 27, w: 8, h: 1, color: 'black' },
      { x: 24, y: 20, w: 1, h: 8, color: 'black' },
      { x: 31, y: 20, w: 1, h: 8, color: 'black' },
      // Left pupil (offset)
      { x: 27, y: 23, w: 3, h: 3, color: 'black' },
      // Right eye white (bigger)
      { x: 32, y: 20, w: 8, h: 8, color: 'white' },
      // Right eye outline
      { x: 32, y: 20, w: 8, h: 1, color: 'black' },
      { x: 32, y: 27, w: 8, h: 1, color: 'black' },
      { x: 32, y: 20, w: 1, h: 8, color: 'black' },
      { x: 39, y: 20, w: 1, h: 8, color: 'black' },
      // Right pupil (offset differently)
      { x: 33, y: 25, w: 3, h: 3, color: 'black' },
    ]
  }
};

// Mouth patterns
export const MOUTHS = {
  0: { // Smile
    name: 'Smile',
    pixels: [
      // Smile curve
      { x: 26, y: 34, w: 2, h: 1, color: 'black' },
      { x: 28, y: 35, w: 2, h: 1, color: 'black' },
      { x: 30, y: 36, w: 4, h: 1, color: 'black' },
      { x: 34, y: 35, w: 2, h: 1, color: 'black' },
      { x: 36, y: 34, w: 2, h: 1, color: 'black' },
    ]
  },
  1: { // Fangs
    name: 'Fangs',
    pixels: [
      // Mouth line
      { x: 26, y: 34, w: 12, h: 1, color: 'black' },
      // Left fang
      { x: 28, y: 35, w: 2, h: 1, color: 'white' },
      { x: 29, y: 36, w: 1, h: 2, color: 'white' },
      // Right fang
      { x: 34, y: 35, w: 2, h: 1, color: 'white' },
      { x: 34, y: 36, w: 1, h: 2, color: 'white' },
    ]
  },
  2: { // Derp
    name: 'Derp',
    pixels: [
      // Open mouth
      { x: 28, y: 34, w: 8, h: 1, color: 'black' },
      { x: 28, y: 35, w: 8, h: 3, color: 'darkRed' },
      { x: 28, y: 38, w: 8, h: 1, color: 'black' },
      // Tongue
      { x: 30, y: 38, w: 4, h: 3, color: 'pink' },
      { x: 31, y: 41, w: 2, h: 1, color: 'pink' },
    ]
  }
};

// Function to generate deterministic fuzz particles based on a seed
export function generateFuzz(bodyColor: string, seed: number = 42): Array<{x: number, y: number, w: number, h: number, color: string}> {
  const fuzz = [];
  const fuzzCount = 50;
  
  // Simple deterministic random number generator
  let localSeed = seed;
  const random = () => {
    localSeed = (localSeed * 1103515245 + 12345) & 0x7fffffff;
    return localSeed / 0x7fffffff;
  };
  
  for (let i = 0; i < fuzzCount; i++) {
    fuzz.push({
      x: 18 + Math.floor(random() * 28),
      y: 14 + Math.floor(random() * 36),
      w: 1,
      h: 1,
      color: random() > 0.5 ? bodyColor : COLORS.outline
    });
  }
  
  return fuzz;
}

// Helper function to draw pixels on canvas
export function drawPixel(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, w * PIXEL_SIZE, h * PIXEL_SIZE);
}

// Draw outline for body parts
export function drawOutline(
  ctx: CanvasRenderingContext2D,
  pixels: Array<{x: number, y: number, w: number, h: number}>
) {
  ctx.fillStyle = COLORS.outline;
  pixels.forEach(pixel => {
    // Draw outline (1 pixel border)
    ctx.fillRect(
      (pixel.x - 1) * PIXEL_SIZE,
      (pixel.y - 1) * PIXEL_SIZE,
      (pixel.w + 2) * PIXEL_SIZE,
      1 * PIXEL_SIZE
    );
    ctx.fillRect(
      (pixel.x - 1) * PIXEL_SIZE,
      (pixel.y + pixel.h) * PIXEL_SIZE,
      (pixel.w + 2) * PIXEL_SIZE,
      1 * PIXEL_SIZE
    );
    ctx.fillRect(
      (pixel.x - 1) * PIXEL_SIZE,
      pixel.y * PIXEL_SIZE,
      1 * PIXEL_SIZE,
      pixel.h * PIXEL_SIZE
    );
    ctx.fillRect(
      (pixel.x + pixel.w) * PIXEL_SIZE,
      pixel.y * PIXEL_SIZE,
      1 * PIXEL_SIZE,
      pixel.h * PIXEL_SIZE
    );
  });
}