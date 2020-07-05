const con = require("../utils/conection.js");

function getAllProducts(request, response) {
  con.query(
    "SELECT id_product, name, FORMAT(price,2) as price, image FROM products",
    function (err, result) {
      if (err) throw err;
      return response.json({ result });
    }
  );
}

function getProduct(request, response) {
  con.query(
    "SELECT id_product, name, price, image, description FROM products where id_product = ?",
    [request.body.productID],
    function (err, result) {
      if (err) throw err;
      return response.json({ result });
    }
  );
}

module.exports = { getAllProducts, getProduct };
