import mongoose from "mongoose";

const TransactionHistorySchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    UpiId: { type: String},
    Amount: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.History || mongoose.model("History", TransactionHistorySchema);
