// Reports Mock Data
export const reportsData = {
  today: {
    revenue: 24850, orders: 14, aov: 1775, units: 21, discounts: 3200, refunds: 0, profit: 11482,
    topProduct: "Air Max Stride", conversionRate: 3.2, visitors: 437,
  },
  week: {
    revenue: 148200, orders: 87, aov: 1703, units: 134, discounts: 18600, refunds: 4500, profit: 67890,
    topProduct: "Urban Stride Pro", conversionRate: 2.9, visitors: 2847,
    daily: [
      { day: "Mon", revenue: 18200, orders: 11 },
      { day: "Tue", revenue: 22400, orders: 13 },
      { day: "Wed", revenue: 19800, orders: 12 },
      { day: "Thu", revenue: 24100, orders: 14 },
      { day: "Fri", revenue: 21600, orders: 13 },
      { day: "Sat", revenue: 28900, orders: 16 },
      { day: "Sun", revenue: 13200, orders: 8 },
    ],
  },
  month: {
    revenue: 583400, orders: 342, aov: 1706, units: 521, discounts: 72300, refunds: 18200, profit: 267842,
    topProduct: "Blossom Pump Deluxe", conversionRate: 3.1, visitors: 11200,
    daily: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      revenue: Math.round(15000 + Math.random() * 12000),
      orders: Math.round(8 + Math.random() * 8),
    })),
  },
  year: {
    revenue: 5840000, orders: 3892, aov: 1500, units: 5847, discounts: 684000, refunds: 174000, profit: 2460000,
    topProduct: "Air Max Stride", conversionRate: 2.8, visitors: 124000,
    monthly: [
      { month: "Jan", revenue: 380000, orders: 254 },
      { month: "Feb", revenue: 420000, orders: 281 },
      { month: "Mar", revenue: 490000, orders: 327 },
      { month: "Apr", revenue: 445000, orders: 297 },
      { month: "May", revenue: 510000, orders: 340 },
      { month: "Jun", revenue: 475000, orders: 317 },
      { month: "Jul", revenue: 520000, orders: 347 },
      { month: "Aug", revenue: 583000, orders: 389 },
      { month: "Sep", revenue: 498000, orders: 332 },
      { month: "Oct", revenue: 542000, orders: 361 },
      { month: "Nov", revenue: 618000, orders: 412 },
      { month: "Dec", revenue: 459000, orders: 306 },
    ],
  },
};

export const topSellingProducts = [
  { rank: 1, name: "Air Max Stride", sku: "BRT-SNE-0061", category: "Sneakers", units: 287, revenue: 316700, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=80&h=80&fit=crop" },
  { rank: 2, name: "Urban Stride Pro", sku: "BRT-MEN-0001", category: "Men", units: 241, revenue: 241000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop" },
  { rank: 3, name: "Blossom Pump Deluxe", sku: "BRT-WOM-0031", category: "Women", units: 218, revenue: 196200, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=80&h=80&fit=crop" },
  { rank: 4, name: "Cloud Boost Runner", sku: "BRT-SNE-0062", category: "Sneakers", units: 196, revenue: 196000, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=80&h=80&fit=crop" },
  { rank: 5, name: "Grace Stiletto 3", sku: "BRT-WOM-0032", category: "Women", units: 187, revenue: 261800, image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=80&h=80&fit=crop" },
  { rank: 6, name: "Metro Runner X", sku: "BRT-MEN-0002", category: "Men", units: 172, revenue: 189200, image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=80&h=80&fit=crop" },
  { rank: 7, name: "Turbo Flex 500", sku: "BRT-SNE-0063", category: "Sneakers", units: 165, revenue: 214500, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop" },
  { rank: 8, name: "Luna Ballet Flat", sku: "BRT-WOM-0033", category: "Women", units: 153, revenue: 107100, image: "https://images.unsplash.com/photo-1584735175315-9d5df23be353?w=80&h=80&fit=crop" },
  { rank: 9, name: "Executive Oxford Pro", sku: "BRT-FOR-0121", category: "Formal", units: 142, revenue: 199000, image: "https://images.unsplash.com/photo-1614252234919-e4a81cd6d0f9?w=80&h=80&fit=crop" },
  { rank: 10, name: "Elite Pace 2.0", sku: "BRT-MEN-0003", category: "Men", units: 138, revenue: 152000, image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop" },
];

export const orderStatusCounts = {
  Pending: 18, Confirmed: 24, Processing: 31, Packed: 19, Shipped: 47, Delivered: 312, Cancelled: 32, Returned: 17,
};

export default reportsData;
