import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useFavorites } from '../context/FavoritesContext';

// Apresenta os produtos salvos pelo comprador ou uma orientação quando vazia.
export default function Favorites() {
  const { products, loading } = useFavorites();
  if (loading) return <Spinner size="lg" label="Carregando favoritos..." />;

  return (
    <div className="favorites-page">
      <div className="page-header favorites-header">
        <div><span className="section-kicker">Sua curadoria</span><h1>Produtos favoritos</h1></div>
        {products.length > 0 && <span>{products.length} {products.length === 1 ? 'produto salvo' : 'produtos salvos'}</span>}
      </div>
      {products.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Nenhum favorito ainda"
          description="Toque no coração dos produtos que você mais gostou para encontrá-los aqui."
          action={<Link to="/" className="button">Explorar produtos</Link>}
        />
      ) : (
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      )}
    </div>
  );
}
