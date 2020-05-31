const { Router } = require("express");
const bcrypt = require("bcryptjs");
const routes = Router();

const cpfFilter = require("../utils/cpfFilter.js");
const user = require("../controllers/user.js");

routes.post(
  "/cadastrar",
  (request, response, next) => {
    for (let field in request.body) {
      if (request.body[field] === "" || request.body[field] === null) {
        return response.status(422).send("Preencha Todos os Campos");
      } else if (
        !cpfFilter.cpfFilter(request.body["cpf"].split(/[.\-/]/).join(""))
      ) {
        return response.status(422).send("CPF Inválido");
      }
    }
    next();
  },
  user.Register
);
routes.post(
  "/login",
  (request, response, next) => {
    if (request.cookies.profile == null || request.cookies.profile == "") {
      request.cookies.profile = { name: "", cart: [], status: "" };
    }
    if (bcrypt.compareSync("logged", request.cookies.profile["status"])) {
      return response.status(409).send("Você Já Está Logado");
    } else {
      for (let field in request.body) {
        if (request.body[field] == "" || request.body[field] == null) {
          return response.status(422).send("Preencha Todos os Campos");
        } else {
        }
      }
    }
    next();
  },
  user.Login
);
routes.get(
  "/logout",
  (request, response, next) => {
    if (request.cookies.profile == null || request.cookies.profile == "") {
      return response.status(409).send("Você Não Está Logado");
    } else {
      next();
    }
  },
  user.Logout
);

module.exports = routes;
