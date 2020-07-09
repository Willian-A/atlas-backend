const mysql = require("mysql");

// conexão com o BD
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "6mRqU3Rnc0hwvqjhaT>Adjud;Y+T?]",
  database: "bdatlas",
});

connection.connect((err) => {
  if (err) throw err;
});

module.exports = connection;
