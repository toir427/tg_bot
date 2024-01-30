const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch');

// @zmp3bot
const token = '6782407164:AAF6aFQemOebJ_ejwv5uRY7iq18Y1wDUAPI';
const bot = new TelegramBot(token, {polling: true});

// In-memory store for items (you might want to use a database in a real application)
let items = [];
let userSessionId = [];

bot.request = async function (command, json) {
    return fetch(`https://api.telegram.org/bot${token}/${command}`, {
        method: 'post',
        body: JSON.stringify(json),
        headers: {'Content-Type': 'application/json'}
    });
}

bot.request('setMyCommands', {
    commands: [
        {command: '/add', description: 'Add Command'},
        {command: '/list', description: 'List Command'},
        {command: '/edit', description: 'Edit Command'},
        {command: '/delete', description: 'Delete Command'},
    ],
    scope: {"type": "all_private_chats"},
    language_code: "en"
}).then(r => console.log(r));

const add = ({chat: {id: chatId}}) => {
    bot.sendMessage(chatId, `Send me your item title: `);
}
const editKeyboard = (ops) => Object.assign({
    reply_markup: {
        inline_keyboard: items
            .map((item, index) => [{
                text: item.title,
                callback_data: `edit_${index}`
            }])
    }
}, ops)

// Handle Telegram commands
bot.onText(/\/start/, (ctx) => {
    const {chat: {id: chatId}, from: {first_name}} = ctx;

    bot.sendMessage(chatId, `Hello ${first_name}.`);

    add(ctx)
});

bot.onText(/\/add/, add);

bot.onText(/\/list/, ({chat: {id: chatId}}) => {
    const titles = items.map((v, i) => `${i}: ${v.title}`);
    bot.sendMessage(chatId, titles.length ? titles.join("\n") : 'not anything. /add')
        .then(r => console.log(r));
});

bot.onText(/\/edit/, ({chat: {id: chatId}}) => {
    bot.sendMessage(chatId, 'Choose an item to edit: ', editKeyboard)
        .then(r => console.log(r));
});

// Handle inline keyboard callbacks
bot.on('callback_query', (query) => {
    bot.answerCallbackQuery(query.id);

    const userSessionId = parseInt(query.data.split('_')[1], 10);
    const itemToEdit = items[userSessionId].title;
    // save (session) item id to redis or session
    // it will be saved when you receive sent text

    bot.sendMessage(query.message.chat.id, `Send new title for "${itemToEdit}".`)
        .then(r => {
            console.log('qu: ', query);
            console.log('q: ', r);
        });
});

bot.on('message', (ctx, {type}) => {
    const {chat: {id: chatId}, text} = ctx;
    console.log('ctx: ', ctx)
    console.log('s: ', s)

    // /edit error
    if (!text.startsWith('/')) {
        let message = '';
        if (userSessionId != null && items[userSessionId] != null) {
            items[userSessionId].title = text;
            message = `Item "${text}" successfully updated.`;
        } else {
            items.push({title: text});
            message = `Item "${text}" successfully saved.`;
        }

        bot.sendMessage(chatId, message)
            .then(r => console.log(r));
    }

});