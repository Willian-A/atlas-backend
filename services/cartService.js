const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;

const ProductModel = require("../database/models/product");

module.exports = function CartService(cookieProfile) {
  const ProductSQL = new ProductModel();
  let cookie = cookieProfile;
  let cart = cookieProfile.cart;
  let token = cookieProfile.token;

  // private
  function prodsID() {
    let idList = [];
    cart.forEach((value) => idList.push(ObjectId(value.id)));
    return idList;
  }

  // private
  function cookieIsValid() {
    if (cookie && token) {
      return jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return false;
        return bcrypt.compareSync("true", decoded.token);
      });
    } else return false;
  }

  function handlePrices(dbResult, cart) {
    let cartTotal = 0;
    cart.forEach((cartProd) => {
      dbResult.forEach((dbProd) => {
        if (dbProd._id.toString() === cartProd.id) {
          dbProd.qty = cartProd.qty;
          dbProd.total = dbProd.price * cartProd.qty;
          cartTotal += dbProd.total;
          dbProd.total = dbProd.total.toFixed(2);
          dbProd.price = dbProd.price.toFixed(2);
        }
      });
    });
    return { dbResult, cartTotal: cartTotal.toFixed(2) };
  }

  // public
  async function getCart() {
    if (cookieIsValid()) {
      if (cart.length > 0) {
        return await ProductSQL.selectByID(prodsID(cart)).then((result) => {
          return {
            error: false,
            payload: handlePrices(result, cart),
          };
        });
      } else return { error: true, HTTPcode: 404 };
    }
  }

  // public
  async function addOnCart(id) {
    function isProductOnCart(id, cart) {
      const idList = [];
      cart.forEach((value) => {
        idList.push(value.id);
      });
      return idList.findIndex((value) => {
        return value.toString() == id.toString();
      });
    }

    if (cookieIsValid()) {
      let productIndex = isProductOnCart(id, cart);
      if (productIndex >= 0) {
        cart[productIndex].qty += 1;
      } else {
        cart.push({ id, qty: 1 });
      }
      return {
        error: false,
        cookie: {
          action: "update",
          name: "profile",
          payload: {
            token: token,
            cart: cart,
          },
        },
      };
    } else return { error: true, HTTPcode: 403 };
  }

  return {
    getCart: getCart,
    addOnCart: addOnCart,
  };
};
