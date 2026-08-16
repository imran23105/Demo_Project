// ─────────────────────────────────────────────
// BRITA FOOTWEARS – 250+ Products Mock Data
// ─────────────────────────────────────────────

const productImages = {
  men: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&h=600&fit=crop",
  ],
  women: [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584735175315-9d5df23be353?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1599459182681-c938b7e47de3?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
  ],
  sneakers: [
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571945192576-7b9974f0fc48?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1629208114423-3b7e8e74e31e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
  ],
};

const menNames = [
  "Urban Stride Pro", "Metro Runner X", "Elite Pace 2.0", "Summit Trek GTX",
  "Derby Classic Oxford", "Velocity Sprint 3", "Coast Walk Lite", "Apex Hiker Plus",
  "Formal Edge Brogue", "Street Flow Canvas", "Power Grip Trainer", "Night Rider 400",
  "Trail Blazer Mid", "Classic Loafer Pro", "Sprint Force Elite", "Zen Comfort Walker",
  "Executive Derby", "Combat Boot Urban", "Tennis Court Pro", "Slip-On Comfort Air",
  "Heritage Wingtip", "Running Beast X1", "Chunky Platform Urban", "Leather Oxford Classic",
  "Summer Slide Pro", "Winter Grip Boot", "Athletic Cross Trainer", "Moc-Toe Workwear",
  "Casual Slip-On Air", "Business Formal Pro",
];

const womenNames = [
  "Blossom Pump Deluxe", "Grace Stiletto 3", "Luna Ballet Flat", "Aria Wedge Comfort",
  "Serene Sneaker Lite", "Rose Block Heel", "Petal Mule Chic", "Cloud Nine Slide",
  "Floral Espadrille", "Velvet Ankle Boot", "Crystal Strappy Sandal", "Satin Mule Luxury",
  "Twist Strap Pump", "Bow Tie Ballet", "Golden Wedge Sandal", "Lace-Up Oxford",
  "Kitten Heel Mule", "Platform Chelsea", "Pointed Toe Classic", "Ankle Strap Flat",
  "Suede Peep-Toe", "Gladiator Lace Up", "Chunky Sole Sneaker", "Casual Canvas Slip",
  "Boho Fringe Sandal", "Shimmer Evening Pump", "Crepe Sole Derby", "T-Strap Vintage",
  "Pom-Pom Slide", "Metallic Loafer",
];

const sneakerNames = [
  "Air Max Stride", "Cloud Boost Runner", "Turbo Flex 500", "Neo Flash 2.0",
  "Street King Pro", "Retro Runner Classic", "High Top Flame", "Mesh Breeze Ultra",
  "Force Impact X", "Glow Sole Night", "Hyper Speed Elite", "Foam Core Lite",
  "Carbon Racer Pro", "Leather Hi-Top", "Vintage Sole 90s", "Neon Pop Runner",
  "Drift Skate Low", "Wave Rider Air", "Court Pro Classic", "Speed Surge X",
  "Glide Run Ultra", "Jump Force Elite", "Terra Grip Trail", "Sprint X Runner",
  "Air Lite Max 3", "Luxe Sole Pro", "Urban Core Boost", "Dynamic Flex Air",
  "Phantom Speed 2", "Ace Court Classic",
];

const casualNames = [
  "Easy Slip Canvas", "Weekend Casual Pro", "Breezy Loafer Air", "Comfort Walk Lite",
  "Hemp Sole Classic", "Woven Espadrille", "Lazy Day Flat", "Urban Moc Pro",
  "Summer Casual Slide", "Beach Walk Sandal", "Park Stroll Slip-On", "Cozy Knit Sneaker",
  "Terracotta Clay", "Minimal Leather Derby", "Canvas Journey Flat", "Soft Step Mule",
  "Earthen Toe-Post", "Yoga Walk Flat", "Weekday Loafer", "Chill Zone Slip",
];

const formalNames = [
  "Executive Oxford Pro", "Power Suit Derby", "Diplomat Brogue", "Legal Eagle Oxford",
  "Boardroom Classic", "Prestige Cap-Toe", "Summit Wing-Tip", "Heritage Full-Brogue",
  "Milano Derby Lux", "Onyx Oxford Elite", "Mahogany Loafer", "Jet Black Cap-Toe",
  "Cognac Brogue Pro", "Patent Derby Night", "Dress Boot Sharp",
];

const sandalNames = [
  "Coastal Flip Chic", "Boho Ankle Strap", "Birk Comfort Plus", "Summer Gladiator",
  "Sparkle Flat Sandal", "Pool Slide Comfort", "Resort Wedge", "Toe Ring Classic",
  "Woven Flat Sandal", "Beach Thong Deluxe",
];

const slipperNames = [
  "Cloud Foot Home", "Plush Memory Foam", "Cozy Fleece Indoor", "Anti-Slip Bath",
  "Spa Collection Pro", "Warm Winter Indoor", "Terry Cloth Luxury", "Open Toe Comfort",
  "Arch Support Home", "Hotel Plush Slide",
];

const brandNames = ["BRITA", "Stride", "Apex", "Luna", "Urban", "Elite", "Metro", "Peak", "Core", "Flux"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct(id, name, category, imageArr) {
  const mrp = randomBetween(1299, 8999);
  const discountPct = getRandom([10, 15, 20, 25, 30, 35, 40]);
  const price = Math.round(mrp * (1 - discountPct / 100));
  const stock = randomBetween(0, 120);
  const rating = (randomBetween(35, 50) / 10).toFixed(1);
  const reviewCount = randomBetween(12, 2400);
  const image = imageArr[id % imageArr.length];
  const isNew = id > 220;
  const isBestSeller = id % 7 === 0;
  const isFeatured = id % 5 === 0;

  return {
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + `-${id}`,
    sku: `BRT-${category.toUpperCase().slice(0, 3)}-${String(id).padStart(4, "0")}`,
    category,
    brand: getRandom(brandNames),
    mrp,
    price,
    discount: discountPct,
    stock,
    rating: parseFloat(rating),
    reviewCount,
    isNew,
    isBestSeller,
    isFeatured,
    images: [
      image,
      imageArr[(id + 1) % imageArr.length],
      imageArr[(id + 2) % imageArr.length],
    ],
    sizes: [6, 7, 8, 9, 10, 11].slice(0, randomBetween(3, 6)),
    colors: ["Black", "White", "Brown", "Navy", "Grey"].slice(0, randomBetween(2, 4)),
    material: getRandom(["Genuine Leather", "Synthetic", "Canvas", "Mesh", "Suede", "Rubber", "EVA Foam"]),
    description: `The ${name} is crafted for those who value both style and comfort. Made with premium materials, it features a cushioned insole for all-day wear and a durable outsole for grip and longevity. Perfect for everyday use.`,
    features: [
      "Premium material construction",
      "Cushioned memory foam insole",
      "Durable rubber outsole",
      "Breathable lining",
      "Lightweight design",
    ],
    shippingInfo: "Free shipping on orders above ₹999. Delivered in 3-5 business days.",
    returnPolicy: "Easy 30-day return policy. Exchange available within 7 days.",
    tags: [category, isNew ? "new" : "classic", isBestSeller ? "bestseller" : "regular"],
    createdAt: new Date(Date.now() - randomBetween(1, 365) * 86400000).toISOString(),
  };
}

let products = [];
let id = 1;

menNames.forEach((name) => {
  products.push(generateProduct(id++, name, "men", productImages.men));
});

womenNames.forEach((name) => {
  products.push(generateProduct(id++, name, "women", productImages.women));
});

sneakerNames.forEach((name) => {
  products.push(generateProduct(id++, name, "sneakers", productImages.sneakers));
});

casualNames.forEach((name) => {
  products.push(generateProduct(id++, name, "casual", productImages.men));
});

formalNames.forEach((name) => {
  products.push(generateProduct(id++, name, "formal", productImages.men));
});

sandalNames.forEach((name) => {
  products.push(generateProduct(id++, name, "sandals", productImages.women));
});

slipperNames.forEach((name) => {
  products.push(generateProduct(id++, name, "slippers", productImages.women));
});

// Fill remaining to get 250+
const extraNames = [
  "Trail Runner X", "Force Air Pro", "Speed Boost 2", "Comfort Walk 3", "Urban Elite",
  "Peak Runner V2", "Flex Core Pro", "Air Stride Plus", "Neo Drive X", "Swift Pace 5",
  "Glide Pro Max", "Power Surge 3", "Flash Step Ultra", "Zen Walk Pro", "Dynamic Air X",
  "Arch Flex Pro", "Speed Wing 4", "Power Stride X", "Elite Force Plus", "Air Cushion Pro",
  "Cloud Step X", "Boost Core 3", "Ultra Flex Air", "Rapid Step Pro", "Power Glide X",
  "Neo Boost Pro", "Speed Core X", "Flex Air Plus", "Dynamic Step X", "Ultra Stride Pro",
];

const extraCategories = ["men", "women", "sneakers", "casual", "formal"];
const extraImages = [...productImages.men, ...productImages.women, ...productImages.sneakers];

extraNames.forEach((name) => {
  const cat = extraCategories[id % extraCategories.length];
  products.push(generateProduct(id++, name, cat, extraImages));
});

export { products };
export default products;
