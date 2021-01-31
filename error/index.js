module.exports = class ErrorFactory {
  constructor(response, status) {
    this.res = response;
    this.status = status;
  }

  checkHttpCode() {
    const httpStatusCodes = {
      200: "OK",
      400: "Email ou Senha errados",
      403: "Usuario não Logado",
      404: "Nada no Carrinho",
      409: "Email ou CPF já cadastrados",
      500: "Erro Interno do Servidor",
    };

    try {
      if (this.status.error) {
        if (typeof this.status.payload !== "undefined") {
          return this.res.status(this.status.HTTPcode).send({
            msg: httpStatusCodes[this.status.HTTPcode],
            payload: this.status.payload,
          });
        }
        return this.res
          .status(this.status.HTTPcode)
          .send(httpStatusCodes[this.status.HTTPcode]);
      } else if (this.status.cookie) {
        if (this.status.cookie.action === "create") {
          this.res.cookie(this.status.cookie.name, this.status.cookie.payload, {
            sameSite: "None",
            secure: true,
          });
        } else if (this.status.cookie.action === "update") {
          this.res.cookie(this.status.cookie.name, this.status.cookie.payload, {
            sameSite: "None",
            secure: true,
          });
        } else if (this.status.cookie.action === "delete") {
          this.res.clearCookie(
            this.status.cookie.name,
            this.status.cookie.configs
          );
        }
      } else if (this.status.payload) {
        return this.res.send(this.status.payload);
      }
      return this.res.sendStatus(200);
    } catch (err) {
      return this.res.status(500).send(httpStatusCodes[500]);
    }
  }
};
