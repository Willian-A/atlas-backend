const con = require("../utils/conection.js");
const bcrypt = require("bcryptjs");

var today = new Date();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

function register(request, response) {
  if (
    request.body.name == "" ||
    request.body.email == "" ||
    request.body.password == "" ||
    request.body.cpf == "" ||
    request.body.phone == ""
  ) {
    console.log("Empty Fields at", time);
    return response.sendStatus(422);
  } else {
    const passwordHash = bcrypt.hashSync(request.body.password, 10);
    con.query(
      "SELECT 1 FROM users WHERE email = ? or cpf = ?",
      [request.body.email, request.body.cpf],
      function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          con.query(
            "INSERT INTO users (name, email, password, cpf, phone) VALUES (?, ?, ?, ?, ?)",
            [
              request.body.name,
              request.body.email,
              passwordHash,
              request.body.cpf,
              request.body.phone,
            ],
            function (err) {
              if (err) throw err;
              console.log(request.body.name, "Registered at", time);
              return response.sendStatus(200);
            }
          );
        } else {
          console.log(request.body.name, "Already Registered at", time);
          return response.sendStatus(409);
        }
      }
    );
  }
}

module.exports = { register };
