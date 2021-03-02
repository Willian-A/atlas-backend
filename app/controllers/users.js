const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken() {
  let hashToken = bcrypt.hashSync("true");
  let token = jwt.sign({ token: hashToken }, process.env.SECRET, {
    expiresIn: 9000, // expires in 2.5h
  });
  return token;
}

function isCookieValid(cookie) {
  return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
    if (err) return false;
    return bcrypt.compareSync("true", decoded.token);
  });
}

module.exports.register = (application, req, res) => {
  const conn = application.config.dbConnection.getDB();
  const userModel = new application.app.models.userDAO(conn);
  userModel.getUser({ email: req.body.email }).then((result) => {
    if (result.length > 0) {
      res.status(409).send("Email ou CPF já Cadastrados");
    } else {
      userModel.inserUser({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        cpf: req.body.cpf,
      });
      res.sendStatus(200);
    }
  });
};

module.exports.login = (application, req, res) => {
  if (req.cookies.profile) {
    if (isCookieValid(req.cookies.profile)) {
      return res.status(409).send("O Usuario já está Logado");
    }
  }
  const conn = application.config.dbConnection.getDB();
  const userModel = new application.app.models.userDAO(conn);

  userModel.getUser({ email: req.body.email }).then((result) => {
    if (
      result.length > 0 &&
      bcrypt.compareSync(req.body.password, result[0].password)
    ) {
      res.cookie(
        "profile",
        { token: generateToken(), cart: [] },
        {
          sameSite: "None",
          secure: true,
        }
      );
      res.sendStatus(200);
    }
  });
};

module.exports.logout = async (req, res) => {
  if (req.cookies.profile) {
    if (isCookieValid(req.cookies.profile)) {
      res.clearCookie("profile");
      res.sendStatus(200);
    } else {
      res.status(401).send("Esta Sessão não é Valida");
    }
  } else {
    res.status(401).send("Usuario não Logado");
  }
};
module.exports.logged = async (req, res) => {
  if (req.cookies.profile) {
    if (isCookieValid(req.cookies.profile)) {
      res.sendStatus(200);
    } else {
      res.status(401).send("Usuario não Logado");
    }
  } else {
    res.status(401).send("Usuario não Logado");
  }
};
