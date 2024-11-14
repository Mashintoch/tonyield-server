require("dotenv").config();

const config = {
    mongodb: {
      url: process.env.MONGODB_URI
    },
    telegram: {
      webhookUrl: process.env.WEBHOOK_URL,
      token: process.env.BOT_TOKEN,
    },
    app: {
      defaultLanguage: 'en',
    }
};
  
module.exports = config;