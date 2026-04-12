const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const path = require("path");

const apiRoutes = require("./src/api/routes");
const ApiError = require("./src/utils/api_error");

const app = express();
app.set("trust proxy", 1);
// --- Global Middlewares ---
// app.use(
//   cors({
//     origin: '*', // Allow all origins
//     credentials: true,
//   })
// );
// CORS configuration - reads allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:8080',
      'http://localhost:8085',
      'http://localhost:4000',
      'http://localhost:8087',
      /\.bizscal\.com$/,
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// Enable CORS
// app.use(cors({
//   origin: 'http://localhost:32100',
//   credentials: true
// }));
// const allowedOrigins = [
//   "http://localhost:8080",
//   "http://localhost:8085",
//   "http://localhost:32100",
//   /.*\.bizscal\.com$/,
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);

//       const isAllowed = allowedOrigins.some((allowedOrigin) => {
//         if (typeof allowedOrigin === "string") {
//           return origin === allowedOrigin;
//         }
//         if (allowedOrigin instanceof RegExp) {
//           return allowedOrigin.test(origin);
//         }
//         return false;
//       });

//       if (isAllowed) {
//         return callback(null, true);
//       } else {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//     },
//     credentials: true,
//   })
// );

// Content Security Policy to allow external images and development scripts
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https://github.com https://avatars.githubusercontent.com https://picsum.photos blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: http: https:;"
  );
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`API Call: ${req.method} ${req.originalUrl}`);
  next();
});

// Session middleware for cart
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false to prevent saving uninitialized sessions
    cookie: {
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      httpOnly: true,
      sameSite: "lax", // Recommended for most cases
    },
  })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---
app.use("/api/v1", apiRoutes);

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Error Handling ---

// Handle 404 for routes not found
app.all("*", (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

if (!process.env.SESSION_SECRET) {
  throw new Error("FATAL ERROR: SESSION_SECRET is not defined.");
}
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
