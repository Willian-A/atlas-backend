const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  insertUser,
  selectUserExists,
  selectUser,
  insertUserSession,
} = require("../database/userSQL");

module.exports = class UserService {
  async register(name, email, password, cpf) {
    let result = await selectUserExists([email, cpf]);

    if (result.length === 0) {
      insertUser([name, email, bcrypt.hashSync(password), cpf]);
      return { error: false };
    } else {
      return { error: true, HTTPcode: 409 };
    }
  }

  async login(email, password) {
    let result = await selectUser([email]);
    if (
      result.length != 0 &&
      bcrypt.compareSync(password, result[0].password)
    ) {
      /*let token = jwt.sign({ auth: true }, process.env.SECRET, {
        expiresIn: 9000, // expires in 2.5h
      });*/
      let hashToken = bcrypt.hashSync("true");
      let token = jwt.sign({ token: hashToken }, process.env.SECRET, {
        expiresIn: 9000, // expires in 2.5h
      });
      await insertUserSession([hashToken, result[0].user_id]);
      let cookie = {
        action: "create",
        name: "profile",
        payload: { token, cart: [] },
        configs: {
          maxAge: 3600000 * 2.5, // (seconds * time) expires in 2.5h
        },
      };

      return { error: false, cookie: cookie };
    } else {
      return { error: true, HTTPcode: 400 };
    }
  }

  async logout(profile) {
    if (profile) {
      let isValid = jwt.verify(profile, process.env.SECRET, (err, decoded) => {
        return bcrypt.compareSync("true", decoded.token);
      });

      if (isValid) {
        return {
          error: false,
          cookie: {
            action: "delete",
            name: "profile",
          },
        };
      } else {
        return { error: true, HTTPcode: 403 };
      }
    } else {
      return { error: true, HTTPcode: 403 };
    }
  }
};
