import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    telegramId: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    victories: {
        type: Number,
        default: 0
    },
    games: {
        type: Number,
        default: 0
    },
    coins: {
        type: Number,
        default: 6
    },
    ranking: {
        type: Number,
        default: 0
    },
    lastBonusTime: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    }
}, {versionKey: false})

module.exports = mongoose.model('User', userSchema)