import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const imageFile = 'neva_under4kb.jpg';
const imageCid = 'QmNMzC3FA8kdr1nJFAqepTytn7qguNwUuFHjBr5Gzkq29T'; // ← from Pinata

// 1️⃣  SHA‑256 checksum (optional but useful)
const fileBuffer = fs.readFileSync(`./pinata/${imageFile}`);
const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

// 2️⃣  Assemble the JSON
const metadata = {
  name: 'Neva #1',
  description: 'One‑off under‑4 KB JPEG minted on Hedera.',
  image: `ipfs://${imageCid}`,
  type: 'image/jpeg',
  format: '[email protected]', // signals HIP‑412 v2
  checksum,
  attributes: [
    { trait_type: 'Size', value: '≤4 KB' },
    { trait_type: 'Artist', value: 'Your Name' },
  ],
};

// 3️⃣  Write it out
fs.writeFileSync(
  './pinata/neva_under4kb.json',
  JSON.stringify(metadata, null, 2),
);
console.log('✅  Metadata file created → pinata/neva_under4kb.json');
