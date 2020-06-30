const bcrypt = require("bcryptjs");
const con = require("../utils/conection.js");

function Register(request, response) {
  function userExists(callback) {
    con.query(
      "SELECT 1 FROM users WHERE email = ? or cpf = ?",
      [request.body.email, request.body.cpf],
      function (err, result) {
        if (err) return callback(err);
        return callback(result.length);
      }
    );
  }

  function registerUser() {
    userExists((result) => {
      if (result > 0) {
        return response.status(422).send("Email ou CPF Já Cadastrados");
      } else {
        con.query(
          "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
          [
            request.body.name,
            request.body.email,
            bcrypt.hashSync(request.body.password, 10),
            request.body.cpf,
          ],
          function (err) {
            if (err) throw err;
            return response.sendStatus(200);
          }
        );
      }
    });
  }

  registerUser();
}

function Login(request, response) {
  function userExists(callback) {
    con.query(
      "SELECT name, email, password FROM users WHERE email = ?",
      [request.body.email],
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
        bcrypt.compareSync(request.body.password, result[0].password)
      ) {
        response.cookie(
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
        return response.sendStatus(200);
      } else {
        return response.status(401).send("Email ou Senha Inválido");
      }
    });
  }

  makeLogin();
}

function Logout(request, response) {
  if (request.cookies.profile != null) {
    response.clearCookie("profile", { path: "/" });
    return response.sendStatus(200);
  }
}
module.exports = { Register, Login, Logout };
