require("module-alias/register");
require("reflect-metadata");
require("source-map-support/register");

const { Bot } = require("grammy");
const { run } = require("@grammyjs/runner");
const config = require("./config/config");
const { COMMANDS } = require("./constants/commands");
const homeHandler = require("./constants/home.commands");
const {
  handleProofOfPayment,
  handleDocs,
  handleNews,
  handleChat,
} = require("./config/callbacks");
const { errorMiddleware } = require("./constants/error-handler");

class ToneyBot {
  constructor() {
    this.bot = new Bot(config.telegram.token);
  }

  setupCommandHandlers() {
    this.bot.command("start", homeHandler);
  }

  setupCallbackQueryHandlers() {
    this.bot.callbackQuery("proof_of_payment", handleProofOfPayment);
    this.bot.callbackQuery("docs", handleDocs);
    this.bot.callbackQuery("news", handleNews);
    this.bot.callbackQuery("chat", handleChat);
  }

  async setupCommands() {
    await this.bot.api.setMyCommands(COMMANDS);
  }

  async start() {
    console.log("Starting bot... 🔍");

    this.setupCommandHandlers();
    this.setupCallbackQueryHandlers();
    await this.setupCommands();

    this.bot.catch(errorMiddleware);

    await this.bot.init();
    run(this.bot);

    console.info(`Bot ${this.bot.botInfo.username} is up and running ✅`);
  }
}

module.exports = ToneyBot;
