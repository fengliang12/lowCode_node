const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const routes = require("./routes");

const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(require("./middlewares/error"));

app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;
