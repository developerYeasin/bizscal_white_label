const asyncHandler = require("../../utils/async_handler");
const ApiError = require("../../utils/api_error");
const StoreConfiguration = require("../models/StoreConfiguration"); // Assuming a StoreConfiguration model exists
const User = require("../models/User"); // Import the User model
const axios = require("axios");
const pool = require("../../config/database"); // Import the database connection pool

// Helper function to get courier configuration
const getCourierConfig = async (storeId, courierType) => {
  const storeConfig = await StoreConfiguration.findOne({ store_id: storeId }); // Assuming store_id is used to fetch configuration
  if (
    !storeConfig ||
    !storeConfig.delivery_settings ||
    !storeConfig.delivery_settings.configuration ||
    !storeConfig.delivery_settings.configuration[courierType]
  ) {
    throw new ApiError(
      400,
      `Configuration for courier type ${courierType} not found for store ${storeId}.`
    );
  }
  return storeConfig.delivery_settings.configuration[courierType];
};

// Helper function to get courier base URL and headers
const getCourierApiDetails = async (courierType, config, userId, storeId) => {
  let baseUrl = "";
  let headers = {
    "Content-Type": "application/json",
  };

  switch (courierType) {
    case "steadfast":
      baseUrl = "https://portal.packzy.com/api/v1";
      headers["Api-Key"] = config.api_key;
      headers["Secret-Key"] = config.app_secret;
      break;
    case "pathao":
      baseUrl = "https://courier-api-sandbox.pathao.com"; // Pathao Sandbox Base URL
      // Fetch Pathao token from the user's record
      let user = await User.findById(userId);
      let accessToken = user ? user.pathao_token : null;

      if (!accessToken) {
        // If token doesn't exist, generate a new one
        const tokenData = await generatePathaoAccessToken(storeId, config);
        accessToken = tokenData.accessToken;

        // Save the new token to the user's record
        await User.updatePathaoTokens(
          userId,
          tokenData.accessToken,
          tokenData.refreshToken,
          tokenData.expiresIn
        );
      }

      headers["Authorization"] = `Bearer ${accessToken}`;
      break;
    case "redx":
      console.log("config >> ", config);
      baseUrl = "https://openapi.redx.com.bd/v1.0.0-beta";
      headers["API-ACCESS-TOKEN"] = `Bearer ${config.api_key}`;
      break;
    // Add other couriers here
    default:
      throw new ApiError(400, `Courier type ${courierType} not supported.`);
  }
  return { baseUrl, headers };
};

// Helper function to update order item status
const updateOrderItemStatus = async (orderId, status) => {
  const connection = await pool.getConnection();
  try {
    await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      orderId,
    ]);
  } finally {
    connection.release();
  }
};

// Helper function to generate Pathao access token
const generatePathaoAccessToken = async (storeId, config) => {
  console.log("config >> ", config);
  const {
    client_id,
    client_secret,
    email: username,
    password,
    store_id,
    grant_type,
  } = config;
  const baseUrl = "https://courier-api-sandbox.pathao.com"; // Pathao Sandbox Base URL
  const apiPath = "/aladdin/api/v1/issue-token";

  try {
    const response = await axios.post(
      `${baseUrl}${apiPath}`,
      {
        client_id,
        client_secret,
        grant_type: "password", // Always 'password' for initial token generation
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.access_token) {
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } else {
      throw new ApiError(500, "Failed to retrieve Pathao access token.");
    }
  } catch (error) {
    console.error("Error generating Pathao access token:", error);
    console.error(
      "Error generating Pathao access token:",
      error.response ? error.response.data : error.message
    );
    throw new ApiError(
      error.response ? error.response.status : 500,
      error.response
        ? error.response.data.message
        : "Failed to generate Pathao access token."
    );
  }
};

// 1. Order Create API
const createOrder = asyncHandler(async (req, res, next) => {
  const { type, payload } = req.body; // 'type' will be the courier name (e.g., 'steadfast', 'pathao')

  if (!type || !payload) {
    throw new ApiError(400, "Courier type and payload are required.");
  }

  // Assuming store_id and user_id are available in req.store_id and req.user.id from a middleware
  const storeId = req.store_id;
  const userId = req.user.id;
  const courierConfig = await getCourierConfig(storeId, type);
  const { baseUrl, headers } = await getCourierApiDetails(
    type,
    courierConfig,
    userId,
    storeId
  );

  let apiPath = "";
  let requestBody = {};

  switch (type) {
    case "steadfast":
      apiPath = "/create_order";
      requestBody = {
        invoice: payload.invoice,
        recipient_name: payload.recipient_name,
        recipient_phone: payload.recipient_phone,
        alternative_phone: payload.alternative_phone,
        recipient_email: payload.recipient_email,
        recipient_address: payload.recipient_address,
        cod_amount: payload.cod_amount,
        note: payload.note,
        item_description: payload.item_description,
        total_lot: payload.total_lot,
        delivery_type: payload.delivery_type,
      };
      break;
    case "pathao":
      apiPath = "/aladdin/api/v1/orders";
      requestBody = {
        store_id: courierConfig.store_id,
        merchant_order_id: payload.merchant_order_id,
        recipient_name: payload.recipient_name,
        recipient_phone: payload.recipient_phone,
        recipient_secondary_phone: payload.recipient_secondary_phone,
        recipient_address: payload.recipient_address,
        recipient_city: payload.recipient_city,
        recipient_zone: payload.recipient_zone,
        recipient_area: payload.recipient_area,
        delivery_type: payload.delivery_type,
        item_type: payload.item_type,
        special_instruction: payload.note,
        item_quantity: payload.item_quantity,
        item_weight: payload.item_weight,
        item_description: payload.item_description,
        cod_amount: payload.cod_amount,
      };
      break;
    case "redx":
      apiPath = "/parcel";
      requestBody = {
        customer_name: payload.recipient_name,
        customer_phone: payload.recipient_phone,

        delivery_area: "Nawabganj, Dhaka",
        delivery_area_id: "41445534",

        customer_address: payload.recipient_address,
        merchant_invoice_id: payload.invoice,

        cash_collection_amount: payload.cod_amount,
        parcel_weight: "1kg",
        instruction: payload.note,
        value: payload.cod_amount,
        is_closed_box: true,
        // pickup_store_id: payload.pickup_store_id,
        parcel_details_json: [
          {
            name: payload.item_description,
            category: payload.item_description,
            value: payload.cod_amount,
          },
        ],
      };
      break;
    default:
      throw new ApiError(
        400,
        `Order creation not implemented for courier type ${type}.`
      );
  }
  console.log("requestBody >>", requestBody);
  try {
    const response = await axios.post(`${baseUrl}${apiPath}`, requestBody, {
      headers,
    });
    // console.log("response >> ", response);
    // Assuming payload contains an internal_order_id to link back to our system
    const internalOrderId = payload.internal_order_id;
    if (internalOrderId) {
      await updateOrderItemStatus(internalOrderId, "shipped");
    }

    res.status(response.status == 401 ? 400 : response.status).json({
      response: response.data,
    });
  } catch (error) {
    // console.error("Error creating order for", type, error);
    console.error(
      `Error creating order for ${type}:`,
      error.response ? error.response.data : error.message
    );
    throw new ApiError(
      error.response
        ? error.response.status == 401
          ? 400
          : error.response.status
        : 500,
      error.response ? error.response.data.message : "Failed to create order."
    );
  }
});

// 2. Bulk Order Create API
const bulkCreateOrder = asyncHandler(async (req, res, next) => {
  try {
    const { type, payload } = req.body; // 'type' will be the courier name (e.g., 'steadfast', 'pathao')

    if (!type || !payload || !Array.isArray(payload)) {
      throw new ApiError(
        400,
        "Courier type and an array payload are required for bulk order creation."
      );
    }

    // Assuming store_id and user_id are available in req.store_id and req.user.id from a middleware
    const storeId = req.store_id;
    const userId = req.user.id;
    const courierConfig = await getCourierConfig(storeId, type);
    const { baseUrl, headers } = await getCourierApiDetails(
      type,
      courierConfig,
      userId,
      storeId
    );

    let apiPath = "";
    let requestBody = {};

    switch (type) {
      case "steadfast":
        apiPath = "/create_order/bulk-order";
        requestBody = payload.map((item) => ({
          invoice: item.invoice,
          recipient_name: item.recipient_name,
          recipient_address: item.recipient_address,
          recipient_phone: item.recipient_phone,
          cod_amount: item.cod_amount,
          note: item.note,
          // Add other steadfast specific fields if needed for bulk
        }));
        break;
      case "pathao":
        apiPath = "/aladdin/api/v1/orders/bulk";
        requestBody = {
          orders: payload.map((item) => ({
            store_id: courierConfig.store_id,
            merchant_order_id: item.merchant_order_id,
            recipient_name: item.recipient_name,
            recipient_phone: item.recipient_phone,
            recipient_secondary_phone: item.recipient_secondary_phone,
            recipient_address: item.recipient_address,
            recipient_city: item.recipient_city,
            recipient_zone: item.recipient_zone,
            recipient_area: item.recipient_area,
            delivery_type: item.delivery_type,
            item_type: item.item_type,
            special_instruction: item.special_instruction,
            item_quantity: item.item_quantity,
            item_weight: item.item_weight,
            item_description: item.item_description,
            cod_amount: item.cod_amount,
          })),
        };
        break;
      default:
        throw new ApiError(
          400,
          `Bulk order creation not implemented for courier type ${type}.`
        );
    }

    console.log("requestBody >>", requestBody);
    console.log("headers >>", headers);
    const response = await axios.post(`${baseUrl}${apiPath}`, requestBody, {
      headers,
    });

    // Assuming each item in the original payload has an internal_order_id
    for (const item of payload) {
      if (item.internal_order_id) {
        await updateOrderItemStatus(item.internal_order_id, "shipped");
      }
    }
    console.log("response >>", response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      `Error bulk creating orders for ${type}:`,
      error.response ? error.response.data : error.message
    );
    throw new ApiError(
      error.response ? error.response.status : 500,
      error.response
        ? error.response.data.message
        : "Failed to bulk create orders."
    );
  }
});

// 3. Check Customer Status by Number API
const checkCustomerStatus = asyncHandler(async (req, res, next) => {
  try {
    const { customerNumber } = req.params; // Assuming customer number is passed as a URL parameter

    if (!customerNumber) {
      throw new ApiError(400, "Customer number is required.");
    }

    console.log(
      "courierConfig?.fraud_api_key || process.env.FRAUD_API_KEY >>",
      process.env.FRAUD_API_KEY
    );
    let apiPath = "https://bdcourier.com/api/courier-check";
    let headers = {};
    headers["Authorization"] = `Bearer ${process.env.FRAUD_API_KEY}`;

    console.log("baseURL >>", `${apiPath}`);
    console.log("headers >>", headers);
    const response = await axios.post(
      apiPath,
      { phone: customerNumber },
      { headers }
    );
    console.log("response >>", response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.log("error >>", error);
    next(new ApiError(500, "Error checking customer status."));
  }
});

// 4. Endpoint to generate and save Pathao access token
const issuePathaoAccessToken = asyncHandler(async (req, res, next) => {
  const storeId = req.store_id; // Assuming store_id is available from middleware
  const userId = req.user.id; // Assuming user_id is available from middleware

  const courierConfig = await getCourierConfig(storeId, "pathao");
  const { accessToken, refreshToken, expiresIn } =
    await generatePathaoAccessToken(storeId, courierConfig);

  // Save tokens to the user's record
  await pool.query(
    "UPDATE users SET pathao_token = ?, pathao_refresh_token = ?, pathao_token_expires_in = ? WHERE id = ?",
    [accessToken, refreshToken, expiresIn, userId]
  );

  res.status(200).json({
    message: "Pathao access token generated and saved successfully.",
    accessToken,
    expiresIn,
  });
});

// 5. Endpoint to generate and save RedX access token
const issueRedxAccessToken = asyncHandler(async (req, res, next) => {
  const storeId = req.store_id; // Assuming store_id is available from middleware
  const userId = req.user.id; // Assuming user_id is available from middleware

  const courierConfig = await getCourierConfig(storeId, "redx");
  const { jwt_token } = courierConfig;

  // In a real scenario, you might need to make an API call to get the token.
  // For now, we're assuming the token is pre-configured.
  // If RedX has a token generation endpoint, you would call it here.

  // Save the token to the user's record (if your schema supports it)
  // await User.update(userId, { redx_token: jwt_token });

  res.status(200).json({
    message: "RedX access token configured successfully.",
    accessToken: jwt_token,
  });
});

module.exports = {
  createOrder,
  bulkCreateOrder,
  checkCustomerStatus,
  generatePathaoAccessToken,
  issuePathaoAccessToken,
  issueRedxAccessToken, // Export the new function
};
