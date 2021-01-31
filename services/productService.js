const ProductModel = require("../database/models/product");

module.exports = class ProductService {
  async getProduct(id) {
    return await new ProductModel().selectProduct(id).then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        result[0].price = result[0].price.toFixed(2);
        return { error: false, payload: result };
      }
    });
  }

  async getLimitedProcuts(qty) {
    function formatPrices(dbResult) {
      dbResult.forEach((dbProd) => {
        dbProd.price = dbProd.price.toFixed(2);
      });

      return dbResult;
    }

    return await new ProductModel()
      .selectLimitedProducts(qty)
      .then((result) => {
        if (result.length <= 0) {
          return { error: true, HTTPcode: 500 };
        } else {
          return { error: false, payload: formatPrices(result) };
        }
      });
  }

  async getAllProducts() {
    return await new ProductModel().selectProducts().then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: result };
      }
    });
  }
};
