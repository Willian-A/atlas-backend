const bcrypt = require("bcryptjs");
const con = require("../utils/conection.js");

function Register(req, rer) {
  function userExists(callback) {
    con.query(
      "SELECT 1 FROM users WHERE email = ? or cpf = ?",
      [req.body.email, req.body.cpf],
      function (err, result) {
        if (err) return callback(err);
        return callback(result.length);
      }
    );
  }

  function registerUser() {
    userExists((result) => {
      if (result > 0) {
        return rer.status(422).send("Email ou CPF Já Cadastrados");
      } else {
        con.query(
          "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
          [
            req.body.name,
            req.body.email,
            bcrypt.hashSync(req.body.password, 10),
            req.body.cpf,
          ],
          function (err) {
            if (err) throw err;
            return rer.sendStatus(200);
          }
        );
      }
    });
  }

  registerUser();
}

function Login(req, rer) {
  function userExists(callback) {
    con.query(
      "SELECT name, email, password FROM users WHERE email = ?",
      [req.body.email],
      function (err, result) {
        if (err) return callback(err);
        return callback(result);
      }
    );
  }

  function makeLogin() {
    userExists((result) => {
      if (
        result.length == 1 &&
        bcrypt.compareSync(req.body.password, result[0].password)
      ) {
        rer.cookie(
          "profile",
          {
            name: result[0].name,
            cart: [],
            status: bcrypt.hashSync("logged", 10),
          },
          {
            maxAge: 5400000,
            httpOnly: true,
          }
        );
        return rer.sendStatus(200);
      } else {
        return rer.status(401).send("Email ou Senha Inválido");
      }
    });
  }

  makeLogin();
}

function Logout(req, rer) {
  if (req.cookies.profile != null) {
    rer.clearCookie("profile", { path: "/" });
    return rer.sendStatus(200);
  }
}
module.exports = { Register, Login, Logout };
