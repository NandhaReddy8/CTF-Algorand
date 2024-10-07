import algosdk from "algosdk";
import { myMnemonic as mnemonic } from "../config";

(async () => {
  try {
    // Get account from mnemonic
    const account = algosdk.mnemonicToSecretKey(mnemonic);

    // Initialize Algod client for testnet
    const algodClient = new algosdk.Algodv2(
      "a".repeat(64),
      "https://testnet-api.algonode.cloud",
      ""
    );

    // Define the asset ID
    const assetId = 720485937;

    // Get transaction parameters from the network
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create an asset transfer transaction
    const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: account.addr,
      receiver: account.addr, // Self-transfer of asset (opt-in or keep-alive)
      assetIndex: assetId,
      amount: 0, // Opt-in requires sending 0 assets
      suggestedParams,
    });

    // Sign the transaction
    const signedTxn = assetTransferTxn.signTxn(account.sk);

    // Send the signed transaction
    const txResponse = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, assetTransferTxn.txID(), 3);

    // Log the confirmed transaction details
    console.log("Transaction confirmed:", confirmedTxn);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
