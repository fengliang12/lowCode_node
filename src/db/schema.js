const db = require("../db");

async function ensureSchema() {
  const stmts = [
    `CREATE TABLE IF NOT EXISTS mange_page_setup (
      id varchar(64) PRIMARY KEY,
      title text,
      content text
    )`,
    `CREATE TABLE IF NOT EXISTS page_setup_api (
      id varchar(64) PRIMARY KEY,
      "apiKey" text,
      "apiName" text,
      url text,
      method text,
      "parentId" varchar(64),
      params text,
      res text
    )`,
    `CREATE TABLE IF NOT EXISTS mini_userInfo (
      customerId text,
      miniOpenId text UNIQUE,
      jwtString text
    )`,
    `CREATE INDEX IF NOT EXISTS idx_page_setup_api_parent ON page_setup_api("parentId")`,
  ];
  for (const sql of stmts) {
    await db.query(sql);
  }
}

module.exports = { ensureSchema };
