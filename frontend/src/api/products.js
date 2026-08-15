import axiosClient from './axiosClient';

// Busca a página de produtos usando os filtros informados.
export async function fetchProducts({ page = 1, limit = 12, categoryId, search } = {}) {
  const { data } = await axiosClient.get('/products', {
    params: { page, limit, categoryId, search },
  });
  return data;
}

// Retorna os detalhes de um produto pelo ID.
export async function fetchProductById(id) {
  const { data } = await axiosClient.get(`/products/${id}`);
  return data.product;
}

// Retorna as categorias disponíveis para filtragem do catálogo.
export async function fetchCategories() {
  const { data } = await axiosClient.get('/categories');
  return data.categories;
}
