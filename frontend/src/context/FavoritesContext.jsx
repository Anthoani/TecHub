import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchFavorites, addFavorite, removeFavorite } from '../api/favorites';

const FavoritesContext = createContext(null);

// Sincroniza favoritos do comprador e oferece atualização otimista da interface.
export function FavoritesProvider({ children }) {
  const { isAuthenticated, isSeller } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyIds, setBusyIds] = useState(new Set());
  const favoriteIds = useMemo(() => new Set(products.map((product) => product.id)), [products]);

  // Carrega favoritos somente quando há um comprador autenticado.
  const load = useCallback(async () => {
    if (!isAuthenticated || isSeller) { setProducts([]); return; }
    setLoading(true);
    try { setProducts(await fetchFavorites()); } finally { setLoading(false); }
  }, [isAuthenticated, isSeller]);

  useEffect(() => { load(); }, [load]);

  // Alterna o favorito de forma otimista e restaura o servidor em caso de falha.
  const toggleFavorite = useCallback(async (product) => {
    if (!isAuthenticated || isSeller || busyIds.has(product.id)) return;
    const wasFavorite = favoriteIds.has(product.id);
    setBusyIds((current) => new Set(current).add(product.id));
    setProducts((current) => wasFavorite ? current.filter((item) => item.id !== product.id) : [{ ...product }, ...current]);
    try {
      const result = wasFavorite ? await removeFavorite(product.id) : await addFavorite(product.id);
      return result.favoriteCount;
    } catch (err) {
      await load();
      throw err;
    } finally {
      setBusyIds((current) => { const next = new Set(current); next.delete(product.id); return next; });
    }
  }, [busyIds, favoriteIds, isAuthenticated, isSeller, load]);

  return (
    <FavoritesContext.Provider value={{ products, favoriteIds, loading, busyIds, toggleFavorite, reload: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Fornece acesso seguro à lista e às ações de favoritos.
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  return context;
}
