const { Router } = require("express");

const routes = Router();

const filters = require("../utils/filters.js");
const errorHandler = require("../utils/errorHandler.js");
const cart = require("../controllers/cartController.js");

//  rota de acesso aos produtos no carrinho
routes.get("/cart", async (req, res) => {
  if (!filters.checkLogin(req, res)) {
    return res.status(409).send("Você Não Está Logado");
  }

  await cart.getCartList(req.cookies, res);
});

//  rota para add produtos no carrinho
routes.post("/cart", async (req, res) => {
  if (!filters.checkLogin(req, res)) {
    return res.status(409).send("Você Não Está Logado");
  }
  return errorHandler.errorHandler(
    await cart.addIntoCart(req.body, res, req.cookies),
    res
  );
});

module.exports = routes;
