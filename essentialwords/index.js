import TelegramBot from "node-telegram-bot-api";
import {config} from "dotenv";
config()

// @essentialwords_bot
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.onText(/^\/start$/, function (ctx, m) {
    const {chat: {id: chatId}} = ctx;

    /*bot.getChat(process.env.CHANNEL_USERNAME)
        .then(r => {
            console.log('chat: ', r)

            bot.sendMessage(r.id, 'Hi there');
        });*/

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
    }).then(r => {
        /*bot.sendMessage(process.env.CHANNEL_USERNAME, "```\n" + JSON.stringify(r) + "```", {
            parse_mode: 'MarkdownV2'
        })*/
    });
});