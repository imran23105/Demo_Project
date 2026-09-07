import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi, categoryApi } from '../../services/productApi';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', brand: '',
    price: '', discountPrice: '',
    category: '', tags: '', stock: '10',
    isActive: true, isFeatured: false, isTrending: false, isBestSeller: false,
  });

  useEffect(() => {
    categoryApi.getCategories().then(({ data }) => setCategories(data.data || []));
    if (isEdit) {
      productApi.getProductById(id).then(({ data }) => {
        const p = data.data;
        setForm({
          title: p.title, description: p.description, shortDescription: p.shortDescription || '',
          brand: p.brand || '', price: p.price, discountPrice: p.discountPrice || '',
          category: p.category?._id || '', tags: p.tags?.join(', ') || '',
          stock: p.stock, isActive: p.isActive, isFeatured: p.isFeatured,
          isTrending: p.isTrending, isBestSeller: p.isBestSeller,
        });
      });
    }
  }, [id]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((k) => formData.append(k, form[k]));
    images.forEach((img) => formData.append('images', img));

    try {
      if (isEdit) {
        await productApi.updateProduct(id, formData);
        toast.success('Product updated!');
      } else {
        await productApi.createProduct(formData);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
          {isEdit ? 'Edit Appliance Details' : 'Add New Smart Appliance'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">Configure appliance specs, pricing, and catalog assets</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">1. Basic Appliance Information</h3>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Product Title *</label>
            <input required value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field text-xs sm:text-sm" placeholder="e.g. Dyson V15 Detect Cordless Vacuum" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Short Tagline / Subtitle</label>
            <input value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="input-field text-xs sm:text-sm" placeholder="e.g. Laser illumination reveals invisible microscopic dust" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Technical Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none text-xs sm:text-sm" placeholder="Detailed product specifications, wattage, power rating, warranties..." />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">2. Pricing & Inventory</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Retail Price (₹) *</label>
              <input type="number" required value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field text-xs sm:text-sm" min="0" placeholder="49999" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Discounted / Offer Price (₹)</label>
              <input type="number" value={form.discountPrice} onChange={(e) => update('discountPrice', e.target.value)} className="input-field text-xs sm:text-sm" min="0" placeholder="42999" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Inventory Units (Stock)</label>
              <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input-field text-xs sm:text-sm" min="0" />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">3. Brand & Classification</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Category *</label>
              <select required value={form.category} onChange={(e) => update('category', e.target.value)} className="input-field text-xs sm:text-sm">
                <option value="">Select Appliance Category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Manufacturer / Brand</label>
              <input value={form.brand} onChange={(e) => update('brand', e.target.value)} className="input-field text-xs sm:text-sm" placeholder="e.g. LG, Samsung, Philips, Dyson" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="input-field text-xs sm:text-sm" placeholder="smart, 5-star, inverter, warranty" />
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-3">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">4. Showcase Visibility Flags</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'isActive', label: 'Active in Store' },
              { key: 'isFeatured', label: 'Featured Product' },
              { key: 'isTrending', label: 'Trending Badge' },
              { key: 'isBestSeller', label: 'Best Seller Badge' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F3F3EE]/60 border border-black/5 cursor-pointer hover:bg-[#F3F3EE] transition-all">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="w-4 h-4 accent-brand-red rounded"
                />
                <span className="text-xs font-bold text-slate-800">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="border-b border-gray-100 pb-2 mb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">5. Appliance Photos</h3>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="input-field text-xs sm:text-sm"
          />
          {images.length > 0 && (
            <div className="flex gap-2.5 mt-3 flex-wrap">
              {images.map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded-2xl border border-black/10" />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-8 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : isEdit ? 'Update Appliance' : 'Publish Appliance'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="py-3 px-6 rounded-full border border-gray-200 text-slate-700 hover:bg-gray-100 text-xs sm:text-sm font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
