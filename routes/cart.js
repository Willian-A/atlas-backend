const { Router } = require("express");
const routes = Router();

const filters = require("../utils/filters.js");
const errorHandler = require("../utils/errorHandler.js");
const cart = require("../controllers/cartController.js");

routes.get(
  "/cart",
  async (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      return res.status(409).send("Você Não Está Logado");
    } else {
      errorHandler.errorHandler(await cart.getCartList(req.cookies, res), res);
    }
  },
  cart.getCartList
);

routes.post(
  "/cart",
  async (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      return res.status(409).send("Você Não Está Logado");
    } else {
      errorHandler.errorHandler(
        await cart.addIntoCart(req.body, res, req.cookies),
        res
      );
    }
  },
  cart.addIntoCart
);

module.exports = routes;
