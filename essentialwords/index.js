const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
require("dotenv").config();
const winston = require('winston');

const logger = winston.createLogger({
    //level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'essentialwords/error.log'})
    ]
});

let mongoConnection = true;
const User = require("./models/User.js");
mongoose
    .connect(process.env.ESSW_MONGODB_URL)
    .catch(error => {
        mongoConnection = false;
        logger.info(error);
    });

const bot = new TelegramBot(process.env.ESSW_BOT_TOKEN, {polling: true});

function saveUser(user) {
    let info = [];
    info.push(`First Name: [${user.first_name}](tg://user?id=${user.id})`);
    info.push(`Last Name: ${user.last_name ?? ''}`);
    info.push(`Username: ${user.username ?? ''}`);
    info.push(`Chat: ${user.chat_id}`);
    info.push(`ID: ${user.id}`);

    bot.sendMessage(process.env.CHANNEL_USERNAME, info.join("\n"), {
        parse_mode: 'MarkdownV2'
    }).then(r => console.log(r));

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

bot.onText(/^\/start$/, function (ctx, m) {
    const {chat: {id: chatId}} = ctx;

    bot.getUpdates().then(r => {
        for (let u of r) {
            if (u.message != null) {
                saveUser({
                    id: u.message.from.id,
                    is_bot: u.message.from.is_bot,
                    first_name: u.message.from.first_name,
                    last_name: u.message.from?.last_name,
                    username: u.message.from?.username,
                    language_code: u.message.from.language_code,
                    chat_id: u.message.chat.id,
                    chat_type: u.message.chat.type,
                    command: u.message.text,
                    date: u.message.date
                });
            }
        }
    });

    bot.sendMessage(chatId, `Essential Words\n\n`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Book 1', web_app: {url: 'https://es4.triple.uz/1/'}},
                    {text: 'Book 2', web_app: {url: 'https://es4.triple.uz/2/'}}
                ],
                [
                    {text: 'Book 3', web_app: {url: 'https://es4.triple.uz/3/'}},
                    {text: 'Book 4', web_app: {url: 'https://es4.triple.uz/4/'}}
                ],
                [
                    {text: 'Book 5', web_app: {url: 'https://es4.triple.uz/5/'}},
                    {text: 'Book 6', web_app: {url: 'https://es4.triple.uz/6/'}}
                ]
            ]
        }
    });
});