const db = require('../db')

const successState = 200
const failState = 500

async function getPageSetupDetail(ctx) {
  try {
    const id = ctx.params.id
    const { rows } = await db.query('select * from mange_page_setup where id=$1', [id])
    if (rows && rows.length) {
      ctx.body = JSON.parse(rows[0].content)
    } else {
      ctx.body = { code: failState, message: '未找到对应的配置' }
    }
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) }
  }
}

module.exports = { getPageSetupDetail }
