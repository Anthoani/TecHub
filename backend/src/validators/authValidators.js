const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  email: z.string().trim().email('E-mail inválido').max(255),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(128),
  role: z.enum(['customer', 'seller']).default('customer'),
});

const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome é obrigatório').max(100).optional(),
    email: z.string().trim().email('E-mail inválido').max(255).optional(),
    password: z
      .string()
      .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
      .max(128)
      .optional(),
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  })
  .refine((data) => data.name || data.email || data.password, {
    message: 'Informe ao menos um campo para atualizar.',
    path: ['name'],
  });

module.exports = { registerSchema, loginSchema, updateProfileSchema };
