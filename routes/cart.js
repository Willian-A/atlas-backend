const routes = require("express").Router();
const CartService = require("../services/cartService");
const ErrorFactory = require("../error");

routes.get("/cart", async (req, res) => {
  await CartService(req.cookies.profile)
    .getCart()
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.post("/cart/add", async (req, res) => {
  await CartService(req.cookies.profile)
    .addOnCart(req.body.id)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.post("/cart/remove", async (req, res) => {
  await new CartService()
    .removeCartProduct(req.body.id, req.cookies.profile)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});
module.exports = routes;
