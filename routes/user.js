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
routes.post("/login", async (req, res, next) => {
  if (filters.isEmpty(req, res)) {
    return;
  } else if (filters.checkLogin(req, res)) {
    return res.status(409).send("Você Já Está Logado");
  } else {
    await user.Login(req.body, res).then((result) => {
      if (result.error) {
        return res.status(result.status).send(result.error);
      } else {
        return res.sendStatus(200);
      }
    });
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
