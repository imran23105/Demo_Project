// Coupons Mock Data
export const coupons = [
  { id: 1, code: "WELCOME10", type: "percentage", value: 10, minOrder: 999, maxDiscount: 500, used: 243, limit: 1000, status: "Active", expiry: "2025-12-31", description: "10% off for new customers" },
  { id: 2, code: "BRITA20", type: "percentage", value: 20, minOrder: 1999, maxDiscount: 1000, used: 87, limit: 500, status: "Active", expiry: "2025-09-30", description: "20% off on orders above ₹1999" },
  { id: 3, code: "FLAT500", type: "flat", value: 500, minOrder: 2999, maxDiscount: 500, used: 156, limit: 300, status: "Active", expiry: "2025-10-15", description: "Flat ₹500 off" },
  { id: 4, code: "SNEAKER15", type: "percentage", value: 15, minOrder: 1499, maxDiscount: 750, used: 412, limit: 500, status: "Active", expiry: "2025-08-31", description: "15% off on sneakers" },
  { id: 5, code: "FREESHIP", type: "shipping", value: 100, minOrder: 499, maxDiscount: 100, used: 789, limit: 2000, status: "Active", expiry: "2025-12-31", description: "Free shipping on all orders" },
  { id: 6, code: "SUMMER30", type: "percentage", value: 30, minOrder: 2499, maxDiscount: 1500, used: 300, limit: 300, status: "Expired", expiry: "2025-06-30", description: "Summer sale 30% off" },
  { id: 7, code: "SALE40", type: "percentage", value: 40, minOrder: 3999, maxDiscount: 2000, used: 124, limit: 200, status: "Active", expiry: "2025-09-15", description: "Mega sale 40% off" },
  { id: 8, code: "FIRST100", type: "flat", value: 100, minOrder: 599, maxDiscount: 100, used: 891, limit: 1500, status: "Active", expiry: "2025-12-31", description: "₹100 off first order" },
];

export default coupons;
