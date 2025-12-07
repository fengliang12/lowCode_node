const utils = require("../utils/index");
const db = require("../db");
const { createSchema, updateSchema } = require("../validators/pageSetupApi");

const successState = 200;
const failState = 500;

async function createApi(ctx) {
  try {
    const pageInfo = createSchema.parse(ctx.request.body || {});
    const id = utils.generateRandom();
    const params = JSON.stringify(pageInfo.params || []);
    const result = JSON.stringify(pageInfo.res || []);
    const sql =
      'insert into page_setup_api(id,"apiKey","apiName",url,method,"parentId",params,res) values($1,$2,$3,$4,$5,$6,$7,$8)';
    await db.query(sql, [
      id,
      pageInfo.apiKey || "",
      pageInfo.apiName || "",
      pageInfo.url || "",
      pageInfo.method || "",
      pageInfo.parentId || null,
      params,
      result,
    ]);
    ctx.body = { code: successState, data: { id }, message: "添加成功" };
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) };
  }
}

async function updateApi(ctx) {
  try {
    const pageInfo = updateSchema.parse(ctx.request.body || {});
    const params = JSON.stringify(pageInfo.params || []);
    const result = JSON.stringify(pageInfo.res || []);
    const sql =
      'update page_setup_api set "apiKey"=$1,"apiName"=$2,url=$3,method=$4,"parentId"=$5,params=$6,res=$7 where id=$8';
    await db.query(sql, [
      pageInfo.apiKey || "",
      pageInfo.apiName || "",
      pageInfo.url || "",
      pageInfo.method || "",
      pageInfo.parentId || null,
      params,
      result,
      pageInfo.id,
    ]);
    ctx.body = { code: successState, data: {}, message: "更新成功" };
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) };
  }
}

async function getPageDetail(ctx) {
  try {
    const id = ctx.query.id;
    const sql = "select * from page_setup_api where id=$1";
    const { rows } = await db.query(sql, [id]);
    if (rows && rows.length) {
      const row = rows[0];
      row.params = row.params ? JSON.parse(row.params) : [];
      row.res = row.res ? JSON.parse(row.res) : [];
      ctx.body = { code: successState, data: row, message: "获取成功" };
    } else {
      ctx.body = { code: failState, message: "未找到对应的配置" };
    }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) };
  }
}

async function deleteApi(ctx) {
  try {
    const id = ctx.params.id;
    const sql = "delete from page_setup_api where id=$1";
    await db.query(sql, [id]);
    ctx.body = { code: successState, data: {}, message: "删除成功" };
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) };
  }
}

async function getApiList(ctx) {
  try {
    const sql = "select * from page_setup_api";
    const { rows } = await db.query(sql);
    ctx.body = {
      code: successState,
      data: utils.handleApiList(rows),
      message: "获取成功",
    };
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) };
  }
}

module.exports = { createApi, updateApi, getPageDetail, deleteApi, getApiList };
