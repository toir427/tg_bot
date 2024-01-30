import TelegramBot from "node-telegram-bot-api";
import {config} from "dotenv";

config()
const bot = new TelegramBot(process.env.TOIR_BOT_TOKEN, {polling: true});

bot.onText(/^\/start$/, function (ctx) {
    const {chat: {id: chatId}} = ctx;

    bot.getUpdates().then(r => {
        for (let u of r) {
            if (u.message != null) {
                const json = JSON.stringify(u.message);
                bot.sendMessage(process.env.CHANNEL_USERNAME, "```\n" + json + "```", {
                    parse_mode: 'MarkdownV2'
                });
            }
        }
    });

    bot.sendMessage(chatId, "Our Projects/Apps\n\n", {
        //parse_mode: 'MarkdownV2',
        reply_markup: {
            inline_keyboard: [
                [{text: 'Essential Words EN/UZ', url: 'https://t.me/essentialwords_bot'}]
            ]
        }
    });
});