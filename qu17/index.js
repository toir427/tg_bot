import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import {config} from "dotenv";
import fs from "node:fs";

config()
const jsonPath = './ess/ex/essential_words.json';
const questions = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const randQuestion = (questions) => questions[Math.floor(Math.random() * questions.length)];
const singles = () => questions.filter(question => question.type === 'single_choice');

const token = process.env.QU17_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
bot.on("polling_error", console.log)

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
}).then(r => console.log('c: ', r));

let count = 0;
let timer = null;
let quizArr = [];
let resultArr = [];
const limit = 10;
const duration = 15;

bot.onText(/^\/start$/, (ctx) => quiz(ctx.chat.id));
bot.onText(/^\/quiz$/, (ctx) => quiz(ctx.chat.id));

bot.on('poll', ctx => {
    console.log('poll: ', ctx)
});

bot.on('poll_answer', ctx => {
    const {
        poll_id: pollId,
        user: {id: userId},
        option_ids: optionIds
    } = ctx;
    clearTimeout(timer);
    count++;

    if (pollId != null && optionIds != null) {
        resultArr[userId] = resultArr[userId] || [];
        resultArr[userId].push({
            poll_id: pollId,
            answer: optionIds[0]
        });
    }

    quiz(userId)
});

function quiz(chatId) {
    if (count >= limit) {
        let score = 0;
        for (let q of quizArr[chatId]) {
            for (const r of resultArr[chatId]) {
                if (q.poll_id === r.poll_id && q.answer === r.answer) {
                    score++;
                }
            }
        }

        bot.sendMessage(chatId, `Result: ${count} - ${score}\n\nPlay again /quiz`)
            .then(r => {
                console.log(r)

                count = 0;
                timer = null;
                quizArr = [];
                resultArr = [];
            });
    } else {
        const rand = randQuestion(singles())

        bot.sendPoll(chatId, `(${count + 1}) ${rand.question}`, rand.options, {
            'allows_multiple_answers': false,
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
                quiz(r.chat.id);
            }, (duration + 1) * 1000);
        });
    }
}
