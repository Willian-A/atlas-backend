const routes = require("express").Router();
const CartService = require("../services/cartService");
const ErrorHandler = require("../error");

routes.get("/cart", async (req, res) => {
  await new CartService()
    .getCart(req.cookies.profile)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.post("/cart/add", async (req, res) => {
  await new CartService()
    .addCartProduct(req.body.id, req.cookies.profile)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.post("/cart/remove", async (req, res) => {
  await new CartService()
    .removeCartProduct(req.body.id, req.cookies.profile)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});
module.exports = routes;
