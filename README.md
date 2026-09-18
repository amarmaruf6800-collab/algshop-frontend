# 🛒 AlgShop

> A full-stack e-commerce marketplace application built for both buyers and sellers.

AlgShop is a modern marketplace platform that provides a complete shopping experience for buyers while giving sellers their own tools to manage products, inventory, orders, and their shop.

The application is built with **React + Vite** on the frontend and **Laravel 12** on the backend.

---

## 🌐 Live Demo

**Frontend:**  
https://algshop.vercel.app

> The current demo uses simulated payment processing for development and demonstration purposes.

---

## 📸 Preview

![AlgShop Preview](./docs/preview.png)

---

## ✨ Features

### 🛍️ Product Catalog

- Browse public product catalog
- Product detail pages
- Shop information
- Product images
- Product stock visibility
- Product discounts
- Final price calculation

### 🛒 Shopping Cart

- Add products to cart
- View cart
- Update cart before checkout
- User-specific shopping cart
- Prevent users from purchasing products from their own shop

### 📦 Checkout & Orders

- Checkout cart
- Select shipping address
- Group orders by seller/shop
- Automatic invoice number generation
- Automatic stock deduction after checkout
- Order details and items
- Buyer order history
- Seller incoming orders
- Seller order status management

### 💳 Payment Flow

- Dedicated payment page
- Invoice-based payment flow
- Simulated payment endpoint
- Payment status handling

> **Note:** The current implementation uses a simulated payment endpoint. It is not a live payment gateway integration.

### 📍 Address Management

- Add shipping addresses
- Edit addresses
- Delete addresses
- Set default address
- Automatic default address handling

### 🏪 Seller / Shop

- Create a shop
- Seller dashboard
- Manage seller products
- Add products
- Edit products
- Delete products
- Set product price
- Set discounts
- Manage stock
- Upload multiple product images
- Product management statistics
- Low-stock indication

### ⭐ Reviews

- Review purchased products
- 1–5 star ratings
- Review comments
- Only verified purchases can be reviewed
- Prevent duplicate reviews from the same user

### 🔐 Authentication

- User registration
- Login
- Laravel Sanctum authentication
- Protected buyer and seller features
- User profile endpoint

---

## 🧱 Architecture

```text
                    ALGSHOP

┌──────────────────────────────────┐
│          React + Vite            │
│          Tailwind CSS            │
│                                  │
│  Catalog • Cart • Checkout       │
│  Orders • Seller Dashboard       │
└───────────────┬──────────────────┘
                │
                │ HTTP / REST API
                ▼
┌──────────────────────────────────┐
│            Laravel 12            │
│                                  │
│  Sanctum Authentication           │
│  Product API                     │
│  Cart API                        │
│  Order API                       │
│  Address API                     │
│  Review API                      │
│  Seller API                      │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│       MySQL-compatible DB         │
│                                  │
│  Users • Shops • Products        │
│  Orders • Cart • Reviews         │
└──────────────────────────────────┘
```

The frontend uses Vercel rewrite rules to proxy API and storage requests to the backend server.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- Laravel Breeze
- Eloquent ORM

### Database

- MySQL / MariaDB-compatible database

### Deployment

- Vercel
- VPS backend deployment

---

## 📁 Project Structure

```text
ALGSHOP
│
├── src/
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── ConfirmOrder.jsx
│   │   ├── Payment.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── SellerDashboard.jsx
│   │   ├── MyProducts.jsx
│   │   ├── CreateShop.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   └── utils/
│
├── public/
├── vercel.json
├── package.json
└── README.md
```

---

## 🔑 API Overview

### Public

```text
GET  /api/katalog
GET  /api/produk/{id}
POST /api/login
POST /api/register
```

### Buyer

```text
GET    /api/keranjang
POST   /api/keranjang/{product_id}
POST   /api/checkout-keranjang

GET    /api/alamat
POST   /api/alamat
PUT    /api/alamat/{id}
DELETE /api/alamat/{id}
PUT    /api/alamat/{id}/default

POST   /api/bayar-simulasi
GET    /api/riwayat-belanja
POST   /api/produk/{id}/ulasan
```

### Seller

```text
POST   /api/buka-toko

GET    /api/toko-saya/produk
POST   /api/toko-saya/produk
POST   /api/toko-saya/produk/{id}
DELETE /api/toko-saya/produk/{id}

GET    /api/pesanan-masuk
PUT    /api/pesanan/{id}/status
```

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/amarmaruf6800-collab/algshop-frontend.git

cd algshop-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Set the backend API URL according to your local or deployed backend environment.

### 4. Start development server

```bash
npm run dev
```

---

## 🔗 Related Repository

### Backend

`algshop-backend`

The backend contains the Laravel API, authentication, product management, shopping cart, checkout, orders, reviews, and seller functionality.

---

## 🔐 Environment Variables

Do not commit production credentials or secrets to GitHub.

Example:

```env
VITE_API_URL=http://localhost:8000
```

Use environment variables for environment-specific configuration.

---

## 📌 Project Highlights

AlgShop demonstrates practical full-stack application development through:

- E-commerce marketplace architecture
- Buyer and seller workflows
- Authentication and authorization
- Product CRUD
- Multi-image product management
- Shopping cart
- Checkout workflow
- Stock deduction
- Shipping address management
- Order management
- Seller dashboard
- Product reviews
- REST API integration
- React + Laravel development

---

## 🎯 What I Built

This project focuses on implementing a marketplace workflow rather than only creating a product catalog.

The application connects multiple parts of an e-commerce system:

```text
User
 ↓
Browse Products
 ↓
Product Detail
 ↓
Shopping Cart
 ↓
Checkout
 ↓
Payment Simulation
 ↓
Order
 ↓
Stock Deduction
 ↓
Seller Order Management
```

---

## 👨‍💻 Author

**Amar**

Junior Web Developer | Full-Stack Enthusiast

Information Technology / Web Development
