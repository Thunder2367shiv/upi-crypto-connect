import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    UpiId: { type: String},
    Amount: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
