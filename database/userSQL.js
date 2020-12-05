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
  const SQL = "SELECT user_id, password FROM users WHERE email = ?";
  return new Promise((result, err) => {
    conn.query(SQL, values, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

async function insertUserSession(values) {
  const SQL = "INSERT INTO sessions(session_id, user_id) VALUES (?, ?)";
  return conn.query(SQL, values);
}

module.exports = {
  insertUser,
  selectUserExists,
  selectUser,
  insertUserSession,
};
