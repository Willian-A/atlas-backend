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
app.use(cors());

app.get("/", function (req, res) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parametos:
// Query Params: request.query (Filstros, ordenação, paginação, ...)
// Route Params: request.params (identificar um recurso na alteração ou remoção)
// Body: request.body
app.listen(process.env.PORT || 3333);
console.log("alive", process.env.PORT);
