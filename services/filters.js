const bcrypt = require("bcryptjs");

const filters = {
  checkLogin(request) {
    if (
      request.cookies.profile &&
      bcrypt.compareSync("logged", request.cookies.profile["status"])
    ) {
      return true;
    }
  },
  isEmpty(request) {
    for (let field in request.body) {
      if (request.body[field]) {
        return true;
      }
    }
  },
  cpfFilter(CPF) {
    var Soma;
    var Resto;
    Soma = 0;
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
  },
};

module.exports = { filters };
