import mongoose, { model, Schema } from "mongoose";

const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Message = model("Message", MessageSchema);

const ApiResponse = {
    success: Boolean,
    message: String,
    isAcceptingMessages: Boolean,
    messages: Array
};

module.exports = { Message, ApiResponse };
