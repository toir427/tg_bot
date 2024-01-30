const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5697465520:AAFWmw0LwneobGz5LjqQLJKLrsJrrhkj0-w';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/^\/start$/, function (msg) {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [{text: 'Level 1'}],
            ],
        }
    };

    bot.sendMessage(msg.chat.id, "I'm a test robot", opts);
});

function getPagination(current = 25, maxPage = 100) {
    var keys = [];
    if (current > 1) keys.push({text: `«1`, callback_data: '1'});
    if (current > 2) keys.push({text: `‹${current - 1}`, callback_data: (current - 1).toString()});
    keys.push({text: `-${current}-`, callback_data: current.toString()});
    if (current < maxPage - 1) keys.push({text: `${current + 1}›`, callback_data: (current + 1).toString()})
    if (current < maxPage) keys.push({text: `${maxPage}»`, callback_data: maxPage.toString()});

    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [keys]
        })
    };
}

bot.onText(/\/book/, function (msg) {
    bot.sendMessage(msg.chat.id, 'Page: 25', getPagination());
});

bot.on('callback_query', function ({message}) {
    var msg = message.message;
    var editOptions = Object.assign({}, getPagination(parseInt(message.data)), {
        chat_id: msg.chat.id,
        message_id: msg.message_id
    });
    bot.editMessageText('Page: ' + message.data, editOptions);
});