const MESSAGES = require ("./messages");
const { ASSETS } = require("./assets");
const { createHomeKeyboard } = require("./home.keyboards");

const homeHandler = async (ctx) => {
  await ctx.replyWithPhoto(ASSETS.welcomeImage, {
    caption: MESSAGES.welcome,
    parse_mode: "Markdown",
    reply_markup: createHomeKeyboard(),
  });
};

module.exports = homeHandler;