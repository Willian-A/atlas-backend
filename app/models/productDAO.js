const ObjectId = require("mongodb").ObjectID;

class productDAO {
  constructor(conn) {
    this._conn = conn;
  }

  getProduct = (id) => {
    return this._conn.collection("products").find(ObjectId(id)).toArray();
  };

  getProducts = () => {
    return this._conn.collection("products").find().toArray();
  };

  getProductsArray = (array) => {
    return this._conn
      .collection("products")
      .find({ _id: { $in: array } })
      .toArray();
  };

  getSomeProducts = (qty) => {
    return this._conn.collection("products").find().limit(qty).toArray();
  };
}

module.exports = (app) => {
  return productDAO;
};
