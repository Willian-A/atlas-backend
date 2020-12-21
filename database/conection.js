const MongoClient = require("mongodb").MongoClient;
const uri = process.env.DB_URI;
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
