// Apresenta uma mensagem orientativa quando uma tela não possui conteúdo.
export default function EmptyState({ icon = 'bag-shopping', title, description, action }) {
  return (
    <div className="empty-state">
      <i className={`fa-solid fa-${icon} empty-state-icon`} aria-hidden="true" />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
