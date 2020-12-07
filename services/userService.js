const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  insertUser,
  selectUserExists,
  selectUser,
} = require("../database/userSQL");

module.exports = class UserService {
  async register(name, email, password, cpf) {
    function userDoesntExists(result) {
      return result.length === 0;
    }

    return await selectUserExists([email, cpf]).then((result) => {
      if (userDoesntExists(result)) {
        insertUser([name, email, bcrypt.hashSync(password), cpf]);
        return { error: false };
      } else {
        return { error: true, HTTPcode: 409 };
      }
    });
  }

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

    function generateLoginCookie() {
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

    return await selectUser([email]).then((result) => {
      if (userExists(result)) {
        return { error: false, cookie: generateLoginCookie() };
      } else {
        return { error: true, HTTPcode: 400 };
      }
    });
  }

  async logout(cookieProfile) {
    function isCookieValid(cookie) {
      return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
        return bcrypt.compareSync("true", decoded.token);
      });
    }

    if (cookieProfile) {
      if (isCookieValid(cookieProfile)) {
        return {
          error: false,
          cookie: {
            action: "delete",
            name: "profile",
            configs: {
              path: "/",
              sameSite: "None",
              secure: true,
              maxAge: 60000,
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

  async logged(profile) {
    if (profile) {
      return {
        error: false,
      };
    } else {
      return { error: true, HTTPcode: 403 };
    }
  }
};
