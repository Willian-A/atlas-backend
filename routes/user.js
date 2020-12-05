const routes = require("express").Router();
const UserService = require("../services/userService");
const ErrorHandler = require("../error");

routes.post("/cadastrar", async (req, res) => {
  await new UserService()
    .register(req.body.nome, req.body.email, req.body.password, req.body.cpf)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.post("/login", async (req, res) => {
  await new UserService()
    .login(req.body.email, req.body.password)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.get("/logout", async (req, res) => {
  await new UserService()
    .logout(req.cookies.profile)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.get("/logged", (req, res) => {
  res.status(200).send("Ok Logado");
});

module.exports = routes;
