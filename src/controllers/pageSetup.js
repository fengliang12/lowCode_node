const utils = require('../utils/index')
const db = require('../db')
const { createSchema, updateSchema, listSchema } = require('../validators/pageSetup')

const successState = 200
const failState = 500

async function createPageSetup(ctx) {
  try {
    const pageInfo = createSchema.parse(ctx.request.body || {})
    const id = utils.generateRandom()
    pageInfo.id = id
    const content = JSON.stringify(pageInfo)
    const title = pageInfo.title || ''
    const sql = 'insert into mange_page_setup(id,title,content) values($1,$2,$3)'
    await db.query(sql, [id, title, content])
    ctx.body = { code: successState, data: { id }, message: '添加成功' }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) }
  }
}

async function updatePageSetup(ctx) {
  try {
    const pageInfo = updateSchema.parse(ctx.request.body || {})
    const content = JSON.stringify(pageInfo)
    const sql = 'update mange_page_setup set content=$1,title=$2 where id=$3'
    await db.query(sql, [content, pageInfo.title || '', pageInfo.id])
    ctx.body = { code: successState, data: {}, message: '更新成功' }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) }
  }
}

async function getPageDetail(ctx) {
  try {
    const id = ctx.query.id
    const sql = 'select * from mange_page_setup where id=$1'
    const { rows } = await db.query(sql, [id])
    if (rows && rows.length) {
      ctx.body = { code: successState, data: JSON.parse(rows[0].content), message: '获取成功' }
    } else {
      ctx.body = { code: failState, message: '未找到对应的配置' }
    }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) }
  }
}

async function deletePageSetup(ctx) {
  try {
    const id = ctx.params.id
    const sql = 'delete from mange_page_setup where id=$1'
    await db.query(sql, [id])
    ctx.body = { code: successState, data: {}, message: '删除成功' }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) }
  }
}

async function getPageSetupList(ctx) {
  try {
    const { size, page, title } = listSchema.parse(ctx.query || {})
    const offset = page * size
    let sql = 'select * from mange_page_setup'
    let params = []
    if (title) {
      sql += ' where title ILIKE $1'
      params.push(`%${title}%`)
    }
    params.push(size)
    params.push(offset)
    const limitIdx = params.length - 1
    const offsetIdx = params.length
    sql += ` order by id limit $${limitIdx} offset $${offsetIdx}`
    const { rows } = await db.query(sql, params)
    ctx.body = { code: successState, data: rows, message: '获取成功' }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) }
  }
}

module.exports = { createPageSetup, updatePageSetup, getPageDetail, deletePageSetup, getPageSetupList }
