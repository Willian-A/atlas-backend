const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createQuery = require("../utils/createQuery.js");

function Register(req, res) {
  createQuery
    .createQuery("SELECT 1 FROM users WHERE email = ? or cpf = ?", [
      req.body.email,
      req.body.cpf,
    ])
    .then((results) => {
      if (results.length > 0) {
        res.status(422).send("Email ou CPF Já Cadastrados");
      } else {
        createQuery
          .createQuery(
            "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
            [
              req.body.name,
              req.body.email,
              bcrypt.hashSync(req.body.password, 10),
              req.body.cpf,
            ]
          )
          .then(res.end());
      }
    })
    .catch(function (err) {
      res.status(500).send("Erro Interno");
    });
}

function Login(req, res) {
  createQuery
    .createQuery(
      "SELECT user_id,name, email, password FROM users WHERE email = ?",
      [req.body.email]
    )
    .then((result) => {
      if (
        result.length > 0 &&
        bcrypt.compareSync(req.body.password, result[0].password)
      ) {
        let token = jwt.sign({ auth: true }, process.env.SECRET, {
          expiresIn: 3600 * 1.5, // (3600s * time) expires in 1.5h
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
    })
    .catch(function (err) {
      res.status(500).send("Erro Interno");
    });
}

function Logout(req, res) {
  if (req.cookies.profile != null) {
    res.clearCookie("profile", { path: "/" });
    return res.end();
  }
}

module.exports = { Register, Login, Logout };
