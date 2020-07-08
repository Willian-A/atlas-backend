const { Router } = require("express");
const selectController = require("../controllers/productController.js");
const routes = Router();

routes.get("/product", (req, res, next) => {
  selectController.getAllProducts(res);
});
routes.post("/product", (req, res, next) => {
  selectController.getProduct(req.body, res);
});

module.exports = routes;
