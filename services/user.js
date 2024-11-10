const { verifyTelegramWebAppData } = require("../helpers/verifyTelegram");
const Game = require("../models/wallet");
const User = require("../models/user");

const authenticateUser = async (initData) => {
  try {
    const isAuth = verifyTelegramWebAppData(initData);

    if (!isAuth) {
      throw new Error("Unauthorized. Access denied!");
    }

    const user = initData.user;
    console.log("User", user);
    const existingUser = await User.findOne({ username: user.username });

    if (existingUser) {
      return existingUser;
    } else {
      //   const newUser = await new User({
      //     username: user.username,
      //     first_name: user.first_name,
      //     last_name: user.last_name,
      //     is_bot: user.is_bot,
      //     telegram_id: user.id,
      //   });
      //   await newUser.save();
    }

    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { authenticateUser };
