const con = require("../utils/conection.js");
var today = new Date();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
function searchProduct(request, response) {
  con.query(
    "SELECT id_product, name, price, img FROM products",

    function (err, result) {
      if (err) throw err;
      console.log(request.path, request.route.methods, "at " + time, "\n");
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
      console.log(request.path, request.route.methods, "at " + time, "\n");
      return response.json({ result });
    }
  );
}

module.exports = { searchProduct, getProduct };
