const app = require("../src/app");
const { env } = require("../src/config");

module.exports = (req, res) => {
  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const reqOrigin = req.headers.origin;
  let originHeader = reqOrigin || "*";
  if (!allowedOrigins.includes("*")) {
    if (reqOrigin && allowedOrigins.includes(reqOrigin))
      originHeader = reqOrigin;
    else if (allowedOrigins.length) originHeader = allowedOrigins[0];
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", originHeader);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,POST,DELETE,OPTIONS"
    );
    const reqHeaders = req.headers["access-control-request-headers"];
    res.setHeader(
      "Access-Control-Allow-Headers",
      reqHeaders || "Content-Type,Authorization,X-Requested-With,Accept,Origin"
    );
    res.setHeader("Access-Control-Max-Age", "600");
    if (originHeader !== "*")
      res.setHeader("Access-Control-Allow-Credentials", "true");
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!req.url.startsWith("/api")) {
    const idx = req.url.indexOf("?");
    const path = idx === -1 ? req.url : req.url.slice(0, idx);
    const qs = idx === -1 ? "" : req.url.slice(idx);
    const prefix = path.startsWith("/") ? "/api" : "/api/";
    req.url = prefix + path + qs;
  }

  res.setHeader("Access-Control-Allow-Origin", originHeader);
  res.setHeader("Vary", "Origin");
  if (originHeader !== "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
  return app.callback()(req, res);
};
