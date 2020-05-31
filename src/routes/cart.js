const { Router } = require("express");
const routes = Router();
const bcrypt = require("bcryptjs");

const cart = require("../controllers/cart.js");

routes.get(
  "/cart",
  (request, response, next) => {
    if (
      request.cookies.profile == "" ||
      request.cookies.profile == null ||
      !bcrypt.compareSync("logged", request.cookies.profile["status"])
    ) {
      return response.status(400).send("Inválido");
    } else {
      next();
    }
  },
  cart.getCart
);

routes.post("/addCart", cart.addIntoCart);

module.exports = routes;
