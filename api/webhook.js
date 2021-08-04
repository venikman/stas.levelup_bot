// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = "test";


const TelegramBot = require("node-telegram-bot-api");

module.exports = async (request, response) => {
  try {
    const bot = new TelegramBot(process.env.BOT_TOKEN);
    // bot.setWebHook(`${process.env.VERCEL_URL}/bot${process.env.BOT_TOKEN}`);
    const { body } = request;
    if (body.message) {
      const { chat: { id }, text, from: {first_name, username} } = body.message;
      if (text === "/start") {
        await bot.sendMessage(id, "Привет, чем я могу помочь?", {
          reply_markup: {
            keyboard: [
              [
                { text: "Скачать гайд" },
              ],
              [
                { text: "Запись на бесплатную консультацию" },
              ],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        await bot.sendMessage(process.env.ADMIN_CHAT, `@${username} ${first_name} нажал ${text}`)
      } else if (text === "Скачать гайд") {
        await bot.sendMessage(id, "Жми на кнопку и качай гайд!", {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "Получить гайд",
                url:
                  "https://drive.google.com/file/d/1q7Qwqx7sUVTufWKorSnJpCpmijzv05MN/view?usp=sharing",
              }],
            ],
          },
        });
        await bot.sendMessage(process.env.ADMIN_CHAT, `@${username} ${first_name} нажал ${text}`)
      } else if (text === "Запись на бесплатную консультацию") {
        await bot.sendMessage(
          id,
          "Бесплатная консультация длится 15-20 минут. В течении этого времени вы сможете пообщаться со Стасом: понять, нужна ли вам консультация или менторский курс, является ли Стас нужным для этого человеком, может ли он вам дать то, что вы хотите и помочь в вашем вопросе.",
          {
            reply_markup: {
              inline_keyboard: [
                [{
                  text: "Записаться",
                  url: "https://calendly.com/nedbailov/15min",
                }],
              ],
            },
          },
        );
        await bot.sendMessage(process.env.ADMIN_CHAT, `@${username} ${first_name} нажал ${text}`)
      } else {
        const message =
          `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;

        await bot.sendMessage(id, message, { parse_mode: "Markdown" });
      }

    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  response.send("OK");
};
