import { useState } from 'react';
import { FiMapPin, FiUser, FiPhone } from 'react-icons/fi';

const ShippingForm = ({ value, onChange, savedAddresses = [] }) => {
  const [useExisting, setUseExisting] = useState(false);

  const handleChange = (field, val) => onChange({ ...value, [field]: val });

  const selectAddress = (addr) => {
    onChange({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
    });
    setUseExisting(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <FiMapPin className="text-navy" /> Shipping Address
      </h3>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
          {savedAddresses.map((addr, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectAddress(addr)}
              className="w-full text-left border border-gray-200 rounded-lg p-3 hover:border-navy hover:bg-blue-50 transition-all text-sm"
            >
              <span className="font-medium">{addr.fullName}</span> · {addr.phone}<br />
              <span className="text-gray-500">{addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}</span>
            </button>
          ))}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-sm font-medium text-gray-600 mb-3">Or enter a new address</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <div className="relative">
            <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required value={value.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="John Doe" className="input-field pl-9 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <div className="relative">
            <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required value={value.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 9999999999" className="input-field pl-9 text-sm" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
        <input required value={value.addressLine1 || ''} onChange={(e) => handleChange('addressLine1', e.target.value)} placeholder="House No., Street, Area" className="input-field text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
        <input value={value.addressLine2 || ''} onChange={(e) => handleChange('addressLine2', e.target.value)} placeholder="Landmark, Locality (optional)" className="input-field text-sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input required value={value.city || ''} onChange={(e) => handleChange('city', e.target.value)} placeholder="Mumbai" className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <input required value={value.state || ''} onChange={(e) => handleChange('state', e.target.value)} placeholder="Maharashtra" className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input required value={value.postalCode || ''} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="400001" className="input-field text-sm" />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
