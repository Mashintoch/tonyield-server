const express = require("express");
const gameRoutes = require("./game");
const userRoutes = require("./user");

const app = express();
app.use(express.json());

app.use("/game", gameRoutes);
app.use("/auth", userRoutes);

module.exports = app;
