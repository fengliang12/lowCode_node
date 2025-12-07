const { v4: uuidv4 } = require('uuid')

function generateRandom() {
  return uuidv4().replace(/-/g, '')
}

function handleApiList(rows) {
  const map = new Map()
  rows.forEach((r) => {
    map.set(r.id, { ...r, children: [] })
  })
  const roots = []
  rows.forEach((r) => {
    const node = map.get(r.id)
    const pid = r.parentid || r.parentId || null
    if (pid && map.has(pid)) {
      map.get(pid).children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

module.exports = { generateRandom, handleApiList }
