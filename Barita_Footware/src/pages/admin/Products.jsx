import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Filter, Check, X, Upload, Image as ImageIcon, Link as LinkIcon, Sparkles } from "lucide-react";
import { products as initialProducts } from "../../data/products";
import { categories } from "../../data/categories";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const SAMPLE_FOOTWEAR_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&h=600&fit=crop",
];

export default function Products() {
  const [productList, setProductList] = useState(() => {
    try {
      const saved = localStorage.getItem("brita_admin_products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("brita_admin_products", JSON.stringify(productList));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  }, [productList]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [urlInput, setUrlInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "men",
    price: "",
    mrp: "",
    stock: "",
    description: "",
    images: [],
  });

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter ? p.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setUrlInput("");
    setFormData({
      name: "",
      sku: `BRT-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "men",
      price: "",
      mrp: "",
      stock: "",
      description: "",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setUrlInput("");
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      description: product.description || "",
      images: product.images && product.images.length > 0 ? [...product.images] : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProductList(productList.filter((p) => p.id !== id));
      toast.success("Product deleted");
    }
  };

  // Local File Upload Handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload valid image files");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64Data],
        }));
        toast.success("Image added locally!");
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Add Image URL Handler
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, urlInput.trim()],
    }));
    setUrlInput("");
    toast.success("Image URL added!");
  };

  // Remove Image Handler
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  // Add Sample Preset Image
  const handleAddSampleImage = (imgUrl) => {
    if (formData.images.includes(imgUrl)) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imgUrl],
    }));
    toast.success("Sample image added!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalImages = formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"];

    if (editingProduct) {
      setProductList(
        productList.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: +formData.price,
                mrp: +formData.mrp,
                stock: +formData.stock,
                images: finalImages,
              }
            : p
        )
      );
      toast.success("Product updated successfully!");
    } else {
      const newP = {
        id: Date.now(),
        ...formData,
        price: +formData.price,
        mrp: +formData.mrp,
        stock: +formData.stock,
        rating: 4.8,
        reviewCount: 1,
        images: finalImages,
        sizes: [6, 7, 8, 9, 10, 11],
        colors: ["Black", "White"],
        slug: (formData.name || "new-product").toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setProductList([newP, ...productList]);
      toast.success("New product added successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-primary">Product Management</h2>
          <p className="text-slate-400 text-xs mt-0.5">Manage catalogue, pricing, local image uploads, and stock ({filtered.length} products)</p>
        </div>
        <button onClick={handleOpenAdd} id="add-product-btn" className="btn-primary flex items-center gap-2 text-xs py-2.5">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-xs pl-10 py-2"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field text-xs py-2 w-full sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price / MRP</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-200" />
                  </td>
                  <td className="font-bold text-primary max-w-xs truncate">{p.name}</td>
                  <td className="font-mono text-xs text-slate-500">{p.sku}</td>
                  <td><span className="badge badge-info capitalize">{p.category}</span></td>
                  <td>
                    <span className="font-bold text-primary">{formatCurrency(p.price)}</span>
                    {p.mrp > p.price && <span className="text-[10px] text-slate-400 line-through block">{formatCurrency(p.mrp)}</span>}
                  </td>
                  <td className="font-semibold">{p.stock} units</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? "badge-danger" : p.stock <= 10 ? "badge-warning" : "badge-success"}`}>
                      {p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEdit(p)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-danger" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
                {editingProduct ? <Edit2 size={16} className="text-secondary" /> : <Plus size={16} className="text-secondary" />}
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-primary"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brita Air Speed Runner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field text-xs"
                  >
                    {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="2999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="4999"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              {/* ── IMAGE UPLOAD SECTION ── */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-primary flex items-center justify-between">
                  <span>Product Images ({formData.images.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Add local files or image URLs</span>
                </label>

                {/* Local File Upload Dropzone */}
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-secondary transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">Click to upload local images</p>
                    <p className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP (Saved locally in app)</p>
                  </div>
                </div>

                {/* Add Image URL Form */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="input-field text-xs pl-8 py-2"
                    />
                  </div>
                  <button type="button" onClick={handleAddUrl} className="btn-secondary text-xs px-3 py-2 shrink-0 font-bold">
                    + Add URL
                  </button>
                </div>

                {/* Preset Sample Images Quick Selector */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> Quick Add Sample Footwear Photos:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {SAMPLE_FOOTWEAR_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSampleImage(img)}
                        className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:border-secondary shrink-0 transition-transform active:scale-95"
                        title="Click to add this image"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Image Thumbnails List */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            COVER
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    ⚠️ No images added yet. A default shoe image will be assigned automatically.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter detailed product description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md">
                  {editingProduct ? "Update Product" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
