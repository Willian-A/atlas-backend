const { Router } = require("express");
const routes = Router();

const filters = require("../services/filters.js");
const cart = require("../controllers/cartController.js");

routes.get(
  "/cart",
  (request, response, next) => {
    if (filters.checkLogin(request)) {
      next();
    } else {
      return response.status(409).send("Você Não Está Logado");
    }
  },
  cart.getCartList
);

routes.post(
  "/cart",
  (request, response, next) => {
    if (filters.checkLogin(request)) {
      next();
    } else {
      return response.status(409).send("Você Não Está Logado");
    }
  },
  cart.addIntoCart
);

module.exports = routes;
