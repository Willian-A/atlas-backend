const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken() {
  let hashToken = bcrypt.hashSync("true");
  let token = jwt.sign({ token: hashToken }, process.env.SECRET, {
    expiresIn: 9000, // expires in 2.5h
  });
  return token;
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
    } else {
      return res.status(400).send("Email ou Senha errados");
    }
  });
};

module.exports.logout = async (res) => {
  res.clearCookie("profile");
  res.sendStatus(200);
};

module.exports.logged = async (res) => {
  res.json(true);
};
