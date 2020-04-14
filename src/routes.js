const { Router } = require("express");
const selectController = require("./controllers/selectController.js");

const routes = Router();

routes.get("/product", selectController.searchProduct);
routes.post("/getProduct", selectController.getProduct);

module.exports = routes;
