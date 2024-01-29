const TelegramBot = require('node-telegram-bot-api');

// @qu17bot
const token = '5862280064:AAG5JzdPaFbdK3j0SffBdSt2XDugD6jYU-I';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});


// Essential Words 1
// 4000 Essential English Words 1 - Paul Nation
// https://e84.vercel.app/1/

bot.onText(/^\/start$/, function (ctx, m) {

    /*const options = {
        parse_mode: 'MarkdownV2'
    };

    bot.sendMessage(ctx.chat.id, `[Essential Words 1](https://t.me/e84_bot/book)`, options)
        .then(r => console.log('r: ', r));

    for (let i = 2; i < 7; i++) {
        bot.sendMessage(ctx.chat.id, `[Essential Words ${i}](https://t.me/e84_bot/book${i})`, options)
            .then(r => console.log('r: ', r));
    }*/

    /*bot.sendMessage(ctx.chat.id, 'Web APP', {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Book 1', web_app: {url: 'https://e84.vercel.app/1/'}},
                    {text: 'Book 2', web_app: {url: 'https://e84.vercel.app/2/'}},
                    {text: 'Book 3', web_app: {url: 'https://e84.vercel.app/3/'}}
                ],
                [
                    {text: 'Book 4', web_app: {url: 'https://e84.vercel.app/4/'}},
                    {text: 'Book 5', web_app: {url: 'https://e84.vercel.app/5/'}},
                    {text: 'Book 6', web_app: {url: 'https://e84.vercel.app/6/'}}
                ],
                [
                    {text: 'Full', web_app: {url: 'https://e84.vercel.app'}}
                ],
            ]
        }
    })*/

    bot.sendMessage(ctx.chat.id, 'Web APP', {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Book 1', web_app: {url: 'https://e84.vercel.app/1/'}},
                    {text: 'Book 2', web_app: {url: 'https://e84.vercel.app/2/'}},
                ],
                [
                    {text: 'Book 3', web_app: {url: 'https://e84.vercel.app/3/'}},
                    {text: 'Book 4', web_app: {url: 'https://e84.vercel.app/4/'}},
                ],
                [
                    {text: 'Book 5', web_app: {url: 'https://e84.vercel.app/5/'}},
                    {text: 'Book 6', web_app: {url: 'https://e84.vercel.app/6/'}}
                ],
                [
                    {text: 'Full', web_app: {url: 'https://e84.vercel.app'}}
                ],
            ]
        }
    })
})



