import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

// @qumebot
const token = '6624341730:AAHjTjgUiuoiQgDfheney6Ays3NUdD4NXu4';
const bot = new TelegramBot(token, {polling: true});

bot.request = async function (command, json) {
    return fetch(`https://api.telegram.org/bot${token}/${command}`, {
        method: 'post',
        body: JSON.stringify(json),
        headers: {'Content-Type': 'application/json'}
    });
}
bot.request('setMyCommands', {
    commands: [
        {command: '/start', description: 'Start Command'},
        {command: '/quiz', description: 'Quiz Command'},
    ],
    scope: {"type": "all_private_chats"},
    language_code: "en"
})

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

bot.on('inline_query', async ctx => {
    let query = ctx.query;
    let results = [];
    if (query.length >= 2) {
        for (let i = 1; i < 10; i++) {
            results.push({
                id: i,
                type: 'article',
                title: `Title ${i}`,
                description: `Description ${i}`,
                input_message_content: {
                    //parse_mode: 'html',
                    message_text: `[BOT] ${i}`,
                    link_preview_options: {
                        show_above_text: false,
                        prefer_small_media: false,
                        prefer_large_media: false,
                    }
                }

                // type: 'video',
                // mime_type: "video/mp4",
                // video_url: "URL",
                //thumb_url: "Thumb", // url

            });
        }

        await bot.answerInlineQuery(ctx.id, results, {cache_time: 0});
    }
});

bot.onText(/^\/start$/, async function (ctx, m) {
    await bot.sendMessage(ctx.chat.id, 'Type @qumebot [your word]\n\nin your friends chat');
})
