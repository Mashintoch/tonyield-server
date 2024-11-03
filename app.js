require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectWithDB = require("./database/config");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "500mb" }));

app.use(routes);

connectWithDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
