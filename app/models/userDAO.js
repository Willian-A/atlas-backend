class userDAO {
  constructor(conn) {
    this._conn = conn;
  }

  getUser = (values) => {
    return this._conn.collection("users").find(values).toArray();
  };

  inserUser = (values) => {
    return this._conn.collection("users").insertOne(values);
  };
}

module.exports = (app) => {
  return userDAO;
};
