import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// __dirname shim for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// tell dotenv exactly where to look
dotenv.config({
  path: resolve(__dirname, '../.env'),
});

import {
  Hbar,
  Client,
  AccountId,
  PrivateKey,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenCreateTransaction,
} from '@hashgraph/sdk';

async function main() {
  let client;
  try {
    const MY_ACCOUNT_ID = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(
      process.env.MY_PRIVATE_KEY,
    );

    // Pre-configured client for test network (testnet)
    client = Client.forTestnet();

    //Set the operator with the account ID and private key
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    const supplyKey = PrivateKey.generate();

    // (1) Create Neva NFT

    const nftCreate = await new TokenCreateTransaction()
      .setTokenName('Neva Chicken')
      .setTokenSymbol('NEVA')
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(MY_ACCOUNT_ID)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(9)
      .setSupplyKey(supplyKey)
      .freezeWith(client);

    //Sign the transaction with the treasury key
    const nftCreateTxSign = await nftCreate.sign(MY_PRIVATE_KEY);

    //Submit the transaction to a Hedera network
    const nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    const tokenId = nftCreateRx.tokenId;

    //Log the token ID
    console.log(`\nCreated NFT with Token ID: ` + tokenId);
    console.log(`\nCreated NFT with supplyKey: ` + supplyKey);

    // (2) Mint NFT with CID image

    // Max transaction fee as a constant
    const maxTransactionFee = new Hbar(50);
    const CID = `ipfs://${process.env.CID}`;

    // MINT NEW BATCH OF NFTs
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(CID)])
      .setMaxTransactionFee(maxTransactionFee)
      .freezeWith(client);

    //Sign the transaction with the supply key
    const mintTxSign = await mintTx.sign(supplyKey);

    //Submit the transaction to a Hedera network
    const mintTxSubmit = await mintTxSign.execute(client);

    //Get the transaction receipt
    const mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(
      'Created NFT ' +
        tokenId +
        ' with serial number: ' +
        mintRx.serials +
        '\n',
    );

    // (F) Footer code
  } catch (error) {
    console.error(error);
  } finally {
    if (client) client.close();
  }
}

main();
