const pool = require("../../config/database");
const ApiError = require("../../utils/api_error");

// const resolve_store = async (req, res, next) => {
//   try {
//     // Skip store resolution for owner registration
//     if (req.originalUrl === "/api/v1/auth/owner/register") {
//       console.log(
//         "[resolve_store] Skipping store resolution for owner registration."
//       );
//       return next();
//     }

//     // Skip store resolution for upload APIs and owner order status counts API
//     if (
//       req.originalUrl.startsWith("/api/v1/upload") ||
//       req.originalUrl.startsWith("/api/v1/orders-status-counts")
//     ) {
//       console.log(
//         "[resolve_store] Skipping store resolution for specific owner/admin APIs."
//       );
//       return next();
//     }

//     // If user is authenticated and has a store_id, use that.
//     if (req.user && req.user.store_id) {
//       req.store_id = req.user.store_id;
//       console.log(
//         `[resolve_store] User authenticated, Store ID from user: ${req.store_id}`
//       );
//       return next();
//     }

//     // Fallback to hostname resolution if no authenticated user store_id
//     // For local testing, you might use a header instead.
//     const hostname1 = req.get("origin") || req.get("Referer"); // Use actual hostname
//     console.log("hostname1 >> ", hostname1);
//     const hostname = "localhost:32100"; // Use actual hostname
//     // const hostname = "localhost:8085"; // Use actual hostname
//     // const hostname = "localhost:3003"; // Use actual hostname

//     if (hostname1 == "store.bizscal.com") {
//       const storeId = req.header("X-Store-ID");
//        const [rows] = await pool.query(
//       "SELECT id FROM stores WHERE hostname = ?",
//       [hostname]
//     );
//     } else {
//        const [rows] = await pool.query(
//       "SELECT id FROM stores WHERE hostname = ?",
//       [hostname]
//     );
//     }

//     if (rows.length === 0) {
//       return next(
//         new ApiError(404, `Store not found for hostname: ${hostname}`)
//       );
//     }

//     req.store_id = rows[0].id;
//     // req.store_id = storeId;
//     console.log(
//       `[resolve_store] Hostname: ${hostname}, Store ID: ${req.store_id}`
//     );
//     next();
//   } catch (error) {
//     console.error("error >> ", error);
//     next(new ApiError(500, "Could not resolve store."));
//   }
// };
const resolve_store = async (req, res, next) => {
  try {
    // Debug: log the path to understand structure
    console.log(
      `[resolve_store] req.path: ${req.path}, req.originalUrl: ${req.originalUrl}, req.baseUrl: ${req.baseUrl}`,
    );

    // Skip store resolution for owner/admin auth and store creation routes
    // Note: This middleware is mounted on /owner and /admin routers, so paths include the mount point
    // if (
    //   req.path.startsWith('/auth/') || // /owner/auth/* (login, register, logout, etc.)
    //   req.path === '/stores' || // POST /api/v1/owner/stores - store creation
    //   req.path === '/orders-status-counts' ||
    //   req.path.startsWith('/upload')
    // ) {
    //   console.log(`[resolve_store] Skipping store resolution for path: ${req.path}`);
    //   return next();
    // }

    // if (req.user && req.user.store_id) {
    //   req.store_id = req.user.store_id;
    //   return next();
    // }

    // // Testing override: allow ?store_id=N to manually set the store
    // if (req.query.store_id) {
    //   const [[row]] = await pool.query("SELECT id FROM stores WHERE id = ?", [req.query.store_id]);
    //   if (row) {
    //     req.store_id = row.id;
    //     console.log(`[resolve_store] Using store_id from query param: ${req.store_id}`);
    //     return next();
    //   }
    // }

    // // const { hostname } = req;
    // const originHeader = req.get("origin") || req.get("Referer");
    // if (!originHeader) {
    //   return next(new ApiError(400, "Could not determine host: missing Origin/Referer header"));
    // }
    // // Parse the URL properly to extract just hostname without port
    // let hostname;
    // try {
    //   const url = new URL(originHeader);
    //   hostname = url.hostname; // This gives host without port
    // } catch (e) {
    //   // Fallback: just strip protocol, port, and any path
    //   hostname = originHeader.replace(/^(https?:\/\/)/, "").split(/[:/?#]/)[0];
    // }
    // console.log("hostname >> ", hostname);
    // const MAIN_APP_DOMAIN = "store.bizscal.com";

    // let store_id = null;

    // // Development convenience: If hostname starts with "localhost" or is an IP address (for dev), find any matching store
    // const isLocalhost = hostname === 'localhost' || hostname.startsWith('localhost.');
    // const isIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);

    // if (isLocalhost || hostname === MAIN_APP_DOMAIN || isIPAddress) {
    //   // First try exact match
    //   const [rows] = await pool.query(
    //     "SELECT id FROM stores WHERE hostname = ?",
    //     [hostname],
    //   );
    //   if (rows.length > 0) {
    //     store_id = rows[0].id;
    //   } else {
    //     // If not found and hostname starts with localhost, try to find any store with hostname starting with localhost
    //     if (isLocalhost) {
    //       const [rows2] = await pool.query(
    //         "SELECT id FROM stores WHERE hostname LIKE 'localhost%' LIMIT 1",
    //       );
    //       if (rows2.length > 0) {
    //         store_id = rows2[0].id;
    //       }
    //     }
    //     // If still not found and it's an IP address, try to find any store (fallback for dev)
    //     if (!store_id && isIPAddress) {
    //       const [rows3] = await pool.query(
    //         "SELECT id FROM stores LIMIT 1",
    //       );
    //       if (rows3.length > 0) {
    //         store_id = rows3[0].id;
    //       }
    //     }
    //   }
    // } else {
    //   const [rows] = await pool.query(
    //     "SELECT id FROM stores WHERE hostname = ?",
    //     [hostname],
    //   );

    //   if (rows.length > 0) {
    //     store_id = rows[0].id;
    //   }
    // }

    // if (!store_id) {
    //   return next(
    //     new ApiError(404, `Store not found for hostname: ${hostname}`),
    //   );
    // }

    // req.store_id = store_id;
    req.store_id = 23;
    // req.store_id = 1;
    // req.store_id = 20;
    // req.store_id = 14;
    console.log("req.store_id >> ", req.store_id);
    next();
  } catch (error) {
    console.error("[resolve_store error]", error);
    next(new ApiError(500, `Could not resolve store. ${error.message}`));
  }
};

const protect_store_owner = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new ApiError(401, "Authentication required."));
    }

    // Check if the user is associated with the store and has an appropriate role
    const [userRows] = await pool.query(
      "SELECT store_id, role FROM users WHERE id = ?",
      [req.user.id],
    );
    console.log("userRows >>", userRows); // New log
    if (
      userRows.length === 0 ||
      userRows[0].store_id !== req.store_id ||
      (userRows[0].role !== "admin" && userRows[0].role !== "owner")
    ) {
      return next(
        new ApiError(
          403,
          "Access denied. Only store owners can access this resource.",
        ),
      );
    }

    next();
  } catch (error) {
    console.error("Error in protect_store_owner middleware:", error);
    next(new ApiError(500, "Authorization failed."));
  }
};

module.exports = { resolve_store, protect_store_owner };
