const { Router } = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Retorna o carrinho do usuário autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Carrinho atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart: { $ref: '#/components/schemas/Cart' }
 */
router.get('/', cartController.getCart);

/**
 * @openapi
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Adiciona um item ao carrinho
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AddCartItemInput' }
 *     responses:
 *       201:
 *         description: Item adicionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item: { $ref: '#/components/schemas/CartItem' }
 *       400:
 *         description: Estoque insuficiente ou produto inválido
 */
router.post('/items', cartController.addItem);

/**
 * @openapi
 * /cart/items/{itemId}:
 *   put:
 *     tags: [Cart]
 *     summary: Atualiza a quantidade de um item do carrinho
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateCartItemInput' }
 *     responses:
 *       200:
 *         description: Item atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item: { $ref: '#/components/schemas/CartItem' }
 *       404:
 *         description: Item não encontrado no carrinho
 */
router.put('/items/:itemId', cartController.updateItem);

/**
 * @openapi
 * /cart/items/{itemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove um item do carrinho
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Item removido
 *       404:
 *         description: Item não encontrado no carrinho
 */
router.delete('/items/:itemId', cartController.removeItem);

/**
 * @openapi
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Esvazia o carrinho
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204:
 *         description: Carrinho esvaziado
 */
router.delete('/', cartController.clearCart);

module.exports = router;
