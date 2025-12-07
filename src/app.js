const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const routes = require("./routes");
const { env } = require("./config");

const app = new Koa();

app.use(logger());
const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowCreds = !allowedOrigins.includes("*");
app.use(
  cors({
    origin: (ctx) => {
      const reqOrigin = ctx.get("Origin");
      if (!reqOrigin) return allowCreds ? allowedOrigins[0] || "" : "*";
      if (allowedOrigins.includes("*")) return "*";
      if (allowedOrigins.includes(reqOrigin)) return reqOrigin;
      return allowedOrigins[0] || reqOrigin;
    },
    credentials: allowCreds,
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposeHeaders: ["Content-Length", "Content-Range"],
    maxAge: 600,
  })
);
app.use(async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    ctx.status = 204;
    return;
  }
  await next();
});
app.use(bodyParser());
app.use(require("./middlewares/error"));

app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;
