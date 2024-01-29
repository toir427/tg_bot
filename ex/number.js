const TelegramBot = require('node-telegram-bot-api');

// @urdlbot
const token = '5697465520:AAFWmw0LwneobGz5LjqQLJKLrsJrrhkj0-w';
const bot = new TelegramBot(token, {polling: true});
// const yt = require('./yt');  // Provides easy access to YouTube API

/*bot.onText(/\/start/, (ctx) => {
    const {
        chat: {
            id: chatId
        }
    } = ctx;

    bot.sendMessage(chatId, 'Please share your contact information:', {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'Share Contact',
                        request_contact: true,
                    },
                ],
            ],
            resize_keyboard: true,
        },
    }).then(r => console.log(r));
});

bot.on('contact', (ctx) => {
    const {
        chat: {
            id: chatId
        }, contact: {
            phone_number: phoneNumber
        }
    } = ctx;

    bot.sendMessage(chatId, `Thank you for sharing your contact! Phone number: ${phoneNumber}`, {
        reply_markup: {
            remove_keyboard: true
        }
    }).then(r => console.log(r));
});*/

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

/*bot.on('inline_query', (msg) => {
    let query = encodeURIComponent(msg.query.trim());
    bot.answerInlineQuery(msg.id, [{
        type: 'article',
        id: query + '_google',
        title: 'Google',
        input_message_content: {
            message_text: 'https://www.google.com/search?q=' + query,
        }
    },
        {
            type: 'article',
            id: query + '_bing',
            title: 'Bing',
            input_message_content: {
                message_text: 'https://www.bing.com/search?q=' + query,
            }
        },
        {
            type: 'article',
            id: query + '_yahoo',
            title: 'Yahoo',
            input_message_content: {
                message_text: 'https://search.yahoo.com/search?q=' + query,
            }
        }]);
});*/

/*bot.on('inline_query', ctx => {
    let query = ctx.query;
    if (query.length > 3) {
        yt.getIdFromNickname(query)
            .then(channel_id => {
                yt.fetchChannelUploads(channel_id)
                    .then(structured_data => {
                        yt.parseListVideos(structured_data)
                            .then(video_info => {
                                let arr = [];
                                console.log('video_info: ', video_info)
                                for (let k in video_info) {
                                    arr[k] = {
                                        id: k,
                                        type: 'article',

                                        //type: 'video',
                                        //mime_type: "video/mp4",
                                        //video_url: video_info[k].url,
                                        //thumb_url: video_info[k].thumb,

                                        title: video_info[k].title,
                                        description: video_info[k].description,
                                        input_message_content: {message_text: "[BOT] " + video_info[k].url}
                                    };
                                }

                                bot.answerInlineQuery(ctx.id, arr, {cache_time: 0})
                                    .then(r => console.log('r: ', r));

                            }).catch(error => {
                            console.log("Error List Videos Promise: " + error)
                        });
                    }).catch(error => {
                    console.log("Error Channel Uploads Promise: " + error)
                });
            }).catch(error => {
            console.log("Error Get Id Nickname Promise: " + error)
        });
    }
});*/


bot.on('message', (msg) => {
    console.log(msg.text)
    const reg = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/;
    const m = reg.exec(msg.text);
    const text = (m ? "YT: " + 'youtu.be/'+m[1] : "Hello " + msg.text);
    bot.sendMessage(msg.chat.id, text);
});

