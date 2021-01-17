const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;

const ProductModel = require("../database/models/product");
const decimalFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});
module.exports = class CartService {
  isCookieValid(cookie) {
    return jwt.verify(cookie.token, process.env.SECRET, (err, decoded) => {
      if (err) return false;
      return bcrypt.compareSync("true", decoded.token);
    });
  }

  async getCart(cookieProfile) {
    function getProductsID(cart) {
      const idList = [];
      cart.map((value) => {
        idList.push(ObjectId(value.id));
      });
      return idList;
    }

    function handleProdQty(dbResult, cart) {
      let cartTotal = 0;
      cart.map((cartProd) => {
        dbResult.map((dbProd) => {
          if (dbProd._id == cartProd.id) {
            let totalProdPrice = dbProd.price * cartProd.qty;
            dbProd.total = decimalFormat.format(totalProdPrice);
            dbProd.price = decimalFormat.format(dbProd.price);
            dbProd.qty = cartProd.qty;
            cartTotal += dbProd.price * cartProd.qty;
          }
        });
      });
      return {
        dbResult,
        cartTotal: decimalFormat.format(cartTotal),
      };
    }

    if (cookieProfile && this.isCookieValid(cookieProfile)) {
      if (cookieProfile.cart.length <= 0) {
        return { error: true, HTTPcode: 404 };
      } else {
        return await new ProductModel()
          .selectProductsByID(getProductsID(cookieProfile.cart))
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
    function isProductOnCart(cart, id) {
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
        let cartIndex = isProductOnCart(cookieProfile.cart, id);
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
