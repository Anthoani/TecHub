const STATUS_CONFIG = {
  pending: { label: 'Pendente', variant: 'warning' },
  paid: { label: 'Pago', variant: 'primary' },
  shipped: { label: 'Enviado', variant: 'primary' },
  delivered: { label: 'Entregue', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

// Traduz o status técnico do pedido para um selo legível e colorido.
export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'neutral' };
  return <span className={`badge badge-${config.variant}`}>{config.label}</span>;
}
