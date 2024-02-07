const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const userSchema = new Schema({
    "id": {type: Number, unique: true},
    "chat_id": {type: Number, unique: true},
    "is_bot": {type: Boolean, default: false},
    "first_name": {type: String},
    "last_name": {type: String},
    "username": {type: String},
    "language_code": {type: String},
    "chat_type": {type: String},
    "command": {type: String},
    "date": {type: Number},
}, {versionKey: false})

const User = model('User', userSchema);
module.exports = User;