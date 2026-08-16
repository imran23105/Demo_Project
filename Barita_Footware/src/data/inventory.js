// Inventory Mock Data
import { products } from "./products";

export const inventory = products.map((p) => ({
  ...p,
  reorderLevel: 10,
  reorderQty: 50,
  location: `Rack-${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
  supplier: ["Stride Imports", "Elite Fabrics", "Urban Materials", "Peak Supplies", "Metro Goods"][Math.floor(Math.random() * 5)],
  lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000).toISOString(),
  unitCost: Math.round(p.price * 0.45),
  stockValue: Math.round(p.price * 0.45 * p.stock),
  stockStatus: p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? "Low Stock" : "In Stock",
}));

export const inventoryStats = {
  totalProducts: products.length,
  totalUnits: inventory.reduce((s, i) => s + i.stock, 0),
  lowStock: inventory.filter(i => i.stock > 0 && i.stock <= 10).length,
  outOfStock: inventory.filter(i => i.stock === 0).length,
  inventoryValue: inventory.reduce((s, i) => s + i.stockValue, 0),
};

export default inventory;
