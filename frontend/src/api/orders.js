import axiosClient from './axiosClient';

// Finaliza o carrinho e cria um pedido para o endereço informado.
export async function createOrder({ shippingAddress }) {
  const { data } = await axiosClient.post('/orders', { shippingAddress });
  return data.order;
}

// Consulta uma página dos pedidos acessíveis ao usuário atual.
export async function fetchOrders({ page = 1, limit = 10 } = {}) {
  const { data } = await axiosClient.get('/orders', { params: { page, limit } });
  return data;
}

// Retorna os detalhes de um pedido pelo ID.
export async function fetchOrderById(id) {
  const { data } = await axiosClient.get(`/orders/${id}`);
  return data.order;
}

// Solicita a alteração do status de um pedido.
export async function updateOrderStatus(id, status) {
  const { data } = await axiosClient.patch(`/orders/${id}/status`, { status });
  return data.order;
}
