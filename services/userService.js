const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../database/models/user");

module.exports = class UserService {
  isCookieValid(cookie) {
    return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
      if (err) return false;
      return bcrypt.compareSync("true", decoded.token);
    });
  }

  async register(name, email, password, cpf) {
    function userDoesntExists(result) {
      return result.length === 0;
    }

    return new UserModel().selectUser(email).then((result) => {
      if (userDoesntExists(result)) {
        new UserModel().insertUser({
          name,
          email,
          password: bcrypt.hashSync(password),
          cpf,
        });
        return { error: false };
      } else {
        return { error: true, HTTPcode: 409 };
      }
    });
  }
  //a
  async login(email, password) {
    function userExists(result) {
      return (
        result.length !== 0 && bcrypt.compareSync(password, result[0].password)
      );
    }

    function generateToken() {
      let hashToken = bcrypt.hashSync("true");
      let token = jwt.sign({ token: hashToken }, process.env.SECRET, {
        expiresIn: 9000, // expires in 2.5h
      });
      return token;
    }

    function generateCookie() {
      return {
        action: "create",
        name: "profile",
        payload: { token: generateToken(), cart: [] },
        configs: {
          sameSite: "None",
          secure: true,
          maxAge: 3600000 * 2.5, // (seconds * time) expires in 2.5h
        },
      };
    }

    return new UserModel().selectUser(email).then((result) => {
      if (userExists(result)) {
        return { error: false, cookie: generateCookie() };
      } else {
        return { error: true, HTTPcode: 400 };
      }
    });
  }

  async logout(cookieProfile) {
    if (cookieProfile) {
      if (this.isCookieValid(cookieProfile)) {
        return {
          error: false,
          cookie: {
            action: "delete",
            name: "profile",
            configs: {
              path: "/",
              sameSite: "None",
              secure: true,
              maxAge: 60000, // expires in 1min,
            },
          },
        };
      } else {
        return { error: true, HTTPcode: 403 };
      }
    } else {
      return { error: true, HTTPcode: 403 };
    }
  }

  async logged(cookieProfile) {
    if (cookieProfile) {
      if (this.isCookieValid(cookieProfile)) {
        return {
          error: false,
        };
      } else {
        return { error: true, HTTPcode: 403 };
      }
    } else {
      return { error: true, HTTPcode: 403 };
    }
  }
};
