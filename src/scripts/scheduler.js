import cron from "node-cron";
import { checkSolanaPrice } from "./priceTracker.js";

// Run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ Checking Solana price...");
  checkSolanaPrice();
});
