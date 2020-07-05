const con = require("../utils/conection.js");

function addIntoCart(req, res) {
  function pushIntoCart() {
    return req.cookies.profile["cart"].push({
      id: req.body.productID,
      quantity: 1,
    });
  }

  function findIndex() {
    return req.cookies.profile["cart"]
      .map(function (e) {
        return e.id;
      })
      .indexOf(req.body["productID"]);
  }

  function checkCart(array) {
    return array["id"] === req.body["productID"];
  }

  function addCart() {
    if (req.cookies.profile["cart"].length == 0) {
      pushIntoCart();
    } else {
      if (req.cookies.profile["cart"].some(checkCart)) {
        let position = findIndex();
        req.cookies.profile["cart"][position]["quantity"] += 1;
      } else {
        pushIntoCart();
      }
    }
    res.cookie("profile", req.cookies.profile, {
      maxAge: 900000,
      httpOnly: true,
    });
    return res.sendStatus(200);
  }
  addCart();
}

function getCartList(req, res) {
  let identifiers = [];

  function getProductIdentifier() {
    req.cookies.profile["cart"].map((value) => {
      identifiers.push(value["id"]);
    });
  }

  function handleQuantity(obj, array) {
    let newObj = [];
    let totalPrice = 0;
    obj.map((objValue) => {
      array.map((value, index) => {
        if (value == objValue["id_product"]) {
          objValue["quantity"] = req.cookies.profile["cart"][index]["quantity"];
          totalPrice += objValue["quantity"] * objValue["price"];
          newObj.push(objValue);
        }
      });
    });
    return [newObj, totalPrice];
  }

  function selectCartProd() {
    if (req.cookies.profile["cart"].length === 0) {
      return res.status(400).send("Nenhum Produto no Carrinho");
    } else {
      con.query(
        `SELECT id_product, name, price, img FROM products WHERE id_product in (${identifiers.join(
          ", "
        )})`,
        function (err, result) {
          if (err) throw err;
          let values = handleQuantity(result, identifiers);
          return res
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
