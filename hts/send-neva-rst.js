import {
  AccountId,
  PrivateKey,
  TransferTransaction,
  Client,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { createLogger } from '../util/util.js';

async function main() {
  let client;
  try {
    // Your account ID and private key from string value
    const treasuryId = AccountId.fromString('0.0.5392976');
    const treasuryKey = PrivateKey.fromStringECDSA(
      'db7aed15b6e7d636ef0382f9bbda3b843c3c96ed14795d704ccf38ba35f92ea0',
    );

    const tokenId = AccountId.fromString('0.0.5964670');
    const rstId = AccountId.fromString('0.0.5953011');

    // Pre-configured client for test network (testnet)
    client = Client.forTestnet();

    //Set the operator with the account ID and private key
    client.setOperator(treasuryId, treasuryKey);

    // (4) Transfer to RST wallet

    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(tokenId, 1, treasuryId, rstId)
      .freezeWith(client)
      .sign(treasuryKey);

    const tokenTransferSubmit = await tokenTransferTx.execute(client);
    const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(
      `\nNFT transfer from Treasury to RST: ${tokenTransferRx.status} \n`,
    );

    // (F) Footer code
  } catch (error) {
    console.error(error);
  } finally {
    if (client) client.close();
  }
}

main();
