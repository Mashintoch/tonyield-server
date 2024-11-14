const crypto = require('crypto');
const configs = require("../configs/env")

const verifyTelegramWebAppData = (initDataObj) => {
  try {
    const botToken = configs.telegram.token;
    if (!botToken) {
      throw new Error('TOKEN environment variable is required');
    }

    // Extract the hash
    const { hash, ...data } = initDataObj;
    if (!hash) {
      throw new Error('Hash not found in init data');
    }

    // Convert user object to string
    if (data.user) {
      data.user = JSON.stringify(data.user);
    }

    // Create the data check string
    const dataCheckString = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('\n');

    // Generate the secret key
    const secretKey = crypto
      .createHash('sha256')
      .update(botToken)
      .digest();

    // Create the HMAC signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return signature
  } catch (error) {
    console.error('Telegram WebApp verification failed:', error);
    return false;
  }
};

module.exports = { verifyTelegramWebAppData };