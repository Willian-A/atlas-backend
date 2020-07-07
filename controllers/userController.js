const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createQuery = require("../utils/createQuery.js");

//registra novos usuarios
function Register(req, res) {
  //retorna se algum usuario que já tenha o email ou cpf
  const userExist = createQuery.createQuery(
    "SELECT 1 FROM users WHERE email = ? or cpf = ?",
    [req.body.email, req.body.cpf]
  );

  //registra o usuario no BD
  const registerUser = createQuery.createQuery(
    "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
    [
      req.body.name,
      req.body.email,
      bcrypt.hashSync(req.body.password, 10),
      req.body.cpf,
    ]
  );

  //função principal
  userExist
    .then((results) => {
      if (results.length > 0) {
        res.status(422).send("Email ou CPF Já Cadastrados");
      } else {
        registerUser.then(res.end());
      }
    })
    .catch(function (err) {
      res.status(500).send("Erro Interno");
    });
}

async function Login(data, res) {
  let result;
  const userExist = createQuery.createQuery(
    "SELECT user_id,name, email, password FROM users WHERE email = ?",
    [data.email]
  );

  result = await userExist
    .then((result) => {
      if (
        result.length > 0 &&
        bcrypt.compareSync(data.password, result[0].password)
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
        return { error: false, status: 200 };
      } else {
        return { error: "Email ou Senha Inválido", status: 401 };
      }
    })
    .catch(function (err) {
      return { error: "Erro Interno", status: 500 };
    });

  return result;
}

function Logout(req, res) {
  if (req.cookies.profile != null) {
    res.clearCookie("profile", { path: "/" });
    return res.end();
  }
}

module.exports = { Register, Login, Logout };
