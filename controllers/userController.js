const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createQuery = require("../utils/createQuery.js");

//  registra novos usuarios
function Register(data, res) {
  //  retorna se algum usuario que já tenha o email ou cpf
  const userExist = createQuery.createQuery(
    "SELECT 1 FROM users WHERE email = ? or cpf = ?",
    [data.email, data.cpf]
  );

  //  função principal
  return userExist
    .then((results) => {
      if (results.length > 0) {
        console.log("A");
        return res.status(422).send("Email ou CPF Já Cadastrados");
      }
      //  registra o usuario no BD
      createQuery.createQuery(
        "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
        [data.name, data.email, bcrypt.hashSync(data.password, 10), data.cpf]
      );
      return res.sendStatus(200);
    })
    .catch(() => {
      console.log("A");
      return res.status(500).send("Erro Interno");
    });
}

function Login(data, res) {
  const userExist = createQuery.createQuery(
    "SELECT user_id, name, email, password FROM users WHERE email = ?",
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
            sameSite: "None",
            secure: true,
            httpOnly: true,
          }
        );
        return res.sendStatus(200);
      }
      return res.status(401).send("Email ou Senha Inválido");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Erro Interno");
    });
}

function Logout(req, res) {
  if (req.cookies.profile != null) {
    res.clearCookie("profile", { path: "/" });
    return res.end();
  }
}

module.exports = { Register, Login, Logout };
