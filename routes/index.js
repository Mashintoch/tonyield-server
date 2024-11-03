const express = require("express");
const gameRoutes = require("./game");

const app = express();
app.use(express.json());

app.use("/game", gameRoutes);

module.exports = app;
