import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.prettyPrint({ colorize: true }),
    winston.format.json({ space: 4 })
  ),
  transports: [
    new winston.transports.File({
      filename: "./logs/error-logs.json",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined-logs.json" }),
    new winston.transports.Console({ level: "warn" }),
  ],
});

export default logger;
