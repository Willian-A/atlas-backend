const routes = require("express").Router();
const UserService = require("../services/userService");
const ErrorFactory = require("../error");

routes.post("/cadastrar", async (req, res) => {
  await new UserService()
    .register(req.body.name, req.body.email, req.body.password, req.body.cpf)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.post("/login", async (req, res) => {
  await new UserService()
    .login(req.body.email, req.body.password)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.get("/logout", async (req, res) => {
  await new UserService()
    .logout(req.cookies.profile)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.get("/logged", async (req, res) => {
  await new UserService()
    .logged(req.cookies.profile)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

module.exports = routes;
