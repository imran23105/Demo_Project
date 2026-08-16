export const DEMO_CUSTOMER = {
  email: "customer@brita-demo.com",
  password: "demo123",
  name: "Demo Customer",
  phone: "+91 9876543210",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoCustomer",
  orders: 8,
  wishlistItems: 5,
  totalSpent: 24890,
};

export const DEMO_ADMIN = {
  email: "owner@brita-demo.com",
  password: "demo123",
  name: "Store Owner",
  role: "Admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StoreOwner",
};

export const BRAND = {
  name: "BRITA FOOTWEARS",
  tagline: "Step Into Your Style",
  description: "Premium footwear designed for every step.",
  email: "support@brita.com",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: "42, Fashion Street, Bandra West, Mumbai – 400050",
  instagram: "https://instagram.com/britafootwears",
  gst: "27AABCB1234F1Z5",
};

export const ORDER_STATUSES = ["Pending","Confirmed","Processing","Packed","Shipped","Out For Delivery","Delivered","Cancelled","Returned"];
export const PAYMENT_METHODS = ["UPI","Card","Net Banking","Cash On Delivery"];
export const CATEGORIES = ["men","women","sneakers","casual","formal","sandals","slippers"];
export const SIZES = [5,6,7,8,9,10,11,12];
export const COLORS = ["Black","White","Brown","Navy","Grey","Red","Blue","Beige","Olive","Tan"];

export const STATUS_COLORS = {
  Pending: "badge-warning",
  Confirmed: "badge-info",
  Processing: "badge-info",
  Packed: "badge-info",
  Shipped: "badge-primary",
  "Out For Delivery": "badge-primary",
  Delivered: "badge-success",
  Cancelled: "badge-danger",
  Returned: "badge-danger",
  Active: "badge-success",
  Inactive: "badge-danger",
  "In Stock": "badge-success",
  "Low Stock": "badge-warning",
  "Out of Stock": "badge-danger",
};

export const COUPON_CODES = ["WELCOME10","BRITA20","FLAT500","FREESHIP"];
