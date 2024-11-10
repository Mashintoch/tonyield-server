const { verifyTelegramWebAppData } = require("../helpers/verifyTelegram");
const Game = require("../models/wallet");
const User = require("../models/user");

const authenticateUser = async (initData, user) => {
  try {
    console.log("Verifying user...");

    // Verify the initData
    const isAuth = verifyTelegramWebAppData(initData);
    if (!isAuth) {
      throw new Error("Unauthorized. Access denied!");
    }

    console.log("Init User data:", initData);
    console.log("User data:", user);

    // Find or create user
    let existingUser = await User.findOne({ telegram_id: user.id });

    if (existingUser) {
      console.log("Existing user found");
      return existingUser;
    } else {
      console.log("Creating new user");
      const newUser = new User({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name || "",
        is_bot: user.is_bot || false,
        telegram_id: user.id,
        language_code: user.language_code,
      });
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error(error.message);
  }
};

module.exports = { authenticateUser };
