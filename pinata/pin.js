import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pinataSDK from '@pinata/sdk';

// ────────────────────────────────────────────────────────────
// 1.  Authenticate with Pinata (JWT is the simplest)
const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT, // OR use key/secret pair
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

// 2.  Absolute or relative path to the image you want to pin
const imgPath = path.resolve('./neva_under4kb.jpg');

// 3.  Stream the file to Pinata and print the resulting CID
try {
  const stream = fs.createReadStream(imgPath);

  const { IpfsHash } = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name: path.basename(imgPath) },
  });

  console.log(`✅  Image pinned. CID: ${IpfsHash}`);
} catch (err) {
  console.error('❌  Pinning failed:', err.message);
}
