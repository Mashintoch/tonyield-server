const crypto = require('crypto');
const { mnemonicNew } = require("@ton/crypto");

const generateMnemonic = async  ()  => {
    try {
        const mnemonic = await mnemonicNew();
        console.log("Your new mnemonic (save these words securely):");
        console.log(mnemonic.join(" "));
    } catch (error) {
        console.error("Error generating mnemonic:", error);
    }
}


const verifyTelegramWebAppData = (telegramInitData) => {
    try {
        // Get your bot token from environment variables
        const botToken = process.env.BOT_TOKEN;
        if (!botToken) {
            throw new Error('BOT_TOKEN environment variable is required');
        }

        // Parse the incoming data
        const initData = new URLSearchParams(telegramInitData);
        
        // Get the hash to verify
        const hash = initData.get('hash');
        if (!hash) {
            throw new Error('Hash not found in init data');
        }

        // Remove hash from the data before checking the signature
        initData.delete('hash');
        
        // Collect remaining parameters for verification
        const dataCheckArr = Array.from(initData.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`);
            
        const dataCheckString = dataCheckArr.join('\n');

        // Create HMAC-SHA256 signature
        const secret = crypto
            .createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();
            
        const signature = crypto
            .createHmac('sha256', secret)
            .update(dataCheckString)
            .digest('hex');

        // Compare the signature with the hash from init data
        return signature === hash;
    } catch (error) {
        console.error('Telegram WebApp verification failed:', error);
        return false;
    }
};





module.exports = { verifyTelegramWebAppData, generateMnemonic };