const mongoose = require("mongoose");
const config = require("../configs/env");

const connectWithDB = () => {
  mongoose
    .connect(config.mongodb.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected ✨✨");
    })
    .catch((error) => {
      console.log("DB Error ❌", error);
    });
};

module.exports = connectWithDB;
