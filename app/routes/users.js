module.exports = (application) => {
  application.post("/cadastrar", (req, res) => {
    application.app.controllers.users.register(application, req, res);
  });
  application.post("/login", (req, res) => {
    application.app.controllers.users.login(application, req, res);
  });
  application.get("/logout", (req, res) => {
    application.app.controllers.users.logout(req, res);
  });
  application.post("/logged", (req, res) => {
    application.app.controllers.users.logged(req, res);
  });
};
