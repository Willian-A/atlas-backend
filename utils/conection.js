var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "6mRqU3Rnc0hwvqjhaT>Adjud;Y+T?]",
  database: "bdatlas",
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
