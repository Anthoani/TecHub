import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

// Mantém o carrinho sincronizado com a API e compartilha suas operações.
export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  // Recarrega o carrinho quando existe uma sessão autenticada de comprador.
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0 });
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.fetchCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Adiciona um produto pela API e sincroniza o carrinho retornado.
  const addItem = useCallback(async (productId, quantity = 1) => {
    await cartApi.addCartItem({ productId, quantity });
    await refreshCart();
  }, [refreshCart]);

  // Persiste uma nova quantidade e atualiza o estado compartilhado.
  const updateItem = useCallback(async (itemId, quantity) => {
    await cartApi.updateCartItem(itemId, quantity);
    await refreshCart();
  }, [refreshCart]);

  // Remove um item pela API e sincroniza o carrinho retornado.
  const removeItem = useCallback(async (itemId) => {
    await cartApi.removeCartItem(itemId);
    await refreshCart();
  }, [refreshCart]);

  // Esvazia o carrinho no servidor e no contexto.
  const clear = useCallback(async () => {
    await cartApi.clearCart();
    await refreshCart();
  }, [refreshCart]);

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, refreshCart, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

// Fornece acesso seguro ao estado e às operações do carrinho.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
