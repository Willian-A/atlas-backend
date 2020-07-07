const con = require("../utils/conection.js");
const createQuery = require("../utils/createQuery.js");

const decimalFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});

//adiciona produtos no carrinho
function addIntoCart(request, response) {
  //adiciona produtos no array do carrinho
  function pushIntoCart() {
    return request.cookies.profile["cart"].push({
      id: request.body.productID,
      quantity: 1,
    });
  }

  //retorna a posição de cada produto no array
  function findIndex() {
    return request.cookies.profile["cart"]
      .map(function (e) {
        return e.id;
      })
      .indexOf(request.body["productID"]);
  }

  //verifica se o id do produto já está no carrinho
  function checkCart(array) {
    return array["id"] === request.body["productID"];
  }

  //função principal
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

//retorna toda a lista do carrinho
function getCartList(request, response) {
  let identifiers = [];

  //coleta o ID de cada produto no carrinho
  function getProductIdentifier() {
    request.cookies.profile["cart"].map((value) => {
      identifiers.push(value["id"]);
    });
  }

  //identifica a quantidade do produto
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

  //função principal
  function selectCartProd() {
    if (request.cookies.profile["cart"].length === 0) {
      return response.status(400).send("Nenhum Produto no Carrinho");
    } else {
      createQuery
        .createQuery(
          `SELECT id_product, name, FORMAT(price,2) as price, image FROM products WHERE id_product in (${identifiers.join(
            ", "
          )})`
        )
        .then((results) => {
          let values = handleQuantity(results, identifiers);
          response.status(200).send({
            newResult: values[0],
            totalPrice: decimalFormat.format(values[1]),
          });
        });
    }
  }

  getProductIdentifier();
  selectCartProd();
}

module.exports = { addIntoCart, getCartList };
