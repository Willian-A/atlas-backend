require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send("Servidor Backend");
});
app.use(userRoute);
app.use(productRoute);
app.use(cartRoute);

app.listen(process.env.PORT || 3333);

console.log(`Server at: ${process.env.PORT}`);
