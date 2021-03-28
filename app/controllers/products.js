module.exports.getProduct = (application, req, res) => {
  const conn = application.config.dbConnection.getDB();
  const productModel = new application.app.models.productDAO(conn);

  productModel.getProduct(req.body.id).then((result) => {
    if (result.length <= 0) {
      res.status(500).send("Produto não Encontrado");
    } else {
      res.json(result);
    }
  });
};

module.exports.getProducts = (application, req, res) => {
  const conn = application.config.dbConnection.getDB();
  const productModel = new application.app.models.productDAO(conn);

  productModel.getProducts().then((result) => {
    if (result.length <= 0) {
      res.status(500).send("Produtos não Encontrados");
    } else {
      res.json(result);
    }
  });
};

module.exports.getSomeProducts = (application, req, res) => {
  const conn = application.config.dbConnection.getDB();
  const productModel = new application.app.models.productDAO(conn);

  productModel.getSomeProducts(req.body.qty).then((result) => {
    if (result.length <= 0) {
      res.status(500).send("Produtos não Encontrados");
    } else {
      res.json(result);
    }
  });
};
