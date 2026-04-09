CREATE DATABASE  IF NOT EXISTS `scalebiz_new`;
USE `scalebiz_new`;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `store_configurations`;
DROP TABLE IF EXISTS `store_landing_page_settings`;
DROP TABLE IF EXISTS `store_theme_settings`;
DROP TABLE IF EXISTS `pages`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `product_landing_pages`;
DROP TABLE IF EXISTS `landing_page_templates`;
DROP TABLE IF EXISTS `themes`;
DROP TABLE IF EXISTS `stores`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_id` (`store_id`,`slug`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `fk_categories_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_categories_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_orders` int DEFAULT '0',
  `total_spent` decimal(12,2) DEFAULT '0.00',
  `last_order_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_customers_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `landing_page_templates`
--

CREATE TABLE `landing_page_templates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `version` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1.0.0',
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `access_level` enum('free','standard','premium') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features` json DEFAULT NULL,
  `preview_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `live_demo_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `template_config` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `product_landing_pages`
--

CREATE TABLE `product_landing_pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `product_id` int NOT NULL,
  `template_id` int unsigned NOT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page_description` text COLLATE utf8mb4_unicode_ci,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settings_json` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `store_id` (`store_id`),
  KEY `product_id` (`product_id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `fk_product_landing_pages_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_landing_pages_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_landing_pages_template_id` FOREIGN KEY (`template_id`) REFERENCES `landing_page_templates` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `product_name_at_purchase` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_at_purchase` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variants` json DEFAULT NULL,
  `selected_variants` json DEFAULT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  `line_item_total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `customer_id` int unsigned DEFAULT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_id` int NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `subtotal_amount` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_address` text COLLATE utf8mb4_unicode_ci,
  `shipping_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_tracking_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fulfilled_at` timestamp NULL DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `customer_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_fraud` int NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`),
  KEY `store_id` (`store_id`),
  KEY `idx_orders_order_number` (`order_number`),
  KEY `idx_orders_status` (`status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orders_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` json DEFAULT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_id` (`store_id`,`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `pages`
ADD CONSTRAINT `fk_pages_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `product_id` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `brand` int DEFAULT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('published','draft','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `product_type` enum('simple','variable') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'simple',
  `price` decimal(10,2) NOT NULL,
  `regular_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hover_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('men','women','unisex') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `track_inventory` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `condition` enum('new','used','refurbished') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `variants` json DEFAULT NULL,
  `offer_count_down` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_stock_out` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_store_sku` (`store_id`,`sku`),
  KEY `store_id` (`store_id`),
  KEY `idx_brand_id` (`brand`),
  CONSTRAINT `fk_products_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `store_configurations`
--

CREATE TABLE `store_configurations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `layout_settings` json DEFAULT NULL,
  `page_settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `localization_settings` json DEFAULT NULL,
  `payment_settings` json DEFAULT NULL,
  `integrations` json DEFAULT NULL,
  `notification_settings` json DEFAULT NULL,
  `delivery_settings` json DEFAULT NULL COMMENT 'Stores default delivery charge and specific zone charges',
  `fraud_prevention` json DEFAULT NULL,
  `rbc_buttons` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_store_id` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `store_configurations`
ADD CONSTRAINT `fk_store_configurations_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Table structure for table `store_landing_page_settings`
--

CREATE TABLE `store_landing_page_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `landing_page_template_id` int unsigned NOT NULL,
  `general_primary_color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `general_secondary_color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_product_details` tinyint(1) NOT NULL DEFAULT '0',
  `seo_page_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_page_description` text COLLATE utf8mb4_unicode_ci,
  `scrolling_banner_text` text COLLATE utf8mb4_unicode_ci,
  `top_banner_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured_section_images` json DEFAULT NULL,
  `featured_video_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured_video_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `showcased_banner_images` json DEFAULT NULL,
  `static_banner_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_images_section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_images_section_images` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_store_id` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `store_landing_page_settings`
ADD CONSTRAINT `fk_slps_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_slps_landing_page_template_id` FOREIGN KEY (`landing_page_template_id`) REFERENCES `landing_page_templates` (`id`) ON DELETE RESTRICT;

--
-- Table structure for table `store_theme_settings`
--

CREATE TABLE `store_theme_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `theme_id` int unsigned NOT NULL,
  `primary_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#6B46C1',
  `secondary_color` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#FFFFFF',
  `accent_color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_mode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Light',
  `buy_now_button_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `typography` json DEFAULT NULL,
  `button_style` json DEFAULT NULL,
  `announcement_bar` json DEFAULT NULL,
  `product_card_style` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_store_id` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `store_theme_settings`
ADD CONSTRAINT `fk_sts_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_sts_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE RESTRICT;

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `theme_id` int unsigned NOT NULL,
  `hostname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favicon_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contact_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency_code` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `timezone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTC',
  `status` enum('active','trial','suspended','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'trial',
  `plan_id` int DEFAULT NULL,
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `business_type` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `shop_details` text DEFAULT NULL,
  `topbar_announcement` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hostname` (`hostname`),
  CONSTRAINT `fk_stores_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `themes`
--

CREATE TABLE `themes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `version` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1.0.0',
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `access_level` enum('free','standard','premium') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features` json DEFAULT NULL,
  `preview_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `live_demo_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `theme_blocks`
--

CREATE TABLE IF NOT EXISTS `theme_blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `theme_id` int NOT NULL,
  `block_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_config` json DEFAULT NULL,
  `config_schema` json DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_theme_id` (`theme_id`),
  UNIQUE KEY `uq_theme_block` (`theme_id`,`block_type`),
  CONSTRAINT `fk_theme_blocks_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending_verification',
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'owner',
  `email_verified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `timezone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'UTC',
  `password_reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_reset_expires_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_store_id` (`store_id`),
  CONSTRAINT `fk_users_store_id` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data: Default theme
INSERT INTO themes (id, name, description, version, status, access_level, category)
VALUES (1, 'Basic', 'Default basic theme', '1.0.0', 'published', 'free', 'general')
ON DUPLICATE KEY UPDATE name=name;

-- Seed data: Default landing page template
INSERT INTO landing_page_templates (id, name, description, version, status, access_level, category, features, template_config)
VALUES (1, 'Default Template', 'Default landing page template', '1.0.0', 'published', 'free', 'general', '[]', '{}')
ON DUPLICATE KEY UPDATE name=name;

-- =================================================================
-- Seed Theme Blocks (Basic + Advanced Layout & Components)
-- =================================================================

-- Theme 1: Basic Theme - Basic Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'heroBanner', 'Hero Banner', 'Full-width banner with image, title, subtitle, and CTA button', 'image', '{"imageUrl": "https://via.placeholder.com/1920x600?text=Hero+Banner", "title": "Welcome to Our Store", "subtitle": "Discover amazing products", "ctaButton": {"text": "Shop Now", "link": "/collections/all"}}', '{"type":"object","properties":{"imageUrl":{"type":"string","title":"Background Image URL"},"title":{"type":"string","title":"Title"},"subtitle":{"type":"string","title":"Subtitle"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}', 1),
(1, 'heroBannerSlider', 'Hero Slider', 'Multiple sliding hero banners with auto-play', 'sliders', '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Slide+1", "title": "Slide 1", "subtitle": "First slide", "ctaButton": {"text": "Learn More", "link": "/"}}, {"imageUrl": "https://via.placeholder.com/1920x600?text=Slide+2", "title": "Slide 2", "subtitle": "Second slide", "ctaButton": {"text": "Shop", "link": "/collections"}}]}', '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}', 2),
(1, 'productCarousel', 'Product Carousel', 'Scrollable carousel of featured products', 'shopping-cart', '{"title": "Featured Products", "query": {"collectionId": "all", "limit": 10}, "displayStyle": "carousel", "productsPerView": 4}', '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string","enum":["carousel","grid"]},"productsPerView":{"type":"number"}}}', 3),
(1, 'productSection', 'Product Section', 'Grid or list display of products with optional tabs', 'grid', '{"title": "Products", "query": {}, "displayStyle": "grid", "gridCols": 4, "tabs": []}', '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string","enum":["carousel","grid"]},"gridCols":{"type":"number"},"tabs":{"type":"array"}}}', 4),
(1, 'featuredCategories', 'Featured Categories', 'Showcase selected product categories', 'folder', '{"title": "Shop by Category", "categories": [{"name": "Category 1", "imageUrl": "https://via.placeholder.com/300x400?text=Cat1", "link": "/collections/cat1"}, {"name": "Category 2", "imageUrl": "https://via.placeholder.com/300x400?text=Cat2", "link": "/collections/cat2"}]}', '{"type":"object","properties":{"title":{"type":"string"},"categories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"imageUrl":{"type":"string"},"link":{"type":"string"}}}}}}', 5),
(1, 'newsletterSubscription', 'Newsletter Signup', 'Email subscription form with title and subtitle', 'mail', '{"title": "Subscribe to Our Newsletter", "subtitle": "Get updates on new arrivals and special offers", "placeholder": "Enter your email", "buttonText": "Subscribe"}', '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}', 6),
(1, 'marketingBanner', 'Promotional Banner', 'Full-width text banner with custom colors', 'alert-circle', '{"text": "Free shipping on orders over $50!", "backgroundColor": "#3F51B5", "textColor": "#FFFFFF"}', '{"type":"object","properties":{"text":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}', 7),
(1, 'featureBlocks', 'Feature Blocks', 'Icon and text blocks for highlighting features', 'check-circle', '{"title": "Why Choose Us", "features": [{"icon": "check-circle", "title": "Quality Products", "description": "We offer only the best"}, {"icon": "truck", "title": "Fast Shipping", "description": "Quick delivery"}]}', '{"type":"object","properties":{"title":{"type":"string"},"features":{"type":"array","items":{"type":"object","properties":{"icon":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}}}}', 8),
(1, 'blogPostsSection', 'Blog Posts', 'Display latest blog articles', 'file-text', '{"title": "Latest Blog Posts", "posts": []}', '{"type":"object","properties":{"title":{"type":"string"},"posts":{"type":"array"}}}', 9);

-- Theme 2: Modern Theme - Basic Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(2, 'heroBannerSlider', 'Hero Slider', 'Multiple sliding hero banners with auto-play', 'sliders', '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Modern+Slide+1", "title": "New Season Arrivals", "subtitle": "Step into the future", "ctaButton": {"text": "Explore", "link": "/collections/new"}}]}', '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}', 1),
(2, 'productCarousel', 'Product Carousel', 'Scrollable carousel of featured products', 'shopping-cart', '{"title": "Trending Now", "query": {"collectionId": "trending"}, "displayStyle": "carousel", "productsPerView": 5}', '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string","enum":["carousel","grid"]},"productsPerView":{"type":"number"}}}', 2),
(2, 'featuredCategories', 'Featured Categories', 'Showcase selected product categories', 'folder', '{"title": "Explore Collections", "categories": [{"name": "Men", "imageUrl": "https://via.placeholder.com/300x400?text=Men", "link": "/collections/men"}, {"name": "Women", "imageUrl": "https://via.placeholder.com/300x400?text=Women", "link": "/collections/women"}]}', '{"type":"object","properties":{"title":{"type":"string"},"categories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"imageUrl":{"type":"string"},"link":{"type":"string"}}}}}}', 3),
(2, 'newsletterSubscription', 'Newsletter Signup', 'Email subscription form with title and subtitle', 'mail', '{"title": "Stay in the Loop", "subtitle": "Subscribe for exclusive offers", "placeholder": "Your email", "buttonText": "Sign Up"}', '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}', 4);

-- Theme 3: Minimal Theme - Basic Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(3, 'heroBanner', 'Hero Banner', 'Full-width banner with image, title, subtitle, and CTA button', 'image', '{"imageUrl": "https://via.placeholder.com/1920x600?text=Minimal+Hero", "title": "Less is More", "subtitle": "Simple elegance", "ctaButton": {"text": "Browse", "link": "/"}}', '{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}', 1),
(3, 'productGrid', 'Product Grid', 'Simple grid of products', 'grid', '{"title": "All Products", "query": {"collectionId": "all"}, "columns": 4}', '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"columns":{"type":"number"}}}', 2),
(3, 'featureBlocks', 'Feature Blocks', 'Icon and text blocks for highlighting features', 'check-circle', '{"title": "Our Values", "features": [{"title": "Sustainability", "description": "Eco-friendly materials"}]}', '{"type":"object","properties":{"title":{"type":"string"},"features":{"type":"array"}}}', 3);

-- Theme 4: Premium Theme - Basic Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(4, 'heroBannerSlider', 'Hero Slider', 'Multiple sliding hero banners with auto-play', 'sliders', '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Premium+1", "title": "Premium Quality", "subtitle": "Exclusive collection", "ctaButton": {"text": "Discover", "link": "/collections/premium"}}]}', '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}', 1),
(4, 'productCarousel', 'Product Carousel', 'Scrollable carousel of featured products', 'shopping-cart', '{"title": "Premium Collection", "query": {"collectionId": "premium"}, "displayStyle": "carousel", "productsPerView": 4, "cardType": "premium"}', '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string"},"productsPerView":{"type":"number"},"cardType":{"type":"string"}}}', 2),
(4, 'featuredCategories', 'Featured Categories', 'Showcase selected product categories', 'folder', '{"title": "Curated Categories", "categories": [{"name": "Electronics", "imageUrl": "https://via.placeholder.com/300x400?text=Electronics", "link": "/collections/electronics"}, {"name": "Accessories", "imageUrl": "https://via.placeholder.com/300x400?text=Accessories", "link": "/collections/accessories"}]}', '{"type":"object","properties":{"title":{"type":"string"},"categories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"imageUrl":{"type":"string"},"link":{"type":"string"}}}}}}', 3),
(4, 'newsletterSubscription', 'Newsletter Signup', 'Email subscription form with title and subtitle', 'mail', '{"title": "Join Premium Club", "subtitle": "Get exclusive deals", "placeholder": "Enter email", "buttonText": "Join"}', '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}', 4);

-- Theme 5: Diamond Theme - Basic Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(5, 'heroBannerSlider', 'Hero Slider', 'Multiple sliding hero banners with auto-play', 'sliders', '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Diamond+Collection", "title": "Diamond Collection", "subtitle": "Luxury redefined", "ctaButton": {"text": "View Collection", "link": "/collections/diamond"}}]}', '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}', 1),
(5, 'productCarousel', 'Product Carousel', 'Scrollable carousel of featured products', 'shopping-cart', '{"title": "Featured Items", "query": {"collectionId": "featured"}, "displayStyle": "carousel", "productsPerView": 3}', '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string"},"productsPerView":{"type":"number"}}}', 2),
(5, 'newsletterSubscription', 'Newsletter Signup', 'Email subscription form with title and subtitle', 'mail', '{"title": "Exclusive Updates", "subtitle": "Be the first to know about new arrivals", "placeholder": "Your email address", "buttonText": "Subscribe"}', '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}', 3),
(5, 'featureBlocks', 'Feature Blocks', 'Icon and text blocks for highlighting features', 'check-circle', '{"title": "The Diamond Experience", "features": [{"title": "Exclusive", "description": "Members only"}, {"title": "Luxury", "description": "Premium quality"}]}', '{"type":"object","properties":{"title":{"type":"string"},"features":{"type":"array"}}}', 4);

-- =================================================================
-- Advanced Layout Blocks (Section, Container, Columns, Grid)
-- =================================================================

-- Theme 1: Basic - Layout Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout', '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}', '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}', 11),
(1, 'container', 'Container', 'Boxed container with max-width for centered content', 'square', '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}', '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}', 12),
(1, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns', '{"columns":2,"gap":"medium","columnWidths":[],"stackOnMobile":true}', '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}', 13),
(1, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid', '{"columns":3,"gap":"medium","autoFit":true,"minColumnWidth":250}', '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}', 14);

-- Theme 2: Modern - Layout Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(2, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout', '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}', '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}', 15),
(2, 'container', 'Container', 'Boxed container with max-width for centered content', 'square', '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}', '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}', 16),
(2, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns', '{"columns":2,"gap":"medium","columnWidths":[],"stackOnMobile":true}', '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}', 17),
(2, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid', '{"columns":3,"gap":"medium","autoFit":true,"minColumnWidth":250}', '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}', 18);

-- Theme 3: Minimal - Layout Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(3, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout', '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}', '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}', 11),
(3, 'container', 'Container', 'Boxed container with max-width for centered content', 'square', '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}', '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}', 12),
(3, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns', '{"columns":2,"gap":"small","columnWidths":[],"stackOnMobile":true}', '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}', 13),
(3, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid', '{"columns":4,"gap":"small","autoFit":true,"minColumnWidth":250}', '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}', 14);

-- Theme 4: Premium - Layout Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(4, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout', '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}', '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}', 15),
(4, 'container', 'Container', 'Boxed container with max-width for centered content', 'square', '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}', '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}', 16),
(4, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns', '{"columns":2,"gap":"medium","columnWidths":[],"stackOnMobile":true}', '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}', 17),
(4, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid', '{"columns":3,"gap":"medium","autoFit":false,"minColumnWidth":300}', '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}', 18);

-- Theme 5: Diamond - Layout Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(5, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout', '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":60,"right":0,"bottom":60,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}', '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}', 11),
(5, 'container', 'Container', 'Boxed container with max-width for centered content', 'square', '{"maxWidth":"1400","alignment":"center","padding":{"top":40,"right":40,"bottom":40,"left":40},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}', '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}', 12);

-- =================================================================
-- Advanced Component Blocks
-- =================================================================

-- Theme 1: Basic - All Advanced Components
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle', '{"title":"What Our Customers Say","testimonials":[{"name":"John Doe","role":"CEO","company":"ABC Corp","text":"Amazing service!","avatar":""},{"name":"Jane Smith","role":"Manager","company":"XYZ Inc","text":"Highly recommended!","avatar":""}],"autoPlay":true,"autoPlayInterval":5000,"slidesToShow":1,"slidesToScroll":1,"showArrows":true,"showDots":true}', '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"slidesToScroll":{"type":"number"},"showArrows":{"type":"boolean"},"showDots":{"type":"boolean"}}}', 15),
(1, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images', '{"title":"Photo Gallery","images":[{"url":"https://via.placeholder.com/400x300","alt":"Image 1","title":"","description":""}],"layout":"grid","columns":3,"gap":"medium","lightbox":true}', '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}', 16),
(1, 'faq', 'FAQ', 'Accordion frequently asked questions', 'help-circle', '{"title":"Frequently Asked Questions","faqs":[{"question":"What is your return policy?","answer":"We offer 30-day returns."},{"question":"How long does shipping take?","answer":"3-5 business days."}]}', '{"type":"object","properties":{"title":{"type":"string"},"faqs":{"type":"array","items":{"type":"object","properties":{"question":{"type":"string"},"answer":{"type":"string"}}}}}}', 17),
(1, 'team', 'Team', 'Showcase team members', 'users', '{"title":"Meet Our Team","members":[{"name":"John Doe","role":"CEO","photo":"","bio":"Leader with 10 years experience","social":{"twitter":"","linkedin":""}}],"columns":3,"layout":"grid"}', '{"type":"object","properties":{"title":{"type":"string"},"members":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"photo":{"type":"string"},"bio":{"type":"string"},"social":{"type":"object","properties":{"twitter":{"type":"string"},"linkedin":{"type":"string"}}}}},"columns":{"type":"number","minimum":1,"maximum":4},"layout":{"type":"string","enum":["grid","list"]}}}', 18),
(1, 'statistics', 'Statistics', 'Animated number counters', 'bar-chart-2', '{"title":"Our Impact","statistics":[{"label":"Happy Customers","value":1000,"suffix":"+","color":"#6B46C1"},{"label":"Products Sold","value":500,"suffix":"K","color":"#10B981"}]}', '{"type":"object","properties":{"title":{"type":"string"},"statistics":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"value":{"type":"number"},"suffix":{"type":"string"},"color":{"type":"string"}}}}}', 19),
(1, 'video', 'Video', 'Embed video from YouTube, Vimeo, or custom', 'video', '{"title":"Watch Our Story","videoUrl":"","provider":"youtube","autoplay":false,"controls":true,"loop":false,"muted":false,"aspectRatio":"16:9"}', '{"type":"object","properties":{"title":{"type":"string"},"videoUrl":{"type":"string","title":"Video URL"},"provider":{"type":"string","title":"Provider","enum":["youtube","vimeo","custom"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"loop":{"type":"boolean"},"muted":{"type":"boolean"},"aspectRatio":{"type":"string","title":"Aspect Ratio","enum":["16:9","4:3","1:1"]}}}', 20),
(1, 'countdown', 'Countdown', 'Countdown timer to a specific date', 'clock', '{"title":"Sale Ends In","targetDate":"2025-12-31T23:59:59","timezone":"UTC","showLabels":true,"style":"boxed","backgroundColor":"#6B46C1","textColor":"#ffffff"}', '{"type":"object","properties":{"title":{"type":"string"},"targetDate":{"type":"string","format":"date-time"},"timezone":{"type":"string"},"showLabels":{"type":"boolean"},"style":{"type":"string","enum":["boxed","outline","minimal"]},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}', 21),
(1, 'socialProof', 'Social Proof', 'Trust badges, payment icons, social proofs', 'award', '{"title":"Trusted By","badges":[{"imageUrl":"https://via.placeholder.com/100x40?text=Badge1","alt":"Badge 1","link":""},{"imageUrl":"https://via.placeholder.com/100x40?text=Badge2","alt":"Badge 2","link":""}],"layout":"row","align":"center"}', '{"type":"object","properties":{"title":{"type":"string"},"badges":{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"alt":{"type":"string"},"link":{"type":"string"}}}},"layout":{"type":"string","enum":["row","grid"]},"align":{"type":"string","enum":["left","center","right"]}}}', 22),
(1, 'customHtml', 'Custom HTML', 'Insert custom HTML code', 'code', '{"html":"<div>Your HTML here</div>","sandbox":false,"allowScripts":false}', '{"type":"object","properties":{"html":{"type":"string","format":"textarea"},"sandbox":{"type":"boolean","title":"Sandbox (iframe isolation)"},"allowScripts":{"type":"boolean","title":"Allow Scripts (use with caution)"}}}', 23),
(1, 'divider', 'Divider', 'Horizontal divider line', 'minus', '{"style":"solid","color":"#e5e7eb","thickness":1,"margin":{"top":20,"bottom":20}}', '{"type":"object","properties":{"style":{"type":"string","enum":["solid","dashed","dotted"],"default":"solid"},"color":{"type":"string"},"thickness":{"type":"number"},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"bottom":{"type":"number"}}}}}', 24),
(1, 'spacer', 'Spacer', 'Vertical space', 'arrow-up-down', '{"height":40,"showInEditor":true}', '{"type":"object","properties":{"height":{"type":"number","title":"Height (px)"},"showInEditor":{"type":"boolean","title":"Show spacer line in editor","default":true}}}', 25),
(1, 'contactForm', 'Contact Form', 'Customer contact form with custom fields', 'mail', '{"title":"Contact Us","fields":[{"name":"name","label":"Name","type":"text","required":true},{"name":"email","label":"Email","type":"email","required":true},{"name":"message","label":"Message","type":"textarea","required":true}],"submitText":"Send Message","successMessage":"Thank you for contacting us!","recipientEmail":"store@example.com"}', '{"type":"object","properties":{"title":{"type":"string"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","textarea","phone","select"]},"required":{"type":"boolean"},"options":{"type":"array","items":{"type":"string"}}}},"submitText":{"type":"string"},"successMessage":{"type":"string"},"recipientEmail":{"type":"string"}}}', 26),
(1, 'map', 'Map', 'Google Maps embed', 'map', '{"title":"Our Location","address":"","latitude":"","longitude":"","zoom":15,"height":400,"apiKey":""}', '{"type":"object","properties":{"title":{"type":"string"},"address":{"type":"string"},"latitude":{"type":"number"},"longitude":{"type":"number"},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"number"},"apiKey":{"type":"string"}}}', 27),
(1, 'tabs', 'Tabs', 'Tabbed content container', 'layout-tab', '{"tabs":[{"label":"Tab 1","content":"<p>Content for tab 1</p>"},{"label":"Tab 2","content":"<p>Content for tab 2</p>"}],"style":"underline","fullWidth":false}', '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"content":{"type":"string","format":"textarea"}}}},"style":{"type":"string","enum":["underline","boxed","pills"]},"fullWidth":{"type":"boolean"}}}', 28),
(1, 'timeline', 'Timeline', 'Vertical timeline with milestones', 'git-commit', '{"title":"Our Journey","items":[{"date":"2020","title":"Company Founded","description":"Started with a vision","icon":"star"},{"date":"2021","title":"First Product","description":"Launched our first product","icon":"package"}]}', '{"type":"object","properties":{"title":{"type":"string"},"items":{"type":"array","items":{"type":"object","properties":{"date":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"},"icon":{"type":"string"}}}},"orientation":{"type":"string","enum":["vertical","horizontal"],"default":"vertical"},"lineColor":{"type":"string"}}}', 29);

-- Theme 2: Modern - Additional Advanced Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(2, 'contactForm', 'Contact Form', 'Customer contact form with custom fields', 'mail', '{"title":"Get in Touch","fields":[{"name":"name","label":"Name","type":"text","required":true},{"name":"email","label":"Email","type":"email","required":true},{"name":"subject","label":"Subject","type":"text","required":true},{"name":"message","label":"Message","type":"textarea","required":true}],"submitText":"Send Message","successMessage":"Thanks for reaching out! We will get back to you soon."}', '{"type":"object","properties":{"title":{"type":"string"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","textarea","phone","select"]},"required":{"type":"boolean"},"options":{"type":"array","items":{"type":"string"}}}},"submitText":{"type":"string"},"successMessage":{"type":"string"}}}', 18),
(2, 'team', 'Team', 'Showcase team members', 'users', '{"title":"Our Team","members":[{"name":"Team Member","role":"Position","photo":"","bio":"","social":{"twitter":"","linkedin":""}}],"columns":4,"layout":"grid"}', '{"type":"object","properties":{"title":{"type":"string"},"members":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"photo":{"type":"string"},"bio":{"type":"string"},"social":{"type":"object","properties":{"twitter":{"type":"string"},"linkedin":{"type":"string"}}}}},"columns":{"type":"number","minimum":1,"maximum":4},"layout":{"type":"string","enum":["grid","list"]}}}', 19);

-- Theme 3: Minimal - Additional Advanced Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(3, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images', '{"title":"Gallery","images":[],"layout":"masonry","columns":3,"gap":"small","lightbox":true}', '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}', 12),
(3, 'video', 'Video', 'Embed video from YouTube, Vimeo, or custom', 'video', '{"title":"Video","videoUrl":"","provider":"youtube","autoplay":false,"controls":true,"aspectRatio":"16:9"}', '{"type":"object","properties":{"title":{"type":"string"},"videoUrl":{"type":"string","title":"Video URL"},"provider":{"type":"string","title":"Provider","enum":["youtube","vimeo","custom"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"loop":{"type":"boolean"},"muted":{"type":"boolean"},"aspectRatio":{"type":"string","title":"Aspect Ratio","enum":["16:9","4:3","1:1"]}}}', 13);

-- Theme 4: Premium - Additional Advanced Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(4, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle', '{"title":"Testimonials","testimonials":[{"name":"Client","role":"Customer","company":"","text":"Great service!","avatar":""}],"autoPlay":true,"slidesToShow":1}', '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"showDots":{"type":"boolean"}}}', 17),
(4, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images', '{"title":"Gallery","images":[],"layout":"grid","columns":4,"gap":"small","lightbox":true}', '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}', 18);

-- Theme 5: Diamond - Additional Advanced Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(5, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle', '{"title":"VIP Testimonials","testimonials":[{"name":"VIP Client","role":"Director","company":"Luxury Corp","text":"Outstanding quality and service!","avatar":""}],"autoPlay":false,"slidesToShow":1,"showArrows":true}', '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"showArrows":{"type":"boolean"},"showDots":{"type":"boolean"}}}', 15),
(5, 'statistics', 'Statistics', 'Animated number counters', 'bar-chart-2', '{"title":"Our Achievements","statistics":[{"label":"Awards","value":50,"suffix":"+","color":"#C0A062"},{"label":"Global Clients","value":200,"suffix":"","color":"#6B46C1"}]}', '{"type":"object","properties":{"title":{"type":"string"},"statistics":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"value":{"type":"number"},"suffix":{"type":"string"},"color":{"type":"string"}}}}}', 16);

SET FOREIGN_KEY_CHECKS = 1;