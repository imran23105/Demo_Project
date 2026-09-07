# Nebula E-Commerce Platform

> **A full-stack, production-ready MERN e-commerce application** with JWT authentication, Razorpay/Stripe payment gateways, Cloudinary image uploads, and a feature-rich admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, Redux Toolkit, Framer Motion |
| Backend | Node.js, Express.js, MongoDB Atlas, Mongoose |
| Auth | JWT Access/Refresh Tokens, Bcrypt |
| Payments | Razorpay + Stripe |
| Media | Cloudinary (image upload) |
| Email | Nodemailer |

---

## Project Structure

```
E-comm/
├── backend/          # Express REST API
│   ├── src/
│   │   ├── config/       # DB, Cloudinary, Stripe
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, upload
│   │   ├── services/     # Email, payment, cloudinary
│   │   ├── utils/        # Token, error, response helpers
│   │   └── seeders/      # Demo data seeder
│   └── .env.example
│
└── frontend/         # React + Vite SPA
    ├── src/
    │   ├── components/  # Layout, product, cart, auth, common
    │   ├── pages/       # All page components + admin
    │   ├── redux/       # Store + slices
    │   ├── hooks/       # useAuth, useCart, useWishlist
    │   ├── services/    # Axios API services
    │   └── utils/       # Currency, date formatters
    └── .env.example
```

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (MongoDB URI, JWT Secret, Cloudinary, etc.)
npm run dev
```

Seed demo data:
```bash
npm run seed
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api/v1
npm run dev
```

Open `http://localhost:5173`

---

## Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nebula.com | password123 |
| User | john@example.com | password123 |

---

## Features

### Customer Features
- 🛍️ Browse products with category filter, price range, rating filter
- 🔍 Live search with instant dropdown results
- 🛒 Cart (persists for guests + syncs for logged-in users)
- ❤️ Wishlist with localStorage persistence
- 💳 Razorpay / Stripe / Cash on Delivery checkout
- 📦 Order tracking with status history
- 👤 Profile management (info, password, addresses)

### Admin Features
- 📊 Dashboard with revenue/order charts (Recharts)
- 📦 Product CRUD with Cloudinary image upload
- 🏷️ Category management
- 📋 Order status management
- 👥 User management (block/unblock)
- 🎫 Coupon management (% or fixed discount)

---

## Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_RAZORPAY_KEY=rzp_test_...
```

---

## API Endpoints

| Resource | Base Route |
|---------|-----------|
| Auth | `/api/v1/auth` |
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Cart | `/api/v1/cart` |
| Orders | `/api/v1/orders` |
| Payments | `/api/v1/payments` |
| Reviews | `/api/v1/reviews` |
| Users | `/api/v1/users` |

---

## Deployment

- **Frontend**: Vercel (`npm run build` → deploy `dist/`)
- **Backend**: Render / Railway (`npm start`)
- **Database**: MongoDB Atlas

---

Built with ❤️ using the MERN stack
