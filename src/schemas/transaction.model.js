import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    transactionSearchId: {type: String},
    UpiId: { type: String},
    Amount: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
