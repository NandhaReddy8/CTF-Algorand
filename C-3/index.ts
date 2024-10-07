import algosdk from "algosdk";
import { myMnemonic as mnemonic } from "../config";

(async () => {
  try {
    // Get account from mnemonic
    const account = algosdk.mnemonicToSecretKey(mnemonic);

    // Initialize Algod client for the testnet
    const algodClient = new algosdk.Algodv2(
      "a".repeat(64),
      "https://testnet-api.algonode.cloud",
      ""
    );

    // Define the recipient
    const recipientAddress = "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY";

    // Encode note using TextEncoder
    const note = new TextEncoder().encode( 
      "b966c3d07e17b9442740dd2386e6e1ab191d51e964cee3b4dfc122f0fa865d10"
    );

    // Fetch transaction parameters from the network
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create the payment transaction object
    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: account.addr,
      receiver: recipientAddress,
      amount: algosdk.algosToMicroalgos(1), // Send 1 ALGO
      suggestedParams,
      note,
    });

    // Sign the transaction
    const signedTxn = paymentTxn.signTxn(account.sk);

    // Send the signed transaction to the network
    const transactionresult = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation of the transaction
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, paymentTxn.txID(), 3);

    // Log the confirmed transaction details
    console.log("Transaction confirmed:", confirmedTxn);
  } catch (error) {
    console.error("An error occurred during the transaction:", error);
  }
})();
