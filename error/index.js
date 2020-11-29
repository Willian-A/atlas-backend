module.exports = class ErrorHandler {
  constructor(response, status) {
    this.res = response;
    this.status = status;
  }

  checkHttpCode() {
    const httpStatusCodes = {
      200: "OK",
      400: "Email ou Senha errados",
      404: "Não Encontrado",
      409: "Email ou CPF já cadastrados",
      500: "Erro Interno do Servidor",
    };

    if (this.status.error) {
      return this.res
        .status(this.status.HTTPcode)
        .send(httpStatusCodes[this.status.HTTPcode]);
    } else if (this.status.cookie) {
      this.res.cookie(
        this.status.cookie.name,
        this.status.cookie.payload,
        this.status.cookie.configs
      );
    }
    return this.res.sendStatus(200);
  }
};
