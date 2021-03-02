require("dotenv").config();
const app = require("./config/server");
const https = require("https");
const fs = require("fs");

app.config.dbConnection.connectToServer(function (err, client) {
  if (err) console.log(err);

  if (process.env.NODE_ENV === "dev") {
    // localhost HTTPS SSL
    const credentials = {
      key: fs.readFileSync("cert/selfsigned.key", "utf8"),
      cert: fs.readFileSync("cert/selfsigned.crt", "utf8"),
    };
    console.log(`Development Server on 3333`);
    https.createServer(credentials, app).listen(3333);
  } else {
    console.log(`Production Server on ${process.env.PORT}`);
    app.listen(process.env.PORT);
  }
});
