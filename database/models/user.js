const mongoUtil = require("../conection");

module.exports = class UserModel {
  async selectUser(email) {
    try {
      var db = mongoUtil.getDb();
      return await db.collection("users").find({ email: email }).toArray();
    } catch (err) {
      console.error(err);
    }
  }
  async insertUser(object) {
    try {
      var db = mongoUtil.getDb();
      return await db.collection("users").insertOne(object);
    } catch (err) {
      console.error(err);
    }
  }
};
