const conn = require("./conection");

async function selectProducts(values) {
  const SQL = `SELECT product_id, name, FORMAT(price, 2) as price, image FROM products WHERE product_id in (${values})`;
  return new Promise((result, err) => {
    conn.query(SQL, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

module.exports = {
  selectProducts,
};
