/**
 * pin_meta.js – Pin a local JSON metadata file (HIP‑412) to Pinata
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pinataSDK from '@pinata/sdk';

// ── 1. Auth
const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT,
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

// ── 2. Read the JSON from disk
const metaPath = path.resolve('./neva_under4kb.json');
const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

// ── 3. Pin it
try {
  const { IpfsHash } = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: path.basename(metaPath) },
  });
  console.log(`✅  Metadata pinned. CID: ${IpfsHash}`);
} catch (err) {
  console.error('❌  Pinning failed:', err.message);
}
