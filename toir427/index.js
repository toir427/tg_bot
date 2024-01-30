import TelegramBot from "node-telegram-bot-api";

// @toir427_bot
const TOKEN = '349160873:AAFa8Nv0EIfFRhT86kg1HPu8DCe7tRvBTAE';
const bot = new TelegramBot(TOKEN, {polling: true});

bot.onText(/^\/start$/, function (ctx) {
    const {chat: {id: chatId}} = ctx;

    bot.getChat('@te3tify')
        .then(r => {
            console.log('chat: ', r)

            bot.sendMessage(r.id, 'Hi there');
        });

    bot.getUpdates().then(r => {

        // type: 'channel',
        // user: type: 'private',

        /*if (Array.isArray(r)) {
            for (let i = 0; i < r.length; i++) {
                console.log('r: ', r[i])
                console.log(r[i].message.chat)
            }
        } else {
            console.log('r: ', r)
        }*/

    });

    bot.sendMessage(chatId, "Our Projects/Apps\n\n@essentialwords_bot", {
        //parse_mode: 'MarkdownV2',
        reply_markup: {
            inline_keyboard: [
                [{text: 'Essential Words EN/UZ', url: 'https://t.me/essentialwords_bot'}]
            ]
        }
    });
});