const jwt = require("jsonwebtoken");

function isEmpty(req, res) {
  function fieldHandler() {
    for (let field in req.body) {
      if (!req.body[field]) {
        return false;
      }
    }
    return true;
  }
  if (!fieldHandler()) {
    res.status(422).send("Preencha Todos os Campos");
    return true;
  }
}

function cpfFilter(req, res) {
  function cpfHandler() {
    let CPF = req.body["cpf"].split(/[.\-/]/).join("");
    var Soma = 0;
    var Resto;
    if (
      CPF.length != 11 ||
      CPF == "00000000000" ||
      CPF == "11111111111" ||
      CPF == "22222222222" ||
      CPF == "33333333333" ||
      CPF == "44444444444" ||
      CPF == "55555555555" ||
      CPF == "66666666666" ||
      CPF == "77777777777" ||
      CPF == "88888888888" ||
      CPF == "99999999999"
    )
      return false;
    for (i = 1; i <= 9; i++)
      Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(CPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++)
      Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(CPF.substring(10, 11))) return false;
    return true;
  }
  if (!cpfHandler()) {
    res.status(422).send("CPF Inválido");
    return true;
  }
}

function checkLogin(req) {
  function profileHandler() {
    if (
      req.cookies.profile &&
      jwt.verify(
        req.cookies.profile.token,
        process.env.SECRET,
        (err, decoded) => {
          if (err) return console.log("TOKEN INVÁLIDO");
          return decoded.auth;
        }
      )
    ) {
      return false;
    }
    return true;
  }
  if (!profileHandler()) {
    return true;
  }
}

module.exports = { isEmpty, cpfFilter, checkLogin };
