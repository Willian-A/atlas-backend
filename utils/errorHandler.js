function errorHandler(promise, res) {
  if (promise.error) {
    return res.status(promise.status).send(promise.error);
  } else {
    return res.sendStatus(200);
  }
}

module.exports = { errorHandler };
