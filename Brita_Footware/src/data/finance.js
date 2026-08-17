// ─────────────────────────────────────────────
// BRITA FOOTWEARS – Finance Mock Data
// ─────────────────────────────────────────────

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const monthlyFinance = months.map((month, i) => {
  const revenue = Math.round(180000 + i * 15000 + Math.random() * 40000);
  const cogs = Math.round(revenue * 0.45);
  const shipping = Math.round(revenue * 0.06);
  const discounts = Math.round(revenue * 0.12);
  const refunds = Math.round(revenue * 0.03);
  const grossProfit = revenue - cogs - shipping - discounts - refunds;
  const operatingExpenses = Math.round(grossProfit * 0.25);
  const netProfit = grossProfit - operatingExpenses;
  return {
    month,
    revenue,
    cogs,
    shipping,
    discounts,
    refunds,
    grossProfit,
    operatingExpenses,
    netProfit,
    orders: Math.round(revenue / 1800),
    aov: Math.round(revenue / (revenue / 1800)),
  };
});

export const weeklyRevenue = Array.from({ length: 7 }, (_, i) => {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const revenue = Math.round(8000 + Math.random() * 12000);
  return { day: days[i], revenue, orders: Math.round(revenue / 1800) };
});

export const todayStats = {
  revenue: 24850,
  orders: 14,
  customers: 11,
  aov: 1775,
  refunds: 1,
  conversionRate: 3.2,
};

export const kpiSummary = {
  totalRevenue: monthlyFinance.reduce((s, m) => s + m.revenue, 0),
  totalOrders: 500,
  totalCustomers: 1200,
  totalProducts: 250,
  netProfit: monthlyFinance.reduce((s, m) => s + m.netProfit, 0),
  lowStock: 18,
  outOfStock: 7,
  avgRating: 4.3,
};

export const categoryRevenue = [
  { category: "Men", revenue: 485000, units: 312, color: "#2563EB" },
  { category: "Women", revenue: 523000, units: 387, color: "#EC4899" },
  { category: "Sneakers", revenue: 398000, units: 265, color: "#10B981" },
  { category: "Casual", revenue: 214000, units: 178, color: "#F59E0B" },
  { category: "Formal", revenue: 189000, units: 124, color: "#8B5CF6" },
  { category: "Sandals", revenue: 142000, units: 198, color: "#F97316" },
];

export const expenseBreakdown = [
  { name: "Cost of Goods", value: 45, color: "#EF4444" },
  { name: "Shipping", value: 8, color: "#F97316" },
  { name: "Discounts", value: 12, color: "#F59E0B" },
  { name: "Marketing", value: 10, color: "#8B5CF6" },
  { name: "Operations", value: 8, color: "#6366F1" },
  { name: "Refunds", value: 3, color: "#EC4899" },
];

export default { monthlyFinance, weeklyRevenue, todayStats, kpiSummary, categoryRevenue, expenseBreakdown };
