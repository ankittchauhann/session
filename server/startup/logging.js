const winston = require("winston");

module.exports = function (app) {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: "./logs/error.log",
        level: "error",
      }),
    ],
  });

  process.on("uncaughtException", (ex) => {
    throw ex;
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        prettyPrint: true,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      })
    );
  }
  app.set("logger", logger);
};
