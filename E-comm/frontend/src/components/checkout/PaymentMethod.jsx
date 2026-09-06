import { FiCreditCard, FiSmartphone, FiTruck } from 'react-icons/fi';
import { SiRazorpay } from 'react-icons/si';

const methods = [
  {
    id: 'razorpay',
    label: 'Razorpay',
    description: 'UPI, Cards, Net Banking, Wallets',
    icon: <SiRazorpay size={22} className="text-blue-600" />,
    badge: 'Recommended',
  },
  {
    id: 'stripe',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: <FiCreditCard size={22} className="text-purple-600" />,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: <FiTruck size={22} className="text-green-600" />,
  },
];

const PaymentMethod = ({ value, onChange }) => (
  <div className="space-y-3">
    <h3 className="font-bold text-gray-900 flex items-center gap-2">
      <FiCreditCard className="text-navy" /> Payment Method
    </h3>
    {methods.map((method) => (
      <label
        key={method.id}
        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          value === method.id ? 'border-navy bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value={method.id}
          checked={value === method.id}
          onChange={() => onChange(method.id)}
          className="accent-navy"
        />
        <div className="flex-shrink-0">{method.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-800">{method.label}</span>
            {method.badge && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{method.badge}</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{method.description}</p>
        </div>
      </label>
    ))}
  </div>
);

export default PaymentMethod;
