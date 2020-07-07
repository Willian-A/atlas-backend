const { Router } = require("express");
const routes = Router();

const filters = require("../utils/filters.js");
const user = require("../controllers/userController.js");

//rota de cadastro de usuarios
routes.post(
  "/cadastrar",
  (req, res, next) => {
    if (filters.isEmpty(req, res) || filters.cpfFilter(req, res)) {
      return;
    }
    next();
  },
  user.Register
);

//rota de login de usuarios
routes.post(
  "/login",
  (req, res, next) => {
    if (filters.isEmpty(req, res)) {
      return;
    } else if (filters.checkLogin(req, res)) {
      return res.status(409).send("Você Já Está Logado");
    }
    next();
  },
  user.Login
);

//rota para logout de usuarios
routes.get(
  "/logout",
  (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      return res.status(409).send("Você Não Está Logado");
    }
    next();
  },
  user.Logout
);

//rota para saber se existe login
routes.get("/logged", (req, res) => {
  let result;
  if (filters.checkLogin(req)) {
    result = true;
  } else {
    result = false;
  }
  return res.status(200).send(result);
});

module.exports = routes;
