// Controla uma quantidade entre os limites mínimo e máximo informados.
export default function QuantityStepper({ value, min = 1, max, onChange, disabled }) {
  // Reduz a quantidade sem ultrapassar o limite mínimo.
  function decrement() {
    if (value > min) onChange(value - 1);
  }

  // Aumenta a quantidade sem ultrapassar o estoque máximo.
  function increment() {
    if (!max || value < max) onChange(value + 1);
  }

  return (
    <div className="stepper">
      <button type="button" onClick={decrement} disabled={disabled || value <= min} aria-label="Diminuir quantidade">
        <i className="fa-solid fa-minus" aria-hidden="true" />
      </button>
      <span>{value}</span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max != null && value >= max)}
        aria-label="Aumentar quantidade"
      >
        <i className="fa-solid fa-plus" aria-hidden="true" />
      </button>
    </div>
  );
}
