const bcrypt = require("bcryptjs");
const con = require("../utils/conection.js");
const cpfFilter = require("../utils/cpfFilter.js");

var today = new Date();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

const loggedStatus = bcrypt.hashSync("logged", 10);

function register(request, response) {
  if (
    request.body.name == "" ||
    request.body.email == "" ||
    request.body.password == "" ||
    request.body.cpf == "" ||
    request.body.phone == ""
  ) {
    console.log("Empty Fields at", time);
    return response.status(422).send("Preencha Todos os Campos");
  } else {
    const passwordHash = bcrypt.hashSync(request.body.password, 10);
    if (
      cpfFilter.cpfFilter(request.body.cpf.split(/[.\-/]/).join("")) === true
    ) {
      con.query(
        "SELECT 1 FROM users WHERE email = ? or cpf = ?",
        [request.body.email, request.body.cpf],
        function (err, result) {
          if (err) throw err;
          if (result.length == 0) {
            con.query(
              "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
              [
                request.body.name,
                request.body.email,
                passwordHash,
                request.body.cpf,
              ],
              function (err) {
                if (err) throw err;
                console.log(request.body.name, "Registered at", time);
                return response
                  .status(200)
                  .send("Registrado com Sucesso! Faça Login");
              }
            );
          } else {
            console.log(request.body.name, "Already Registered at", time);
            return response.status(422).send("Email ou CPF Já Cadastrados");
          }
        }
      );
    } else {
      console.log("Invalid CPF at", time);
      return response.status(422).send("CPF Inválido");
    }
  }
}

function login(request, response) {
  if (request.body.email == null || request.body.password == null) {
    console.log("Empty Fields at", time);
    return response.status(422).send("Campos com Conteudo Inválido");
  } else {
    con.query(
      "SELECT name, email, password FROM users WHERE email = ?",
      [request.body.email],
      function (err, result) {
        if (err) throw err;
        if (bcrypt.compareSync(request.body.password, result[0].password)) {
          console.log(result[0].name, "Logged at", time);
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
          console.log(result[0].name, "Invalid Credentials at", time);
          return response.status(401).send("Email ou Senha Inválido");
        }
      }
    );
  }
}

module.exports = { register, login };
