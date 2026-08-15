const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lista todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 */
router.get('/', categoryController.list);

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Cria uma categoria (somente vendedor)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: 'Eletrônicos' }
 *     responses:
 *       201:
 *         description: Categoria criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category: { $ref: '#/components/schemas/Category' }
 *       403:
 *         description: Acesso restrito a vendedores
 */
router.post('/', authenticate, authorize('seller'), categoryController.create);

module.exports = router;
