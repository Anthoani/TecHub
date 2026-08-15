import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import QuantityStepper from '../components/QuantityStepper';
import { useFavorites } from '../context/FavoritesContext';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Exibe o produto escolhido e oferece ações de carrinho e favorito.
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSeller } = useAuth();
  const { addItem } = useCart();
  const { favoriteIds, busyIds, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setQuantity(1);
      })
      .catch(() => setError('Produto não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Exige autenticação e adiciona ao carrinho a quantidade selecionada.
  async function handleAddToCart() {
    setMessage('');
    setError('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await addItem(product.id, quantity);
      setMessage('Produto adicionado ao carrinho.');
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível adicionar ao carrinho.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <Spinner size="lg" label="Carregando produto..." />;
  if (error && !product) return <p className="form-error">{error}</p>;

  const outOfStock = product.stock <= 0;
  const isFavorite = favoriteIds.has(product.id);

  // Alterna o favorito e atualiza localmente sua contagem de corações.
  async function handleFavorite() {
    if (!isAuthenticated) { navigate('/login'); return; }
    const favoriteCount = await toggleFavorite(product);
    setProduct((current) => ({ ...current, favoriteCount }));
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/">Catálogo</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-detail-image-wrap">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600?text=Produto'}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div>
          {product.category && <span className="product-detail-category">{product.category.name}</span>}
          <h1>{product.name}</h1>
          <p className="product-detail-price">{currencyFormatter.format(product.price)}</p>

          {!isSeller && (
            <button
              type="button"
              className={`favorite-detail-button${isFavorite ? ' is-favorite' : ''}`}
              onClick={handleFavorite}
              disabled={busyIds.has(product.id)}
              aria-pressed={isFavorite}
            >
              <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`} />
              {isFavorite ? 'Favoritado' : 'Favoritar'}
              <span>{product.favoriteCount || 0}</span>
            </button>
          )}

          {product.description && <p className="product-detail-description">{product.description}</p>}

          {outOfStock ? (
            <span className="badge badge-danger">Fora de estoque</span>
          ) : product.stock <= 5 ? (
            <span className="badge badge-warning">Restam apenas {product.stock} unidades</span>
          ) : (
            <span className="badge badge-success">{product.stock} unidades em estoque</span>
          )}

          <div className="product-detail-actions">
            <QuantityStepper
              value={quantity}
              max={product.stock}
              onChange={setQuantity}
              disabled={outOfStock || adding}
            />
            <button type="button" className="button-lg" onClick={handleAddToCart} disabled={outOfStock || adding}>
              {adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
            </button>
          </div>

          {message && <p className="form-success" style={{ marginTop: '1rem' }}>{message}</p>}
          {error && <p className="form-error" style={{ marginTop: '1rem' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
