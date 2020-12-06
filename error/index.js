module.exports = class ErrorHandler {
  constructor(response, status) {
    this.res = response;
    this.status = status;
  }

  checkHttpCode() {
    const httpStatusCodes = {
      200: "OK",
      400: "Email ou Senha errados",
      403: "Usuario não Logado",
      404: "Não Encontrado",
      409: "Email ou CPF já cadastrados",
      500: "Erro Interno do Servidor",
    };

    if (this.status.error) {
      return this.res
        .status(this.status.HTTPcode)
        .send(httpStatusCodes[this.status.HTTPcode]);
    } else if (this.status.cookie) {
      if (this.status.cookie.action === "create") {
        this.res.cookie(
          this.status.cookie.name,
          this.status.cookie.payload,
          this.status.cookie.configs
        );
      } else if (this.status.cookie.action === "update") {
        this.res.cookie(this.status.cookie.name, this.status.cookie.payload);
      } else if (this.status.cookie.action === "delete") {
        console.log(this.status);
        this.res.clearCookie("profile");
      }
    } else if (this.status.payload) {
      return this.res.send(this.status.payload);
    }
    return this.res.sendStatus(200);
  }
};
