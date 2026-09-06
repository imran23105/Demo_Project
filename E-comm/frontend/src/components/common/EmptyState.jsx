import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  actionHref,
  onAction,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center px-4"
  >
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    {description && <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>}
    {actionHref && (
      <Link to={actionHref} className="btn-primary">
        {actionLabel || 'Browse Now'}
      </Link>
    )}
    {onAction && !actionHref && (
      <button onClick={onAction} className="btn-primary">{actionLabel}</button>
    )}
  </motion.div>
);

export default EmptyState;
