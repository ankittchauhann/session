const config = require("config");
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "./logs/access.log"), {
      flags: "a",
    }),
  })
);

app.use(cookieParser());

app.use(express.static("public"));

const server = http.createServer(app);

require("./startup/logging")(app);
require("./startup/cors")(app);
require("./startup/helmet")(app);
require("./startup/routes")(app);
require("./startup/db")(app);
require("./startup/config")();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  //   console.clear();
  const logger = app.get("logger");
  logger.info(`Server started on PORT ${PORT}`);
});

module.exports = { server, app };
