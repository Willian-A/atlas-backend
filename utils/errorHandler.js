//  forma universão para detectar erro e retornar a response
function errorHandler(promise, res) {
  if (promise.error) {
    return res.status(promise.status).send(promise.error);
  } else if (promise.info) {
    return res.status(200).send(promise.info);
  }
  return res.sendStatus(200);
}

module.exports = { errorHandler };
