const { Router } = require("express");
const selectController = require("../controllers/productController.js");
const routes = Router();

routes.get("/product", selectController.getAllProducts);
routes.post("/product", selectController.getProduct);

module.exports = routes;
