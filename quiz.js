import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import * as fs from "fs";

// @qumebot
const token = '6624341730:AAHjTjgUiuoiQgDfheney6Ays3NUdD4NXu4';
const bot = new TelegramBot(token, {polling: true});
bot.on("polling_error", console.log)

const jsonPath = "./ess/ex/essential_words.json";
const questions = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const randQuestion = (questions) => questions[Math.floor(Math.random() * questions.length)];
const singles = () => questions.filter(question => question.type === 'single_choice');

let quizArr = [];
let result = [];

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
})//.then(r => console.log('c: ', r));

bot.onText(/^\/start$/, ({from: {id: userId}}) => quiz(userId));
bot.onText(/^\/quiz$/, ({from: {id: userId}}) => quiz(userId));

bot.on('poll', ctx => {
    console.log('poll: ', ctx)
});

bot.on('poll_answer', ctx => {
    const {
        poll_id: pollId,
        user: {id: userId},
        option_ids: optionIds
    } = ctx;

    if (pollId != null && optionIds != null) {
        result.push({
            user_id: userId,
            poll_id: pollId,
            answer: optionIds[0]
        });
    }

    quizArr.length > 20 || quiz(userId)
});

function quiz(chatId) {
    console.log('quizArr: ', quizArr)

    const rand = randQuestion(singles())
    console.log('rand: ', rand)

    bot.sendPoll(chatId, rand.question, rand.options, {
        'allows_multiple_answers': false,
        correct_option_id: rand.correct,
        is_anonymous: false,
        open_period: 20,
        type: 'quiz'
    }).then(r => {
        quizArr[r.poll.id] = r.poll;

    });
}