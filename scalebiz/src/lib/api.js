"use client";

// This is a dummy API utility for demonstration purposes.
// In a real application, this would make actual API calls.

const mockProducts = [
  {
    id: 1,
    name: "Elegant Silk Scarf",
    description: "A luxurious silk scarf perfect for any occasion.",
    price: 1200.00,
    regular_price: 1500.00,
    cost_price: 800.00,
    stock_quantity: 50,
    image_url: "https://picsum.photos/seed/scarf1/300/300",
    categories: [{ id: 1, name: "Accessories" }],
    sku: "SCARF001",
  },
  {
    id: 2,
    name: "Classic Leather Wallet",
    description: "Handcrafted leather wallet with multiple card slots.",
    price: 2500.00,
    regular_price: 3000.00,
    cost_price: 1800.00,
    stock_quantity: 30,
    image_url: "https://picsum.photos/seed/wallet1/300/300",
    categories: [{ id: 1, name: "Accessories" }],
    sku: "WALLET001",
  },
  {
    id: 3,
    name: "Vintage Denim Jacket",
    description: "Stylish denim jacket with a vintage wash.",
    price: 4500.00,
    regular_price: 5000.00,
    cost_price: 3200.00,
    stock_quantity: 20,
    image_url: "https://picsum.photos/seed/jacket1/300/300",
    categories: [{ id: 2, name: "Apparel" }],
    sku: "JACKET001",
  },
  {
    id: 4,
    name: "Minimalist Sneakers",
    description: "Comfortable and stylish sneakers for everyday wear.",
    price: 3800.00,
    regular_price: 4200.00,
    cost_price: 2800.00,
    stock_quantity: 40,
    image_url: "https://picsum.photos/seed/sneakers1/300/300",
    categories: [{ id: 3, name: "Footwear" }],
    sku: "SNEAKER001",
  },
  {
    id: 5,
    name: "Bohemian Maxi Dress",
    description: "Flowy maxi dress with intricate patterns.",
    price: 3200.00,
    regular_price: 3500.00,
    cost_price: 2000.00,
    stock_quantity: 25,
    image_url: "https://picsum.photos/seed/dress1/300/300",
    categories: [{ id: 2, name: "Apparel" }],
    sku: "DRESS001",
  },
  {
    id: 6,
    name: "Smartwatch Pro",
    description: "Advanced smartwatch with health tracking features.",
    price: 8000.00,
    regular_price: 9000.00,
    cost_price: 6000.00,
    stock_quantity: 15,
    image_url: "https://picsum.photos/seed/smartwatch1/300/300",
    categories: [{ id: 4, name: "Electronics" }],
    sku: "SMARTW001",
  },
  {
    id: 7,
    name: "Wireless Earbuds",
    description: "High-fidelity sound with comfortable fit.",
    price: 1800.00,
    regular_price: 2000.00,
    cost_price: 1200.00,
    stock_quantity: 60,
    image_url: "https://picsum.photos/seed/earbuds1/300/300",
    categories: [{ id: 4, name: "Electronics" }],
    sku: "EARBUDS001",
  },
  {
    id: 8,
    name: "Designer Sunglasses",
    description: "UV protected sunglasses with a modern design.",
    price: 2800.00,
    regular_price: 3200.00,
    cost_price: 1900.00,
    stock_quantity: 35,
    image_url: "https://picsum.photos/seed/sunglasses1/300/300",
    categories: [{ id: 1, name: "Accessories" }],
    sku: "SUNGLASS001",
  },
  {
    id: 9,
    name: "Cozy Knit Sweater",
    description: "Soft and warm sweater for chilly evenings.",
    price: 2200.00,
    regular_price: 2500.00,
    cost_price: 1500.00,
    stock_quantity: 45,
    image_url: "https://picsum.photos/seed/sweater1/300/300",
    categories: [{ id: 2, name: "Apparel" }],
    sku: "SWEATER001",
  },
  {
    id: 10,
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent cushioning.",
    price: 4000.00,
    regular_price: 4500.00,
    cost_price: 2900.00,
    stock_quantity: 55,
    image_url: "https://picsum.photos/seed/runningshoes1/300/300",
    categories: [{ id: 3, name: "Footwear" }],
    sku: "RUNSHOES001",
  },
];

export const fetchProducts = async (query = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredProducts = [...mockProducts];

  if (query.collectionId) {
    if (query.collectionId === "featured") {
      // Example: return a subset of products as "featured"
      filteredProducts = mockProducts.slice(0, 4);
    } else if (query.collectionId === "best-sellers") {
      // Example: return another subset as "best-sellers"
      filteredProducts = mockProducts.slice(4, 8);
    }
    // Add more collectionId logic as needed
  }

  // Simulate pagination if needed
  // const { page = 1, limit = 10 } = query;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // filteredProducts = filteredProducts.slice(startIndex, endIndex);

  return filteredProducts;
};