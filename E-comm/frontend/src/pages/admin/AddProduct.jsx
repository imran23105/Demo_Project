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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
            <input required value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" placeholder="Enter product title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="input-field" placeholder="Brief description for listings" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" placeholder="Detailed product description" />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Pricing & Stock</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" required value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
              <input type="number" value={form.discountPrice} onChange={(e) => update('discountPrice', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input-field" min="0" />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Categorization</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={form.category} onChange={(e) => update('category', e.target.value)} className="input-field">
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input value={form.brand} onChange={(e) => update('brand', e.target.value)} className="input-field" placeholder="Brand name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="input-field" placeholder="summer, sale, new" />
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Product Flags</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'isActive', label: 'Active (visible to customers)' },
              { key: 'isFeatured', label: 'Featured Product' },
              { key: 'isTrending', label: 'Trending' },
              { key: 'isBestSeller', label: 'Best Seller' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="w-4 h-4 accent-navy"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Product Images</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="input-field text-sm"
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={isLoading}>{isEdit ? 'Update Product' : 'Create Product'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
