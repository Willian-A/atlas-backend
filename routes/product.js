const { Router } = require("express");
const selectController = require("../controllers/productController.js");
const routes = Router();

routes.get("/product", selectController.getAllProducts);
routes.post("/productPage", selectController.getProduct);

module.exports = routes;
