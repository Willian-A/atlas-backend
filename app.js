const dotenv = require("dotenv");
dotenv.config();
const { Router } = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");

const app = express();

app.use(express.static("public"));

app.get("/hello", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send("Hello World");
});

const options = {
  key: fs.readFileSync("./cert/selfsigned.key", "utf8"),
  cert: fs.readFileSync("./cert/selfsigned.crt", "utf8"),
};
const credentials = { key: options.key, cert: options.cert };
// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parametos:
// Query Params: request.query (Filstros, ordenação, paginação, ...)
// Route Params: request.params (identificar um recurso na alteração ou remoção)
// Body: request.body
https.createServer(credentials, app).listen(3333, () => {
  console.log("alive");
});
