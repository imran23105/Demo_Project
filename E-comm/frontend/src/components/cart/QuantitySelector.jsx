import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => (
  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <FiMinus size={12} />
    </button>
    <span className="w-8 text-center text-sm font-semibold text-gray-800">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <FiPlus size={12} />
    </button>
  </div>
);

export default QuantitySelector;
