module.exports = (application) => {
  application.post("/product", (req, res) => {
    application.app.controllers.products.getProduct(application, req, res);
  });
  application.post("/products", (req, res) => {
    application.app.controllers.products.getSomeProducts(application, req, res);
  });
  application.get("/products", (req, res) => {
    application.app.controllers.products.getProducts(application, req, res);
  });
};
