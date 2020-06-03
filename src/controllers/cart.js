const con = require("../utils/conection.js");

const addIntoCart = (request, response) => {
  let profile = {
    cart: [],
    status: "",
  };

  function setValues() {
    for (let field in profile) {
      profile[field] = request.cookies.profile[field];
    }
  }

  function pushCart() {
    return profile["cart"].push({
      id: request.body["productID"],
      quantity: 1,
    });
  }

  function findIndex() {
    return profile["cart"]
      .map(function (e) {
        return e.id;
      })
      .indexOf(request.body["productID"]);
  }

  function checkCart(array) {
    return array["id"] === request.body["productID"];
  }

  function addCart() {
    if (profile["cart"].length == 0) {
      pushCart();
    } else {
      if (profile["cart"].some(checkCart)) {
        let position = findIndex();
        profile["cart"][position]["quantity"] += 1;
      } else {
        pushCart();
      }
    }
    response.cookie("profile", request.cookies.profile, {
      maxAge: 900000,
      httpOnly: true,
    });
    return response.sendStatus(200);
  }

  setValues();
  addCart();
};

const getCart = (request, response) => {
  let profile = {
    cart: [],
    status: "",
  };
  let identifiers = [];

  function setValues() {
    for (let field in profile) {
      profile[field] = request.cookies.profile[field];
    }
    profile["cart"].map((value) => {
      identifiers.push(value["id"]);
    });
  }

  function handleQuantity(obj, array) {
    let newObj = [];
    obj.map((objValue) => {
      array.map((value, index) => {
        if (value == objValue["id_product"]) {
          objValue["quantity"] = profile["cart"][index]["quantity"];
          newObj.push(objValue);
        }
      });
    });
    return newObj;
  }

  function selectProd() {
    con.query(
      `SELECT id_product, name, price, img FROM products WHERE id_product in (${identifiers.join(
        ", "
      )})`,
      function (err, result) {
        if (err) throw err;
        let newResult = handleQuantity(result, identifiers);
        return response.status(200).send({ newResult });
      }
    );
  }

  setValues();
  selectProd();
};
module.exports = { addIntoCart, getCart };
