const mongoose = require('mongoose');
require("dotenv").config();

const connectWithDB = () => {
    
  mongoose.connect("mongodb+srv://Paul:y9DSqyzD8uiQ9n8g@node-class.iz8y6zp.mongodb.net/TonYield", {
  })
    .then(() => {

      console.log('DB connected ✨✨');
    })
    .catch((error) => {
      console.log('DB Error ❌');
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectWithDB;
