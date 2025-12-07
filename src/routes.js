const Router = require("@koa/router");
const multer = require("@koa/multer");

const uploadController = require("./controllers/upload");
const pageSetup = require("./controllers/pageSetup");
const pageSetupApi = require("./controllers/pageSetupApi");
const miniCustomer = require("./miniControllers/customer");
const miniPageSetup = require("./miniControllers/pageSetup");

const router = new Router();

const storage = multer.memoryStorage();
const _upload = multer({ storage });

router.post(
  "/api/uploadFile",
  _upload.single("file"),
  uploadController.uploadFile
);

router.post("/api/pageSetup/create", pageSetup.createPageSetup);
router.put("/api/pageSetup/update", pageSetup.updatePageSetup);
router.get("/api/pageSetup/getDetail", pageSetup.getPageDetail);
router.delete("/api/pageSetup/delete/:id", pageSetup.deletePageSetup);
router.get("/api/pageSetup/getPageSetupList", pageSetup.getPageSetupList);

router.post("/api/pageSetupApi/create", pageSetupApi.createApi);
router.put("/api/pageSetupApi/update", pageSetupApi.updateApi);
router.get("/api/pageSetupApi/detail", pageSetupApi.getPageDetail);
router.delete("/api/pageSetupApi/delete/:id", pageSetupApi.deleteApi);
router.get("/api/pageSetupApi/list", pageSetupApi.getApiList);

router.post("/api/mini/customer/login", miniCustomer.loginWx);
router.get("/api/mini/pageSetup/item/:id", miniPageSetup.getPageSetupDetail);

router.get("/health", async (ctx) => {
  const db = require("./db");
  const { isDbEnabled } = require("./config");
  let dbOk = false;
  if (isDbEnabled) {
    try {
      await db.query("select 1");
      dbOk = true;
    } catch (e) {
      dbOk = false;
    }
  }
  ctx.body = { status: "ok", db: dbOk };
});

router.get("/api/health", async (ctx) => {
  const db = require("./db");
  const { isDbEnabled } = require("./config");
  let dbOk = false;
  if (isDbEnabled) {
    try {
      await db.query("select 1");
      dbOk = true;
    } catch (e) {
      dbOk = false;
    }
  }
  ctx.body = { status: "ok", db: dbOk };
});

module.exports = router;
