import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

const NEXT_ACTIONS = {
  pending: [
    { status: 'paid', label: 'Autorizar pedido', icon: 'fa-check', className: '' },
    { status: 'cancelled', label: 'Cancelar pedido', icon: 'fa-ban', className: 'button-danger' },
  ],
  paid: [
    { status: 'shipped', label: 'Marcar como enviado', icon: 'fa-truck', className: '' },
    { status: 'cancelled', label: 'Cancelar pedido', icon: 'fa-ban', className: 'button-danger' },
  ],
  shipped: [{ status: 'delivered', label: 'Marcar como entregue', icon: 'fa-box-open', className: '' }],
  delivered: [],
  cancelled: [],
};

// Apresenta itens, comprador, entrega e ações disponíveis para um pedido.
export default function OrderDetail() {
  const { id } = useParams();
  const { isSeller } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState('');

  useEffect(() => {
    fetchOrderById(id)
      .then(setOrder)
      .catch(() => setError('Pedido não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Solicita a nova etapa do pedido e atualiza a tela com a resposta da API.
  async function handleStatusChange(status) {
    setActionError('');
    setUpdatingStatus(status);
    try {
      const updated = await updateOrderStatus(id, status);
      setOrder(updated);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Não foi possível atualizar o status do pedido.');
    } finally {
      setUpdatingStatus('');
    }
  }

  if (loading) return <Spinner size="lg" label="Carregando pedido..." />;
  if (error) return <p className="form-error">{error}</p>;

  const actions = isSeller ? NEXT_ACTIONS[order.status] || [] : [];

  return (
    <div className="order-detail-page">
      <div className="breadcrumb">
        <Link to="/orders">{isSeller ? 'Pedidos' : 'Meus pedidos'}</Link>
        <span>/</span>
        <span className="current">Pedido #{order.id.slice(0, 8)}</span>
      </div>

      <div className="order-detail-header">
        <h1>Pedido #{order.id.slice(0, 8)}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="order-detail-meta">
        <div className="card">
          <div className="label">Data do pedido</div>
          <div>{dateFormatter.format(new Date(order.createdAt))}</div>
        </div>

        {isSeller && order.buyer ? (
          <div className="card">
            <div className="label">Comprador</div>
            <div className="buyer-card">
              <span className="buyer-avatar" aria-hidden="true">
                {order.buyer.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <div>{order.buyer.name}</div>
                <div className="field-hint">{order.buyer.email}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="label">Total</div>
            <div>{currencyFormatter.format(order.total)}</div>
          </div>
        )}

        <div className="card">
          <div className="label">Endereço de entrega</div>
          <div>{order.shippingAddress}</div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço unitário</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{currencyFormatter.format(item.unitPrice)}</td>
                <td>{currencyFormatter.format(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total</td>
              <td>{currencyFormatter.format(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {isSeller && actions.length > 0 && (
        <div className="order-actions">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className={action.className}
              disabled={Boolean(updatingStatus)}
              onClick={() => handleStatusChange(action.status)}
            >
              <i className={`fa-solid ${action.icon}`} aria-hidden="true" />
              {updatingStatus === action.status ? 'Atualizando...' : action.label}
            </button>
          ))}
        </div>
      )}

      {actionError && <p className="form-error" style={{ marginTop: '1rem' }}>{actionError}</p>}
    </div>
  );
}
