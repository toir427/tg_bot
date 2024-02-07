const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const fs = require("node:fs");
require("dotenv").config();

const User = require("./models/User.js");
let mongoConnection = true;
mongoose
    .connect(process.env.QU17_MONGODB_URL)
    .catch(error => {
        mongoConnection = false;
        console.log(error)
    });

function saveUser(user) {
    let info = [];
    info.push(`First Name: [${user.first_name}](tg://user?id=${user.id})`);
    info.push(`Last Name: ${user.last_name ?? ''}`);
    info.push(`Username: ${user.username ?? ''}`);
    info.push(`Chat: ${user.chat_id}`);
    info.push(`ID: ${user.id}`);

    bot.sendMessage(process.env.CHANNEL_USERNAME, info.join("\n"), {
        parse_mode: 'MarkdownV2'
    }).then(r => console.log(r));

    User.findOne({id: user.id, chat_id: user.chat_id})
        .then(doc => {
            if (doc === null) {
                User.create(user).then(usr => {
                    console.log('usr: ', usr)
                })
            } else {
                console.log('user already exist')
            }
        });
}

const jsonPath = './ess/ex/essential_words.json';
const questions = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const randQuestion = (questions) => questions[Math.floor(Math.random() * questions.length)];
const singles = () => questions.filter(question => question.type === 'single_choice');

const bot = new TelegramBot(process.env.QU17_BOT_TOKEN, {polling: true});
bot.on("polling_error", console.log)

let messageId = 0;
let count = 0;
let notAnswered = 0;
let timer = null;
let quizArr = [];
let resultArr = [];
const limit = 10;
const duration = 15;

bot.on('message', async function (ctx) { // when forward message json
    console.log('msg: ', ctx.text)

    if (ctx.text.startsWith('{')) {
        const data = JSON.parse(ctx.text);
        if (typeof data === 'object') {
            saveUser({
                id: data.from.id,
                is_bot: data.from.is_bot,
                first_name: data.from.first_name,
                last_name: data.from?.last_name,
                username: data.from?.username,
                language_code: data.from.language_code,
                chat_id: data.chat.id,
                chat_type: data.chat.type,
                command: data.text,
                date: data.date
            })
        }
    }
})

bot.onText(/^\/start$/, ctx => {
    console.log(ctx)

    bot.setMyCommands([
        {command: 'start', description: 'Menu'},
        {command: 'quiz', description: 'Quiz'},
    ], {
        scope: {"type": "chat", chat_id: ctx.chat.id},
        language_code: "en"
    })

    messageId = ctx.message_id
    //quiz(ctx.chat.id)
});
bot.onText(/^\/quiz$/, ctx => {
    messageId = ctx.message_id
    quiz(ctx.chat.id)
});

bot.on('poll', ctx => console.log('poll: ', ctx));

bot.on('poll_answer', ctx => {
    const {
        poll_id: pollId,
        user: {id: userId},
        option_ids: optionIds
    } = ctx;
    clearTimeout(timer);
    count++;

    console.log('pa: ', ctx)

    if (pollId != null && optionIds != null) {
        resultArr[userId] = resultArr[userId] || [];
        resultArr[userId].push({
            poll_id: pollId,
            answer: optionIds[0]
        });
    }

    quiz(userId)
});

bot.on('callback_query', ctx => {

    bot.answerCallbackQuery(ctx.id)
    console.log('cq: ', ctx)

    if (ctx.data === 'pc_yes') {
        notAnswered = 0;
        messageId = ctx.message.message_id
        quiz(ctx.message.chat.id);
    }

    if (ctx.data === 'pc_no') {
        count = 0;
        notAnswered = 0;
        quizArr = [];
        resultArr = [];

        bot.editMessageText('Ok. Call me later 😊', {
            message_id: ctx.message.message_id,
            chat_id: ctx.message.chat.id,
        })
    }

})

function quiz(chatId) {

    if (notAnswered > 0) {
        bot.sendMessage(chatId, "Shall we continue?", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            "text": "Yes",
                            "callback_data": "pc_yes" // pc - poll continue
                        },
                        {
                            "text": "No",
                            "callback_data": "pc_no"
                        }
                    ]
                ]
            }
        });
    } else {
        if (count >= limit) {
            let score = 0;
            for (let q of quizArr[chatId]) {
                for (const r of resultArr[chatId]) {
                    if (q.poll_id === r.poll_id && q.answer === r.answer) {
                        score++;
                    }
                }
            }

            bot.sendMessage(chatId, `Result: ${score} - ${count}\n\nPlay again /quiz`)
                .then(r => {
                    console.log('f: ', r)

                    count = 0;
                    timer = null;
                    quizArr = [];
                    resultArr = [];
                });
        } else {
            const rand = randQuestion(singles())

            bot.sendPoll(chatId, `(${count + 1}/${limit}) ${rand.question}`, rand.options, {
                allows_multiple_answers: false,
                correct_option_id: rand.correct,
                is_anonymous: false,
                open_period: duration,
                type: 'quiz'
            }).then(r => {
                console.log('r: ', r)
                quizArr[r.chat.id] = quizArr[r.chat.id] || [];
                quizArr[r.chat.id].push({
                    poll_id: r.poll.id,
                    answer: r.poll.correct_option_id
                });
                resultArr[r.chat.id] = resultArr[r.chat.id] || [];
                resultArr[r.chat.id].push({
                    poll_id: r.poll.id,
                    answer: null
                });

                timer = setTimeout(() => {
                    count++;
                    notAnswered++;

                    messageId = r.message_id;
                    quiz(r.chat.id);
                }, (duration + 1) * 1000);
            });
        }
    }
}
