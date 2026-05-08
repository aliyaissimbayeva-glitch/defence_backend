const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([
    'RESTAURANT',
    'CONSUMER',
    'SHELTER',
    'DRIVER',
    'ADMIN'
  ])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

module.exports = { registerSchema, loginSchema };