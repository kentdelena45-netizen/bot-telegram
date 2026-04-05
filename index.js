const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const token = '8458043093:AAHWcxPht0sSONOjTKz3MHktajulgl4AVuU';
const bot = new TelegramBot(token, { polling: true });

const OWNER_ID = 8420104044;
const CHANNEL_ID = "@ZEIJIEACCOUNTSHOP";

let shopStatus = 'closed';
const TIMEZONE = "Asia/Manila";

// ===== FUNCTIONS =====
function openShop() {
    shopStatus = 'open';

    console.log("SHOP OPEN TRIGGERED");

    bot.sendMessage(OWNER_ID, "🟢 Shop OPENED");
    bot.sendMessage(CHANNEL_ID, "🟢 SHOP IS NOW OPEN!\n\n🛒 Buy now!");
}

function closeShop() {
    shopStatus = 'closed';

    console.log("SHOP CLOSE TRIGGERED");

    bot.sendMessage(OWNER_ID, "🔴 Shop CLOSED");
    bot.sendMessage(CHANNEL_ID, "🔴 SHOP IS NOW CLOSED!\n\n⏰ Come back later!");
}

// ===== TEST COMMANDS =====
bot.onText(/\/testopen/, (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    openShop();
});

bot.onText(/\/testclose/, (msg) => {
    if (msg.from.id !== OWNER_ID) return;
    closeShop();
});

// ===== SCHEDULE =====

// MONDAY 1PM → 12MN
cron.schedule('0 13 * * 1', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 2', closeShop, { timezone: TIMEZONE });

// TUESDAY
cron.schedule('0 7 * * 2', openShop, { timezone: TIMEZONE });
cron.schedule('0 13 * * 2', closeShop, { timezone: TIMEZONE });
cron.schedule('0 19 * * 2', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 3', closeShop, { timezone: TIMEZONE });

// WEDNESDAY
cron.schedule('0 16 * * 3', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 4', closeShop, { timezone: TIMEZONE });

// THURSDAY
cron.schedule('0 19 * * 4', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 5', closeShop, { timezone: TIMEZONE });

// FRIDAY
cron.schedule('0 7 * * 5', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 6', closeShop, { timezone: TIMEZONE });

// SATURDAY
cron.schedule('0 7 * * 6', openShop, { timezone: TIMEZONE });
cron.schedule('0 10 * * 6', closeShop, { timezone: TIMEZONE });
cron.schedule('0 13 * * 6', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 0', closeShop, { timezone: TIMEZONE });

// SUNDAY
cron.schedule('0 7 * * 0', openShop, { timezone: TIMEZONE });
cron.schedule('0 0 * * 1', closeShop, { timezone: TIMEZONE });

// ===== MENU =====
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to ZEIJIE COD SHOP!", {
        reply_markup: {
            keyboard: [
                ["🛒 Buy Account"],
                ["📊 Check Status"]
            ],
            resize_keyboard: true
        }
    });
});

// ===== MAIN =====
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith('/')) return;

    // STATUS
    if (text === "📊 Check Status") {
        return bot.sendMessage(chatId,
            shopStatus === 'open'
                ? "🟢 Shop is OPEN!"
                : "🔴 Shop is CLOSED!"
        );
    }

    // BUY
    if (text === "🛒 Buy Account") {
        if (shopStatus === 'closed') {
            return bot.sendMessage(chatId, "🔴 Shop is CLOSED.");
        }

        bot.sendMessage(
            OWNER_ID,
            `🛒 NEW BUYER\nUser: @${msg.from.username || "No username"}\nID: ${msg.from.id}`
        );

        return bot.sendMessage(chatId, "✅ Admin will message you.");
    }
});
