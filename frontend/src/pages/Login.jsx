import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Verifica se e-mail e senha foram preenchidos em formatos válidos.
function validate(form) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Digite um e-mail válido.';
  }

  if (!form.password) {
    errors.password = 'Senha é obrigatória.';
  }

  return errors;
}

// Autentica o usuário e o devolve à rota privada originalmente solicitada.
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Atualiza o campo digitado e limpa sua mensagem de erro.
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  }

  // Valida as credenciais e inicia a sessão por meio do contexto.
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <span className="navbar-brand-badge" aria-hidden="true">
              <i className="fa-solid fa-atom" />
            </span>
            <h2>Órbita</h2>
            <p>Sua loja online, do jeito certo.</p>
            <ul className="auth-brand-features">
              <li>
                <i className="fa-solid fa-truck-fast" aria-hidden="true" /> Entrega rastreada em todo o Brasil
              </li>
              <li>
                <i className="fa-solid fa-lock" aria-hidden="true" /> Pagamento protegido de ponta a ponta
              </li>
              <li>
                <i className="fa-solid fa-rotate-left" aria-hidden="true" /> Troca facilitada em até 30 dias
              </li>
            </ul>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <span className="navbar-brand-badge" aria-hidden="true">
                <i className="fa-solid fa-atom" />
              </span>
              <h1>Bem-vindo de volta</h1>
              <p>Entre na sua conta para continuar comprando.</p>
            </div>

            <form onSubmit={handleSubmit} className="form" noValidate>
              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="voce@exemplo.com"
                  className={fieldErrors.email ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </label>

              <label>
                Senha
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={fieldErrors.password ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="button-block button-lg" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="auth-footer">
              Não tem conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
