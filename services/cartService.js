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
    function getProductsIDs(cart) {
      const idList = [];
      cart.forEach((value) => {
        idList.push(ObjectId(value.id));
      });
      return idList;
    }

    function formatPrices(dbResult, cartTotal) {
      dbResult.forEach((dbProd) => {
        dbProd.price = dbProd.price.toFixed(2);
        dbProd.total = dbProd.total.toFixed(2);
      });

      return { dbResult, cartTotal: cartTotal.toFixed(2) };
    }

    function handleProdQty(dbResult, cart) {
      let cartTotal = 0;
      cart.forEach((cartProd) => {
        dbResult.forEach((dbProd) => {
          if (dbProd._id.toString() === cartProd.id) {
            dbProd.total = dbProd.price * cartProd.qty;
            dbProd.qty = cartProd.qty;
            cartTotal += dbProd.price * cartProd.qty;
          }
        });
      });
      return formatPrices(dbResult, cartTotal);
    }

    if (cookieProfile && this.isCookieValid(cookieProfile)) {
      if (cookieProfile.cart.length <= 0) {
        return { error: true, HTTPcode: 404 };
      } else {
        return await new ProductModel()
          .selectProductsByID(getProductsIDs(cookieProfile.cart))
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
      let positions = [];
      cart.map((value, i) => {
        positions.push(i);
      });
      return positions.findIndex((value, i) => {
        return cart[value].id === id;
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
