const { z } = require('zod');

const addItemSchema = z.object({
  productId: z.string().uuid('productId inválido'),
  quantity: z.coerce.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  quantity: z.coerce.number().int().min(1),
});

module.exports = { addItemSchema, updateItemSchema };
