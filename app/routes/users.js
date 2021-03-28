const cookieValidation = require("../middlewares/cookies");

module.exports = (application) => {
  application.post("/cadastrar", (req, res) => {
    application.app.controllers.users.register(application, req, res);
  });
  application.post("/login", (req, res) => {
    application.app.controllers.users.login(application, req, res);
  });
  application.get("/logout", cookieValidation.isLogged, (req, res) => {
    application.app.controllers.users.logout(res);
  });
  application.get("/logged", cookieValidation.isLogged, (req, res) => {
    application.app.controllers.users.logged(res);
  });
};
