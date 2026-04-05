const TelegramBot = require('node-telegram-bot-api');

//  PUT YOUR TOKEN
const token = '8458043093:AAHWcxPht0sSONOjTKz3MHktajulgl4AVuU';

const bot = new TelegramBot(token, { polling: true });

//  YOUR TELEGRAM ID
const OWNER_ID = 8420104044;

//  /  Shop Status
let shopStatus = 'closed';

// START MENU
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to ZEIJIE COD SHOP!", {
        reply_markup: {
            keyboard: [
                [" Buy Account"],
                [" Check Status"]
            ],
            resize_keyboard: true
        }
    });
});

//  OPEN SHOP
bot.onText(/\/open/, (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    shopStatus = 'open';
    bot.sendMessage(msg.chat.id, " Shop is now OPEN!");
});

//  CLOSE SHOP
bot.onText(/\/close/, (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    shopStatus = 'closed';
    bot.sendMessage(msg.chat.id, " Shop is now CLOSED!");
});

// MAIN HANDLER
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // ignore commands
    if (!text || text.startsWith('/')) return;

    //  STATUS
    if (text === " Check Status") {
        if (shopStatus === 'open') {
            return bot.sendMessage(chatId, " Shop is OPEN!");
        } else {
            return bot.sendMessage(chatId, " Shop is CLOSED!");
        }
    }

    //  BUY (INSTANT ORDER)
    if (text === " Buy Account") {
        if (shopStatus === 'closed') {
            return bot.sendMessage(chatId, " Shop is CLOSED. Try later.");
        }

        // send order directly to owner
        bot.sendMessage(
            OWNER_ID,
            ` NEW COD BUYER\n\nUser: @${msg.from.username || "No username"}\nID: ${msg.from.id}`
        );

        return bot.sendMessage(
            chatId,
            " Request sent! Admin will message you."
        );
    }
});