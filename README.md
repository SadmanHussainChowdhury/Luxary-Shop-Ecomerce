# Luxury Shop - Premium E-Commerce Platform

A modern, fully responsive, and feature-rich e-commerce platform built with Next.js 14, MongoDB Atlas, Tailwind CSS, and Framer Motion. Features a complete admin panel for dynamic product management, real-time statistics, and order processing.

## ✨ Features

- 🎨 **Premium Design**: Ultra-modern, responsive UI with glassmorphism effects and smooth animations
- 🛍️ **Product Management**: Dynamic admin panel for adding, editing, and managing products
- 📊 **Real-time Dashboard**: Live statistics with trend analysis and auto-refresh
- 🛒 **Shopping Cart**: Full cart functionality with local storage persistence
- 🔍 **Advanced Search**: MongoDB-powered search with text indexing and regex fallback
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🔐 **Authentication**: NextAuth integration for user authentication
- 💳 **Stripe Integration**: Ready for payment processing
- 📦 **Order Management**: Complete order tracking and status management
- ⚡ **Performance**: Optimized with Next.js App Router and server components

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS 3
- MongoDB Atlas + Mongoose 8
- NextAuth.js (authentication)
- Framer Motion (animations)
- Stripe (payment processing)
- React Hook Form (forms)
- Sonner (notifications)

## Getting Started

1) Install dependencies
```bash
npm install
```

2) Configure environment
Create `.env.local` (see `.env.example`).
```bash
cp .env.example .env.local
```
Fill in:
- MONGODB_URI – your MongoDB Atlas connection string
- NEXTAUTH_SECRET – a long random string
- NEXTAUTH_URL – e.g. http://localhost:3000 during dev
- (Optional) Stripe keys if using checkout

3) Run dev server
```bash
npm run dev
```
Open http://localhost:3000

## Scripts
- npm run dev – start dev server
- npm run build – production build
- npm run start – start production server
- npm run lint – run Next/ESLint

## Project Structure
```
app/
  admin/            # Admin panel pages
    products/       # Product management
    orders/         # Order management
    page.tsx        # Admin dashboard
  api/              # API routes
    admin/          # Admin API endpoints
    products/       # Product API
    auth/           # Authentication API
  product/          # Product detail pages
  products/         # Product listing pages
components/         # Reusable UI components
  AdminStats.tsx   # Admin dashboard statistics
  AliExpressHeader.tsx  # Main navigation header
  StaticProducts.tsx    # Static product data
lib/                # Utilities
  mongoose.ts       # Database connection
  auth.ts          # Authentication config
models/             # Mongoose models
  Product.ts       # Product model
  Order.ts         # Order model
  User.ts          # User model
```

## Admin Panel Features

- **Dashboard**: Real-time statistics with trend analysis
- **Product Management**: Add, edit, delete products with images
- **Order Management**: View and update order statuses
- **User Management**: Track user registrations
- **Auto-refresh**: All data updates automatically every 30-60 seconds

## Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Deploy to GitHub

See `GITHUB_SETUP.md` for detailed instructions, or run:

```bash
git init
git add .
git commit -m "Initial commit: Luxury Shop ecommerce platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Notes

- All sensitive files (`.env.local`) are excluded via `.gitignore`
- The admin panel is fully dynamic with real-time data from MongoDB
- The platform is production-ready with responsive design and optimized performance


