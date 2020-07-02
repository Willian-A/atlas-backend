const { Router } = require("express");
const routes = Router();

const filters = require("../services/filters.js");
const user = require("../controllers/userController.js");

routes.post(
  "/cadastrar",
  (req, res, next) => {
    if (filters.isEmpty(req, res) || filters.cpfFilter(req, res)) {
      return console.log("ERRO");
    }
    next();
  },
  user.Register
);
routes.post(
  "/login",
  (req, res, next) => {
    if (filters.isEmpty(req, res)) {
      return console.log("ERRO");
    } else if (filters.checkLogin(req, res)) {
      console.log("ERRO");
      return res.status(409).send("Você Já Está Logado");
    }
    next();
  },
  user.Login
);
routes.get(
  "/logout",
  (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      console.log("ERRO");
      return res.status(409).send("Você Não Está Logado");
    }
    next();
  },
  user.Logout
);

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
