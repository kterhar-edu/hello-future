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
    // Your account ID and private key from string value
    const MY_ACCOUNT_ID = AccountId.fromString('0.0.5392976');
    const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(
      'db7aed15b6e7d636ef0382f9bbda3b843c3c96ed14795d704ccf38ba35f92ea0',
    );

    // Pre-configured client for test network (testnet)
    client = Client.forTestnet();

    //Set the operator with the account ID and private key
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    const supplyKey = PrivateKey.generate();

    // (1) Create Neva NFT

    const nftCreate = await new TokenCreateTransaction()
      .setTokenName('Neva Vax Test2')
      .setTokenSymbol('NEVA2')
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
    let CID = 'ipfs://QmR6UaFbYq1NBUqtW6YFRpPyNLQXzSBRjkAyH4jQHCUTXi';

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
