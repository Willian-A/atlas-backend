const mysql = require("mysql");

var connection = mysql.createConnection({
  user: process.env.SQL_USER, // e.g. 'my-db-user'
  password: process.env.SQL_PASSWORD, // e.g. 'my-db-password'
  database: process.env.SQL_DATABASE, // e.g. 'my-database'
  // If connecting via unix domain socket, specify the path
  host: `127.0.0.1`,
});

module.exports = connection;
