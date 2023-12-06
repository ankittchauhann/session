const mongoose = require("mongoose");
const config = require("config");

module.exports = function (app) {
  const db = config.get("db");
  const logger = app.get("logger");
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info(`Connected to MongoDB ${db}...`))
    .catch((error) => logger.error("Error connecting to MongoDB", error));
};
