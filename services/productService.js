const ProductModel = require("../database/models/product");

module.exports = class ProductService {
  constructor() {
    this.ProductSQL = new ProductModel();
    this.formatPrices = (dbResult) => {
      dbResult.forEach((dbProd) => {
        dbProd.price = dbProd.price.toFixed(2);
      });

      return dbResult;
    };
  }

  async getProduct(id) {
    return await this.ProductSQL.selectProduct(id).then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        result[0].price = result[0].price.toFixed(2);
        return { error: false, payload: result };
      }
    });
  }

  async getLimitedProcuts(qty) {
    return await this.ProductSQL.selectLimitedProducts(qty).then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: this.formatPrices(result) };
      }
    });
  }

  async getAllProducts() {
    return await this.ProductSQL.selectProducts().then((result) => {
      if (result.length <= 0) {
        return { error: true, HTTPcode: 500 };
      } else {
        return { error: false, payload: this.formatPrices(result) };
      }
    });
  }
};
