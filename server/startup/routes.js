const express = require("express");
const error = require("../middleware/error");
const router = require("../routes/routes");
const { auth } = require("../middleware/auth");

module.exports = function (app) {
  const logger = app.get("logger");
  app.use(express.json({ limit: "50mb" }));
  app.use("/api/v1", router);
  app.all("*", (req, res) => {
    res.status(404).send("Route not found");
    logger.error(`404 || Route not found: ${req.originalUrl}`);
  });
  app.use(error);
};
