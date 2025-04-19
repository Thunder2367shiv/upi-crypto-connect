import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username must be under 30 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please use a valid email address"],
            index: true, 
        },
        phone: {
            type: Number,
            unique: true,
        },
        Wallet: {
            type: Number,
            default: 0,
        },
        BankAccounts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BankAccount"
            }
        ],
        mpin: {
            type: String,
        },
        TransactionHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "History"
            }
        ],
        receiveAlerts: { type: Boolean, default: false },
    },
    {
        timestamps: true, 
    }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = UserModel;
