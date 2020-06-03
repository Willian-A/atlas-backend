const { Router } = require("express");
const routes = Router();

const filters = require("../services/filters.js");
const user = require("../controllers/user.js");

routes.post(
  "/cadastrar",
  (request, response, next) => {
    if (filters.isEmpty(request)) {
      return response.status(422).send("Preencha Todos os Campos");
    } else if (
      !filters.cpfFilter(request.body["cpf"].split(/[.\-/]/).join(""))
    ) {
      return response.status(422).send("CPF Inválido");
    }
    next();
  },
  user.Register
);
routes.post(
  "/login",
  (request, response, next) => {
    if (filters.isEmpty(request)) {
      return response.status(422).send("Preencha Todos os Campos");
    } else if (filters.checkCookie(request)) {
      request.cookies.profile = { name: "", cart: [], status: "" };
    } else if (filters.checkLogin(request)) {
      return response.status(409).send("Você Já Está Logado");
    } else {
      return response.status(400).send("Cookie Inválido");
    }
    next();
  },
  user.Login
);
routes.get(
  "/logout",
  (request, response, next) => {
    if (filters.checkCookie(request)) {
      return response.status(400).send("Cookie Inválido");
    } else if (!filters.checkLogin(request)) {
      return response.status(409).send("Você Não Está Logado");
    }
    next();
  },
  user.Logout
);

module.exports = routes;
