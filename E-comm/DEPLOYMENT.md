# Production Deployment Guide — Nebula E-Commerce

This guide provides step-by-step instructions to deploy the full-stack Nebula E-Commerce application to **Vercel** (Frontend), **Render** (Backend API), and **MongoDB Atlas** (Cloud Database), along with **Razorpay** payment gateway configuration.

---

## Architecture Overview

- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion (Deployed on **Vercel**)
- **Backend**: Node.js, Express.js, JWT, Razorpay SDK, Nodemailer, Cloudinary (Deployed on **Render**)
- **Database**: MongoDB Atlas Cluster (Managed M0/M10 MongoDB)
- **Payments**: Razorpay Gateway (Test & Live modes) with Webhook signature verification

---

## 1. MongoDB Atlas Setup

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a free **M0 Cluster** (or production M10+).
3. Under **Database Access**, create a database user:
   - Role: `Read and write to any database`
   - Authentication: Password
4. Under **Network Access**, click **Add IP Address**:
   - Add `0.0.0.0/0` (Allow access from anywhere, required for Render/Vercel dynamic IPs).
5. Click **Connect -> Drivers -> Node.js** to get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/nebula-ecommerce?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment on Render

1. Push your repository to GitHub or GitLab.
2. Sign in to [Render](https://render.com/).
3. Click **New + -> Web Service**.
4. Connect your GitHub repository:
   - **Name**: `nebula-ecommerce-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter
5. Under **Environment Variables**, add:

| Key | Example / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://your-frontend.vercel.app` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | 32+ character random string |
| `JWT_EXPIRE` | `15m` |
| `REFRESH_TOKEN_SECRET` | 32+ character random string |
| `REFRESH_TOKEN_EXPIRE` | `7d` |
| `RAZORPAY_KEY_ID` | `rzp_live_...` (or `rzp_test_...`) |
| `RAZORPAY_SECRET` | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET`| Razorpay Webhook Secret |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail or SMTP sender email |
| `EMAIL_PASS` | Gmail App Password (16 characters) |

6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g. `https://nebula-ecommerce-api.onrender.com`).

---

## 3. Database Seeding (Admin & Initial Products)

To seed initial categories, admin account, and products:
In Render's **Shell** tab (or locally pointing `MONGODB_URI` to Atlas):
```bash
npm run seed
```
**Default Admin Credentials:**
- **Email**: `admin@nebula.com`
- **Password**: `Admin@123`

---

## 4. Razorpay Webhook Configuration

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings -> Webhooks -> Add New Webhook**.
3. **Webhook URL**:
   ```
   https://your-backend.onrender.com/api/v1/payments/razorpay/webhook
   ```
4. **Secret**: Enter the exact secret string defined in `RAZORPAY_WEBHOOK_SECRET`.
5. **Active Events**:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
6. Click **Save**. All successful and failed payments will now automatically sync to your database.

---

## 5. Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New... -> Project** and select your repository.
3. In Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://your-backend.onrender.com/api/v1` |
| `VITE_RAZORPAY_KEY` | `rzp_live_...` (or `rzp_test_...`) |

5. Click **Deploy**.
6. The `frontend/vercel.json` rewrite file handles SPA routing automatically so refreshing deep links (`/shop`, `/orders`, `/admin`) returns the app seamlessly without 404s.

---

## 6. Post-Deployment Verification

1. **User Registration & Login**: Test user registration, login, and JWT access token refresh.
2. **Product Catalog & Live Search**: Test filters by category, price, rating, and header search.
3. **Cart & Wishlist**: Test adding products, coupon application, and wishlist toggle.
4. **Checkout & Razorpay**: Complete a test order with Razorpay test card or netbanking.
5. **Admin Dashboard**: Log in with `admin@nebula.com`, inspect real-time sales stats, update order status to `shipped` or `delivered`, and upload product images to Cloudinary.
