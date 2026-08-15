const { Cart, CartItem, Product } = require('../models');
const { addItemSchema, updateItemSchema } = require('../validators/cartValidators');
const { ApiError } = require('../middlewares/errorHandler');

// Localiza o carrinho do usuário ou cria um carrinho vazio na primeira utilização.
async function getOrCreateCart(userId) {
  const [cart] = await Cart.findOrCreate({ where: { userId } });
  return cart;
}

const itemInclude = {
  model: Product,
  as: 'product',
  attributes: ['id', 'name', 'price', 'imageUrl', 'stock'],
};

// Retorna o carrinho autenticado com produtos, quantidades e total calculado.
async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [itemInclude],
      order: [['createdAt', 'ASC']],
    });

    const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    res.json({ cart: { id: cart.id, items, total } });
  } catch (err) {
    next(err);
  }
}

// Adiciona um produto ao carrinho ou soma sua quantidade, respeitando o estoque.
async function addItem(req, res, next) {
  try {
    const data = addItemSchema.parse(req.body);
    const cart = await getOrCreateCart(req.user.id);

    const product = await Product.findByPk(data.productId);
    if (!product) {
      throw new ApiError(404, 'Produto não encontrado.');
    }

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId: data.productId } });
    const newQuantity = (item?.quantity || 0) + data.quantity;

    if (newQuantity > product.stock) {
      throw new ApiError(400, 'Quantidade solicitada excede o estoque disponível.');
    }

    if (item) {
      item.quantity = newQuantity;
      await item.save();
    } else {
      item = await CartItem.create({ cartId: cart.id, productId: data.productId, quantity: data.quantity });
    }

    const fullItem = await CartItem.findByPk(item.id, { include: [itemInclude] });
    res.status(201).json({ item: fullItem });
  } catch (err) {
    next(err);
  }
}

// Altera a quantidade de um item após validar propriedade e disponibilidade.
async function updateItem(req, res, next) {
  try {
    const data = updateItemSchema.parse(req.body);
    const cart = await getOrCreateCart(req.user.id);

    const item = await CartItem.findOne({ where: { id: req.params.itemId, cartId: cart.id } });
    if (!item) {
      throw new ApiError(404, 'Item não encontrado no carrinho.');
    }

    const product = await Product.findByPk(item.productId);
    if (data.quantity > product.stock) {
      throw new ApiError(400, 'Quantidade solicitada excede o estoque disponível.');
    }

    item.quantity = data.quantity;
    await item.save();

    const fullItem = await CartItem.findByPk(item.id, { include: [itemInclude] });
    res.json({ item: fullItem });
  } catch (err) {
    next(err);
  }
}

// Remove do carrinho autenticado o item indicado na rota.
async function removeItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const item = await CartItem.findOne({ where: { id: req.params.itemId, cartId: cart.id } });
    if (!item) {
      throw new ApiError(404, 'Item não encontrado no carrinho.');
    }
    await item.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Exclui todos os itens do carrinho do usuário autenticado.
async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, getOrCreateCart };
