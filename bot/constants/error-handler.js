const errorMiddleware = (err, ctx) => {
  console.error(`Error while handling update ${ctx.update.update_id}:`, err);
};

module.exports = { errorMiddleware };
