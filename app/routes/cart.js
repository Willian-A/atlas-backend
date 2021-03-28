const cookieValidation = require("../middlewares/cookies");

module.exports = (application) => {
  application.get("/cart", cookieValidation.isLogged, (req, res) => {
    application.app.controllers.cart.getCart(application, req, res);
  });

  application.post("/add_cart", cookieValidation.isLogged, (req, res) => {
    application.app.controllers.cart.addOnCart(req, res);
  });

  application.post("/remove_cart", cookieValidation.isLogged, (req, res) => {
    application.app.controllers.cart.removeFromCart(req, res);
  });
};
