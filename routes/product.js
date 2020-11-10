const { Router } = require("express");
const selectController = require("../controllers/productController.js");

const routes = Router();

// rota de acesso a todos os produtos
routes.get("/product:limit", (req, res) => {
  selectController.getAllProducts(res, req.params.limit);
});

// rota de acessoa a um unico produto
routes.post("/product", (req, res) => {
  console.log(req.body);
  selectController.getProduct(req.body, res);
});

routes.post("/categories", (req, res) => {
  selectController.productsCategories(req.body, res);
});

module.exports = routes;
