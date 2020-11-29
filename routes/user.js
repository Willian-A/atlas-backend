const routes = require("express").Router();
const UserService = require("../services/userService");
const ErrorHandler = require("../error");

routes.post("/cadastrar", async (req, res) => {
  await new UserService(
    req.body.nome,
    req.body.email,
    req.body.password,
    req.body.cpf
  )
    .register()
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.post("/login", async (req, res) => {
  await new UserService(null, req.body.email, req.body.password, null)
    .login()
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.get("/logout", async (req, res) => {
  res.status(200).send("Ok Logout");
});

routes.get("/logado", (req, res) => {
  res.status(200).send("Ok Logado");
});

module.exports = routes;
