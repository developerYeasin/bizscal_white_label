-- =================================================================
-- Insert Theme Blocks for Akira, Axon, and Ghorer Bazar Themes
-- =================================================================

-- Akira Theme Blocks (Theme ID: 6)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(6, 'promotionalBannerGrid',
  '{"banners": [{"imageUrl": "https://via.placeholder.com/400x300?text=Banner+1", "title": "Fashion Month", "subtitle": "Ready in Capital Shop", "ctaButton": {"text": "View All", "link": "/collections/fashion"}}, {"imageUrl": "https://via.placeholder.com/400x300?text=Banner+2", "title": "Summer Sale", "subtitle": "Up to 50% Off", "ctaButton": {"text": "Shop Now", "link": "/collections/sale"}}]}',
  '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}',
  1
),
(6, 'saleBanner',
  '{"title": "New Season Sale", "subtitle": "40% OFF", "imageUrl": "https://via.placeholder.com/1200x400?text=Sale+Banner", "ctaButton": {"text": "SHOP NOW", "link": "/collections/sale"}}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"imageUrl":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}',
  2
),
(6, 'featuresTrustBadges',
  '{"badges": [{"icon": "🚚", "title": "Free Shipping", "subtitle": "orders $50 or more"}, {"icon": "🔄", "title": "Free Returns", "subtitle": "within 30 days"}, {"icon": "ℹ️", "title": "Get 20% Off", "subtitle": "when you sign up"}, {"icon": "💬", "title": "We Support", "subtitle": "24/7 amazing services"}]}',
  '{"type":"array","items":{"type":"object","properties":{"icon":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"}}}}',
  3
),
(6, 'newsletterCouponBanner',
  '{"title": "Get The Latest Deals", "subtitle": "and receive $20 coupon for first shopping", "placeholder": "Your email address", "buttonText": "Subscribe"}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}',
  4
),
(6, 'topNavigationBar',
  '{"links": [{"text": "My Wishlist", "icon": "heart"}, {"text": "Compare", "icon": "compare"}, {"text": "ENGLISH", "icon": "globe"}, {"text": "$ USD", "icon": "dollar"}]}',
  '{"type":"array","items":{"type":"object","properties":{"text":{"type":"string"},"icon":{"type":"string"}}}}',
  5
),
(6, 'megaMenuNavigation',
  '{"menuItems": [{"title": "Apparel", "path": "/collections/apparel", "subCategories": [{"title": "Tops", "path": "/collections/tops"}, {"title": "Bottoms", "path": "/collections/bottoms"}]}, {"title": "Accessories", "path": "/collections/accessories", "subCategories": [{"title": "Bags", "path": "/collections/bags"}, {"title": "Jewelry", "path": "/collections/jewelry"}]}]}',
  '{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"path":{"type":"string"},"subCategories":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"path":{"type":"string"}}}}}}}',
  6
);

-- Axon Theme Blocks (Theme ID: 7)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(7, 'announcementBar',
  '{"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}',
  '{"type":"object","properties":{"message":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}',
  1
),
(7, 'megaMenuWithCategories',
  '{"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}',
  '{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"path":{"type":"string"}}}}',
  2
),
(7, 'productTabsFilter',
  '{"tabs": [{"name": "Women\'s", "active": true}, {"name": "Mens", "active": false}, {"name": "Kids", "active": false}]}',
  '{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"active":{"type":"boolean"}}}}',
  3
),
(7, 'dualPromotionalBanners',
  '{"banners": [{"imageUrl": "https://via.placeholder.com/600x300?text=Banner+1", "title": "MODERN ACCENTS FOR HIM", "subtitle": "SHOP MEN\'S ACCESSORIES", "link": "/collections/men"}, {"imageUrl": "https://via.placeholder.com/600x300?text=Banner+2", "title": "MODERN ACCENTS FOR HER", "subtitle": "SHOP WOMEN\'S ACCESSORIES", "link": "/collections/women"}]}',
  '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"link":{"type":"string"}}}}',
  4
),
(7, 'brandLogoRow',
  '{"brands": [{"name": "RETROGE", "logo": "https://via.placeholder.com/150x50?text=RETROGE"}, {"name": "BARBERSHOP", "logo": "https://via.placeholder.com/150x50?text=BARBERSHOP"}, {"name": "DESIGNERS", "logo": "https://via.placeholder.com/150x50?text=DESIGNERS"}]}',
  '{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"logo":{"type":"string"}}}}',
  5
),
(7, 'backToTopButton',
  '{"backgroundColor": "#E63946", "textColor": "#FFFFFF", "position": "bottom-right"}',
  '{"type":"object","properties":{"backgroundColor":{"type":"string"},"textColor":{"type":"string"},"position":{"type":"string","enum":["bottom-right","bottom-left"]}}}',
  6
);

-- Ghorer Bazar Theme Blocks (Theme ID: 8)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(8, 'contactInfoBar',
  '{"phone": "+8801321208940", "whatsapp": "+8801321208940", "phone2": "+8801321208940", "whatsapp2": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}',
  '{"type":"object","properties":{"phone":{"type":"string"},"whatsapp":{"type":"string"},"phone2":{"type":"string"},"whatsapp2":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}',
  1
),
(8, 'categoryNavigation',
  '{"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Dates (খেজুর)", "path": "/dates"}, {"name": "খোজরা গুড়", "path": "/khajorgur"}, {"name": "Honey", "path": "/honey"}, {"name": "Masala", "path": "/masala"}, {"name": "Nuts & Seeds", "path": "/nuts-seeds"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}',
  '{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"path":{"type":"string"}}}}',
  2
),
(8, 'heroBannerWithProduct',
  '{"title": "আফ্রিকার ওয়াইল্ড অর্গানিক খাবার", "subtitle": "এখন বাংলাদেশে", "imageUrl": "https://via.placeholder.com/1200x500?text=African+Wild+Organic+Food", "phone": "09642922922", "backgroundColor": "#FF9F1C", "textColor": "#FFFFFF"}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"imageUrl":{"type":"string"},"phone":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}',
  3
),
(8, 'productGridQuickAdd',
  '{"columns": 5, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}',
  '{"type":"object","properties":{"columns":{"type":"number"},"showQuickAdd":{"type":"boolean"},"showDiscountBadge":{"type":"boolean"},"showNewBadge":{"type":"boolean"}}}',
  4
),
(8, 'productBadges',
  '{"showDiscountBadge": true, "showNewBadge": true, "showOutOfStockBadge": true, "discountBadgeColor": "#FF0000", "newBadgeColor": "#00FF00"}',
  '{"type":"object","properties":{"showDiscountBadge":{"type":"boolean"},"showNewBadge":{"type":"boolean"},"showOutOfStockBadge":{"type":"boolean"},"discountBadgeColor":{"type":"string"},"newBadgeColor":{"type":"string"}}}',
  5
),
(8, 'onlineStatusIndicator',
  '{"status": "online", "message": "Online", "backgroundColor": "#00FF00", "textColor": "#FFFFFF"}',
  '{"type":"object","properties":{"status":{"type":"string","enum":["online","offline"]},"message":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}',
  6
);
