const { Favorite, Product, Category } = require('../models');
const { ApiError } = require('../middlewares/errorHandler');

// Retorna os produtos favoritados pelo comprador autenticado.
async function list(req, res, next) {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'product', include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ products: favorites.map((favorite) => favorite.product) });
  } catch (err) { next(err); }
}

// Associa um produto aos favoritos do comprador sem criar duplicatas.
async function add(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) throw new ApiError(404, 'Produto não encontrado.');
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId: req.user.id, productId: product.id },
      defaults: { userId: req.user.id, productId: product.id },
    });
    const favoriteCount = await Favorite.count({ where: { productId: product.id } });
    res.status(created ? 201 : 200).json({ favorite, favoriteCount });
  } catch (err) { next(err); }
}

// Remove a associação de favorito e retorna a nova contagem do produto.
async function remove(req, res, next) {
  try {
    await Favorite.destroy({ where: { userId: req.user.id, productId: req.params.productId } });
    const favoriteCount = await Favorite.count({ where: { productId: req.params.productId } });
    res.json({ favoriteCount });
  } catch (err) { next(err); }
}

module.exports = { list, add, remove };
