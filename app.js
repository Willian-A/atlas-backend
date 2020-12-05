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

app.get("/", async (req, res) => {
  res.sendStatus("Servidor Backend");
});
app.use(userRoute);
app.use(productRoute);
app.use(cartRoute);

app.listen(3333);
