import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida nome, e-mail e requisitos mínimos da senha de cadastro.
function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório.';
  } else if (form.name.trim().length > 100) {
    errors.name = 'Nome deve ter no máximo 100 caracteres.';
  }

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Digite um e-mail válido.';
  }

  if (!form.password) {
    errors.password = 'Senha é obrigatória.';
  } else if (form.password.length < 8) {
    errors.password = 'A senha deve ter no mínimo 8 caracteres.';
  }

  return errors;
}

// Coleta os dados da nova conta e conclui o cadastro com login automático.
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Atualiza o campo digitado e limpa sua mensagem de erro.
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  }

  // Define se a nova conta será de comprador ou vendedor.
  function handleRoleSelect(role) {
    setForm((prev) => ({ ...prev, role }));
  }

  // Valida os dados, cria a conta e direciona para o catálogo.
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível criar a conta.');
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
                <i className="fa-solid fa-bag-shopping" aria-hidden="true" /> Compre com segurança em poucos cliques
              </li>
              <li>
                <i className="fa-solid fa-store" aria-hidden="true" /> Ou venda seus produtos como parceiro
              </li>
              <li>
                <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" /> Acompanhe pedidos em tempo real
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
              <h1>Criar conta</h1>
              <p>Leva menos de um minuto.</p>
            </div>

            <form onSubmit={handleSubmit} className="form" noValidate>
              <div>
                <span
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    color: 'var(--color-ink-700)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Tipo de conta
                </span>
                <div className="role-select" role="radiogroup" aria-label="Tipo de conta">
                  <label className={`role-option${form.role === 'customer' ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={form.role === 'customer'}
                      onChange={() => handleRoleSelect('customer')}
                    />
                    <span className="role-option-label">
                      <i className="fa-solid fa-user" aria-hidden="true" />
                      Comprador
                    </span>
                  </label>

                  <label className={`role-option${form.role === 'seller' ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={form.role === 'seller'}
                      onChange={() => handleRoleSelect('seller')}
                    />
                    <span className="role-option-label">
                      <i className="fa-solid fa-store" aria-hidden="true" />
                      Vendedor
                    </span>
                  </label>
                </div>
              </div>

              <label>
                Nome
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className={fieldErrors.name ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </label>

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
                  placeholder="Mínimo de 8 caracteres"
                  className={fieldErrors.password ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                {fieldErrors.password ? (
                  <span className="field-error">{fieldErrors.password}</span>
                ) : (
                  <span className="field-hint">Use ao menos 8 caracteres.</span>
                )}
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="button-block button-lg" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Cadastrar'}
              </button>
            </form>

            <p className="auth-footer">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
