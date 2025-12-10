# 🐾 Pet Shop E-Commerce Platform

> A full-stack e-commerce platform for pet supplies with modern features including real-time chat, product reviews, promotion management, and comprehensive admin dashboard.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/NguyenManhChi/petshopv1)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Installation](#installation)
- [API Documentation](#api-documentation)

## 🎯 Overview

A complete e-commerce solution for pet shops with separate frontend (React) and backend (Node.js/Express) architecture. Features include user authentication, product management, shopping cart, order processing, review system, AI chatbot integration, and promotional campaigns.

## ✨ Features

## ✨ Features

### Customer Features
- 🔐 **User Authentication**: Registration, login with JWT tokens, Google OAuth integration
- 🛍️ **Product Catalog**: Browse products with advanced filtering, search, and pagination
- 🛒 **Shopping Cart**: Real-time cart management with quantity updates
- 💳 **Checkout & Orders**: Complete order processing with order tracking
- ⭐ **Review System**: Rate and review products with sentiment analysis
- 🎁 **Promotions**: Apply discount codes and view active promotions
- 💬 **AI Chatbot**: Get instant support with AI-powered chat assistance
- 📱 **Responsive Design**: Mobile-friendly interface

### Admin Features
- 📊 **Dashboard**: Comprehensive analytics and statistics
- 📦 **Product Management**: CRUD operations for products, variants, and images
- 🏷️ **Category & Brand Management**: Organize products efficiently
- 👥 **User Management**: View and manage customer accounts
- 📋 **Order Management**: Process and track orders with status updates
- 🎨 **Banner Management**: Control homepage banners and promotions
- 📰 **Article System**: Create and manage blog/news articles
- 📈 **Review Analytics**: Monitor product reviews with sentiment analysis

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **State Management**: Context API
- **Routing**: React Router v6
- **UI Components**: Material-UI, Bootstrap
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth, JWT
- **Icons**: Font Awesome, Material Icons

### Backend
### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT, bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **API Documentation**: Swagger/OpenAPI 3.0
- **Code Quality**: ESLint, Prettier

## 📸 Demo

### Customer Interface
```
🏠 Home Page → Product Listing → 🛒 Cart → 💳 Checkout → ✅ Order Confirmation
```

### Admin Dashboard
```
📊 Analytics Dashboard → 📦 Product Management → 📋 Order Processing → 📈 Review Analytics
```

> **Note**: Add screenshots in a `/screenshots` folder to showcase your project visually!

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NguyenManhChi/petshopv1.git
   cd petshopv1
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in root directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=petshop
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d

   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Setup database**
   ```bash
   # Create database
   createdb petshop
   
   # Run migrations
   node database/setup.js
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```
   Backend runs at: `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Configure frontend environment**
   
   Create `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_FIREBASE_API_KEY=your_firebase_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   # Add other Firebase config...
   ```

4. **Start frontend**
   ```bash
   npm start
   ```
   Frontend runs at: `http://localhost:3001`

## 📚 API Documentation

### Key Endpoints

**Authentication**

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

**Products**
- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)

**Cart & Orders**
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders

**Admin Dashboard**
- `GET /api/dashboard/statistics` - Get dashboard stats (admin)
- `GET /api/orders` - Manage all orders (admin)
- `GET /api/reviews` - Manage reviews (admin)

**Interactive Documentation**: Visit `http://localhost:3000/api/docs` for complete Swagger documentation

## 📂 Project Structure

```
petshopv1/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── Pages/        # Page components (Home, Cart, Admin, etc.)
│   │   ├── Compoments/   # Reusable UI components
│   │   ├── api/          # API service layer
│   │   └── custom-hooks/ # Custom React hooks
│   └── public/           # Static assets
│
├── src/                  # Backend application
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, error handling
│   └── config/          # Configuration files
│
├── database/            # Database setup & migrations
│   ├── migrations/      # SQL migration scripts
│   └── seed.sql        # Sample data
│
└── docs/               # Project documentation
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting to prevent abuse
- Input validation & sanitization
- SQL injection prevention
- XSS protection with Helmet

## 🎓 Key Learning Outcomes

This project demonstrates proficiency in:
- **Full-stack Development**: Building complete web applications
- **RESTful API Design**: Creating scalable backend services
- **Database Design**: PostgreSQL schema design & optimization
- **Authentication**: Implementing secure user authentication
- **State Management**: Managing application state in React
- **Code Quality**: Following best practices with ESLint & Prettier

## 👤 Author

**Nguyen Manh Chi**
- GitHub: [@NguyenManhChi](https://github.com/NguyenManhChi)
- Project Link: [https://github.com/NguyenManhChi/petshopv1](https://github.com/NguyenManhChi/petshopv1)

## 📝 License

This project is licensed under the ISC License.

---

### 🚀 Future Enhancements
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for orders
- [ ] Product recommendations using ML
- [ ] Mobile app version (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**⭐ If you find this project useful, please give it a star!**
