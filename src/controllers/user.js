const bcrypt = require("bcryptjs");
const con = require("../utils/conection.js");

const loggedStatus = bcrypt.hashSync("logged", 10);

const Register = (request, response) => {
  let user = {
    name: "",
    email: "",
    password: "",
    cpf: "",
  };

  function setValue() {
    for (let field in user) {
      user[field] = request.body[field];
    }
  }

  function userExists(callback) {
    con.query(
      "SELECT 1 FROM users WHERE email = ? or cpf = ?",
      [user.email, user.cpf],
      function (err, result) {
        if (err) return callback(err);
        return callback(result.length);
      }
    );
  }

  function register() {
    userExists((result) => {
      if (result > 0) {
        return response.status(422).send("Email ou CPF Já Cadastrados");
      } else {
        con.query(
          "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
          [
            user.name,
            user.email,
            bcrypt.hashSync(request.body.password, 10),
            user.cpf,
          ],
          function (err) {
            if (err) throw err;
            return response.sendStatus(200);
          }
        );
      }
    });
  }

  setValue();
  register();
};

const Login = (request, response) => {
  let user = {
    email: "",
    password: "",
  };

  function setValue() {
    for (let field in user) {
      user[field] = request.body[field];
    }
  }

  function userExists(callback) {
    con.query(
      "SELECT name, email, password FROM users WHERE email = ?",
      [user.email],
      function (err, result) {
        if (err) return callback(err);
        return callback(result);
      }
    );
  }

  function login() {
    userExists((result) => {
      if (bcrypt.compareSync(user.password, result[0].password)) {
        response.cookie(
          "profile",
          { name: result[0].name, cart: [], status: loggedStatus },
          {
            maxAge: 3600000,
            httpOnly: true,
          }
        );
        return response.sendStatus(200);
      } else {
        return response.status(401).send("Email ou Senha Inválido");
      }
    });
  }

  setValue();
  login();
};

const Logout = (request, response) => {
  if (request.cookies.profile != null) {
    response.clearCookie("profile", { path: "/" });
    return response.sendStatus(200);
  }
};
module.exports = { Login, Register, Logout };
