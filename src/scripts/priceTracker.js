import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dbConnect from "../lib/dbConnect.js";
import User from "@/schemas/user.model.js"

dotenv.config();

let lastPrice = null;
const thresholdPercent = 2; // % change to trigger alert

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendEmail = async (userEmail, newPrice, change) => {
  await transporter.sendMail({
    from: process.env.EMAIL_ID,
    to: userEmail,
    subject: "🚨 Solana Price Alert",
    html: `<p>Solana price changed by ${change.toFixed(2)}%. New price: $${newPrice}</p>`,
  });
};

export const checkSolanaPrice = async () => {
  try {
    await dbConnect();

    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const currentPrice = res.data.solana.usd;

    if (lastPrice) {
      const change = ((currentPrice - lastPrice) / lastPrice) * 100;

      if (Math.abs(change) >= thresholdPercent) {
        console.log(`Price changed by ${change.toFixed(2)}%. Sending emails...`);
        const users = await User.find({ receiveAlerts: true });

        for (const user of users) {
          await sendEmail(user.email, currentPrice, change);
        }
      }
    }

    lastPrice = currentPrice;
  } catch (err) {
    console.error("Price check error:", err.message);
  }
};
