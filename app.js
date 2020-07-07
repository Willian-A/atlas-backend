const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(userRoute);
app.use(productRoute);
app.use(cartRoute);

// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parametos:
// Query Params: request.query (Filstros, ordenação, paginação, ...)
// Route Params: request.params (identificar um recurso na alteração ou remoção)
// Body: request.body

app.listen(process.env.PORT || 3333);
console.log(`Listening: ${process.env.PORT}`);
