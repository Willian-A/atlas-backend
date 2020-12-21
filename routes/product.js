const routes = require("express").Router();
const ProductService = require("../services/productService");
const ProductModel = require("../database/models/product");
const ErrorHandler = require("../error");

routes.post("/product", async (req, res) => {
  await new ProductService()
    .getProduct(req.body.id)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.post("/products", async (req, res) => {
  await new ProductService()
    .getLimitedProcuts(req.body.qty)
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

routes.get("/products", async (req, res) => {
  await new ProductService()
    .getAllProducts()
    .then((status) => new ErrorHandler(res, status).checkHttpCode());
});

module.exports = routes;
