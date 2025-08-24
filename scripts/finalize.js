import { ethers } from 'ethers';
import { createCanvas } from 'canvas';
import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contract ABI (only the functions we need)
const CONTRACT_ABI = [
  "function getGene(uint8 geneType) view returns (uint8)",
  "function isBorn() view returns (bool)"
];

// Gene mappings (same as frontend)
const GENE_TYPES = {
  0: 'bodyShape',
  1: 'bodyColor',
  2: 'eyes',
  3: 'mouth'
};

const GENE_VALUES = {
  bodyShape: {
    0: 'Normal',
    1: 'Aquatic',
    2: 'Fuzzy'
  },
  bodyColor: {
    0: '#FF5733', // Fiery Orange
    1: '#33FF57', // Neon Green
    2: '#3357FF'  // Cyber Blue
  },
  eyes: {
    0: 'Default',
    1: 'Laser',
    2: 'Googly'
  },
  mouth: {
    0: 'Smile',
    1: 'Fangs',
    2: 'Derp'
  }
};

async function main() {
  console.log('🧬 Chimera Metadata Generation Script');
  console.log('=====================================\n');

  // Check environment variables
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
    console.error('❌ Error: PINATA_API_KEY and PINATA_SECRET_KEY must be set in .env file');
    process.exit(1);
  }

  if (!process.env.SEPOLIA_RPC_URL) {
    console.error('❌ Error: SEPOLIA_RPC_URL must be set in .env file');
    process.exit(1);
  }

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!CONTRACT_ADDRESS) {
    console.error('❌ Error: NEXT_PUBLIC_CONTRACT_ADDRESS must be set in .env file');
    process.exit(1);
  }

  // Initialize Pinata
  const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

  // Test Pinata authentication
  try {
    await pinata.testAuthentication();
    console.log('✅ Pinata authentication successful\n');
  } catch (error) {
    console.error('❌ Pinata authentication failed:', error.message);
    process.exit(1);
  }

  // Connect to blockchain
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  // Check if chimera is born
  const isBorn = await contract.isBorn();
  if (!isBorn) {
    console.error('❌ Error: Chimera has not been born yet. Call birth() first.');
    process.exit(1);
  }

  console.log('📊 Fetching DNA from blockchain...');
  
  // Fetch DNA from contract
  const dna = {};
  for (let i = 0; i < 4; i++) {
    dna[i] = await contract.getGene(i);
    const geneName = GENE_TYPES[i];
    const geneValue = GENE_VALUES[geneName][dna[i]];
    console.log(`  ${geneName}: ${geneValue}`);
  }

  console.log('\n🎨 Generating chimera image...');

  // Create canvas for the image
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(0, 0, 800, 800);

  // Get body color
  const bodyColorValue = dna[1];
  const bodyColor = GENE_VALUES.bodyColor[bodyColorValue];

  // Draw body based on shape
  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;

  const bodyShape = dna[0];
  ctx.beginPath();
  switch (bodyShape) {
    case 0: // Normal
      ctx.ellipse(400, 400, 150, 200, 0, 0, Math.PI * 2);
      break;
    case 1: // Aquatic
      ctx.ellipse(400, 400, 180, 150, 0, 0, Math.PI * 2);
      // Add fins
      ctx.moveTo(220, 400);
      ctx.quadraticCurveTo(150, 380, 180, 420);
      ctx.moveTo(580, 400);
      ctx.quadraticCurveTo(650, 380, 620, 420);
      break;
    case 2: // Fuzzy
      ctx.ellipse(400, 400, 170, 220, 0, 0, Math.PI * 2);
      // Add fuzzy texture effect
      for (let i = 0; i < 30; i++) {
        const x = 300 + Math.random() * 200;
        const y = 250 + Math.random() * 300;
        ctx.fillRect(x, y, 3, 3);
      }
      break;
  }
  ctx.fill();
  ctx.stroke();

  // Draw eyes based on type
  const eyes = dna[2];
  switch (eyes) {
    case 0: // Default
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(350, 350, 30, 0, Math.PI * 2);
      ctx.arc(450, 350, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(350, 350, 15, 0, Math.PI * 2);
      ctx.arc(450, 350, 15, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 1: // Laser
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(330, 345, 40, 10);
      ctx.fillRect(430, 345, 40, 10);
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(350, 350, 5, 0, Math.PI * 2);
      ctx.arc(450, 350, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 2: // Googly
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(350, 350, 40, 0, Math.PI * 2);
      ctx.arc(450, 350, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(360, 360, 15, 0, Math.PI * 2);
      ctx.arc(440, 340, 15, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  // Draw mouth based on type
  const mouth = dna[3];
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  switch (mouth) {
    case 0: // Smile
      ctx.arc(400, 420, 50, 0, Math.PI);
      ctx.stroke();
      break;
      
    case 1: // Fangs
      ctx.moveTo(350, 450);
      ctx.lineTo(450, 450);
      ctx.stroke();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(370, 450);
      ctx.lineTo(375, 465);
      ctx.lineTo(380, 450);
      ctx.moveTo(420, 450);
      ctx.lineTo(425, 465);
      ctx.lineTo(430, 450);
      ctx.fill();
      break;
      
    case 2: // Derp
      ctx.arc(400, 430, 30, 0, Math.PI);
      ctx.stroke();
      
      ctx.fillStyle = '#FF69B4';
      ctx.fillRect(390, 450, 20, 15);
      break;
  }

  // Save image to buffer
  const imageBuffer = canvas.toBuffer('image/png');
  
  // Create output directory
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save image locally
  const imagePath = path.join(outputDir, 'chimera.png');
  fs.writeFileSync(imagePath, imageBuffer);
  console.log(`✅ Image saved locally: ${imagePath}`);

  // Upload image to IPFS
  console.log('\n📤 Uploading image to IPFS...');
  const imageResult = await pinata.pinFileToIPFS(
    fs.createReadStream(imagePath),
    {
      pinataMetadata: {
        name: 'Chimera Image'
      }
    }
  );
  const imageCID = imageResult.IpfsHash;
  console.log(`✅ Image uploaded to IPFS: ipfs://${imageCID}`);

  // Create metadata
  const metadata = {
    name: "Cyber Chimera #1",
    description: "A unique digital lifeform co-created by the community through blockchain contributions.",
    image: `ipfs://${imageCID}`,
    attributes: [
      {
        trait_type: "Body Shape",
        value: GENE_VALUES.bodyShape[dna[0]]
      },
      {
        trait_type: "Body Color",
        value: GENE_VALUES.bodyColor[dna[1]]
      },
      {
        trait_type: "Eyes",
        value: GENE_VALUES.eyes[dna[2]]
      },
      {
        trait_type: "Mouth",
        value: GENE_VALUES.mouth[dna[3]]
      }
    ]
  };

  // Save metadata locally
  const metadataPath = path.join(outputDir, '0.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`\n✅ Metadata saved locally: ${metadataPath}`);

  // Upload metadata to IPFS
  console.log('📤 Uploading metadata to IPFS...');
  const metadataResult = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: {
      name: 'Chimera Metadata'
    }
  });
  const metadataCID = metadataResult.IpfsHash;
  console.log(`✅ Metadata uploaded to IPFS: ipfs://${metadataCID}`);

  // Create a folder with metadata for token URI
  const folderMetadata = {
    "0": metadata
  };
  
  const folderResult = await pinata.pinJSONToIPFS(folderMetadata, {
    pinataMetadata: {
      name: 'Chimera Collection'
    }
  });
  const folderCID = folderResult.IpfsHash;

  console.log('\n' + '='.repeat(60));
  console.log('🎉 METADATA GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📝 Next Steps:');
  console.log('1. Copy the Base URI below');
  console.log('2. Go to the Admin Panel on the frontend');
  console.log('3. Paste the Base URI and click "Set URI"');
  console.log('\n🔗 BASE URI FOR CONTRACT:');
  console.log(`   ipfs://${metadataCID}`);
  console.log('\n📍 Direct Links:');
  console.log(`   Image: https://gateway.pinata.cloud/ipfs/${imageCID}`);
  console.log(`   Metadata: https://gateway.pinata.cloud/ipfs/${metadataCID}`);
  console.log('\n✨ Contributors can now mint their NFTs!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });