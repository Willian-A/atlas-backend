const ProductModel = require("../database/models/product");

module.exports = class ProductService {
  async getProduct(id) {
    return await new ProductModel().selectProduct(id).then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: result };
      }
    });
  }

  async getLimitedProcuts(qty) {
    return await new ProductModel()
      .selectLimitedProducts(qty)
      .then((result) => {
        if (result.length <= 0) {
          return { error: true, HTTPcode: 500 };
        } else {
          return { error: false, payload: result };
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
