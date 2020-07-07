const con = require("../utils/conection.js");

function createQuery(query, fields) {
  return new Promise((result, error) => {
    con.query(query, fields, function (err, queryResult) {
      if (err) error(new Error(err));
      return result(queryResult);
    });
  });
}

module.exports = { createQuery };
