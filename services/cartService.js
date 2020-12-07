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

  async addCartProduct(id, cookieProfile) {
    function isCookieValid(cookie) {
      return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
        return bcrypt.compareSync("true", decoded.token);
      });
    }

    function isProductInCart(cookie, id) {
      return cookie.cart.findIndex((value, i) => {
        return value.id === id;
      });
    }

    function generateCookie() {
      return {
        action: "update",
        name: "profile",
        payload: {
          token: cookieProfile.token,
          cart: cookieProfile.cart,
        },
      };
    }

    if (cookieProfile) {
      if (isCookieValid(cookieProfile)) {
        if (isProductInCart(cookieProfile, id) >= 0) {
          cookieProfile.cart[cartIndex].qty += 1;
        } else {
          cookieProfile.cart.push({ id, qty: 1 });
        }
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
