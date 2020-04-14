const con = require("../utils/conection.js");

function searchProduct(request, response) {
  con.query(
    "SELECT id_product, name, price, img FROM products",

    function (err, result) {
      if (err) throw err;
      console.log("Loaded All Products");
      return response.json({ result });
    }
  );
}

function getProduct(request, response) {
  con.query(
    "SELECT name, price, img, description FROM products where id_product = ?",
    [request.body.productID],
    function (err, result) {
      if (err) throw err;
      console.log(
        "Post Product " +
          result[0]["name"] +
          "\n" +
          "---------------------------------------------"
      );
      return response.json({ result });
    }
  );
}

module.exports = { searchProduct, getProduct };
