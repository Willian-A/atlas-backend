const conn = require("./conection");

async function selectProduct(values) {
  const SQL =
    "SELECT *, FORMAT(price,2) as price FROM products WHERE product_id = ?";
  return new Promise((result, err) => {
    conn.query(SQL, values, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

async function selectLimitedProducts(qty) {
  const SQL = `SELECT *, FORMAT(price,2) as price FROM products LIMIT ?`;
  return new Promise((result, err) => {
    conn.query(SQL, qty, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

async function selectAllProducts() {
  const SQL = "SELECT *, FORMAT(price,2) as price FROM products";
  return new Promise((result, err) => {
    conn.query(SQL, (queryErr, queryResult) => {
      if (queryErr) return err(new Error(queryErr));
      return result(JSON.parse(JSON.stringify(queryResult)));
    });
  });
}

module.exports = {
  selectProduct,
  selectLimitedProducts,
  selectAllProducts,
};
