 const handleProofOfPayment = async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Please provide your proof of payment.");
};

 const handleDocs = async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "You can access the documentation here: https://www.google.com"
  );
};

 const handleNews = async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "Stay updated with the latest news here: https://www.google.com"
  );
};

 const handleChat = async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Join the chat community here: https://www.google.com");
};

module.exports = {
    handleProofOfPayment,
    handleDocs,
    handleNews,
    handleChat,
}
