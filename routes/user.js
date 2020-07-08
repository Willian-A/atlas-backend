const { Router } = require("express");
const routes = Router();

const filters = require("../utils/filters.js");
const errorHandler = require("../utils/errorHandler.js");
const user = require("../controllers/userController.js");

//rota de cadastro de usuarios
routes.post("/cadastrar", async (req, res, next) => {
  if (filters.isEmpty(req, res) || filters.cpfFilter(req, res)) {
    return;
  } else {
    errorHandler.errorHandler(await user.Register(req.body, res), res);
  }
});

//rota de login de usuarios
routes.post("/login", async (req, res, next) => {
  if (filters.isEmpty(req, res)) {
    return;
  } else if (filters.checkLogin(req, res)) {
    return res.status(409).send("Você Já Está Logado");
  } else {
    errorHandler.errorHandler(await user.Login(req.body, res), res);
  }
});

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
