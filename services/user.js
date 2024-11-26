const QRCode = require("qrcode");

const { verifyTelegramWebAppData } = require("../helpers/verifyTelegram");
const User = require("../models/user");
const Game = require("../models/game");
const Invite = require("../models/invite");

const authenticateUser = async (initData, invite_code) => {
  try {
    const isAuth = verifyTelegramWebAppData(initData);
    if (!isAuth) {
      throw new Error("Unauthorized. Access denied!");
    }
    const user = initData.user;

    // Find or create user
    let existingUser = await User.findOne({ telegram_id: user.id });
    if (existingUser) {
      return existingUser;
    } else {
      const referrer = await User.findOne({ invite_code });

      const newUser = new User({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name || "",
        avatar_url: user.photo_url,
        is_bot: user.is_bot || false,
        telegram_id: user.id,
        language_code: user.language_code,
        referred_by: referrer ? referrer._id : null,
      });

      if (referrer) {
        const invite = new Invite({
          referrer: referrer._id,
          referred_user: newUser._id,
          invite_code,
          status: "completed",
        });

        await invite.save();

        await User.findByIdAndUpdate(referrer._id, {
          $inc: { total_referrals: 1 },
        });
      }

      const exsitingGame = await Game.findOne({ user: newUser.id });
      if (!exsitingGame) {
        const newGame = new Game({ user: newUser.id });
        newUser.game = newGame.id;
        await newGame.save();
      }

      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error(error.message);
  }
};

const getInviteLink = async (initData) => {
  try {
    const isAuth = verifyTelegramWebAppData(initData);
    if (!isAuth) {
      throw new Error("Unauthorized. Access denied!");
    }
    const userId = initData.user;
    const user = await User.findOne({ telegram_id: userId.id });

    if (!user) {
      throw new Error("User not found");
    }

    const inviteLink = `https://t.me/blockvaulttrade_bot?invite/${user.invite_code}`;
    const totalReferrals = await Invite.countDocuments({
      referrer: user.id,
      status: "completed",
    });

    return {
      inviteLink,
      totalReferrals,
    };
  } catch (error) {
    console.error("Error Getting Invite Link:", error);
    throw new Error(error.message);
  }
};

const getInviteQRCode = async (initData) => {
  try {
    const isAuth = verifyTelegramWebAppData(initData);
    if (!isAuth) {
      throw new Error("Unauthorized. Access denied!");
    }
    const userId = initData.user;
    const user = await User.findOne({ telegram_id: userId.id });

    if (!user) {
      throw new Error("User not found");
    }

    const inviteLink = `https://t.me/blockvaulttrade_bot?invite/${user.invite_code}`;
    const qrCodeDataUrl = await QRCode.toDataURL(inviteLink, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return {
      qrCode: qrCodeDataUrl,
      inviteLink,
    };
  } catch (error) {
    throw new Error(error.message || "QR Code generation error");
  }
};

module.exports = { authenticateUser, getInviteLink, getInviteQRCode };
