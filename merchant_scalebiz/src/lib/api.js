import axios from "axios";

const baseURL = "http://localhost:4000/api/v1/store";

export const apiClient = axios.create({
  // Use relative URL to go through nginx proxy
  // baseURL: "/api/v1/store",
  baseURL: baseURL,
  withCredentials: true,
});

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/500x500?text=No+Image+Available"; // A simple placeholder

// Helper to convert hex to a more readable name (optional, for display purposes)
const hexToColorName = (hex) => {
  const colors = {
    "#ff0000": "Red",
    "#00ff19": "Green",
    "#000000": "Black",
    "#FFD700": "Yellow",
    "#32CD32": "Lime Green",
    "#FFFFFF": "White",
    "#0000FF": "Blue",
    // Add more as needed
  };
  return colors[hex.toLowerCase()] || hex.toUpperCase(); // Fallback to hex if no name
};

// Helper function to build the product images array with correct priority
const buildProductImagesArray = (apiProduct) => {
  const images = [];
  const primaryImageUrl = apiProduct.image_url || PLACEHOLDER_IMAGE_URL;
  const hoverImageUrl = apiProduct.hover_image_url; // Don't default to primary here, check for existence later

  // 1. Add primary image first
  if (primaryImageUrl && primaryImageUrl !== PLACEHOLDER_IMAGE_URL) {
    images.push(primaryImageUrl);
  }

  // 2. Add hover image if it exists and is different from primary
  if (
    hoverImageUrl &&
    hoverImageUrl !== primaryImageUrl &&
    !images.includes(hoverImageUrl)
  ) {
    images.push(hoverImageUrl);
  }

  // 3. Add gallery images, avoiding duplicates
  if (apiProduct.gallery_images && Array.isArray(apiProduct.gallery_images)) {
    apiProduct.gallery_images.forEach((galleryImage) => {
      if (galleryImage && !images.includes(galleryImage)) {
        images.push(galleryImage);
      }
    });
  }

  // 4. If still no images, add the placeholder
  if (images.length === 0) {
    images.push(PLACEHOLDER_IMAGE_URL);
  }

  return images;
};

// Mapper function to transform API product data (from /products endpoint) to our app's Product type
const mapApiProductToProduct = (apiProduct) => {
  // console.log("apiProduct >> ", apiProduct);
  const primaryImageUrl = apiProduct.image_url || PLACEHOLDER_IMAGE_URL;
  const hoverImageUrl = apiProduct.hover_image_url || primaryImageUrl; // Keep this for the main product object properties

  const productImages = buildProductImagesArray(apiProduct); // Use the new helper

  const mappedColors = [];
  const mappedSizes = [];
  const mappedImageVariants = []; // New array for image variants

  if (apiProduct.variants && Array.isArray(apiProduct.variants)) {
    apiProduct.variants.forEach((variant) => {
      if (variant.type === "color" && variant.options) {
        variant.options.forEach((option) => {
          if (option.attribute) {
            mappedColors.push({
              label: hexToColorName(option.attribute),
              value: option.attribute,
              hex: option.attribute,
              extraPrice: parseFloat(option.extraPrice || 0), // Add extraPrice
            });
          }
        });
      } else if (variant.type.toLowerCase() === "text" && variant.options) {
        variant.options.forEach((option) => {
          if (option.attribute) {
            mappedSizes.push({
              label: option.attribute,
              value: option.attribute,
              extraPrice: parseFloat(option.extraPrice || 0), // Add extraPrice
            });
          }
        });
      } else if (variant.type === "image" && variant.options) {
        // Handle image variants
        variant.options.forEach((option, index) => {
          mappedImageVariants.push({
            label: option.defaultText || `Image Option ${index + 1}`, // Use defaultText or generate a label
            value: option.id.toString(), // Use ID as value
            imageUrl: option.imageUrl || PLACEHOLDER_IMAGE_URL, // Add imageUrl here
            extraPrice: parseFloat(option.extraPrice || 0),
          });
        });
      }
    });
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: parseFloat(apiProduct.price || 0), // Added || 0 fallback
    imageUrl: primaryImageUrl,
    hoverImageUrl: hoverImageUrl,
    description: apiProduct.description,
    status: apiProduct.status, // Added status
    productType: apiProduct.product_type, // Added productType
    regularPrice: parseFloat(apiProduct.regular_price || apiProduct.price || 0), // Added || 0 fallback
    costPrice: parseFloat(apiProduct.cost_price || 0), // Already has || 0
    videoUrl: apiProduct.video_url, // Added videoUrl
    gender: apiProduct.gender,
    stockQuantity: apiProduct.stock_quantity, // Added stockQuantity
    trackInventory: apiProduct.track_inventory, // Added trackInventory
    condition: apiProduct.condition, // Added condition
    sku: apiProduct.sku,
    cardType: apiProduct.card_type || null,
    shortDescription:
      apiProduct.short_description ||
      apiProduct.description?.substring(0, 150) + "...",
    colors:
      mappedColors.length > 0
        ? mappedColors
        : [
            // { label: "Yellow", value: "yellow", hex: "#FFD700", extraPrice: 0 },
            // { label: "Green", value: "green", hex: "#32CD32", extraPrice: 0 },
            // { label: "Black", value: "black", hex: "#000000", extraPrice: 0 },
          ],
    sizes:
      mappedSizes.length > 0
        ? mappedSizes
        : [
            // { label: "S", value: "s", extraPrice: 0 },
            // { label: "M", value: "m", extraPrice: 0 },
            // { label: "L", value: "l", extraPrice: 0 },
            // { label: "XL", value: "xl", extraPrice: 0 },
          ],
    images: productImages, // Use the correctly built array
    imageVariants: mappedImageVariants, // Add imageVariants to the product object
    categoryIds: apiProduct.categories?.map((cat) => Number(cat.id)) || [],
    offerCountDown: apiProduct.offer_count_down || null,
    details: apiProduct.details || [], // **THIS IS THE CRUCIAL ADDITION**
    faqs: apiProduct.faqs || [], // NEW: Add FAQs
    right_col_banner: apiProduct.right_col_banner || null, // NEW: Add right column banner
    isStockOut: apiProduct.is_stock_out || false, // NEW: Add isStockOut
  };
};

// Mapper function to transform API product data (from /all-products endpoint) to our app's Product type
const mapApiAllProductToProduct = (apiProduct) => {
  const primaryImageUrl = apiProduct.image_url || PLACEHOLDER_IMAGE_URL;
  const hoverImageUrl = apiProduct.hover_image_url || primaryImageUrl; // Keep this for the main product object properties

  const productImages = buildProductImagesArray(apiProduct); // Use the new helper

  const mappedColors = [];
  const mappedSizes = [];
  const mappedImageVariants = []; // New array for image variants

  if (apiProduct.variants && Array.isArray(apiProduct.variants)) {
    apiProduct.variants.forEach((variant) => {
      if (variant.type === "color" && variant.options) {
        variant.options.forEach((option) => {
          if (option.attribute) {
            mappedColors.push({
              label: hexToColorName(option.attribute),
              value: option.attribute,
              hex: option.attribute,
              extraPrice: parseFloat(option.extraPrice || 0),
            });
          }
        });
      } else if (
        variant.type === "text" &&
        variant.title === "Size" &&
        variant.options
      ) {
        variant.options.forEach((option) => {
          if (option.attribute) {
            mappedSizes.push({
              label: option.attribute,
              value: option.attribute,
              extraPrice: parseFloat(option.extraPrice || 0),
            });
          }
        });
      } else if (variant.type === "image" && variant.options) {
        // Handle image variants
        variant.options.forEach((option, index) => {
          mappedImageVariants.push({
            label: option.defaultText || `Image Option ${index + 1}`,
            value: option.id.toString(),
            imageUrl: option.imageUrl || PLACEHOLDER_IMAGE_URL, // Add imageUrl here
            extraPrice: parseFloat(option.extraPrice || 0),
          });
        });
      }
    });
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: parseFloat(apiProduct.price || 0), // Added || 0 fallback
    regularPrice: parseFloat(apiProduct.regular_price || apiProduct.price || 0),
    // salePrice: parseFloat(apiProduct.sale_price || 0), // Added || 0 fallback
    imageUrl: primaryImageUrl,
    hoverImageUrl: hoverImageUrl,
    description: apiProduct.description,
    gender: apiProduct.gender,
    sku: apiProduct.sku,
    cardType: apiProduct.card_type || null,
    shortDescription:
      apiProduct.short_description ||
      apiProduct.description?.substring(0, 150) + "...",
    colors:
      mappedColors.length > 0
        ? mappedColors
        : [
            // { label: "Yellow", value: "yellow", hex: "#FFD700", extraPrice: 0 },
            // { label: "Green", value: "green", hex: "#32CD32", extraPrice: 0 },
            // { label: "Black", value: "black", hex: "#000000", extraPrice: 0 },
          ],
    sizes:
      mappedSizes.length > 0
        ? mappedSizes
        : [
            // { label: "S", value: "s", extraPrice: 0 },
            // { label: "M", value: "m", extraPrice: 0 },
            // { label: "L", value: "l", extraPrice: 0 },
            // { label: "XL", value: "xl", extraPrice: 0 },
          ],
    images: productImages, // Use the correctly built array
    imageVariants: mappedImageVariants, // Add imageVariants to the product object
    categoryIds:
      apiProduct.category_details?.map((cat) => Number(cat.id)) || [],
    offerCountDown: apiProduct.offer_count_down || null,
    details: apiProduct.details || [], // **THIS IS THE CRUCIAL ADDITION**
    faqs: apiProduct.faqs || [], // NEW: Add FAQs
    right_col_banner: apiProduct.right_col_banner || null, // NEW: Add right column banner
    isStockOut: apiProduct.is_stock_out || false, // NEW: Add isStockOut
  };
};

// Mapper function to transform API category data to our app's Category type
const mapApiCategoryToCategory = (apiCategory) => ({
  id: apiCategory.id,
  name: apiCategory.name,
  slug: apiCategory.slug,
  imageUrl: apiCategory.image_url,
  path: `/collections/${apiCategory.slug}`, // Assuming this path structure for navigation
  subCategories: apiCategory.sub_categories
    ? apiCategory.sub_categories.map(mapApiCategoryToCategory)
    : [],
});

// Helper function to map raw API config to internal format
export const mapRawApiConfigToInternal = (rawConfig) => {
  if (!rawConfig) return null;

  const transformedTheme = {
    name: rawConfig.theme_settings.name,
    primaryColor: rawConfig.theme_settings.primary_color,
    secondaryColor: rawConfig.theme_settings.secondary_color,
    accentColor: rawConfig.theme_settings.accent_color,
    textColor: rawConfig.theme_settings.text_color,
    typography: rawConfig.theme_settings.typography,
    buttonStyle: rawConfig.theme_settings.button_style,
    announcementBar: rawConfig.theme_settings.announcement_bar,
    productCardStyle: rawConfig.theme_settings.product_card_style,
    buyNowButtonEnabled: rawConfig.theme_settings.buy_now_button_enabled,
  };

  const transformedConfig = {
    storeConfiguration: {
      storeId: rawConfig.store_id,
      storeName: rawConfig.store_name,
      logoUrl: rawConfig.logo_url,
      faviconUrl: rawConfig.favicon_url,
      themeId: rawConfig.theme_id,
      hostname: rawConfig.hostname || null, // Added hostname
    },
    integrations: rawConfig.integrations || {},
    deliverySettings: rawConfig.delivery_settings || {}, // Added deliverySettings
    paymentSettings: rawConfig.payment_settings || {}, // NEW: Added paymentSettings
    theme: transformedTheme,
    layout: rawConfig.layout_settings || {},
    pages: {
      landingPage: {
        components: rawConfig.page_settings?.landingPage?.components || [],
        landing_page_template_id:
          rawConfig.page_settings?.landingPage?.landing_page_template_id ||
          null,
      },
      productPage: rawConfig.page_settings?.productPage || {},
      policies: rawConfig.page_settings?.policies || {},
      order_confirmation_page:
        rawConfig.page_settings?.order_confirmation_page || null,
    },
    fraudPrevention: rawConfig.fraud_prevention || {}, // NEW: Add fraud_prevention
    rbcButtons: rawConfig.rbc_buttons || {}, // NEW: Add fraud_prevention
  };
  return transformedConfig;
};

// API Functions
export const fetchStoreConfig = async () => {
  // Removed storeId parameter
  const url = "/store_configuration"; // Endpoint remains the same, storeId is in header
  const response = await apiClient.get(url);
  const config = response.data.data.configuration;
  return mapRawApiConfigToInternal(config); // Use the new mapper
};

export const fetchProducts = async (filters) => {
  const params = new URLSearchParams();
  if (filters.collectionId && filters.collectionId !== "all") {
    params.append("collection_id", filters.collectionId);
  }
  if (filters.categories && filters.categories.length > 0) {
    params.append("category_ids", filters.categories.join(","));
  }
  if (filters.gender) {
    params.append("gender", filters.gender);
  }
  if (filters.priceRange) {
    params.append("min_price", filters.priceRange[0].toString());
    params.append("max_price", filters.priceRange[1].toString());
  }
  if (filters.productTypes && filters.productTypes.length > 0) {
    params.append("product_type_ids", filters.productTypes.join(","));
  }
  if (filters.searchTerm) {
    // Original search term filter
    params.append("search_term", filters.searchTerm);
  }
  if (filters.limit) {
    // Added limit for featured/related sections
    params.append("limit", filters.limit.toString());
  }

  const response = await apiClient.get("/products", { params }); // Original endpoint

  // Defensive parsing to prevent silent failures
  const responseData = response.data;
  if (!responseData || !responseData.data) {
    return [];
  }

  const apiProducts = responseData.data.products;
  if (!Array.isArray(apiProducts)) {
    return [];
  }

  return apiProducts.map(mapApiProductToProduct);
};

export const fetchAllProductsAndSearch = async (filters) => {
  const params = new URLSearchParams();
  if (filters.title) {
    // Use 'title' for search
    params.append("title", filters.title);
  }
  if (filters.limit) {
    params.append("limit", filters.limit.toString());
  }

  const response = await apiClient.get("/all-products", { params }); // New endpoint

  const responseData = response.data;
  if (!responseData || !responseData.data) {
    return [];
  }

  const apiProducts = responseData.data.products;
  if (!Array.isArray(apiProducts)) {
    return [];
  }

  return apiProducts.map(mapApiAllProductToProduct); // Use the new mapper
};

export const fetchProductById = async (productId) => {
  const response = await apiClient.get(`/products/${productId}`); // Endpoint remains the same relative to base

  // Defensive parsing
  const responseData = response.data;
  if (!responseData || !responseData.data) {
    throw new Error(`Product with ID ${productId} not found.`);
  }

  const dataContainer = responseData.data;
  const apiProduct = dataContainer.product || dataContainer;

  if (!apiProduct || typeof apiProduct !== "object") {
    throw new Error(`Product with ID ${productId} not found in API response.`);
  }

  return mapApiProductToProduct(apiProduct);
};

export const fetchCategories = async () => {
  const response = await apiClient.get("/categories"); // Updated endpoint
  const responseData = response.data;
  if (
    !responseData ||
    !responseData.data ||
    !Array.isArray(responseData.data.categories)
  ) {
    return [];
  }
  return responseData.data.categories.map(mapApiCategoryToCategory);
};

export const validateCoupon = async ({ code, productIds, categoryIds }) => {
  const payload = { code };

  // Always send product_ids as an array
  if (productIds && productIds.length > 0) {
    payload.product_ids = productIds;
  }
  // Always send category_ids as an array
  if (categoryIds && categoryIds.length > 0) {
    payload.category_ids = categoryIds;
  }

  try {
    const response = await apiClient.post("/coupons/validate", payload);
    return response.data; // { success: true, data: couponData } or { success: false, message: "..." }
  } catch (error) {
    console.error("Error validating coupon:", error);
    // Return a consistent error structure
    return (
      error.response?.data || {
        success: false,
        message: "An unexpected error occurred during coupon validation.",
      }
    );
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/orders", orderData);
    return response.data; // { status: "success", data: { order_id: 5 } } or { status: "fail", message: "..." }
  } catch (error) {
    console.error("Error creating order:", error);
    // Return a consistent error structure
    return (
      error.response?.data || {
        status: "fail",
        message: "An unexpected error occurred during order creation.",
      }
    );
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    return (
      error.response?.data || {
        status: "fail",
        message: "An unexpected error occurred during order update.",
      }
    );
  }
};

export const createIncompleteOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/orders/incomplete", orderData);
    return response.data; // { status: "success", data: { order_id, order_number } } or { status: "fail", message: "..." }
  } catch (error) {
    console.error("Error creating incomplete order:", error);
    return (
      error.response?.data || {
        status: "fail",
        message:
          "An unexpected error occurred during incomplete order creation.",
      }
    );
  }
};

export const fetchCourierStatus = async (phoneNumber) => {
  try {
    const response = await apiClient.get(`/courier/status/${phoneNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching courier status for ${phoneNumber}:`, error);
    return (
      error.response?.data || {
        status: "fail",
        message: "An unexpected error occurred while fetching courier status.",
      }
    );
  }
};

export const fetchProductLandingPageById = async (productLandingPageId) => {
  const response = await apiClient.get(
    `/product-landing-pages/public/${productLandingPageId}`,
  );
  const responseData = response.data;

  if (!responseData || !responseData.data) {
    throw new Error(
      `Product landing page with ID ${productLandingPageId} not found.`,
    );
  }

  const apiLandingPage = responseData.data;

  // Map the nested product object using the updated mapApiProductToProduct
  const product = apiLandingPage.product
    ? mapApiProductToProduct(apiLandingPage.product)
    : null;

  // Parse settings_json if it's a string
  let parsedSettings = {};
  if (apiLandingPage.settings_json) {
    if (typeof apiLandingPage.settings_json === "string") {
      try {
        parsedSettings = JSON.parse(apiLandingPage.settings_json);
      } catch (e) {
        console.error(
          "Error parsing settings_json for product landing page:",
          e,
        );
      }
    } else if (typeof apiLandingPage.settings_json === "object") {
      parsedSettings = apiLandingPage.settings_json;
    }
  }

  return {
    id: apiLandingPage.id,
    productId: apiLandingPage.product_id,
    pageTitle: apiLandingPage.page_title,
    pageDescription: apiLandingPage.page_description,
    slug: apiLandingPage.slug,
    headerEnable: apiLandingPage.header_enable === 1,
    footerEnable: apiLandingPage.footer_enable === 1,
    components: parsedSettings.components || [], // Use components from parsedSettings
    product: product,
    settings_json: parsedSettings, // Return the parsed settings_json as an object
    storeName: apiLandingPage.store?.store_name || "Store", // Fallback
    storeLogoUrl: apiLandingPage.store?.logo_url || null, // Assuming store might have a logo
    next_single_product_id: apiLandingPage.next_single_product_id || null, // Extract next product ID
    previous_single_product_id:
      apiLandingPage.previous_single_product_id || null, // Extract previous product ID
  };
};

export const fetchOrderById = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  const responseData = response.data;

  if (!responseData || !responseData.data || !responseData.data.order) {
    throw new Error(`Order with ID ${orderId} not found.`);
  }

  return responseData.data.order;
};

export const generateInvoicePdf = async (orderId, invoiceData) => {
  try {
    // Use apiClient directly as the endpoint is now under the store's base URL
    const response = await apiClient.post(
      "/invoices/generate-pdf", // Updated endpoint
      { orderId, invoiceData },
    );
    return response.data; // { error: false, message: "...", pdfUrl: "..." }
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return (
      error.response?.data || {
        error: true,
        message: "An unexpected error occurred during PDF generation.",
      }
    );
  }
};

export const submitContactForm = async (formData) => {
  try {
    // Assuming store_id is available globally or passed down. For now, hardcoding as 1 as per example.
    // In a real application, you might get this from context or a user session.
    const payload = { ...formData, store_id: 1 };
    const response = await apiClient.post("/contact-submissions", payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error; // Re-throw to be handled by the calling component
  }
};
