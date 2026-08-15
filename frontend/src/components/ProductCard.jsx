import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Exibe um resumo do produto e permite alternar seu estado de favorito.
export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;
  const navigate = useNavigate();
  const { isAuthenticated, isSeller } = useAuth();
  const { favoriteIds, busyIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.has(product.id);

  // Exige login quando necessário e alterna o favorito selecionado.
  async function handleFavorite() {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: '/' } } }); return; }
    await toggleFavorite(product);
  }

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        {!isSeller && (
          <button
            type="button"
            className={`product-card-favorite${isFavorite ? ' is-favorite' : ''}`}
            onClick={handleFavorite}
            disabled={busyIds.has(product.id)}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
          ><i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`} /></button>
        )}
        <Link to={`/products/${product.id}`} aria-label={`Ver ${product.name}`}>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400?text=Produto'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        </Link>
      </div>

      <div className="product-card-body">
        {product.category && <span className="product-card-category">{product.category.name}</span>}
        <Link to={`/products/${product.id}`}><h3 className="product-card-title">{product.name}</h3></Link>

        <div className="product-card-footer">
          <span className="product-card-price"><small>por</small>{currencyFormatter.format(product.price)}</span>
          {outOfStock ? (
            <span className="badge badge-danger">Esgotado</span>
          ) : product.stock <= 5 ? (
            <span className="badge badge-warning">Últimas {product.stock}</span>
          ) : (
            <span className="badge badge-success">Em estoque</span>
          )}
        </div>
        <Link to={`/products/${product.id}`} className="product-card-action">Ver produto <i className="fa-solid fa-arrow-right" /></Link>
      </div>
    </article>
  );
}
