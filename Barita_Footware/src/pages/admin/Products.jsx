import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Filter, Check, X } from "lucide-react";
import { products as initialProducts } from "../../data/products";
import { categories } from "../../data/categories";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export default function Products() {
  const [productList, setProductList] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "men",
    price: "",
    mrp: "",
    stock: "",
    description: "",
  });

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter ? p.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", sku: `BRT-NEW-${Math.floor(1000 + Math.random() * 9000)}`, category: "men", price: "", mrp: "", stock: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      description: product.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProductList(productList.filter((p) => p.id !== id));
      toast.success("Product deleted");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProductList(
        productList.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData, price: +formData.price, mrp: +formData.mrp, stock: +formData.stock }
            : p
        )
      );
      toast.success("Product updated!");
    } else {
      const newP = {
        id: Date.now(),
        ...formData,
        price: +formData.price,
        mrp: +formData.mrp,
        stock: +formData.stock,
        rating: 4.5,
        reviewCount: 0,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
        sizes: [6, 7, 8, 9, 10],
        colors: ["Black", "White"],
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      };
      setProductList([newP, ...productList]);
      toast.success("New product added!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-primary">Product Management</h2>
          <p className="text-slate-400 text-xs mt-0.5">Manage catalogue, pricing, and stock ({filtered.length} products)</p>
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
        <div className="overflow-x-auto">
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
              {filtered.slice(0, 15).map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50" />
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
                      <button onClick={() => handleOpenEdit(p)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-danger">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-primary">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-primary"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
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
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Selling Price</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">MRP</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost text-xs">Cancel</button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
