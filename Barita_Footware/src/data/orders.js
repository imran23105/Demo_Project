// ─────────────────────────────────────────────
// BRITA FOOTWEARS – Orders Mock Data (500+)
// ─────────────────────────────────────────────
import { products } from "./products";

const firstNames = ["Aryan","Priya","Rahul","Sneha","Vikram","Pooja","Amit","Kavya","Raj","Ananya","Dev","Ishaan","Neha","Karan","Riya","Siddharth","Aisha","Rohan","Megha","Aditya","Divya","Nikhil","Shreya","Abhishek","Tanvi","Mihir","Kritika","Varun","Pallavi","Shubham"];
const lastNames = ["Sharma","Patel","Kumar","Singh","Gupta","Verma","Mehta","Shah","Joshi","Nair","Reddy","Bose","Das","Iyer","Pillai","Agarwal","Mishra","Yadav","Tiwari","Pandey"];
const cities = ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow","Surat","Nagpur","Indore","Bhopal","Coimbatore"];
const states = ["Maharashtra","Delhi","Karnataka","Telangana","Tamil Nadu","West Bengal","Maharashtra","Gujarat","Rajasthan","Uttar Pradesh","Gujarat","Maharashtra","Madhya Pradesh","Madhya Pradesh","Tamil Nadu"];
const statuses = ["Pending","Confirmed","Processing","Packed","Shipped","Delivered","Delivered","Delivered","Cancelled","Returned"];
const payments = ["UPI","Card","Net Banking","Cash On Delivery"];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateOrderTimeline(status) {
  const steps = ["Placed","Confirmed","Processing","Packed","Shipped","Out For Delivery","Delivered"];
  const statusIndex = { "Pending":0, "Confirmed":1, "Processing":2, "Packed":3, "Shipped":4, "Out For Delivery":5, "Delivered":6, "Cancelled":1, "Returned":6 };
  const currentIndex = statusIndex[status] ?? 0;
  return steps.map((step, i) => ({
    label: step,
    done: i <= currentIndex,
    date: i <= currentIndex ? new Date(Date.now() - (currentIndex - i) * 86400000 * 1.5).toISOString() : null,
  }));
}

function generateOrder(id) {
  const firstName = getRandom(firstNames);
  const lastName = getRandom(lastNames);
  const cityIndex = randomBetween(0, cities.length - 1);
  const itemCount = randomBetween(1, 3);
  const orderProducts = [];
  let subtotal = 0;
  for (let i = 0; i < itemCount; i++) {
    const p = products[randomBetween(0, Math.min(products.length - 1, 80))];
    const qty = randomBetween(1, 2);
    orderProducts.push({ productId: p.id, name: p.name, image: p.images[0], qty, price: p.price, size: getRandom(p.sizes || [8]), color: getRandom(p.colors || ["Black"]) });
    subtotal += p.price * qty;
  }
  const discount = Math.round(subtotal * (randomBetween(0, 15) / 100));
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;
  const status = getRandom(statuses);
  const daysAgo = randomBetween(1, 180);

  return {
    id: `#BRI${10000 + id}`,
    customer: { name: `${firstName} ${lastName}`, email: `${firstName.toLowerCase()}@email.com`, phone: `+91 ${randomBetween(7000000000, 9999999999)}` },
    address: { line: `${randomBetween(1, 999)}, ${getRandom(["MG Road","Park Street","Lake View","Gandhi Nagar","Nehru Place"])}`, city: cities[cityIndex], state: states[cityIndex], pincode: `${randomBetween(100000, 999999)}` },
    products: orderProducts,
    subtotal,
    discount,
    shipping,
    total,
    status,
    payment: getRandom(payments),
    paymentStatus: status === "Cancelled" ? "Refunded" : "Paid",
    timeline: generateOrderTimeline(status),
    date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    estimatedDelivery: new Date(Date.now() + randomBetween(2, 7) * 86400000).toISOString(),
  };
}

export const orders = Array.from({ length: 500 }, (_, i) => generateOrder(i + 1));
export default orders;
