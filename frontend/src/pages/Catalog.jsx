import { useEffect, useState, useCallback } from 'react';
import { fetchProducts, fetchCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

// Exibe a estrutura provisória de um produto durante o carregamento.
function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: '40%' }} />
        <div className="skeleton skeleton-line" style={{ width: '85%' }} />
        <div className="skeleton skeleton-line" style={{ width: '50%' }} />
      </div>
    </div>
  );
}

// Carrega e apresenta o catálogo com busca, categorias e paginação.
export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Consulta produtos com os filtros atuais e atualiza paginação e estados da tela.
  const loadProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts({ page, categoryId: categoryId || undefined, search: search || undefined });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError('Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }, [categoryId, search]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  // Impede o recarregamento da página e executa a busca desde a primeira página.
  function handleSearchSubmit(e) {
    e.preventDefault();
    loadProducts(1);
  }

  return (
    <div className="catalog-page">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow"><span /> Curadoria que combina com você</div>
          <h1>Descubra o extraordinário no seu dia a dia.</h1>
          <p>Uma seleção cuidadosa de produtos para transformar a sua rotina – com qualidade, segurança e entrega para todo o Brasil.</p>
          <a href="#catalogo" className="hero-cta">Explorar coleção <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-orb"><i className="fa-solid fa-atom" /></div>
          <span className="hero-pill hero-pill-top">Novidades toda semana</span>
          <span className="hero-pill hero-pill-bottom"><i className="fa-solid fa-star" /> Escolhas especiais</span>
        </div>
      </div>

      <div className="trust-bar">
        <div className="trust-item">
          <i className="fa-solid fa-truck-fast" aria-hidden="true" />
          <div>
            <strong>Entrega rápida</strong>
            <span>Rastreamento em tempo real</span>
          </div>
        </div>
        <div className="trust-item">
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          <div>
            <strong>Compra segura</strong>
            <span>Pagamento protegido</span>
          </div>
        </div>
        <div className="trust-item">
          <i className="fa-solid fa-rotate-left" aria-hidden="true" />
          <div>
            <strong>Troca fácil</strong>
            <span>Até 30 dias corridos</span>
          </div>
        </div>
        <div className="trust-item">
          <i className="fa-solid fa-headset" aria-hidden="true" />
          <div>
            <strong>Suporte dedicado</strong>
            <span>Fale com a gente</span>
          </div>
        </div>
      </div>

      <div className="catalog-heading" id="catalogo">
        <div><span className="section-kicker">Nossa seleção</span><h2>Produtos em destaque</h2></div>
        <span className="catalog-count">{!loading && `${pagination.total || products.length} produtos`}</span>
      </div>

      <form onSubmit={handleSearchSubmit} className="toolbar">
        <i className="fa-solid fa-magnifying-glass toolbar-search-icon" aria-hidden="true" />
        <input
          type="search"
          placeholder="O que você está procurando?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">
          Buscar
        </button>
      </form>

      <div className="category-chips">
        <button
          type="button"
          className={`category-chip${categoryId === '' ? ' is-active' : ''}`}
          onClick={() => setCategoryId('')}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-chip${categoryId === cat.id ? ' is-active' : ''}`}
            onClick={() => setCategoryId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="magnifying-glass"
          title="Nenhum produto encontrado"
          description="Tente ajustar os filtros ou buscar por outro termo."
        />
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="button-secondary"
                disabled={pagination.page <= 1}
                onClick={() => loadProducts(pagination.page - 1)}
              >
                ← Anterior
              </button>
              <span>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                type="button"
                className="button-secondary"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadProducts(pagination.page + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
