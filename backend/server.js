// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/authRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// // Security headers
// app.use(helmet());

// // CORS - allow the frontend origin and credentials (cookies)
// app.use(
//   cors({
//     origin: CLIENT_URL,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(morgan("dev"));

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", message: "E-commerce API is running" });
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// // 404 + error handling (must be last)
// app.use(notFound);
// app.use(errorHandler);

// export default app;



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// --- YAHAN SE CORS WALA CODE CHANGE KIYA HAI ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://altafmalik99.github.io"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
// ---------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "E-commerce API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;