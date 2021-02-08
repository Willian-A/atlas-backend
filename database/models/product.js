const mongoUtil = require("../conection");
const ObjectId = require("mongodb").ObjectID;

module.exports = class ProductModel {
  async selectProduct(id) {
    try {
      var db = mongoUtil.getDb();
      return await db.collection("products").find(ObjectId(id)).toArray();
    } catch (err) {
      console.error(err);
    }
  }

  async selectByID(array) {
    try {
      var db = mongoUtil.getDb();
      return await db
        .collection("products")
        .find({ _id: { $in: array } })
        .toArray();
    } catch (err) {
      console.error(err);
    }
  }

  async selectLimitedProducts(qty) {
    try {
      var db = mongoUtil.getDb();
      return await db.collection("products").find().limit(qty).toArray();
    } catch (err) {
      console.error(err);
    }
  }

  async selectProducts() {
    try {
      var db = mongoUtil.getDb();
      return await db.collection("products").find().toArray();
    } catch (err) {
      console.error(err);
    }
  }
};
