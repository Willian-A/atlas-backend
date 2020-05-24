const express = require("express");
const routes = require("./routes");
const cors = require("cors");
var cookieParser = require("cookie-parser");

var app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:2000", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(routes);

// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parametos:
// Query Params: request.query (Filstros, ordenação, paginação, ...)
// Route Params: request.params (identificar um recurso na alteração ou remoção)
// Body: request.body

// MongoDB (Não-relacional)

app.listen(process.env.PORT || 3333);
console.log("Listening: 3333");
