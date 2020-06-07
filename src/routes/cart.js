const { Router } = require("express");
const routes = Router();

const filters = require("../services/filters.js");
const cart = require("../controllers/cart.js");

routes.get(
  "/cart",
  (request, response, next) => {
    if (filters.checkLogin(request)) {
      return response.status(409).send("Você Não Está Logado");
    } else {
      next();
    }
  },
  cart.getCart
);

routes.post(
  "/addCart",
  (request, response, next) => {
    if (filters.checkLogin(request)) {
      return response.status(409).send("Você Não Está Logado");
    } else {
      next();
    }
  },
  cart.addIntoCart
);

module.exports = routes;
