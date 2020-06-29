const con = require("../utils/conection.js");

function addIntoCart(request, response) {
  function pushIntoCart() {
    return request.cookies.profile["cart"].push({
      id: request.body.productID,
      quantity: 1,
    });
  }

  function findIndex() {
    return request.cookies.profile["cart"]
      .map(function (e) {
        return e.id;
      })
      .indexOf(request.body["productID"]);
  }

  function checkCart(array) {
    return array["id"] === request.body["productID"];
  }

  function addCart() {
    if (request.cookies.profile["cart"].length == 0) {
      pushIntoCart();
    } else {
      if (request.cookies.profile["cart"].some(checkCart)) {
        let position = findIndex();
        request.cookies.profile["cart"][position]["quantity"] += 1;
      } else {
        pushIntoCart();
      }
    }
    response.cookie("profile", request.cookies.profile, {
      maxAge: 900000,
      httpOnly: true,
    });
    return response.sendStatus(200);
  }
  addCart();
}

function getCartList(request, response) {
  let identifiers = [];

  function getProductIdentifier() {
    request.cookies.profile["cart"].map((value) => {
      identifiers.push(value["id"]);
    });
  }

  function handleQuantity(obj, array) {
    let newObj = [];
    let totalPrice = 0;
    obj.map((objValue) => {
      array.map((value, index) => {
        if (value == objValue["id_product"]) {
          objValue["quantity"] =
            request.cookies.profile["cart"][index]["quantity"];
          totalPrice += objValue["quantity"] * objValue["price"];
          newObj.push(objValue);
        }
      });
    });
    return [newObj, totalPrice];
  }

  function selectCartProd() {
    if (request.cookies.profile["cart"].length === 0) {
      return response.status(400).send("Nenhum Produto no Carrinho");
    } else {
      con.query(
        `SELECT id_product, name, price, img FROM products WHERE id_product in (${identifiers.join(
          ", "
        )})`,
        function (err, result) {
          if (err) throw err;
          let values = handleQuantity(result, identifiers);
          return response
            .status(200)
            .send({ newResult: values[0], totalPrice: values[1] });
        }
      );
    }
  }

  getProductIdentifier();
  selectCartProd();
}

module.exports = { addIntoCart, getCartList };
