const { z } = require('zod');

const createOrderSchema = z.object({
  shippingAddress: z.string().trim().min(5, 'Endereço de entrega é obrigatório').max(500),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
