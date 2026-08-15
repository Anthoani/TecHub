// Indica visualmente que um conteúdo ou uma operação está em processamento.
export default function Spinner({ size = 'md', label }) {
  return (
    <div className="loading-block">
      <span className={`spinner${size === 'lg' ? ' spinner-lg' : ''}`} />
      {label && <span>{label}</span>}
    </div>
  );
}
