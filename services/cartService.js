const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = class CartService {
  async getCart(profile) {
    const productsIDs = [];
    profile.cart.map((value) => {
      productsIDs.push(value.id);
    });
    return { error: false };
  }

  async addCartProduct(id, profile) {
    if (profile) {
      let decoded = jwt.verify(profile.token, process.env.SECRET);
      let isValid = bcrypt.compareSync("true", decoded.token);
      if (isValid) {
        let cartIndex = profile.cart.findIndex((value, i) => {
          return value.id === id;
        });
        if (cartIndex >= 0) {
          profile.cart[cartIndex].qty += 1;
        } else {
          profile.cart.push({ id, qty: 1 });
        }
        let cookie = {
          action: "update",
          name: "profile",
          payload: {
            token: profile.token,
            cart: profile.cart,
          },
        };
        return { error: false, cookie: cookie };
      } else {
        return { error: true, HTTPcode: 403 };
      }
    } else {
      return { error: true, HTTPcode: 403 };
    }
  }

  async removeCartProduct(id, profile) {
    return { error: false, payload: result };
  }
};
