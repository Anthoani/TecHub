import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { fetchAddressByCep, formatCep, onlyDigits } from '../api/cep';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
  'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const INITIAL_ADDRESS = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

// Valida os campos obrigatórios do endereço antes de criar o pedido.
function validateAddress(address) {
  const errors = {};

  if (onlyDigits(address.cep).length !== 8) errors.cep = 'CEP inválido.';
  if (!address.street.trim()) errors.street = 'Rua é obrigatória.';
  if (!address.number.trim()) errors.number = 'Número é obrigatório.';
  if (!address.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório.';
  if (!address.city.trim()) errors.city = 'Cidade é obrigatória.';
  if (!address.state) errors.state = 'Selecione o estado.';

  return errors;
}

// Combina os campos do formulário no endereço textual armazenado no pedido.
function buildShippingAddress(address) {
  const complementPart = address.complement.trim() ? ` - ${address.complement.trim()}` : '';
  return `${address.street.trim()}, ${address.number.trim()}${complementPart} - ${address.neighborhood.trim()}, ${address.city.trim()} - ${address.state}, CEP ${address.cep}`;
}

// Coleta o endereço, consulta o CEP e finaliza o carrinho como pedido.
export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [cepStatus, setCepStatus] = useState('idle'); // idle | loading | success | error
  const [cepMessage, setCepMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Atualiza um campo do endereço e remove seu erro de validação anterior.
  function updateField(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  }

  // Busca o CEP e preenche automaticamente os campos encontrados.
  async function lookupCep(digits) {
    setCepStatus('loading');
    setCepMessage('');
    try {
      const data = await fetchAddressByCep(digits);
      setAddress((prev) => ({
        ...prev,
        street: data.street || prev.street,
        neighborhood: data.neighborhood || prev.neighborhood,
        city: data.city || prev.city,
        state: data.state || prev.state,
      }));
      setFieldErrors((prev) => ({ ...prev, cep: '', street: '', neighborhood: '', city: '', state: '' }));
      setCepStatus('success');
    } catch (err) {
      setCepStatus('error');
      setCepMessage(err.message || 'Não foi possível consultar o CEP.');
    }
  }

  // Formata o CEP digitado e inicia a consulta quando os oito dígitos existem.
  function handleCepChange(e) {
    const formatted = formatCep(e.target.value);
    updateField('cep', formatted);
    setCepMessage('');

    const digits = onlyDigits(formatted);
    if (digits.length === 8) {
      lookupCep(digits);
    } else {
      setCepStatus('idle');
    }
  }

  // Valida o formulário, cria o pedido, atualiza o carrinho e redireciona.
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validateAddress(address);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const order = await createOrder({ shippingAddress: buildShippingAddress(address) });
      await refreshCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível concluir o pedido.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <EmptyState
        icon="cart-shopping"
        title="Seu carrinho está vazio"
        description="Adicione produtos antes de finalizar um pedido."
        action={
          <Link to="/" className="button">
            Ver produtos
          </Link>
        }
      />
    );
  }

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1>Finalizar pedido</h1>
      </div>

      <div className="checkout-layout">
        <div className="card">
          <h3>Endereço de entrega</h3>
          <form onSubmit={handleSubmit} className="form" style={{ marginTop: '1rem' }} noValidate>
            <label>
              CEP
              <div className="input-with-status">
                <input
                  name="cep"
                  value={address.cep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  inputMode="numeric"
                  className={fieldErrors.cep ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.cep)}
                />
                <i
                  className={`fa-solid input-status-icon ${
                    cepStatus === 'loading'
                      ? 'fa-circle-notch is-loading'
                      : cepStatus === 'success'
                        ? 'fa-circle-check'
                        : cepStatus === 'error'
                          ? 'fa-circle-exclamation'
                          : 'fa-magnifying-glass'
                  }`}
                  aria-hidden="true"
                />
              </div>
              {fieldErrors.cep ? (
                <span className="field-error">{fieldErrors.cep}</span>
              ) : cepMessage ? (
                <span className="field-error">{cepMessage}</span>
              ) : (
                <span className="field-hint">Digite o CEP para preencher o endereço automaticamente.</span>
              )}
            </label>

            <label>
              Rua
              <input
                value={address.street}
                onChange={(e) => updateField('street', e.target.value)}
                placeholder="Rua, avenida..."
                className={fieldErrors.street ? 'input-invalid' : ''}
                aria-invalid={Boolean(fieldErrors.street)}
              />
              {fieldErrors.street && <span className="field-error">{fieldErrors.street}</span>}
            </label>

            <div className="form-row">
              <label>
                Número
                <input
                  value={address.number}
                  onChange={(e) => updateField('number', e.target.value)}
                  placeholder="123"
                  className={fieldErrors.number ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.number)}
                />
                {fieldErrors.number && <span className="field-error">{fieldErrors.number}</span>}
              </label>

              <label>
                Complemento
                <input
                  value={address.complement}
                  onChange={(e) => updateField('complement', e.target.value)}
                  placeholder="Apto, bloco... (opcional)"
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Bairro
                <input
                  value={address.neighborhood}
                  onChange={(e) => updateField('neighborhood', e.target.value)}
                  placeholder="Bairro"
                  className={fieldErrors.neighborhood ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.neighborhood)}
                />
                {fieldErrors.neighborhood && <span className="field-error">{fieldErrors.neighborhood}</span>}
              </label>

              <label>
                Cidade
                <input
                  value={address.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Cidade"
                  className={fieldErrors.city ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.city)}
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
              </label>

              <label>
                Estado
                <select
                  value={address.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={fieldErrors.state ? 'input-invalid' : ''}
                  aria-invalid={Boolean(fieldErrors.state)}
                >
                  <option value="">UF</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
              </label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="button-lg" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Confirmar pedido'}
            </button>
          </form>
        </div>

        <div className="summary-card">
          <h3>Resumo do pedido</h3>
          <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {cart.items.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{currencyFormatter.format(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{currencyFormatter.format(cart.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
