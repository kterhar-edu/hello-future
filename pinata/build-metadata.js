import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const imageFile = './neva_under4kb.jpg';
const imageCid = 'QmNMzC3FA8kdr1nJFAqepTytn7qguNwUuFHjBr5Gzkq29T'; // ← from Pinata

// 1️⃣  SHA‑256 checksum (optional but useful)
const fileBuffer = fs.readFileSync(`${imageFile}`);
const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

// 2️⃣  Assemble the JSON
const metadata = {
  name: 'Neva NFT',
  description: 'First of 1, just for her mama',
  image: `ipfs://${imageCid}`,
  type: 'image/jpeg',
  format: 'HIP412@2.0.0',
  checksum,
  attributes: [
    { trait_type: 'Chicken?', value: 'TRUE' },
    { trait_type: 'Artist', value: 'Bubsy' },
  ],
};

// 3️⃣  Write it out
fs.writeFileSync('./neva_under4kb.json', JSON.stringify(metadata, null, 2));
console.log('✅  Metadata file created → pinata/neva_under4kb.json');
