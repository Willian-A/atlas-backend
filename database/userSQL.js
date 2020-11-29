const conn = require("./conection");

async function insertUser(values) {
  const SQL =
    "INSERT INTO users(name, email, password, cpf) VALUES (?, ?, ?, ?)";
  return conn.query(SQL, values);
}

async function selectUserExists(values) {
  const SQL = "SELECT * FROM users WHERE email = ? or cpf = ?";
  return new Promise((result, err) => {
    conn.query(SQL, values, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

async function selectUser(values) {
  const SQL = "SELECT password FROM users WHERE email = ?";
  return new Promise((result, err) => {
    conn.query(SQL, values, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

module.exports = { insertUser, selectUserExists, selectUser };
