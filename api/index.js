const app = require("../src/app");

module.exports = (req, res) => {
  if (!req.url.startsWith("/api")) {
    const idx = req.url.indexOf("?");
    const path = idx === -1 ? req.url : req.url.slice(0, idx);
    const qs = idx === -1 ? "" : req.url.slice(idx);
    const prefix = path.startsWith("/") ? "/api" : "/api/";
    req.url = prefix + path + qs;
  }
  return app.callback()(req, res);
};
