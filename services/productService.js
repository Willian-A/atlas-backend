const {
  selectProduct,
  selectLimitedProducts,
  selectAllProducts,
} = require("../database/productSQL");

module.exports = class ProductService {
  async getProduct(id) {
    let result = await selectProduct(id);
    if (result.length <= 0) {
      return { error: true, HTTPcode: 500 };
    }
    return { error: false, payload: result };
  }

  async getLimitedProcuts(qty) {
    let result = await selectLimitedProducts(qty);

    return { error: false, payload: result };
  }

  async getAllProducts() {
    let result = await selectAllProducts();
    if (result.length <= 0) {
      return { error: true, HTTPcode: 500 };
    }
    return { error: false, payload: result };
  }
};
