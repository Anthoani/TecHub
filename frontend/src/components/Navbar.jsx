import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Retorna a classe visual usada para destacar a rota atual.
function navLinkClass({ isActive }) {
  return isActive ? 'is-active' : undefined;
}

// Renderiza a navegação adequada ao estado de login e ao perfil do usuário.
export default function Navbar() {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Encerra a sessão, fecha o menu e redireciona para o login.
  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  // Fecha o menu responsivo após uma ação de navegação.
  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-brand-badge" aria-hidden="true">
            <i className="fa-solid fa-atom" />
          </span>
          <span className="brand-wordmark">Órbita<small>marketplace</small></span>
        </Link>

        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
        </button>

        <div className={`navbar-links${menuOpen ? ' is-open' : ''}`}>
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Início
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/orders" className={navLinkClass} onClick={closeMenu}>
                {isSeller ? 'Pedidos' : 'Meus pedidos'}
              </NavLink>

              {!isSeller && (
                <>
                <NavLink to="/favorites" className={navLinkClass} onClick={closeMenu}>
                  <i className="fa-regular fa-heart" aria-hidden="true" /> Favoritos
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) => `navbar-cart-link${isActive ? ' is-active' : ''}`}
                  onClick={closeMenu}
                  aria-label="Carrinho"
                >
                  <span className="navbar-cart-icon">
                    <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                  </span>
                  Carrinho
                </NavLink>
                </>
              )}

              <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                <i className="fa-solid fa-user-pen" aria-hidden="true" /> Meus dados
              </NavLink>

              <span className="navbar-divider" />
              <span className="navbar-user">
                Olá, <strong>{user.name}</strong>
                <span className="role-badge">{isSeller ? 'Vendedor' : 'Comprador'}</span>
              </span>
              <button type="button" onClick={handleLogout} className="button-ghost">
                <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" /> Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                Entrar
              </NavLink>
              <Link to="/register" className="button" onClick={closeMenu}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
