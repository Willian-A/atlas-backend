const routes = require("express").Router();
const ProductService = require("../services/productService");
const ErrorHandler = require("../error");

routes.post("/product", async (req, res) => {
  await new ProductService()
    .getProduct(req.body.id)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.get("/products:qty", async (req, res) => {
  res.send("broken");
});

routes.get("/products", async (req, res) => {
  await new ProductService()
    .getAllProducts()
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

module.exports = routes;
