const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["https://localhost:3000", "https://frontend-tcc.vercel.app"],
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

consign()
  .include("./app/routes")
  .then("config/dbConnection.js")
  .then("app/models")
  .then("app/controllers")
  .into(app);

module.exports = app;
