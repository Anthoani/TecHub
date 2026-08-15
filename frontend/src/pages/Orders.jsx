import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

// Lista os pedidos permitidos e adapta o conteúdo ao perfil do usuário.
export default function Orders() {
  const { isSeller } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data.orders))
      .catch(() => setError('Não foi possível carregar os pedidos.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" label="Carregando pedidos..." />;
  if (error) return <p className="form-error">{error}</p>;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="box-open"
        title={isSeller ? 'Nenhum pedido para autorizar' : 'Você ainda não fez nenhum pedido'}
        description={
          isSeller
            ? 'Os pedidos feitos pelos compradores aparecerão aqui.'
            : 'Seus pedidos aparecerão aqui assim que você finalizar uma compra.'
        }
        action={
          !isSeller && (
            <Link to="/" className="button">
              Ver produtos
            </Link>
          )
        }
      />
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>{isSeller ? 'Pedidos' : 'Meus pedidos'}</h1>
        <p>{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</p>
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <Link to={`/orders/${order.id}`} className="order-card" key={order.id}>
            <div>
              <div className="order-card-id">Pedido #{order.id.slice(0, 8)}</div>
              <div className="order-card-date">{dateFormatter.format(new Date(order.createdAt))}</div>
              {isSeller && order.buyer && <div className="order-card-buyer">Comprador: {order.buyer.name}</div>}
            </div>
            <StatusBadge status={order.status} />
            <div className="order-card-total">{currencyFormatter.format(order.total)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
