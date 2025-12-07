const { z } = require('zod')

const createSchema = z.object({
  title: z.string().min(1),
}).passthrough()

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
}).passthrough()

const listSchema = z.object({
  page: z.coerce.number().int().nonnegative().default(0),
  size: z.coerce.number().int().positive().default(10),
  title: z.string().optional()
})

module.exports = { createSchema, updateSchema, listSchema }
