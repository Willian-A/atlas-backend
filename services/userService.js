const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var session = require("express-session");

const {
  insertUser,
  selectUserExists,
  selectUser,
} = require("../database/userSQL");

module.exports = class UserService {
  constructor(nome, email, password, cpf) {
    this.name = nome || undefined;
    this.email = email || undefined;
    this.password = password || undefined;
    this.cpf = cpf || undefined;
  }

  async register() {
    let result = await selectUserExists([this.email, this.cpf]);

    if (result.length === 0) {
      insertUser([
        this.name,
        this.email,
        bcrypt.hashSync(this.password),
        this.cpf,
      ]);
      return { error: false };
    } else {
      return { error: true, HTTPcode: 409 };
    }
  }

  async login() {
    let result = await selectUser([this.email]);
    if (
      result.length != 0 &&
      bcrypt.compareSync(this.password, result[0].password)
    ) {
      let token = bcrypt.hashSync("kkk");
      let cookie = {
        name: "profile",
        payload: token,
        configs: {
          maxAge: 3600000 * 2.5, // (seconds * time) expires in 2.5h
          sameSite: "None",
          secure: true,
          httpOnly: true,
        },
      };

      return { error: false, cookie: cookie };
    } else {
      return { error: true, HTTPcode: 400 };
    }
  }
};
