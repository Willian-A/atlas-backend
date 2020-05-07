const { Router } = require("express");
const selectController = require("./controllers/selectController.js");
const user = require("./controllers/user.js");
const bcrypt = require("bcryptjs");

const routes = Router();

routes.get("/product", selectController.searchProduct);
routes.post("/productPage", selectController.getProduct);
routes.post("/cadastrar", user.register);
routes.post(
  "/login",
  (request, response, next) => {
    if (request.body.profile == null) {
      request.body.profile = {
        name: "",
        cart: [""],
        status: "",
      };
    }
    if (bcrypt.compareSync("logged", request.body.profile["status"])) {
      console.log(request.body.profile["name"], "Already Logged");
      return response.status(409).send("Você Já Está Logado");
    } else {
      next();
    }
  },
  user.login
);

module.exports = routes;
