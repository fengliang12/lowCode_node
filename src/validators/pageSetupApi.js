const { z } = require('zod')

const createSchema = z.object({
  apiKey: z.string().min(1),
  apiName: z.string().min(1),
  url: z.string().min(1),
  method: z.string().min(1),
  parentId: z.string().optional(),
  params: z.array(z.any()).default([]),
  res: z.array(z.any()).default([])
})

const updateSchema = createSchema.extend({ id: z.string().min(1) })

module.exports = { createSchema, updateSchema }
