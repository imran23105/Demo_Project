require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const categories = [
  { name: "Women's Fashion", slug: 'womens-fashion', icon: '👗', sortOrder: 1 },
  { name: "Men's Fashion", slug: 'mens-fashion', icon: '👔', sortOrder: 2 },
  { name: 'Beauty & Personal Care', slug: 'beauty', icon: '💄', sortOrder: 3 },
  { name: 'Electronics', slug: 'electronics', icon: '📱', sortOrder: 4 },
  { name: 'Home & Living', slug: 'home-living', icon: '🏠', sortOrder: 5 },
  { name: 'Sports & Outdoors', slug: 'sports', icon: '⚽', sortOrder: 6 },
  { name: 'Toys & Games', slug: 'toys-games', icon: '🧸', sortOrder: 7 },
  { name: 'Automotive', slug: 'automotive', icon: '🚗', sortOrder: 8 },
  { name: 'Books & Stationery', slug: 'books', icon: '📚', sortOrder: 9 },
  { name: 'Pet Supplies', slug: 'pet-supplies', icon: '🐾', sortOrder: 10 },
];

const generateProducts = (categoryMap) => [
  // Electronics
  {
    title: 'Bluetooth Speaker Pro X200',
    description: 'Premium wireless bluetooth speaker with 360° surround sound, 24-hour battery life, and waterproof design. Perfect for outdoor adventures.',
    shortDescription: 'Premium wireless 360° surround sound speaker',
    category: categoryMap['electronics'],
    brand: 'SoundWave',
    price: 4999,
    discountPrice: 3499,
    stock: 45,
    images: [
      { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', alt: 'Bluetooth Speaker' },
    ],
    tags: ['bluetooth', 'speaker', 'wireless', 'audio'],
    ratings: 4.5,
    numReviews: 127,
    isTrending: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    title: 'Smart Watch Elite Series 5',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, AMOLED display, and 5-day battery life. Compatible with iOS and Android.',
    shortDescription: 'Advanced health & fitness smartwatch',
    category: categoryMap['electronics'],
    brand: 'TechFit',
    price: 12999,
    discountPrice: 8999,
    stock: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch' },
    ],
    tags: ['smartwatch', 'fitness', 'health'],
    ratings: 4.6,
    numReviews: 89,
    isTrending: true,
    isBestSeller: true,
  },
  {
    title: 'Wireless Earbuds ANC Pro',
    description: 'True wireless earbuds with Active Noise Cancellation, 30-hour total battery life, and premium sound quality.',
    shortDescription: 'ANC true wireless earbuds with 30hr battery',
    category: categoryMap['electronics'],
    brand: 'AudioTech',
    price: 7999,
    discountPrice: 5499,
    stock: 60,
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', alt: 'Earbuds' },
    ],
    tags: ['earbuds', 'wireless', 'anc', 'audio'],
    ratings: 4.3,
    numReviews: 203,
    isTrending: true,
  },
  {
    title: 'Stainless Steel Water Bottle 1L',
    description: 'Double-wall insulated stainless steel bottle. Keeps drinks cold for 24 hours and hot for 12 hours.',
    shortDescription: 'Insulated stainless steel bottle',
    category: categoryMap['sports'],
    brand: 'HydroFlow',
    price: 1499,
    discountPrice: 999,
    stock: 100,
    images: [
      { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', alt: 'Water Bottle' },
    ],
    tags: ['bottle', 'hydration', 'sports', 'outdoor'],
    ratings: 4.6,
    numReviews: 445,
    isTrending: true,
    isBestSeller: true,
  },
  {
    title: 'Classic Aviator Sunglasses',
    description: 'Timeless aviator sunglasses with UV400 protection, polarized lenses, and lightweight metal frame.',
    shortDescription: 'Classic polarized aviator sunglasses',
    category: categoryMap["men's-fashion"] || categoryMap['mens-fashion'],
    brand: 'VisionX',
    price: 2499,
    discountPrice: 1799,
    stock: 75,
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', alt: 'Sunglasses' },
    ],
    tags: ['sunglasses', 'fashion', 'accessories', 'uv'],
    ratings: 4.2,
    numReviews: 67,
    isTrending: true,
  },
  {
    title: 'Laptop Backpack 30L',
    description: 'Premium laptop backpack with dedicated 15.6" laptop compartment, USB charging port, and water-resistant material.',
    shortDescription: 'Professional water-resistant laptop backpack',
    category: categoryMap["men's-fashion"] || categoryMap['mens-fashion'],
    brand: 'CarryPro',
    price: 3499,
    discountPrice: 2299,
    stock: 55,
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Backpack' },
    ],
    tags: ['backpack', 'laptop', 'travel', 'work'],
    ratings: 4.4,
    numReviews: 156,
    isTrending: true,
    isBestSeller: true,
  },
  // Women's Fashion
  {
    title: 'Elegant Silk Scarf',
    description: 'Luxurious 100% pure silk scarf with beautiful floral pattern. Perfect for all seasons.',
    shortDescription: 'Pure silk floral print scarf',
    category: categoryMap["women's-fashion"] || categoryMap['womens-fashion'],
    brand: 'LuxStyle',
    price: 1999,
    discountPrice: 1299,
    stock: 40,
    images: [
      { url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500', alt: 'Silk Scarf' },
    ],
    tags: ['scarf', 'silk', 'fashion', 'accessory'],
    ratings: 4.5,
    numReviews: 34,
    isFeatured: true,
  },
  {
    title: 'Designer Handbag Collection',
    description: 'Premium vegan leather handbag with multiple compartments, removable shoulder strap, and gold-tone hardware.',
    shortDescription: 'Premium vegan leather structured handbag',
    category: categoryMap["women's-fashion"] || categoryMap['womens-fashion'],
    brand: 'ModaBag',
    price: 8999,
    discountPrice: 5999,
    stock: 25,
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', alt: 'Handbag' },
    ],
    tags: ['handbag', 'fashion', 'accessories', 'leather'],
    ratings: 4.7,
    numReviews: 89,
    isFeatured: true,
    isBestSeller: true,
  },
  // Beauty
  {
    title: 'Vitamin C Brightening Serum',
    description: 'Concentrated Vitamin C serum with 20% L-ascorbic acid, hyaluronic acid, and niacinamide for radiant, glowing skin.',
    shortDescription: '20% Vitamin C brightening face serum',
    category: categoryMap['beauty'],
    brand: 'GlowLab',
    price: 2999,
    discountPrice: 1999,
    stock: 80,
    images: [
      { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', alt: 'Serum' },
    ],
    tags: ['serum', 'vitamin c', 'skincare', 'beauty'],
    ratings: 4.8,
    numReviews: 312,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    title: 'Matte Lipstick Set of 6',
    description: 'Long-lasting matte lipstick collection in 6 trending shades. Formulated with moisturizing ingredients for comfortable wear.',
    shortDescription: '6-shade long-lasting matte lipstick set',
    category: categoryMap['beauty'],
    brand: 'ColorPop',
    price: 1499,
    discountPrice: 999,
    stock: 120,
    images: [
      { url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf5e6b?w=500', alt: 'Lipstick' },
    ],
    tags: ['lipstick', 'makeup', 'beauty', 'matte'],
    ratings: 4.4,
    numReviews: 178,
    isFeatured: true,
  },
  // Home & Living
  {
    title: 'Scented Soy Candle Set',
    description: 'Set of 3 premium soy wax candles with natural essential oil fragrances. Lavender, Vanilla, and Sandalwood.',
    shortDescription: 'Premium soy wax aromatherapy candle trio',
    category: categoryMap['home-living'],
    brand: 'AromaHome',
    price: 1299,
    discountPrice: 899,
    stock: 90,
    images: [
      { url: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=500', alt: 'Candles' },
    ],
    tags: ['candle', 'home decor', 'aromatherapy', 'gift'],
    ratings: 4.6,
    numReviews: 223,
    isFeatured: true,
  },
  {
    title: 'Minimalist Wall Clock',
    description: 'Modern silent sweep wall clock with Nordic minimalist design. Available in matte black finish.',
    shortDescription: 'Silent sweep Nordic minimalist wall clock',
    category: categoryMap['home-living'],
    brand: 'TimeCraft',
    price: 1799,
    discountPrice: 1299,
    stock: 35,
    images: [
      { url: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500', alt: 'Wall Clock' },
    ],
    tags: ['clock', 'home decor', 'wall', 'minimalist'],
    ratings: 4.3,
    numReviews: 56,
  },
  // Sports
  {
    title: 'Yoga Mat Premium Non-Slip',
    description: 'Extra thick 6mm eco-friendly yoga mat with non-slip surface, alignment lines, and carrying strap.',
    shortDescription: '6mm eco-friendly non-slip yoga mat',
    category: categoryMap['sports'],
    brand: 'FlexZone',
    price: 2499,
    discountPrice: 1799,
    stock: 65,
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', alt: 'Yoga Mat' },
    ],
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    ratings: 4.5,
    numReviews: 145,
    isBestSeller: true,
  },
  {
    title: 'Resistance Bands Set (5 Levels)',
    description: '5-piece resistance band set with different resistance levels. Perfect for home workouts and physical therapy.',
    shortDescription: '5-level resistance band workout set',
    category: categoryMap['sports'],
    brand: 'GymPro',
    price: 999,
    discountPrice: 699,
    stock: 150,
    images: [
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', alt: 'Resistance Bands' },
    ],
    tags: ['resistance bands', 'fitness', 'workout', 'gym'],
    ratings: 4.4,
    numReviews: 267,
    isBestSeller: true,
  },
  // Books
  {
    title: 'The Art of Clean Code',
    description: 'A comprehensive guide to writing clean, maintainable, and efficient code. Essential reading for every developer.',
    shortDescription: 'Essential guide to clean code principles',
    category: categoryMap['books'],
    brand: 'TechPress',
    price: 699,
    discountPrice: 499,
    stock: 200,
    images: [
      { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', alt: 'Book' },
    ],
    tags: ['book', 'programming', 'coding', 'tech'],
    ratings: 4.8,
    numReviews: 89,
  },
  // Men's Fashion
  {
    title: 'Premium Oxford Shirt',
    description: 'Classic Oxford cotton shirt with button-down collar. Versatile style for office or casual wear.',
    shortDescription: 'Classic Oxford cotton button-down shirt',
    category: categoryMap["men's-fashion"] || categoryMap['mens-fashion'],
    brand: 'FabricKing',
    price: 2499,
    discountPrice: 1799,
    stock: 85,
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', alt: 'Oxford Shirt' },
    ],
    tags: ['shirt', 'oxford', 'men', 'formal', 'fashion'],
    ratings: 4.3,
    numReviews: 134,
    isFeatured: true,
  },
  // Toys
  {
    title: 'STEM Robot Building Kit',
    description: 'Educational robot building kit for kids aged 8+. Teaches coding, engineering, and problem-solving through play.',
    shortDescription: 'Educational robot building kit for kids 8+',
    category: categoryMap['toys-games'],
    brand: 'BrainBuilder',
    price: 3999,
    discountPrice: 2999,
    stock: 40,
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Robot Kit' },
    ],
    tags: ['stem', 'robot', 'educational', 'kids', 'toy'],
    ratings: 4.7,
    numReviews: 67,
    isFeatured: true,
  },
  // Pet Supplies
  {
    title: 'Interactive Pet Toy Bundle',
    description: 'Set of 5 interactive toys for dogs and cats. Includes puzzle feeder, chew toys, and laser pointer.',
    shortDescription: 'Interactive puzzle toy bundle for pets',
    category: categoryMap['pet-supplies'],
    brand: 'PetJoy',
    price: 1299,
    discountPrice: 899,
    stock: 70,
    images: [
      { url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500', alt: 'Pet Toy' },
    ],
    tags: ['pet', 'dog', 'cat', 'toy', 'interactive'],
    ratings: 4.5,
    numReviews: 112,
  },
  // Automotive
  {
    title: 'Car Phone Mount Pro',
    description: 'Universal magnetic car phone mount with 360° rotation, strong suction cup base, and quick-release mechanism.',
    shortDescription: 'Universal magnetic 360° car phone mount',
    category: categoryMap['automotive'],
    brand: 'DriveGear',
    price: 799,
    discountPrice: 549,
    stock: 200,
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', alt: 'Car Mount' },
    ],
    tags: ['car', 'phone mount', 'accessories', 'automotive'],
    ratings: 4.2,
    numReviews: 198,
    isBestSeller: true,
  },
  {
    title: 'Noise Cancelling Headphones',
    description: 'Over-ear wireless headphones with 40dB ANC, 30-hour battery, and foldable design for travel.',
    shortDescription: 'Over-ear ANC wireless headphones',
    category: categoryMap['electronics'],
    brand: 'AudioTech',
    price: 9999,
    discountPrice: 6999,
    stock: 40,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Headphones' },
    ],
    tags: ['headphones', 'wireless', 'anc', 'audio'],
    ratings: 4.6,
    numReviews: 234,
    isFeatured: true,
    isBestSeller: true,
  },
];

const coupons = [
  {
    code: 'WELCOME20',
    description: '20% off for new users',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 999,
    maxDiscountAmount: 500,
    usageLimit: 1000,
    expiresAt: new Date('2027-12-31'),
  },
  {
    code: 'FLAT200',
    description: '₹200 flat discount',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1499,
    usageLimit: 500,
    expiresAt: new Date('2027-12-31'),
  },
  {
    code: 'SUMMER50',
    description: '50% off summer sale — max ₹1000',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    usageLimit: 200,
    expiresAt: new Date('2027-12-31'),
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting seed...\n');

    // Clean existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('✅ Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@nebula.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);
    console.log('   Admin: admin@nebula.com / password123');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products
    const rawProducts = generateProducts(categoryMap);
    const productData = rawProducts.map((prod, index) => {
      const slug = prod.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-') + '-' + (index + 1);
      const discountPercent = prod.price > 0 && prod.discountPrice > 0
        ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
        : 0;
      return {
        ...prod,
        slug,
        discountPercent,
      };
    });
    const createdProducts = await Product.insertMany(productData);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create coupons
    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`✅ Created ${createdCoupons.length} coupons`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Credentials:');
    console.log('   Admin:  admin@nebula.com    | password123');
    console.log('   User 1: john@example.com    | password123');
    console.log('   User 2: jane@example.com    | password123');
    console.log('\n🎟️  Coupons: WELCOME20 | FLAT200 | SUMMER50\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
