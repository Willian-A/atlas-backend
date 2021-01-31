const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;

const ProductModel = require("../database/models/product");

module.exports = class CartService {
  isCookieValid(cookie) {
    return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
      if (err) return false;
      return bcrypt.compareSync("true", decoded.token);
    });
  }

  async getCartProducts(cookieProfile) {
    function getProdID(cart) {
      const idList = [];
      cart.forEach((value) => {
        idList.push(ObjectId(value.id));
      });
      return idList;
    }

    function handleProdQty(dbResult, cart) {
      let cartTotal = 0;
      cart.forEach((cartProd) => {
        dbResult.forEach((dbProd) => {
          if (dbProd._id.toString() === cartProd.id) {
            let prodTotal = dbProd.price * cartProd.qty;
            cartTotal += prodTotal;
            dbProd.total = prodTotal.toFixed(2);
            dbProd.price = dbProd.price.toFixed(2);
            dbProd.qty = cartProd.qty;
          }
        });
      });
      return {
        dbResult,
        cartTotal: cartTotal.toFixed(2),
      };
    }

    if (cookieProfile && this.isCookieValid(cookieProfile)) {
      if (cookieProfile.cart.length <= 0) {
        return { error: true, HTTPcode: 404 };
      } else {
        return await new ProductModel()
          .selectProductsByID(getProdID(cookieProfile.cart))
          .then((result) => {
            return {
              error: false,
              payload: handleProdQty(result, cookieProfile.cart),
            };
          });
      }
    } else {
      return { error: true, HTTPcode: 403 };
    }
  }

  async addProdOnCart(id, cookieProfile) {
    function isProductOnCart(id, cart) {
      const idList = [];
      cart.forEach((value) => {
        idList.push(value.id);
      });
      return idList.findIndex((value) => {
        return value.toString() == id.toString();
      });
    }

    function createCookie() {
      return {
        action: "update",
        name: "profile",
        payload: {
          token: cookieProfile.token,
          cart: cookieProfile.cart,
        },
      };
    }

    if (cookieProfile && cookieProfile.token) {
      if (this.isCookieValid(cookieProfile)) {
        let cartIndex = isProductOnCart(id, cookieProfile.cart);
        if (cartIndex >= 0) {
          cookieProfile.cart[cartIndex].qty += 1;
        } else {
          cookieProfile.cart.push({ id, qty: 1 });
        }
        return { error: false, cookie: createCookie() };
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
