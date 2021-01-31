const routes = require("express").Router();
const CartService = require("../services/cartService");
const ErrorFactory = require("../error");

routes.get("/cart", async (req, res) => {
  console.log(req.cookies.profile);
  await new CartService()
    .getCartProducts(req.cookies.profile)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.post("/cart/add", async (req, res) => {
  console.log(req.body.id, req.cookies.profile);
  await new CartService()
    .addProdOnCart(req.body.id, req.cookies.profile)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});

routes.post("/cart/remove", async (req, res) => {
  await new CartService()
    .removeCartProduct(req.body.id, req.cookies.profile)
    .then((status) => new ErrorFactory(res, status).checkHttpCode());
});
module.exports = routes;
