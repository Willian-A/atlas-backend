const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createQuery = require("../utils/createQuery.js");

//  registra novos usuarios
function Register(data) {
  //  retorna se algum usuario que já tenha o email ou cpf
  const userExist = createQuery.createQuery(
    "SELECT 1 FROM users WHERE email = ? or cpf = ?",
    [data.email, data.cpf]
  );

  //  função principal
  return userExist
    .then((results) => {
      if (results.length > 0) {
        return { error: "Email ou CPF Já Cadastrados", status: 422 };
      }
      //  registra o usuario no BD
      createQuery.createQuery(
        "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
        [data.name, data.email, bcrypt.hashSync(data.password, 10), data.cpf]
      );
      return { error: false };
    })
    .catch(() => {
      return { error: "Erro Interno", status: 500 };
    });
}

function Login(data, res) {
  const userExist = createQuery.createQuery(
    "SELECT user_id,name, email, password FROM users WHERE email = ?",
    [data.email]
  );

  return userExist
    .then((result) => {
      if (
        result.length > 0 &&
        bcrypt.compareSync(data.password, result[0].password)
      ) {
        const token = jwt.sign({ auth: true }, process.env.SECRET, {
          expiresIn: 3600 * 1.5, // (3600s * time) expires in 1.5h
        });
        res.cookie(
          "profile",
          {
            token,
            cart: [],
          },
          {
            maxAge: 3600000 * 1.5, // (60s * time) expires in 1.5h
            httpOnly: true,
          }
        );
        return { error: false };
      }
      return { error: "Email ou Senha Inválido", status: 401 };
    })
    .catch(() => {
      return { error: "Erro Interno", status: 500 };
    });
}

function Logout(req, res) {
  if (req.cookies.profile != null) {
    res.clearCookie("profile", { path: "/" });
    return res.end();
  }
}

module.exports = { Register, Login, Logout };
