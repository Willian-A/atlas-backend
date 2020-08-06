const mysql = require("mysql");

// conexão com o BD
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "atlas",
});

connection.connect((err) => {
  if (err) throw err;
});

module.exports = connection;
