import mongoose from "mongoose";

const DigitalCurrencySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        symbol: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        id: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true, // Added unique index
        },
        imageURL: {
            type: String,
            default: "https://example.com/default-image.png", // Default image URL
        },
        current_price: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        market_cap: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        market_cap_rank: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        fully_diluted_valuation: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        total_volume: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        high_24h: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        low_24h: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        price_change_24h: {
            type: Number,
            required: true,
        },
        price_change_percentage_24h: {
            type: Number,
            required: true,
        },
        market_cap_change_24h: {
            type: Number,
            required: true,
        },
        market_cap_change_percentage_24h: {
            type: Number,
            required: true,
        },
        circulating_supply: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        total_supply: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        max_supply: {
            type: Number,
            min: 0, // Added validation for optional field
        },
        ath: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        ath_change_percentage: {
            type: Number,
            required: true,
        },
        ath_date: {
            type: Date, // Changed to Date type
            required: true,
        },
        atl: {
            type: Number,
            required: true,
            min: 0, // Added validation
        },
        atl_change_percentage: {
            type: Number,
            required: true,
        },
        price_change_percentage_1y_in_currency: {
            type: Number,
            required: true,
        },
        price_change_percentage_24h_in_currency: {
            type: Number,
            required: true,
        },
        price_change_percentage_30d_in_currency: {
            type: Number,
            required: true,
        },
        price_change_percentage_7d_in_currency: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const DigitalCurrency = mongoose.models.DigitalCurrency || mongoose.model("DigitalCurrency", DigitalCurrencySchema);

module.exports = DigitalCurrency;
