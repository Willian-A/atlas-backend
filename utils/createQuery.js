const connection = require("./conection.js");

//  cria uma query para o BD
function createQuery(query, fields) {
  return new Promise((result, error) => {
    connection.query(query, fields, (err, queryResult) => {
      if (err) error(new Error(err));
      return result(queryResult);
    });
  });
}

module.exports = { createQuery };
