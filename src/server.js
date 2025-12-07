const app = require("./app");

const { env, isDbEnabled } = require("./config");
if (env.HTTPS_PROXY && !process.env.VERCEL) {
  process.env.GLOBAL_AGENT_HTTP_PROXY = env.HTTPS_PROXY;
  process.env.GLOBAL_AGENT_NO_PROXY = env.NO_PROXY;
  require("global-agent").bootstrap();
}
const { ensureSchema } = require("./db/schema");

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
