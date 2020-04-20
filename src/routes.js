const { Router } = require("express");
const selectController = require("./controllers/selectController.js");
const user = require("./controllers/user.js");

const routes = Router();

routes.get("/product", selectController.searchProduct);
routes.post("/productPage", selectController.getProduct);
routes.post("/cadastrar", user.register);
routes.post("/login", user.login);

module.exports = routes;
