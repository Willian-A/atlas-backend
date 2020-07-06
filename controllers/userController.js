const bcrypt = require("bcryptjs");
const con = require("../utils/conection.js");
const jwt = require("jsonwebtoken");

function Register(req, res) {
  function userExists(callback) {
    con.query(
      "SELECT 1 FROM users WHERE email = ? or cpf = ?",
      [req.body.email, req.body.cpf],
      function (err, result) {
        if (err) return console.log(err);
        return callback(result.length);
      }
    );
  }

  function registerUser() {
    con.query(
      "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
      [
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 10),
        req.body.cpf,
      ],
      function (err) {
        if (err) return console.log(err);
        return;
      }
    );
  }

  userExists((result) => {
    if (result > 0) {
      res.status(422).send("Email ou CPF Já Cadastrados");
    } else {
      registerUser();
    }
    res.end();
  });
}

function Login(req, res) {
  function getUser(callback) {
    con.query(
      "SELECT user_id,name, email, password FROM users WHERE email = ?",
      [req.body.email],
      function (err, result) {
        if (err) console.log(err);
        return callback(result);
      }
    );
  }

  getUser((result) => {
    if (
      result.length > 0 &&
      bcrypt.compareSync(req.body.password, result[0].password)
    ) {
      let token = jwt.sign({ auth: true }, process.env.SECRET, {
        expiresIn: 60 * 1.5, // (60s * time) expires in 1.5h
      });
      res.cookie(
        "profile",
        {
          token: token,
          cart: [],
        },
        {
          maxAge: 3600000 * 1.5, // (60s * time) expires in 1.5h
          httpOnly: true,
        }
      );
    } else {
      res.status(401).send("Email ou Senha Inválido");
    }
    res.end();
  });
}

function Logout(req, res) {
  if (req.cookies.profile != null) {
    res.clearCookie("profile", { path: "/" });
    return res.end();
  }
}

module.exports = { Register, Login, Logout };
