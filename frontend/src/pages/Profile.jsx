import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida os dados editáveis e exige a senha atual para confirmar alterações.
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

  if (form.newPassword && form.newPassword.length < 8) {
    errors.newPassword = 'A nova senha deve ter no mínimo 8 caracteres.';
  }

  if (!form.currentPassword) {
    errors.currentPassword = 'Confirme sua senha atual para salvar.';
  }

  return errors;
}

// Permite ao usuário atualizar nome, e-mail e senha da própria conta.
export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    newPassword: '',
    currentPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Atualiza o campo digitado e limpa mensagens anteriores relacionadas.
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
    setSuccess('');
  }

  // Valida e envia as alterações do perfil para a API.
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.newPassword || undefined,
        currentPassword: form.currentPassword,
      });
      setSuccess('Dados atualizados com sucesso.');
      setForm((prev) => ({ ...prev, newPassword: '', currentPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível atualizar seus dados.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="navbar-brand-badge" aria-hidden="true">
            <i className="fa-solid fa-user-pen" />
          </span>
          <h1>Meus dados</h1>
          <p>Atualize suas informações de conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="form" noValidate>
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
            Nova senha
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Deixe em branco para manter a atual"
              className={fieldErrors.newPassword ? 'input-invalid' : ''}
              aria-invalid={Boolean(fieldErrors.newPassword)}
            />
            {fieldErrors.newPassword ? (
              <span className="field-error">{fieldErrors.newPassword}</span>
            ) : (
              <span className="field-hint">Opcional – use ao menos 8 caracteres se for trocar.</span>
            )}
          </label>

          <label>
            Senha atual
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={fieldErrors.currentPassword ? 'input-invalid' : ''}
              aria-invalid={Boolean(fieldErrors.currentPassword)}
            />
            {fieldErrors.currentPassword ? (
              <span className="field-error">{fieldErrors.currentPassword}</span>
            ) : (
              <span className="field-hint">Necessária para confirmar qualquer alteração.</span>
            )}
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button type="submit" className="button-block button-lg" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
