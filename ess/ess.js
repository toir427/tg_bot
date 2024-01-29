import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import * as fs from "fs";

const jsonPath = "./ess/ex/essential_words.json";
const questions = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const randQuestion = (questions) => questions[Math.floor(Math.random() * questions.length)];
const singles = () => questions.filter(question => question.type === 'single_choice');

// @qumebot
const token = '6624341730:AAHjTjgUiuoiQgDfheney6Ays3NUdD4NXu4';
const bot = new TelegramBot(token, {polling: true});
let chatId = 0;

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
});//.then(r => console.log(r));

bot.onText(/^\/start$/, poll);
bot.onText(/^\/quiz$/, poll);
let counter = 0;

function poll(ctx) {
    const rand = randQuestion(singles())
    console.log('rand: ', rand);

    chatId = ctx.chat.id;
    bot.sendPoll(chatId, rand.question, rand.options, {
        'allows_multiple_answers': false,
        correct_option_id: rand.correct,
        is_anonymous: false,
        open_period: 20
    }).then(r => counter <= 20 || poll(r));
}