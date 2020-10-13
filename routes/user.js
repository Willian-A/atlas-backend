const { Router } = require("express");
const routes = Router();

const filters = require("../utils/filters.js");
const user = require("../controllers/userController.js");

// rota de cadastro de usuarios
routes.post("/cadastrar", async (req, res) => {
  if (filters.isEmpty(req, res) || filters.cpfFilter(req, res)) {
    return false;
  }
  return await user.Register(req.body, res);
});

// rota de login de usuarios
routes.post("/login", async (req, res) => {
  if (filters.isEmpty(req, res)) {
    return false;
  }
  if (filters.checkLogin(req, res)) {
    return res.status(409).send("Você Já Está Logado");
  }
  return await user.Login(req.body, res);
});

// rota para logout de usuarios
routes.get(
  "/logout",
  (req, res, next) => {
    if (!filters.checkLogin(req, res)) {
      return res.status(409).send("Você Não Está Logado");
    }
    return next();
  },
  user.Logout
);

// rota para saber se existe login
routes.get("/logged", (req, res) => {
  let result;
  if (filters.checkLogin(req)) {
    return res.status(200).send(true)
  } else {
    return res.status(409).send(false)
  }
  
});

module.exports = routes;
