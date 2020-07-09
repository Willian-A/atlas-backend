const createQuery = require("../utils/createQuery.js");

const decimalFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});

// adiciona produtos no carrinho
async function addIntoCart(data, res, cookie) {
  // adiciona produtos no array do carrinho
  function pushIntoCart() {
    return cookie.profile.cart.push({
      id: data.productID,
      quantity: 1,
    });
  }

  // retorna a posição de cada produto no array
  function findIndex() {
    return cookie.profile.cart
      .map((e) => {
        return e.id;
      })
      .indexOf(data.productID);
  }

  // verifica se o id do produto já está no carrinho
  function checkCart(array) {
    return array.id === data.productID;
  }

  // função principal
  function addCart() {
    if (cookie.profile.cart.length === 0) {
      pushIntoCart();
    } else if (cookie.profile.cart.some(checkCart)) {
      const position = findIndex();
      cookie.profile.cart[position].quantity += 1;
    } else {
      pushIntoCart();
    }
    res.cookie("profile", cookie.profile, {
      maxAge: 900000,
      httpOnly: true,
    });
    return { error: false };
  }
  return addCart();
}

// retorna toda a lista do carrinho
async function getCartList(cookie, res) {
  const identifiers = [];

  // coleta o ID de cada produto no carrinho
  function getProductIdentifier() {
    cookie.profile.cart.map((value) => {
      identifiers.push(value.id);
    });
  }

  // identifica a quantidade do produto
  function handleQuantity(results, productsID) {
    const newResults = [];
    let totalPrice = 0;
    results.map((resultObj) => {
      productsID.map((productID, index) => {
        if (productID == resultObj.id_product) {
          resultObj.quantity = cookie.profile.cart[index].quantity;
          totalPrice += resultObj.quantity * resultObj.price;
          newResults.push(resultObj);
        }
      });
    });
    return [newResults, totalPrice];
  }

  // função principal
  function selectCartProd() {
    getProductIdentifier();
    if (cookie.profile.cart.length === 0) {
      return res.status(400).send("Nenhum Produto no Carrinho");
    }
    return createQuery
      .createQuery(
        `SELECT id_product, name, FORMAT(price,2) as price, image FROM products WHERE id_product in (${identifiers.join(
          ", "
        )})`
      )
      .then((results) => {
        const values = handleQuantity(results, identifiers);
        return {
          error: false,
          info: {
            newResult: values[0],
            totalPrice: decimalFormat.format(values[1]),
          },
        };
      })
      .catch(() => {
        return { error: "Erro Interno", status: 500 };
      });
  }

  return selectCartProd();
}

module.exports = { addIntoCart, getCartList };
