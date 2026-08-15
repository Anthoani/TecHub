import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import QuantityStepper from '../components/QuantityStepper';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Exibe o carrinho e permite alterar quantidades, remover itens e avançar.
export default function Cart() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busyItemId, setBusyItemId] = useState(null);

  // Persiste a nova quantidade do item e controla seu estado de processamento.
  async function handleQuantityChange(item, quantity) {
    setError('');
    if (quantity < 1) return;
    setBusyItemId(item.id);
    try {
      await updateItem(item.id, quantity);
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível atualizar o item.');
    } finally {
      setBusyItemId(null);
    }
  }

  // Remove o item selecionado e apresenta falhas retornadas pela API.
  async function handleRemove(itemId) {
    setError('');
    setBusyItemId(itemId);
    try {
      await removeItem(itemId);
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível remover o item.');
    } finally {
      setBusyItemId(null);
    }
  }

  if (loading) return <Spinner size="lg" label="Carregando carrinho..." />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <EmptyState
        icon="cart-shopping"
        title="Seu carrinho está vazio"
        description="Explore o catálogo e adicione produtos ao seu carrinho."
        action={
          <Link to="/" className="button">
            Ver produtos
          </Link>
        }
      />
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Carrinho</h1>
        <p>{cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'}</p>
      </div>

      {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      <div className="cart-layout">
        <div className="cart-list">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.product.imageUrl || 'https://via.placeholder.com/100?text=Produto'}
                alt={item.product.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <span className="cart-item-price">{currencyFormatter.format(item.product.price)} / un.</span>
              </div>

              <div className="cart-item-controls">
                <QuantityStepper
                  value={item.quantity}
                  max={item.product.stock}
                  disabled={busyItemId === item.id}
                  onChange={(quantity) => handleQuantityChange(item, quantity)}
                />

                <span className="cart-item-subtotal">
                  {currencyFormatter.format(item.product.price * item.quantity)}
                </span>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => handleRemove(item.id)}
                  disabled={busyItemId === item.id}
                  aria-label="Remover item"
                  title="Remover item"
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h3>Resumo do pedido</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{currencyFormatter.format(cart.total)}</span>
          </div>
          <div className="summary-row">
            <span>Frete</span>
            <span>Calculado no próximo passo</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{currencyFormatter.format(cart.total)}</span>
          </div>
          <button type="button" className="button-block button-lg" style={{ marginTop: '1rem' }} onClick={() => navigate('/checkout')}>
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
