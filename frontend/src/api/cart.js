import axiosClient from './axiosClient';

// Consulta o carrinho atual do usuário autenticado.
export async function fetchCart() {
  const { data } = await axiosClient.get('/cart');
  return data.cart;
}

// Adiciona ao carrinho a quantidade escolhida de um produto.
export async function addCartItem({ productId, quantity = 1 }) {
  const { data } = await axiosClient.post('/cart/items', { productId, quantity });
  return data.item;
}

// Atualiza a quantidade de um item existente no carrinho.
export async function updateCartItem(itemId, quantity) {
  const { data } = await axiosClient.put(`/cart/items/${itemId}`, { quantity });
  return data.item;
}

// Remove um item específico do carrinho.
export async function removeCartItem(itemId) {
  await axiosClient.delete(`/cart/items/${itemId}`);
}

// Remove todos os itens do carrinho autenticado.
export async function clearCart() {
  await axiosClient.delete('/cart');
}
