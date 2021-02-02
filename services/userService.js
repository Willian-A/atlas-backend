const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../database/models/user");

module.exports = class UserService {
  constructor() {
    this.UserSQL = new UserModel();
    this.isCookieValid = (cookie) => {
      return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
        if (err) return false;
        return bcrypt.compareSync("true", decoded.token);
      });
    };
    this.userExists = (dbResult) => {
      return dbResult.length != 0;
    };
  }
  //
  async register(name, email, password, cpf) {
    return this.UserSQL.selectUser(email).then((dbResult) => {
      if (!this.userExists(dbResult)) {
        this.UserSQL.insertUser({
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
      };
    }

    return this.UserSQL.selectUser(email).then((dbResult) => {
      if (
        this.userExists(dbResult) &&
        bcrypt.compareSync(password, dbResult[0].password)
      ) {
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
          payload: true,
        };
      } else {
        return { error: true, HTTPcode: 403, payload: false };
      }
    } else {
      return { error: true, HTTPcode: 403, payload: false };
    }
  }
};
