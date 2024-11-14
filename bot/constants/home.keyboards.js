const { InlineKeyboard } = require('grammy');

const createHomeKeyboard = () => {
  return new InlineKeyboard()
    .webApp('🔥 Start App! 🔥', 'https://tonyield.vercel.app/')
    .row()
    .text('Proof-of-Payment', 'proof_of_payment')
    .row()
    .url('Docs', 'https://www.google.com')
    .row()
    .url('News', 'https://www.google.com')
    .url('Chat', 'https://www.google.com');
};

module.exports = {
    createHomeKeyboard
}