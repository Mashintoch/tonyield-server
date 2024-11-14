'use strict';
require("dotenv").config();
require('module-alias/register');
require('reflect-metadata');
require('source-map-support/register');

const express = require("express");
const cors = require("cors");

const connectWithDB = require("./database/config");
const routes = require("./routes");
const ToneyBot = require('./bot');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "500mb" }));

app.use("/api", routes);

async function bootstrap() {
  const bot = new ToneyBot();
  await bot.start();
}

void bootstrap();

connectWithDB();
app.listen(port, () => {
  console.log(`Server running on port ${port} 💡`);
});
