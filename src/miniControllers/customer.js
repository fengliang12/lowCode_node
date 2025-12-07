const { createToken } = require("../utils/jwt");
const db = require("../db");
const { loginSchema } = require("../validators/mini");

const failState = 500;

function normalizeUser(row, jwtString) {
  return {
    customerId: row.customerid || row.customerId,
    miniOpenId: row.miniopenid || row.miniOpenId,
    jwtString,
  };
}

async function loginWx(ctx) {
  try {
    const { code } = loginSchema.parse(ctx.request.body || {});
    const appId = process.env.WX_APP_ID;
    const appSecret = process.env.WX_APP_SECRET;
    if (!appId || !appSecret) {
      ctx.status = 400;
      ctx.body = { status: failState, message: "配置缺失" };
      return;
    }
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let wxRes;
    try {
      wxRes = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    let wxJson = {};
    try {
      wxJson = await wxRes.json();
    } catch (e) {}
    const openid = wxJson.openid;
    if (!openid) {
      ctx.body = { status: failState, message: "微信登录失败" };
      return;
    }
    const { rows } = await db.query(
      "select * from mini_userInfo where miniOpenId=$1",
      [openid]
    );
    const jwtString = createToken({ miniOpenId: openid });
    if (!rows.length) {
      const customerId = String(Date.now());
      await db.query(
        "insert into mini_userInfo(customerId,miniOpenId,jwtString) values($1,$2,$3) on conflict (miniOpenId) do update set jwtString=EXCLUDED.jwtString",
        [customerId, openid, jwtString]
      );
      const { rows: rows2 } = await db.query(
        "select * from mini_userInfo where miniOpenId=$1",
        [openid]
      );
      ctx.body = normalizeUser(rows2[0], jwtString);
      return;
    }
    await db.query(
      "update mini_userInfo set jwtString=$1 where miniOpenId=$2",
      [jwtString, openid]
    );
    ctx.body = normalizeUser(rows[0], jwtString);
  } catch (err) {
    ctx.body = { status: failState, message: "" };
  }
}

module.exports = { loginWx };
