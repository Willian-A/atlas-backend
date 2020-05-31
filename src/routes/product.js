const { Router } = require("express");
const selectController = require("../controllers/selectController.js");
const routes = Router();

routes.get("/product", selectController.searchProduct);
routes.post("/productPage", selectController.getProduct);

module.exports = routes;
