import TelegramBot from "node-telegram-bot-api";
import {config} from "dotenv";
config()

const bot = new TelegramBot(process.env.ESS_BOT_TOKEN, {polling: true});

bot.onText(/^\/start$/, function (ctx, m) {
    const {chat: {id: chatId}} = ctx;

    bot.getUpdates().then(r => {
        for (let u of r) {
            if (u.message != null) {
                const json = JSON.stringify(u.message);
                bot.sendMessage(process.env.CHANNEL_USERNAME, "```\n" + json + "```", {
                    parse_mode: 'markdown'
                });
            }
        }
    });

    bot.sendMessage(chatId, 'Essential Words', {
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