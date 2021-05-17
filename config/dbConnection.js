const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://griffin:root@atlas.fe6gk.mongodb.net/Atlas?retryWrites=true&w=majority";

var db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        db = client.db("atlas");
        return callback(err);
      }
    );
  },

  getDB: function () {
    return db;
  },
};
