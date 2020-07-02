const bcrypt = require("bcryptjs");
const con = require("../utils/conection.js");

function Register(req, res) {
  function userExists(callback) {
    con.query(
      "SELECT 1 FROM users WHERE email = ? or cpf = ?",
      [req.body.email, req.body.cpf],
      function (err, result) {
        if (err) console.log(err);
        return callback(result.length);
      }
    );
  }

  userExists((result) => {
    if (result > 0) {
      res.status(422).send("Email ou CPF Já Cadastrados");
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
        }
      );
    }
    res.end();
  });
}

function Login(req, res) {
  con.query(
    "SELECT name, email, password FROM users WHERE email = ?",
    [req.body.email],
    function (err, result) {
      if (err) console.log(err);
      if (
        result.length > 0 &&
        bcrypt.compareSync(req.body.password, result[0].password)
      ) {
        res.cookie(
          "profile",
          {
            name: result[0].name,
            cart: [],
            status: bcrypt.hashSync("logged", 10),
          },
          {
            maxAge: 3600000 * 1.5,
            httpOnly: true,
          }
        );
      } else {
        res.status(401).send("Email ou Senha Inválido");
      }
      res.end();
    }
  );
}

function Logout(request, response) {
  if (request.cookies.profile != null) {
    response.clearCookie("profile", { path: "/" });
    return response.sendStatus(200);
  }
}

module.exports = { Register, Login, Logout };
