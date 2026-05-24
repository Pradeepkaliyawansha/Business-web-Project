# 🔌 Dilo's Gadget — Full Stack MERN E-Commerce

A premium tech gadget store built with MongoDB, Express, React (Vite), and Node.js with a full admin panel.

---

## ✨ Features

### Storefront
- 🏠 Hero landing page with animated sections
- 🗂️ Product categories with emoji icons
- 🔍 Search, filter & sort products
- 📄 Product detail pages with reviews & ratings
- 🔐 User registration & login (JWT auth)
- 📱 Fully responsive (mobile-first)

### Admin Panel
- 📊 Dashboard with live stats
- ➕ Add / ✏️ Edit / 🗑️ Delete products
- 🗂️ Manage categories (CRUD)
- 👥 View & manage users (promote to admin)
- 🔒 Role-based route protection

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS      |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB, Mongoose                 |
| Auth      | JWT (JSON Web Tokens)             |
| Styling   | Tailwind CSS + custom design      |
| Icons     | Lucide React                      |
| Toasts    | React Hot Toast                   |

---

## 📁 Folder Structure

```
dilos-gadget/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── productController.js   # Product CRUD + reviews
│   │   ├── categoryController.js  # Category CRUD
│   │   └── userController.js      # User management + stats
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── userRoutes.js
│   ├── seed.js                    # Database seeder
│   ├── server.js                  # Entry point
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.jsx
│   │   │   ├── common/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   └── Loader.jsx
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── MainLayout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   ├── AdminProductForm.jsx
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   └── public/
│   │   │       ├── HomePage.jsx
│   │   │       ├── ProductsPage.jsx
│   │   │       ├── ProductDetailPage.jsx
│   │   │       └── CategoryPage.jsx
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── package.json                   # Root scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone & Install

```bash
# Install root dependencies (concurrently)
npm install

# Install all backend + frontend dependencies
npm run install:all
```

---

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dilos-gadget
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

### 3. Seed the Database

```bash
cd backend
node seed.js
```

This creates:
- 👤 Admin: `admin@dilos.com` / `admin123`
- 👤 User: `user@dilos.com` / `user123`
- 📂 6 categories
- 📦 8 sample products

---

### 4. Run Development Servers

```bash
# From the root — runs both backend and frontend
npm run dev
```

Or run separately:
```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint                    | Access  |
|--------|-----------------------------|---------|
| POST   | `/api/auth/register`        | Public  |
| POST   | `/api/auth/login`           | Public  |
| GET    | `/api/auth/me`              | Private |
| PUT    | `/api/auth/profile`         | Private |
| PUT    | `/api/auth/change-password` | Private |

### Products
| Method | Endpoint                    | Access       |
|--------|-----------------------------|--------------|
| GET    | `/api/products`             | Public       |
| GET    | `/api/products/:id`         | Public       |
| GET    | `/api/products/admin/all`   | Admin        |
| POST   | `/api/products`             | Admin        |
| PUT    | `/api/products/:id`         | Admin        |
| DELETE | `/api/products/:id`         | Admin        |
| POST   | `/api/products/:id/reviews` | Private      |

### Categories
| Method | Endpoint                      | Access  |
|--------|-------------------------------|---------|
| GET    | `/api/categories`             | Public  |
| GET    | `/api/categories/admin/all`   | Admin   |
| POST   | `/api/categories`             | Admin   |
| PUT    | `/api/categories/:id`         | Admin   |
| DELETE | `/api/categories/:id`         | Admin   |

### Users (Admin)
| Method | Endpoint                      | Access  |
|--------|-------------------------------|---------|
| GET    | `/api/users`                  | Admin   |
| GET    | `/api/users/dashboard/stats`  | Admin   |
| PUT    | `/api/users/:id`              | Admin   |
| DELETE | `/api/users/:id`              | Admin   |

---

## 🎨 Design System

The UI uses a dark futuristic theme with:
- **Primary color**: Orange (`#f97316`)
- **Background**: Deep dark (`#0a0a0f`)
- **Fonts**: Syne (display) + DM Sans (body)
- **Animations**: fade-in, slide-up, scale-in, glow

---

## 🔐 Default Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@dilos.com     | admin123  |
| User  | user@dilos.com      | user123   |

> ⚠️ Change these credentials before deploying to production!

---

## 🚢 Deployment

### Backend (e.g. Render / Railway)
1. Set environment variables from `.env.example`
2. Set `NODE_ENV=production`
3. Set `FRONTEND_URL` to your deployed frontend URL
4. Start command: `node server.js`

### Frontend (e.g. Vercel / Netlify)
1. Build: `npm run build`
2. Set `VITE_API_URL` if not using Vite proxy
3. Update `vite.config.js` proxy for production

---

## 📝 License

MIT © Dilo's Gadget
