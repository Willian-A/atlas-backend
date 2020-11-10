const dotenv = require("dotenv");
dotenv.config();

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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  app.use(cors());
  next();
});

const options = {
  key: fs.readFileSync("./cert/selfsigned.key", "utf8"),
  cert: fs.readFileSync("./cert/selfsigned.crt", "utf8"),
};
const credentials = { key: options.key, cert: options.cert };

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(userRoute);
app.use(productRoute);
app.use(cartRoute);

// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parametos:
// Query Params: request.query (Filstros, ordenação, paginação, ...)
// Route Params: request.params (identificar um recurso na alteração ou remoção)
// Body: request.body
http.createServer(app).listen(8080);
https.createServer(credentials, app).listen(process.env.PORT || 3333);
console.log(`Listening: ${process.env.PORT}`);
