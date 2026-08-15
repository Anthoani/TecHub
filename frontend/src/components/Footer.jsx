// Renderiza informações institucionais, contatos e atalhos no rodapé.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="navbar-brand-badge" aria-hidden="true">
            <i className="fa-solid fa-atom" />
          </span>
          <div>
            <strong>Órbita</strong>
            <p>Boas escolhas colocam tudo em movimento.</p>
          </div>
        </div>

        <div className="footer-links">
          <strong>Navegue</strong>
          <a href="/">Produtos</a>
          <a href="/orders">Meus pedidos</a>
        </div>

        <div className="footer-contact">
          <strong>Fale com a gente</strong>
          <a href="mailto:contato@orbita.com.br">
            <i className="fa-solid fa-envelope" aria-hidden="true" /> contato@orbita.com.br
          </a>
          <span>
            <i className="fa-solid fa-phone" aria-hidden="true" /> (11) 4000-0000
          </span>
        </div>

        <div className="footer-social" aria-label="Redes sociais">
          <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
          <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
          <a href="#" aria-label="X"><i className="fa-brands fa-x-twitter" /></a>
        </div>
      </div>

      <p className="footer-copyright">© {new Date().getFullYear()} Órbita. Sua loja online, do jeito certo.</p>
    </footer>
  );
}
