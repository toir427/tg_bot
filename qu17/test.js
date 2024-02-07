const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
require("dotenv").config();
const winston = require('winston');

const logger = winston.createLogger({
    //level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'qu17/error.log'})
    ]
});

const User = require("./models/User.js");
let mongoConnection = true;
mongoose
    .connect(process.env.ESSW_MONGODB_URL)
    .catch(error => {
        mongoConnection = false;
        logger.info(error)
    });

const bot = new TelegramBot(process.env.QU17_BOT_TOKEN, {polling: true});

function saveUser(user) {
    User.findOne({id: user.id, chat_id: user.chat_id})
        .then(doc => {
            if (doc === null) {
                User.create(user).then(usr => {
                    console.log('usr: ', usr)
                })
            } else {
                console.log('user already exist')
            }
        });
}

bot.on('message', async function (ctx) { // when forward message json
    console.log('msg: ', ctx.text)

    if (ctx.text.startsWith('{')) {
        const data = JSON.parse(ctx.text);
        if (typeof data === 'object') {
            saveUser({
                id: data.from.id,
                is_bot: data.from.is_bot,
                first_name: data.from.first_name,
                last_name: data.from?.last_name,
                username: data.from?.username,
                language_code: data.from.language_code,
                chat_id: data.chat.id,
                chat_type: data.chat.type,
                command: data.text,
                date: data.date
            })
        }
    }
})
bot.onText(/^\/start$/, ctx => bot.sendMessage(ctx.chat.id, 'hi'));