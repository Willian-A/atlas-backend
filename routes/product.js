const { Router } = require("express");
const selectController = require("../controllers/productController.js");
const routes = Router();

//rota de acesso a todos os produtos
routes.get("/product", (req, res, next) => {
  selectController.getAllProducts(res);
});

//rota de acessoa a um unico produto
routes.post("/product", (req, res, next) => {
  selectController.getProduct(req.body, res);
});

module.exports = routes;
