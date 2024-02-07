const TelegramBot = require('node-telegram-bot-api')

// @qu17bot
// 5862280064:AAExgHvPth5KiPSfvIWVgcn73stR_1nuTRc

// @e84_bot
const token = '6716128964:AAEh-UqBmOpTJuiEsU7fzc-FfFrHDeBgvOg';
const bot = new TelegramBot(token, {polling: true});

/*bot.on('inline_query', (ctx) => {
    const inlineQueryId = ctx.id;
    const queryText = ctx.query;

    console.log('ctx: ', ctx);

    // Perform your search logic here
    const results = [
        {
            type: 'article',
            id: '1',
            title: 'Result 1',
            input_message_content: {
                message_text: 'This is the content of Result 1',
            },
        },
        {
            type: 'article',
            id: '2',
            title: 'Result 2',
            input_message_content: {
                message_text: 'This is the content of Result 2',
            },
        },
        // Add more results as needed
    ];

    bot.answerInlineQuery(inlineQueryId, results)
        .then(r => console.log('r: ', r));
});*/

/*
bot.on('inline_query', ctx => {
    let query = ctx.query;
    if (query.length > 3) {
        let results = [{
            id: 1,
            type: 'article',

            // type: 'video',
            // mime_type: "video/mp4",
            // video_url: "URL",

            title: "Title",
            description: "Description",
            thumb_url: "Thumb", // url
            input_message_content: {message_text: "[BOT]"}
        }];

        bot.answerInlineQuery(ctx.id, results, {cache_time: 0})
            .then(r => console.log('r: ', r));
    }
});*/

/*
bot.onText(/^\/start$/, poll)

function poll(msg) {
    const question = "Hello";
    const answers = ["Hey", "Hi", "Sup?"];

    const now = new Date();
    now.setSeconds(now.getSeconds() + 5);
    const timestamp = now.getTime();

    const opts = {
        //'allows_multiple_answers': true,
        correct_option_id: 1,
        is_anonymous: false,
        // close_date: timestamp,
        open_period: 5
    };

    bot.sendPoll(msg.chat.id, question, answers, opts)
        .then(r => console.log('r: ', r));
}

bot.onText('poll', (msg) => poll(msg));*/

bot.onText(/^\/text/, function (ctx, m) {
    console.log('ctx: ', ctx)
    console.log('m: ', m)
});

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

    bot.sendMessage(ctx.chat.id, 'Hello', {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Essential Words EN/UZ',
                    url: 'https://t.me/essentialwords_bot'
                }]
            ]
        }
    });
})