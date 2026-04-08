-- Create theme_blocks table
CREATE TABLE IF NOT EXISTS `theme_blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `theme_id` int NOT NULL,
  `block_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_config` json DEFAULT NULL,
  `config_schema` json DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_theme_id` (`theme_id`),
  CONSTRAINT `fk_theme_blocks_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
