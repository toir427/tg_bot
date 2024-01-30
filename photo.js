const TelegramBot = require('node-telegram-bot-api');

// @te3tify_bot
// const token = '6453458341:AAGi2GwezFZluuRA_VXH93MVN0bWeu2dQK4';

// @e84_bot
const token = '6716128964:AAEh-UqBmOpTJuiEsU7fzc-FfFrHDeBgvOg';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/^\/text/, function (ctx, m) {
    console.log('ctx: ', ctx)
    console.log('m: ', m)
});

bot.onText(/^\/start$/, function (ctx, m) {
    console.log('ctx: ', ctx)
    console.log('m: ', m)
});

bot.on('photo', ctx => {
    console.log(ctx)
    console.log(ctx.photo[2].file_id)

    bot.sendPhoto(ctx.chat.id, ctx.photo[2].file_id, {
        caption: "Hello",
        reply_markup: JSON.stringify({
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
        })
    })
});

/*
bot.on('photo', ctx => {
    const chatId = msg.chat.id;
    const photoPath = ctx.photo[2].file_id;
    const caption = 'Check out this photo!';

    const keyboard = {
        inline_keyboard: [
            [
                {text: 'Button 1', callback_data: 'button1'},
                {text: 'Button 2', callback_data: 'button2'}
            ]
        ]
    };

    const options = {
        caption: caption,
        reply_markup: JSON.stringify(keyboard)
    };

    bot.sendPhoto(chatId, photoPath, options)
        .then(() => {
            console.log('Photo with buttons sent successfully');
        })
        .catch((error) => {
            console.error('Error sending photo with buttons:', error);
        });
});*/
