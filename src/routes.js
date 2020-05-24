const { Router } = require("express");
const selectController = require("./controllers/selectController.js");
const user = require("./controllers/user.js");
const bcrypt = require("bcryptjs");
const con = require("./utils/conection.js");

const routes = Router();
routes.get("/cart", (request, response) => {
  let array = [];

  function handleQuantity(obj, array) {
    let newObj = [];
    obj.map((value, index) => {
      let newValue = value;
      array.map((value, index) => {
        if (value == newValue["id_product"]) {
          newValue["quantity"] =
            request.cookies.profile["cart"][index]["quantity"];
          newObj.push(newValue);
        }
      });
    });
    return newObj;
  }
  if (request.cookies.profile == null) {
    return response.status(422).send("Campos com Conteudo Inválido");
  } else {
    request.cookies.profile["cart"].map((value) => {
      array.push(value["id"]);
    });
    con.query(
      `SELECT id_product, name, price, img FROM products WHERE id_product in (${array.join(
        ", "
      )})`,
      function (err, result) {
        if (err) throw err;
        let newResult = handleQuantity(result, array);
        return response.status(200).send({ newResult });
      }
    );
  }
});

routes.get("/product", selectController.searchProduct);
routes.post("/productPage", selectController.getProduct);
routes.post("/cadastrar", user.register);

routes.post(
  "/login",
  (request, response, next) => {
    if (request.cookies.profile == null) {
      request.cookies.profile = { name: "", cart: [], status: "" };
    }
    if (bcrypt.compareSync("logged", request.cookies.profile["status"])) {
      console.log(request.cookies.profile["name"], "Already Logged");
      return response.status(409).send("Você Já Está Logado");
    } else {
      next();
    }
  },
  user.login
);
routes.get("/logout", (request, response) => {
  if (request.cookies.profile != null) {
    console.log("A");
    response.clearCookie("profile", { path: "/" });
    return response.sendStatus(200);
  }
});

routes.post("/addCart", (request, response) => {
  function teste(array) {
    return array["id"] === request.body["productID"];
  }
  if (request.cookies.profile["cart"].length == 0) {
    request.cookies.profile["cart"].push({
      id: request.body["productID"],
      quantity: 1,
    });
  } else {
    if (request.cookies.profile["cart"].some(teste)) {
      let position = request.cookies.profile["cart"]
        .map(function (e) {
          return e.id;
        })
        .indexOf(request.body["productID"]);
      request.cookies.profile["cart"][position]["quantity"] += 1;
    } else {
      request.cookies.profile["cart"].push({
        id: request.body["productID"],
        quantity: 1,
      });
    }
  }
  response.cookie("profile", request.cookies.profile, {
    maxAge: 900000,
    httpOnly: true,
  });

  return response.sendStatus(200);
});

module.exports = routes;
