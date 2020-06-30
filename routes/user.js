const { Router } = require("express");
const routes = Router();

const filters = require("../services/filters.js");
const user = require("../controllers/userController.js");

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
    if (!filters.filters.isEmpty(request)) {
      return response.status(422).send("Preencha Todos os Campos");
    } else if (filters.filters.checkLogin(request)) {
      return response.status(409).send("Você Já Está Logado");
    }

    next();
  },
  user.Login
);
routes.get(
  "/logout",
  (request, response, next) => {
    if (!filters.filters.checkLogin(request)) {
      return response.status(409).send("Você Não Está Logado");
    }
    next();
  },
  user.Logout
);

routes.get("/logged", (request, response) => {
  if (filters.filters.checkLogin(request)) {
    return response.status(200).send(true);
  } else {
    return response.status(200).send(false);
  }
});

module.exports = routes;
