const ObjectId = require("mongodb").ObjectID;

module.exports.getCart = (application, req, res) => {
  let cart = req.cookies.profile.cart;
  const conn = application.config.dbConnection.getDB();
  const productModel = new application.app.models.productDAO(conn);

  const productsIDs = () => {
    const productIDs = [];
    cart.forEach((value) => {
      productIDs.push(ObjectId(value.id));
    });
    return productIDs;
  };

  if (cart.length <= 0) {
    res.status(404).send("Nenhum Produto no Carrinho");
  } else {
    let total = 0;
    let arrayIDs = productsIDs();
    productModel.getProductsArray(arrayIDs).then((result) => {
      cart.forEach((cartValue) => {
        result.forEach((resultValue) => {
          if (cartValue.id === resultValue._id.toString()) {
            resultValue.qty = cartValue.qty;
            resultValue.total = cartValue.qty * resultValue.price;
            total += resultValue.total;
          }
        });
      });
      res.json({ result, total });
    });
  }
};

module.exports.addOnCart = (req, res) => {
  let cart = req.cookies.profile.cart;
  let token = req.cookies.profile.token;
  let id = req.body.id;

  const isOnCart = () => {
    const productIDs = [];
    cart.forEach((value) => {
      productIDs.push(value.id);
    });
    return productIDs.findIndex((value) => value.toString() === id.toString());
  };

  let index = isOnCart();
  index >= 0 ? (cart[index].qty += 1) : cart.push({ id, qty: 1 });

  res.cookie(
    "profile",
    { token: token, cart: cart },
    {
      sameSite: "None",
      secure: true,
    }
  );
  res.sendStatus(200);
};

module.exports.removeFromCart = (req, res) => {
  let cart = req.cookies.profile.cart;
  let token = req.cookies.profile.token;
  let id = req.body.id;

  const isOnCart = () => {
    const productIDs = [];
    cart.forEach((value) => {
      productIDs.push(value.id);
    });
    return productIDs.findIndex((value) => value.toString() === id.toString());
  };

  let index = isOnCart();
  if (index >= 0) {
    if (cart[index].qty === 1) {
      cart.splice(index, 1);
    } else {
      cart[index].qty -= 1;
    }
  }
  res.cookie(
    "profile",
    { token: token, cart: cart },
    {
      sameSite: "None",
      secure: true,
    }
  );
  res.sendStatus(200);
};
