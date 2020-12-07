const {
  selectProduct,
  selectLimitedProducts,
  selectAllProducts,
} = require("../database/productSQL");

module.exports = class ProductService {
  async getProduct(id) {
    return await selectProduct(id).then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: result };
      }
    });
  }

  async getLimitedProcuts(qty) {
    return await selectLimitedProducts(qty).then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: result };
      }
    });
  }

  async getAllProducts() {
    return await selectAllProducts().then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: result };
      }
    });
  }
};
