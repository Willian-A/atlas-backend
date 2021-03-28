const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.isLogged = (req, res, next) => {
  function cookieIsValid() {
    if (req.cookies.profile && req.cookies.profile.token) {
      let token = req.cookies.profile.token;
      return jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return false;
        return bcrypt.compareSync("true", decoded.token);
      });
    } else return false;
  }

  if (cookieIsValid()) {
    next();
  } else {
    res.status(401).send("Usuario não Logado");
  }
};
