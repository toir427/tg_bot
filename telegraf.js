import express from "express";
import { Telegraf } from "telegraf";

const port = Number(process.env.PORT) || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Set the bot API endpoint
app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN }));

bot.on("text", ctx => ctx.reply("Hello"));

app.listen(port, () => console.log("Listening on port", port));