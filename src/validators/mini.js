const { z } = require('zod')

const loginSchema = z.object({
  code: z.string().min(1)
})

module.exports = { loginSchema }
