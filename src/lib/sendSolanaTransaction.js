import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const sendSol = async (sendTransaction, fromPublicKey, toPublicKey, solAmount) => {
    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const lamports = Math.floor(solAmount * 1000000000);
  
      // More robust address validation
      try {
        new PublicKey(toPublicKey); // This will throw if invalid
      } catch (e) {
        throw new Error("Invalid recipient address format");
      }
  
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: lamports,
        })
      );
  
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = fromPublicKey;
  
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      
      return signature;
    } catch (error) {
      console.error("Error sending SOL:", error);
      throw error;
    }
  };