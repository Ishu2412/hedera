import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
} from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

async function environmentSetup() {
  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (!myAccountId || !myPrivateKey) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
    );
  }

  //Create your Hedera Testnet client
  const client = Client.forTestnet();

  // Set your account as the client's operator
  const operatorPrivateKey = PrivateKey.fromStringECDSA(myPrivateKey);
  client.setOperator(myAccountId, operatorPrivateKey);

  //Set the default maximum transaction fee (in Hbar)
  client.setDefaultMaxTransactionFee(new Hbar(100));

  //Set the maximum payment for queries (in Hbar)
  client.setMaxQueryPayment(new Hbar(50));

  //Create new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  //Create a new account with 1,000 tinybar starting balance
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  const getReciept = await newAccount.getReceipt(client);
  const newAccountId = getReciept.accountId;

  console.log(`New account ID: ${newAccountId}`);

  console.log("success");
  client.close();
}
environmentSetup();
