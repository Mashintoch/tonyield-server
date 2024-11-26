const UserService = require("../services/user");
const response = require("../helpers/responseHelper");

const authenticateUser = async (req, res) => {
  try {
    const { initData, invite_code } = req.body;
    const user = await UserService.authenticateUser(initData, invite_code);
    return response(res, 200, "User retrieved", user);
  } catch (error) {
    return response(res, 500, "Error Authenticating User", error.message);
  }
};

const getInviteLink = async (req, res) => {
  try {
    const { initData } = req.body;
    const user = await UserService.getInviteLink(initData);
    return response(res, 200, "User Invite Link retrieved", user);
  } catch (error) {
    return response(res, 500, "Error retrieving Invite link", error.message);
  }
};

const getInviteQRCode = async (req, res) => {
  try {
    const { initData } = req.body;
    const user = await UserService.getInviteQRCode(initData);
    return response(res, 200, "User Invite QRCode retrieved", user);
  } catch (error) {
    return response(res, 500, "QR Code generation error", error.message);
  }
};

module.exports = {
  authenticateUser,
  getInviteLink,
  getInviteQRCode,
};
