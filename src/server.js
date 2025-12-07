const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const logger = require("koa-logger");

const { env, isDbEnabled } = require("./config");
if (env.HTTPS_PROXY && !process.env.VERCEL) {
  process.env.GLOBAL_AGENT_HTTP_PROXY = env.HTTPS_PROXY;
  process.env.GLOBAL_AGENT_NO_PROXY = env.NO_PROXY;
  require("global-agent").bootstrap();
}
const { ensureSchema } = require("./db/schema");
const routes = require("./routes");
const db = require("./db");

const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(require("./middlewares/error"));

app.use(routes.routes());
app.use(routes.allowedMethods());

(async () => {
  if (isDbEnabled) {
    try {
      await ensureSchema();
      console.log("DB schema ensured");
    } catch (e) {
      console.warn("DB ensure schema failed:", e.message);
    }
  } else {
    console.warn("DATABASE_URL not set, skipping schema init");
  }
  const port = env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on http://127.0.0.1:${port}`);
  });
})();
