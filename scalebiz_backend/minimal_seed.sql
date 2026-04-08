-- Minimal seed for scalebiz_new

USE scalebiz_new;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data (if any)
TRUNCATE TABLE store_configurations;
TRUNCATE TABLE product_categories;
TRUNCATE TABLE categories;
TRUNCATE TABLE products;
TRUNCATE TABLE users;
TRUNCATE TABLE pages;
TRUNCATE TABLE stores;
TRUNCATE TABLE themes;

-- Insert a theme
INSERT INTO `themes` (`id`, `name`, `description`, `version`, `status`, `access_level`) VALUES
(1, 'Basic', 'Basic theme', '1.0.0', 'published', 'free');

-- Insert a store
INSERT INTO `stores` (`id`, `theme_id`, `hostname`, `store_name`, `contact_email`, `country`, `currency_code`, `timezone`, `status`) VALUES
(1, 1, 'localhost:4000', 'Test Store', 'test@example.com', 'US', 'USD', 'UTC', 'active');

-- Insert store configuration
INSERT INTO `store_configurations` (`store_id`, `theme_settings`, `layout_settings`, `page_settings`) VALUES
(1,
 '{"name":"basic","primaryColor":"#3F51B5","secondaryColor":"#FFFFFF","accentColor":"#FFC107","textColor":"#212121","typography":{"headingFont":"Roboto","bodyFont":"Open Sans"},"buttonStyle":{"cornerRadius":"8px","style":"solid"},"announcementBar":{"backgroundColor":"#3F51B5","textColor":"#FFFFFF"},"productCardStyle":"default"}',
 '{"announcementBar":{"enabled":true,"text":"Free shipping on orders over $50!","backgroundColor":"#3F51B5","textColor":"#FFFFFF"},"header":{"layoutStyle":"logo-left-nav-right","navItems":[{"title":"Home","path":"/"},{"title":"Shop","path":"/collections/all"}]},"footer":{"layoutStyle":"simple","copyrightText":"© 2024 Test Store"}}',
 '{}'
);

-- Insert categories for store 1
INSERT INTO `categories` (`store_id`, `name`, `slug`, `is_active`, `is_featured`, `sort_order`) VALUES
(1, 'Apparel', 'apparel', 1, 1, 1),
(1, 'Accessories', 'accessories', 1, 1, 2),
(1, 'Footwear', 'footwear', 1, 1, 3);

-- Insert sample products for store 1
INSERT INTO `products` (`store_id`, `sku`, `name`, `slug`, `description`, `status`, `product_type`, `price`, `regular_price`, `image_url`, `gender`, `stock_quantity`, `track_inventory`, `condition`) VALUES
(1, 'SHIRT001', 'Classic T-Shirt', 'classic-t-shirt', 'A comfortable cotton t-shirt.', 'published', 'simple', 29.99, 39.99, 'https://via.placeholder.com/500', 'unisex', 100, 1, 'new'),
(1, 'PANTS001', 'Comfortable Jeans', 'comfortable-jeans', 'Stylish denim jeans.', 'published', 'simple', 59.99, 79.99, 'https://via.placeholder.com/500', 'unisex', 50, 1, 'new'),
(1, 'SHOE001', 'Running Sneakers', 'running-sneakers', 'Lightweight running shoes.', 'published', 'simple', 89.99, 119.99, 'https://via.placeholder.com/500', 'unisex', 75, 1, 'new');

-- Link products to categories (product_categories)
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 1), -- Classic T-Shirt -> Apparel
(2, 1), -- Jeans -> Apparel
(3, 3); -- Sneakers -> Footwear

-- Insert a user for store 1 (owner)
INSERT INTO `users` (`store_id`, `name`, `email`, `password_hash`, `account_status`, `role`) VALUES
(1, 'Store Owner', 'owner@example.com', '$2b$10$D8.gO5z4.g3gO5z4.g3gO5z4.g3gO5z4.g3gO5z4.g3gO5z4.g3gO', 'active', 'owner');

-- Insert pages for store 1
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`) VALUES
(1, 'About Us', 'about-us', '<h1>About Test Store</h1><p>We sell great products.</p>'),
(1, 'Contact', 'contact', '<h1>Contact Us</h1><p>Email: test@example.com</p>');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
