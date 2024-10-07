import algosdk from "algosdk";
import { myMnemonic as mnemonic } from "../config";

(async () => {
  try {
    // Retrieve account from mnemonic
    const account = algosdk.mnemonicToSecretKey(mnemonic);

    // Initialize Algod client for the testnet
    const algodClient = new algosdk.Algodv2(
      "a".repeat(64),
      "https://testnet-api.algonode.cloud",
      ""
    );

    // Define the recipient address and transaction details
    const recipientAddress = "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY";
    const amountToSend = algosdk.algosToMicroalgos(1); // Sending 1 ALGO

    // Fetch the transaction parameters (e.g., fees, first/last valid round)
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create the payment transaction object
    const paymentTransaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: account.addr,
      receiver: recipientAddress,
      amount: amountToSend,
      suggestedParams,
    });

    // Sign the transaction
    const signedTransaction = paymentTransaction.signTxn(account.sk);

    // Send the signed transaction
    const txResponse = await algodClient.sendRawTransaction(signedTransaction).do();

    // Wait for confirmation of the transaction
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, paymentTransaction.txID(), 3);

    // Log the confirmed transaction details
    console.log("Transaction confirmed:", confirmedTxn);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

