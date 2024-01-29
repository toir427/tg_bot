import TelegramBot from "node-telegram-bot-api";

// @essentialwords_bot
const TOKEN = '5373770672:AAGBEgTZebmXsMHE-P1Ie6i5zjXiaCder74';
const CHANNEL_USERNAME = '@te3tify';
const bot = new TelegramBot(TOKEN, {polling: true});

bot.onText(/^\/start$/, function (ctx, m) {
    const {chat: {id: chatId}} = ctx;

    /*bot.getChat(CHANNEL_USERNAME)
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
        bot.sendMessage(CHANNEL_USERNAME, "```\n" + JSON.stringify(r) + "```", {
            parse_mode: 'MarkdownV2'
        })
    });
});