const createQuery = require("../utils/createQuery.js");

//  retorna todos os produtos do BD
async function getAllProducts(res, limit) {
  //  define o tipo da query, se é apenas alguns produtos ou todos
  let query;
  if (limit >= 1) {
    query = `SELECT id_product, name, FORMAT(price,2) as price, image FROM products LIMIT ${limit}`;
  } else {
    query =
      "SELECT id_product, name, FORMAT(price,2) as price, image FROM products";
  }
  const result = await createQuery.createQuery(query);
  return res.json({ result });
}

//  retorna um produto baseado no ID passado
async function getProduct(data, response) {
  const result = await createQuery.createQuery(
    "SELECT id_product, name, FORMAT(price,2) as price, image, description FROM products where id_product = ?",
    [data.productID]
  );
  return response.json({ result });
}

module.exports = { getAllProducts, getProduct };
