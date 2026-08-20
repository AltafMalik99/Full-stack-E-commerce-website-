# SHOP.CO — Full-Stack E-Commerce Assignment

A complete, working full-stack e-commerce web application built with **React (Vite) + Redux Toolkit** on the frontend and **Node.js + Express + JSON file storage** on the backend. No external database — all data is read from and written to JSON files on disk.

---

## Features

- Home page with hero banner, category grid, new arrivals, and popular products
- Category pages with search, category filter, price filter, and sorting
- Product detail page with quantity selector and related products
- Fully working cart: add / remove / update quantity / totals, persisted in `localStorage`
- User registration & login with hashed passwords (bcryptjs) and JWT auth (HTTP-only cookie + bearer token fallback)
- Protected checkout flow — must be logged in to place an order
- Orders are persisted to `backend/data/orders.json`
- Frontend + backend form validation
- Loading states, error states, empty states, and a 404 page
- Fully responsive (desktop, tablet, mobile)

---

## Tech Stack

**Frontend:** React, Vite, React Router DOM, Redux Toolkit, Context API, Axios, CSS
**Backend:** Node.js, Express, bcryptjs, JWT, cookie-parser, Helmet, CORS, Morgan
**Storage:** JSON files (`backend/data/*.json`) — no MongoDB/MySQL/Firebase

---

## Folder Structure

```text
ecommerce-project/
├── frontend/
│   ├── src/
│   │   ├── components/   Navbar, Footer, ProductCard, ProductGrid, Hero,
│   │   │                 CategoryCard, SearchBar, FilterSidebar, Loading, ErrorMessage
│   │   ├── pages/         Home, Category, ProductDetail, Cart, Login, Register, Checkout, NotFound
│   │   ├── redux/         store.js, productSlice.js, cartSlice.js, authSlice.js, orderSlice.js
│   │   ├── context/       AuthContext.jsx
│   │   ├── services/      api.js (Axios instance)
│   │   ├── routes/        ProtectedRoute.jsx
│   │   ├── App.jsx, main.jsx, index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/       authController.js, productController.js, orderController.js
│   ├── routes/            authRoutes.js, productRoutes.js, orderRoutes.js
│   ├── middleware/        authMiddleware.js, errorMiddleware.js, validationMiddleware.js
│   ├── data/               users.json, products.json, orders.json
│   ├── utils/              jsonDatabase.js  (read/write/find/create/update/delete helpers)
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## Getting Started (Local Development)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and set a real `JWT_SECRET` (any long random string). Then start the server:

```bash
npm run dev      # uses nodemon (auto-restart)
# or
npm start
```

The API will run at **http://localhost:5000**. Test it: open `http://localhost:5000/api/health` — you should see `{"status":"ok", ...}`.

### 2. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will run at **http://localhost:5173** and will talk to the backend at the URL set in `frontend/.env` (`VITE_API_URL`).

### 3. Try it out

1. Visit `http://localhost:5173`
2. Register a new account → check `backend/data/users.json`, you'll see the new (hashed-password) user
3. Add products to your cart, then check out → check `backend/data/orders.json`, you'll see the new order

---

## Environment Variables

**`backend/.env`**

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server runs on | `5000` |
| `JWT_SECRET` | Secret used to sign JWTs — **change this** | any long random string |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `development` |

**`frontend/.env`**

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, sets auth cookie + returns token |
| POST | `/api/auth/logout` | No | Clears the auth cookie |
| GET | `/api/auth/me` | Yes | Returns the current logged-in user |

### Products
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/products` | No | List products. Query params: `category`, `search`, `minPrice`, `maxPrice`, `sort` (`price_asc`\|`price_desc`\|`rating_desc`\|`newest`) |
| GET | `/api/products/:id` | No | Get one product |
| POST | `/api/products` | Yes | Create a product |
| PUT | `/api/products/:id` | Yes | Update a product |
| DELETE | `/api/products/:id` | Yes | Delete a product |

### Orders
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/orders` | Yes | List the logged-in user's orders |
| GET | `/api/orders/:id` | Yes | Get one order (must belong to the user) |
| POST | `/api/orders` | Yes | Place an order (`items`, `shippingInfo`, `total`) |

---

## Build for Production

```bash
cd frontend
npm run build     # outputs to frontend/dist
npm run preview   # preview the production build locally
```

---

## Deployment

### Backend → Render (or Railway / Fly.io / any Node host)

1. Push this repo to GitHub.
2. On Render: **New → Web Service** → connect the repo → set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in Render's dashboard: `PORT` (Render sets this automatically, you can omit it), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your deployed frontend URL, e.g. `https://your-app.vercel.app`), `NODE_ENV=production`.
6. Deploy. Note the resulting backend URL, e.g. `https://your-api.onrender.com`.

> ⚠️ JSON-file storage note: most free hosts (Render free tier included) use an **ephemeral filesystem** — writes to `data/*.json` may be reset on redeploy or restart. This satisfies the assignment's "no external database" requirement for local/dev use and demo purposes. For a persistent production deployment, mount a persistent disk (Render offers paid persistent disks) or migrate to a database later.

### Frontend → Vercel

1. On Vercel: **New Project** → import the repo → set **Root Directory** to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`.
4. Deploy. Note the resulting frontend URL, e.g. `https://your-app.vercel.app`.

### Final step — connect them

Go back to your Render backend's environment variables and set `CLIENT_URL` to your actual Vercel URL, then redeploy the backend so CORS allows requests from it.

---

## Replacing Placeholder Images

All product/banner images currently use royalty-free Unsplash URLs. To use your own:

- **Product images** → edit the `"image"` field for each product in `backend/data/products.json`
- **Homepage hero banner** → `frontend/src/components/Hero.jsx`
- **Homepage category tiles** (Men/Women/Shoes/Accessories) → the `CATEGORIES` array at the top of `frontend/src/pages/Home.jsx`

Any image URL works — a hosted image link, or files placed in `frontend/public/` and referenced as `/your-image.jpg`.

---

## Notes

- Passwords are hashed with bcryptjs before being written to `users.json` — never stored in plain text.
- JWTs are set as HTTP-only cookies (safer against XSS) and also returned in the response body as a fallback bearer token for cross-site environments where third-party cookies are restricted.
- This project was written and syntax-validated in a sandboxed environment without internet access, so `npm install` could not be run there. Please run the install commands above locally and let me know if you hit any issue — happy to fix it.
