export const GENE_TYPES = {
  0: 'bodyShape',
  1: 'bodyColor',
  2: 'eyes',
  3: 'mouth',
  4: 'pattern',
  5: 'accessory'
} as const;

export const GENE_VALUES = {
  bodyShape: {
    0: 'Normal',
    1: 'Aquatic',
    2: 'Fuzzy',
    3: 'Chunky',
    4: 'Slim'
  },
  bodyColor: {
    0: '#FF5733', // Fiery Orange
    1: '#33FF57', // Neon Green
    2: '#3357FF', // Cyber Blue
    3: '#FF33F5', // Neon Pink
    4: '#FFD700', // Gold
    5: '#9D33FF', // Purple
    6: '#33FFF5', // Cyan
    7: '#FF3333'  // Red
  },
  eyes: {
    0: 'Default',
    1: 'Laser',
    2: 'Googly',
    3: 'Sleepy',
    4: 'Heart',
    5: 'Star'
  },
  mouth: {
    0: 'Smile',
    1: 'Fangs',
    2: 'Derp',
    3: 'Kiss',
    4: 'Grin',
    5: 'Surprised'
  },
  pattern: {
    0: 'None',
    1: 'Spots',
    2: 'Stripes',
    3: 'Stars',
    4: 'Hearts'
  },
  accessory: {
    0: 'None',
    1: 'Hat',
    2: 'Bow',
    3: 'Glasses',
    4: 'Crown'
  }
} as const;

export const GENE_OPTIONS = [
  {
    type: 0,
    name: 'Body Shape',
    icon: '🦴',
    options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'Aquatic' },
      { value: 2, label: 'Fuzzy' },
      { value: 3, label: 'Chunky' },
      { value: 4, label: 'Slim' }
    ]
  },
  {
    type: 1,
    name: 'Body Color',
    icon: '🎨',
    options: [
      { value: 0, label: 'Fiery Orange', color: '#FF5733' },
      { value: 1, label: 'Neon Green', color: '#33FF57' },
      { value: 2, label: 'Cyber Blue', color: '#3357FF' },
      { value: 3, label: 'Neon Pink', color: '#FF33F5' },
      { value: 4, label: 'Gold', color: '#FFD700' },
      { value: 5, label: 'Purple', color: '#9D33FF' },
      { value: 6, label: 'Cyan', color: '#33FFF5' },
      { value: 7, label: 'Red', color: '#FF3333' }
    ]
  },
  {
    type: 2,
    name: 'Eyes',
    icon: '👁️',
    options: [
      { value: 0, label: 'Default' },
      { value: 1, label: 'Laser' },
      { value: 2, label: 'Googly' },
      { value: 3, label: 'Sleepy' },
      { value: 4, label: 'Heart' },
      { value: 5, label: 'Star' }
    ]
  },
  {
    type: 3,
    name: 'Mouth',
    icon: '👄',
    options: [
      { value: 0, label: 'Smile' },
      { value: 1, label: 'Fangs' },
      { value: 2, label: 'Derp' },
      { value: 3, label: 'Kiss' },
      { value: 4, label: 'Grin' },
      { value: 5, label: 'Surprised' }
    ]
  },
  {
    type: 4,
    name: 'Pattern',
    icon: '✨',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Spots' },
      { value: 2, label: 'Stripes' },
      { value: 3, label: 'Stars' },
      { value: 4, label: 'Hearts' }
    ]
  },
  {
    type: 5,
    name: 'Accessory',
    icon: '🎩',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Hat' },
      { value: 2, label: 'Bow' },
      { value: 3, label: 'Glasses' },
      { value: 4, label: 'Crown' }
    ]
  }
];