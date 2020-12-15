const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { selectProducts } = require("../database/cartSQL");

module.exports = class CartService {
  async getCart(cookieProfile) {
    function getProductsIDs(cookie) {
      const productsIDs = [];
      cookie.cart.map((value) => {
        productsIDs.push(value.id);
      });
      return productsIDs;
    }

    function handleQuantity(dbResult, cookie) {
      let cartTotal = 0;
      cookie.cart.map((cartProduct, i) => {
        dbResult.map((dbProduct, index) => {
          if (dbProduct.product_id == cartProduct.id) {
            dbProduct.totalPrice = dbProduct.price * cartProduct.qty;
            cartTotal += dbProduct.price * cartProduct.qty;
            dbProduct.qty = cartProduct.qty;
          }
        });
      });
      return { dbResult, cartTotal };
    }

    return await selectProducts(getProductsIDs(cookieProfile)).then(
      (result) => {
        return { error: false, payload: handleQuantity(result, cookieProfile) };
      }
    );
  }

  async addCartProduct(id, cookieProfile) {
    function isCookieValid(cookie) {
      return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
        if (err) return false;
        return bcrypt.compareSync("true", decoded.token);
      });
    }

    function isProductInCart(cookie, id) {
      let positions = [];
      cookie.cart.map((value, i) => {
        positions.push(i);
      });
      return positions.findIndex((value, i) => {
        return cookie.cart[value].id === id;
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

    if (cookieProfile.token) {
      if (isCookieValid(cookieProfile)) {
        let cartIndex = isProductInCart(cookieProfile, id);
        if (cartIndex >= 0) {
          cookieProfile.cart[cartIndex].qty += 1;
        } else {
          cookieProfile.cart.push({ id, qty: 1 });
        }
        return { error: false, cookie: generateCookie() };
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
