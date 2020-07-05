const con = require("../utils/conection.js");

function getAllProducts(req, res) {
  con.query("SELECT id_product, name, price, image FROM products", function (
    err,
    result
  ) {
    if (err) throw err;
    return res.json({ result });
  });
}

function getProduct(req, res) {
  con.query(
    "SELECT id_product, name, price, image, description FROM products where id_product = ?",
    [req.body.productID],
    function (err, result) {
      if (err) throw err;
      return res.json({ result });
    }
  );
}

module.exports = { getAllProducts, getProduct };
