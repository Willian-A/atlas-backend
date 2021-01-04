const MongoClient = require("mongodb").MongoClient;
const uri =
  process.env.DB_URI ||
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

var db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
      db = client.db("atlas");
      return callback(err);
    });
  },

  getDb: function () {
    return db;
  },
};
