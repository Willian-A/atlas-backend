const { Router } = require("express");
const routes = Router();

const filters = require("../utils/filters.js");
const cart = require("../controllers/cartController.js");

routes.get(
  "/cart",
  (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      console.log("ERRO");
      return res.status(409).send("Você Não Está Logado");
    }
    next();
  },
  cart.getCartList
);

routes.post(
  "/cart",
  (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      console.log("ERRO");
      return res.status(409).send("Você Não Está Logado");
    }
    next();
  },
  cart.addIntoCart
);

module.exports = routes;
