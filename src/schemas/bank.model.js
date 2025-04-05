import mongoose from "mongoose";

const BankSchema = new mongoose.Schema({
    AccountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    BranchName: { type: String, required: true },
    UpiId: { type: String, required: true },
    Amount: { type: String, required: true },
    Currency: { type: String, required: true },
    accountType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.BankAccount  || mongoose.model("BankAccount", BankSchema);
