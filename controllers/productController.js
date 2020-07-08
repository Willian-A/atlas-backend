const con = require("../utils/conection.js");
const createQuery = require("../utils/createQuery.js");

//retorna todos os produtos do BD
async function getAllProducts(res) {
  const result = await createQuery.createQuery(
    "SELECT id_product, name, FORMAT(price,2) as price, image FROM products"
  );
  return res.json({ result });
}

//retorna um produto baseado no ID passado
async function getProduct(data, response) {
  const result = await createQuery.createQuery(
    "SELECT id_product, name, FORMAT(price,2) as price, image, description FROM products where id_product = ?",
    [data.productID]
  );
  return response.json({ result });
}

module.exports = { getAllProducts, getProduct };
