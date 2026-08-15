import axiosClient from './axiosClient';

// Retorna os produtos favoritados pelo comprador autenticado.
export async function fetchFavorites() {
  const { data } = await axiosClient.get('/favorites');
  return data.products;
}

// Salva um produto na lista de favoritos.
export async function addFavorite(productId) {
  const { data } = await axiosClient.post(`/favorites/${productId}`);
  return data;
}

// Retira um produto da lista de favoritos.
export async function removeFavorite(productId) {
  const { data } = await axiosClient.delete(`/favorites/${productId}`);
  return data;
}
