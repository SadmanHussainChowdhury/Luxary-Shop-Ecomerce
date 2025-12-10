# Luxentra - Ultimate Muli-Vendor Premium E-Commerce Solution

<div align="center">
  <br />
  <h1>Luxentra</h1>
  <h3>The Next Generation of E-Commerce</h3>
  <p>
    Built with <strong>Next.js 14</strong>, <strong>MongoDB</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.
  </p>
  <br />
</div>

**Luxentra** is a state-of-the-art, enterprise-grade e-commerce platform designed for reliability, speed, and conversion. Whether you are selling fashion, electronics, or digital goods, Luxentra provides a seamless shopping experience with a powerful admin dashboard to manage your entire business.

---

## 🚀 Key Features

### 🎨 Stunning Front-End Experience
- **Modern UI/UX**: Crafted with the latest design trends using Glassmorphism and Micro-interactions.
- **Fully Responsive**: Flawless experience across Mobile, Tablet, and Desktop.
- **Dark/Light Mode**: User preference support (Configuration ready).
- **Advanced Search**: Real-time search with MongoDB regex and text indexing.
- **Smart Filtering**: Filter by category, price, rating, and more.
- **Wishlist & Cart**: Persistent cart state and user wishlists.
- **User Accounts**: Order history, profile management, and saved addresses.

### ⚡ Powerful Admin Dashboard
- **Analytics Dashboard**: Real-time sales data, visitor tracking, and revenue charts.
- **Product Management**: Create, edit, and delete products with rich text descriptions and multiple image uploads.
- **Order Management**: Track order status (Pending, Processing, Shipped, Delivered) with visual indicators.
- **Inventory Control**: Stock management and low-stock alerts.
- **Dynamic Settings**: Update site logo, banners, and footer links directly from the admin panel.
- **User Management**: View customer details and manage access roles.

### 🔧 Technical Excellence
- **Next.js 14 App Router**: Utilizing the latest React Server Components for SEO and performance.
- **TypeScript**: 100% type-safe codebase for better maintainability.
- **MongoDB + Mongoose**: Scalable NoSQL database with flexible schema modeling.
- **NextAuth.js**: Secure authentication for Admins and Customers.
- **Stripe Integration**: Secure payment processing pre-configured.
- **SEO Optimized**: Meta tags, OpenGraph, and structured data ready.
- **Server Actions**: Modern form handling without API boilerplate.

---

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS 3.4 + Framer Motion (Animations)
- **Database**: MongoDB Atlas (Cloud)
- **ORM**: Mongoose 8
- **Authentication**: NextAuth.js v4
- **Payments**: Stripe SDK
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Deployment**: Vercel / Netlify / VPS ready

---

## 📦 Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account (Free Tier works)

### Step 1: Extract & Install
Unzip the project file and open your terminal in the root directory.

```bash
npm install
```

### Step 2: Environment Setup
Create a `.env.local` file in the root directory. Copy the contents from `.env.example` and fill in your credentials.

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxentra

# Authentication (Generate a random string: openssl rand -base64 32)
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Stripe (For Payments)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Step 3: Run Development Server

```bash
npm run dev
```
Visit http://localhost:3000 to see your store live!

---

## 🛡 Security & Best Practices

- **Secure API Routes**: Protected endpoints for Admin actions.
- **Data Validation**: Zod schema validation for all inputs.
- **Password Hashing**: Bcrypt secure hashing for user credentials.
- **Environment Isolation**: Sensitive keys never exposed to the client.

---

## 📝 License

Copyright © 2025 Luxentra. All Rights Reserved.
This product is protected by copyright laws. Redistribution or resale of this source code without a valid license from CodeCanyon is strictly prohibited.

---

## 🤝 Support

If you have any questions or need customization, please contact us via our CodeCanyon profile. We are here to help you build your dream store!
