-- =================================================================
-- Delete Existing Themes and Pages, then Re-seed
-- =================================================================

-- Delete existing pages for themes 6, 7, 8 (if they exist)
DELETE FROM pages WHERE store_id = 23 AND slug IN ('home', 'about-us', 'contact', 'privacy-policy', 'terms-of-service', 'shipping-returns');

-- Delete existing theme blocks for themes 6, 7, 8 (if they exist)
DELETE FROM theme_blocks WHERE theme_id IN (6, 7, 8);

-- Delete existing themes 6, 7, 8 (if they exist)
DELETE FROM themes WHERE id IN (6, 7, 8);

-- =================================================================
-- Insert Akira, Axon, and Ghorer Bazar Themes
-- =================================================================

-- Insert Themes (IDs 6, 7, 8)
INSERT INTO `themes` (`id`, `name`, `description`, `access_level`) VALUES
(6, 'Akira', 'Fashion e-commerce theme with promotional grids and sale banners', 'free'),
(7, 'Axon', 'Multi-level navigation theme with mega menu and product tabs', 'standard'),
(8, 'Ghorer Bazar', 'Organic food e-commerce theme with contact bar and category navigation', 'free');

-- =================================================================
-- Akira Theme Blocks (Theme ID: 6)
-- =================================================================
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
  '{"badges": [{"icon": "🚚", "title": "Lorem Ipsum", "subtitle": "Lorem ipsum dolor sit amet"}, {"icon": "🔄", "title": "Consectetur Adipiscing", "subtitle": "Sed do eiusmod tempor incididunt"}, {"icon": "ℹ️", "title": "Ut Labore", "subtitle": "Magna aliqua ut enim ad minim veniam"}, {"icon": "💬", "title": "Quis Nostrud", "subtitle": "Exercitation ullamco laboris nisi ut aliquip"}]}',
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

-- =================================================================
-- Axon Theme Blocks (Theme ID: 7)
-- =================================================================
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

-- =================================================================
-- Ghorer Bazar Theme Blocks (Theme ID: 8)
-- =================================================================
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
  '{"title": "Lorem Ipsum Dolor Sit Amet", "subtitle": "Consectetur Adipiscing Elit", "imageUrl": "https://via.placeholder.com/1200x500?text=Hero+Banner", "phone": "+1-555-LOREMIPSUM", "backgroundColor": "#FF9F1C", "textColor": "#FFFFFF"}',
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

-- =================================================================
-- Akira Theme Pages
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(23, 'Home', 'home', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "heroBannerSlider", "type": "heroBannerSlider", "data": {"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Autumn+Collection+2024", "title": "Autumn Jackets Collection In 2024", "subtitle": "NEW WOMEN CLOTHING", "ctaButton": {"text": "SHOP NOW", "link": "/collections/autumn"}}, {"imageUrl": "https://via.placeholder.com/1920x600?text=Summer+Sale", "title": "Summer Sale", "subtitle": "Up to 50% Off", "ctaButton": {"text": "Shop Now", "link": "/collections/sale"}}]}},
    {"id": "promotionalBannerGrid", "type": "promotionalBannerGrid", "data": {"banners": [{"imageUrl": "https://via.placeholder.com/400x300?text=Fashion+Month", "title": "Fashion Month", "subtitle": "Ready in Capital Shop", "ctaButton": {"text": "View All", "link": "/collections/fashion"}}, {"imageUrl": "https://via.placeholder.com/400x300?text=Summer+Styles", "title": "Catch the Sun", "subtitle": "Summer Break Styles From $5.99", "ctaButton": {"text": "View All", "link": "/collections/summer"}}, {"imageUrl": "https://via.placeholder.com/400x300?text=Red+Dress", "title": "OFF SHOULDER RED DRESS", "subtitle": "-20%", "ctaButton": {"text": "$99 | Shop Now", "link": "/collections/dresses"}}, {"imageUrl": "https://via.placeholder.com/400x300?text=Summer+Sale", "title": "Super Summer Sale", "subtitle": "Limited Time Offer", "ctaButton": {"text": "View All", "link": "/collections/sale"}}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "BEST SELLER", "query": {"collectionId": "best-sellers"}, "displayStyle": "grid", "gridCols": 4, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "saleBanner", "type": "saleBanner", "data": {"title": "New Season Sale", "subtitle": "40% OFF", "imageUrl": "https://via.placeholder.com/1200x400?text=Sale+Banner", "ctaButton": {"text": "SHOP NOW", "link": "/collections/sale"}}},
    {"id": "productSection", "type": "productSection", "data": {"title": "TRENDING", "query": {"collectionId": "trending"}, "displayStyle": "grid", "gridCols": 4, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "featuresTrustBadges", "type": "featuresTrustBadges", "data": {"badges": [{"icon": "🚚", "title": "Free Shipping", "subtitle": "orders $50 or more"}, {"icon": "🔄", "title": "Free Returns", "subtitle": "within 30 days"}, {"icon": "ℹ️", "title": "Get 20% Off 1 Item", "subtitle": "when you sign up"}, {"icon": "💬", "title": "We Support", "subtitle": "24/7 amazing services"}]}},
    {"id": "newsletterCouponBanner", "type": "newsletterCouponBanner", "data": {"title": "Get The Latest Deals", "subtitle": "and receive $20 coupon for first shopping", "placeholder": "Your email address", "buttonText": "Subscribe"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'About Us', 'about-us', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=About+Us", "title": "About Our Brand", "subtitle": "Fashion since 2024", "ctaButton": {"text": "Shop Collection", "link": "/collections/all"}}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Our Story", "features": [{"icon": "check-circle", "title": "Quality Products", "description": "We offer only the best fashion items"}, {"icon": "truck", "title": "Fast Shipping", "description": "Quick delivery worldwide"}, {"icon": "heart", "title": "Customer Care", "description": "24/7 support for our customers"}]}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Contact Us', 'contact', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Contact+Us", "title": "Get in Touch", "subtitle": "We would love to hear from you", "ctaButton": {"text": "Call Us", "link": "tel:+1234567890"}}},
    {"id": "contactForm", "type": "contactForm", "data": {"title": "Contact Us", "description": "Have questions? Reach out!", "emailTo": "info@akirastore.com", "fields": [{"name": "name", "label": "Your Name", "type": "text", "required": true, "placeholder": "Enter your name"}, {"name": "email", "label": "Your Email", "type": "email", "required": true, "placeholder": "Enter your email"}, {"name": "phone", "label": "Phone Number", "type": "phone", "required": false, "placeholder": "Enter your phone"}, {"name": "message", "label": "Your Message", "type": "textarea", "required": true, "placeholder": "Enter your message"}], "submitLabel": "Send Message", "showNameFields": true}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Privacy Policy', 'privacy-policy', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Privacy+Policy", "title": "Privacy Policy", "subtitle": "Your privacy is important to us", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate, maintain, and improve our services.</p><h2>Security</h2><p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Terms of Service', 'terms-of-service', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Terms+of+Service", "title": "Terms of Service", "subtitle": "Please read these terms carefully", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Akira Store website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Akira Store website are provided on an as is basis. Akira Store makes no warranties, expressed or implied.</p>"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Shipping & Returns', 'shipping-returns', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Shipping+Returns", "title": "Shipping & Returns", "subtitle": "Our policies explained", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Shipping Information", "features": [{"icon": "truck", "title": "Free Shipping", "description": "Free shipping on orders over $50"}, {"icon": "clock", "title": "Fast Delivery", "description": "3-5 business days for domestic orders"}, {"icon": "globe", "title": "International Shipping", "description": "We ship worldwide"}]}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Return Policy", "features": [{"icon": "refresh-cw", "title": "30 Days Returns", "description": "30 days return policy for all items"}, {"icon": "check-circle", "title": "Easy Returns", "description": "Simple and hassle-free return process"}, {"icon": "dollar-sign", "title": "Full Refund", "description": "Full refund for eligible returns"}]}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published');

-- =================================================================
-- Axon Theme Pages
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Home', 'home', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "announcementBar", "type": "announcementBar", "data": {"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}},
    {"id": "megaMenuWithCategories", "type": "megaMenuWithCategories", "data": {"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}, {"title": "Clocks", "path": "/clocks"}, {"title": "Lighting", "path": "/lighting"}, {"title": "Toys", "path": "/toys"}, {"title": "Hand Made", "path": "/hand-made"}, {"title": "Minimalism", "path": "/minimalism"}, {"title": "Electronics", "path": "/electronics"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x600?text=TERRY+WEBB+-+FRANCO+DESIGNER", "title": "TERRY WEBB - FRANCO DESIGNER", "subtitle": "Proin at sapien ipsum. Aenean placerat, quam ac tempor congue, orci est luctus ex, ut vestibulum ipsum", "ctaButton": {"text": "Shop Now!", "link": "/collections/new"}}},
    {"id": "featuresTrustBadges", "type": "featuresTrustBadges", "data": {"badges": [{"icon": "📦", "title": "NO LIMITED", "subtitle": "Worldwide free shipping"}, {"icon": "💰", "title": "MONEY BACK", "subtitle": "7 days money back guaranteed"}, {"icon": "🔒", "title": "SAFETY", "subtitle": "We never share your individual info"}]}},
    {"id": "productTabsFilter", "type": "productTabsFilter", "data": {"tabs": [{"name": "Women\'s", "active": true}, {"name": "Mens", "active": false}, {"name": "Kids", "active": false}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "ELECTRONICS", "query": {"collectionId": "electronics"}, "displayStyle": "grid", "gridCols": 4, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "dualPromotionalBanners", "type": "dualPromotionalBanners", "data": {"banners": [{"imageUrl": "https://via.placeholder.com/600x300?text=Modern+Accents+For+Him", "title": "MODERN ACCENTS FOR HIM", "subtitle": "SHOP MEN\'S ACCESSORIES", "link": "/collections/men"}, {"imageUrl": "https://via.placeholder.com/600x300?text=Modern+Accents+For+Her", "title": "MODERN ACCENTS FOR HER", "subtitle": "SHOP WOMEN\'S ACCESSORIES", "link": "/collections/women"}]}},
    {"id": "productTabsFilter", "type": "productTabsFilter", "data": {"tabs": [{"name": "Women\'s", "active": true}, {"name": "Mens", "active": false}, {"name": "Kids", "active": false}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "FASHIONS", "query": {"collectionId": "fashion"}, "displayStyle": "grid", "gridCols": 4, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "brandLogoRow", "type": "brandLogoRow", "data": {"brands": [{"name": "RETROGE", "logo": "https://via.placeholder.com/150x50?text=RETROGE"}, {"name": "BARBERSHOP", "logo": "https://via.placeholder.com/150x50?text=BARBERSHOP"}, {"name": "DESIGNERS", "logo": "https://via.placeholder.com/150x50?text=DESIGNERS"}, {"name": "BARBERSHOP", "logo": "https://via.placeholder.com/150x50?text=BARBERSHOP"}, {"name": "RETROGE", "logo": "https://via.placeholder.com/150x50?text=RETROGE"}, {"name": "DESIGNERS", "logo": "https://via.placeholder.com/150x50?text=DESIGNERS"}]}},
    {"id": "productTabsFilter", "type": "productTabsFilter", "data": {"tabs": [{"name": "Women\'s", "active": true}, {"name": "Mens", "active": false}, {"name": "Kids", "active": false}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "BRAND SHOWCASE", "query": {"collectionId": "brands"}, "displayStyle": "grid", "gridCols": 4, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "productTabsFilter", "type": "productTabsFilter", "data": {"tabs": [{"name": "New Arrivals", "active": true}, {"name": "Best Seller", "active": false}, {"name": "Specials", "active": false}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "NEW ARRIVALS", "query": {"collectionId": "new-arrivals"}, "displayStyle": "grid", "gridCols": 3, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "productSection", "type": "productSection", "data": {"title": "BEST SELLER", "query": {"collectionId": "best-sellers"}, "displayStyle": "grid", "gridCols": 3, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "productSection", "type": "productSection", "data": {"title": "SPECIALS", "query": {"collectionId": "specials"}, "displayStyle": "grid", "gridCols": 3, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "productTabsFilter", "type": "productTabsFilter", "data": {"tabs": [{"name": "Latest News", "active": true}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "LATEST NEW", "query": {"collectionId": "blog"}, "displayStyle": "grid", "gridCols": 3, "showQuickAdd": false, "showDiscountBadge": false, "showNewBadge": true}},
    {"id": "backToTopButton", "type": "backToTopButton", "data": {"backgroundColor": "#E63946", "textColor": "#FFFFFF", "position": "bottom-right"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'About Us', 'about-us', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "announcementBar", "type": "announcementBar", "data": {"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}},
    {"id": "megaMenuWithCategories", "type": "megaMenuWithCategories", "data": {"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=About+Us", "title": "About Our Brand", "subtitle": "Quality products since 2024", "ctaButton": {"text": "Shop Collection", "link": "/collections/all"}}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Our Story", "features": [{"icon": "check-circle", "title": "Quality Products", "description": "We offer only the best items"}, {"icon": "truck", "title": "Fast Shipping", "description": "Quick delivery worldwide"}, {"icon": "heart", "title": "Customer Care", "description": "24/7 support for our customers"}]}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Contact Us', 'contact', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "announcementBar", "type": "announcementBar", "data": {"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}},
    {"id": "megaMenuWithCategories", "type": "megaMenuWithCategories", "data": {"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Contact+Us", "title": "Get in Touch", "subtitle": "We would love to hear from you", "ctaButton": {"text": "Call Us", "link": "tel:+1234567890"}}},
    {"id": "contactForm", "type": "contactForm", "data": {"title": "Contact Us", "description": "Have questions? Reach out!", "emailTo": "info@axonstore.com", "fields": [{"name": "name", "label": "Your Name", "type": "text", "required": true, "placeholder": "Enter your name"}, {"name": "email", "label": "Your Email", "type": "email", "required": true, "placeholder": "Enter your email"}, {"name": "phone", "label": "Phone Number", "type": "phone", "required": false, "placeholder": "Enter your phone"}, {"name": "message", "label": "Your Message", "type": "textarea", "required": true, "placeholder": "Enter your message"}], "submitLabel": "Send Message", "showNameFields": true}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Privacy Policy', 'privacy-policy', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "announcementBar", "type": "announcementBar", "data": {"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}},
    {"id": "megaMenuWithCategories", "type": "megaMenuWithCategories", "data": {"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Privacy+Policy", "title": "Privacy Policy", "subtitle": "Your privacy is important to us", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate, maintain, and improve our services.</p><h2>Security</h2><p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Terms of Service', 'terms-of-service', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "announcementBar", "type": "announcementBar", "data": {"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}},
    {"id": "megaMenuWithCategories", "type": "megaMenuWithCategories", "data": {"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Terms+of+Service", "title": "Terms of Service", "subtitle": "Please read these terms carefully", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Axon Store website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Axon Store website are provided on an as is basis. Axon Store makes no warranties, expressed or implied.</p>"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Shipping & Returns', 'shipping-returns', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "announcementBar", "type": "announcementBar", "data": {"message": "Free shipping on orders over $50!", "backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}},
    {"id": "megaMenuWithCategories", "type": "megaMenuWithCategories", "data": {"menuItems": [{"title": "Furniture", "path": "/furniture"}, {"title": "Cooking", "path": "/cooking"}, {"title": "Fashion", "path": "/fashion"}, {"title": "Accessories", "path": "/accessories"}], "backgroundColor": "#E63946", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Shipping+Returns", "title": "Shipping & Returns", "subtitle": "Our policies explained", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Shipping Information", "features": [{"icon": "truck", "title": "Free Shipping", "description": "Free shipping on orders over $50"}, {"icon": "clock", "title": "Fast Delivery", "description": "3-5 business days for domestic orders"}, {"icon": "globe", "title": "International Shipping", "description": "We ship worldwide"}]}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Return Policy", "features": [{"icon": "refresh-cw", "title": "30 Days Returns", "description": "30 days return policy for all items"}, {"icon": "check-circle", "title": "Easy Returns", "description": "Simple and hassle-free return process"}, {"icon": "dollar-sign", "title": "Full Refund", "description": "Full refund for eligible returns"}]}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published');

-- =================================================================
-- Ghorer Bazar Theme Pages
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Home', 'home', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "contactInfoBar", "type": "contactInfoBar", "data": {"phone": "+8801321208940", "whatsapp": "+8801321208940", "phone2": "+8801321208940", "whatsapp2": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "categoryNavigation", "type": "categoryNavigation", "data": {"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Dates (খেজুর)", "path": "/dates"}, {"name": "খোজরা গুড়", "path": "/khajorgur"}, {"name": "Honey", "path": "/honey"}, {"name": "Masala", "path": "/masala"}, {"name": "Nuts & Seeds", "path": "/nuts-seeds"}, {"name": "Tea/Coffee", "path": "/tea-coffee"}, {"name": "Honeycomb", "path": "/honeycomb"}, {"name": "Organic Zone", "path": "/organic-zone"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "heroBannerWithProduct", "type": "heroBannerWithProduct", "data": {"title": "Lorem Ipsum Dolor Sit Amet", "subtitle": "Consectetur Adipiscing Elit", "imageUrl": "https://via.placeholder.com/1200x500?text=Hero+Banner", "phone": "+1-555-LOREMIPSUM", "backgroundColor": "#FF9F1C", "textColor": "#FFFFFF"}},
    {"id": "productSection", "type": "productSection", "data": {"title": "ALL PRODUCT", "query": {"collectionId": "all"}, "displayStyle": "grid", "gridCols": 5, "showQuickAdd": true, "showDiscountBadge": true, "showNewBadge": true}},
    {"id": "productTabsFilter", "type": "productTabsFilter", "data": {"tabs": [{"name": "Collection", "active": true}]}},
    {"id": "productSection", "type": "productSection", "data": {"title": "COLLECTION", "query": {"collectionId": "collections"}, "displayStyle": "grid", "gridCols": 5, "showQuickAdd": false, "showDiscountBadge": false, "showNewBadge": false}},
    {"id": "featuresTrustBadges", "type": "featuresTrustBadges", "data": {"badges": [{"icon": "🌿", "title": "Lorem Ipsum", "subtitle": "Dolor sit amet, consectetur"}, {"icon": "🚚", "title": "Adipiscing Elit", "subtitle": "Sed do eiusmod tempor incididunt"}, {"icon": "💯", "title": "Ut Labore", "subtitle": "Magna aliqua ut enim ad minim"}, {"icon": "💬", "title": "Quis Nostrud", "subtitle": "Exercitation ullamco laboris"}]}},
    {"id": "newsletterCouponBanner", "type": "newsletterCouponBanner", "data": {"title": "Get The Latest Deals", "subtitle": "Subscribe to our newsletter", "placeholder": "Your email address", "buttonText": "Subscribe"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'About Us', 'about-us', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "contactInfoBar", "type": "contactInfoBar", "data": {"phone": "+8801321208940", "whatsapp": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "categoryNavigation", "type": "categoryNavigation", "data": {"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Honey", "path": "/honey"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=About+Ghorer+Bazar", "title": "Ghorer Bazar: Your Trusted Source for Safe & Organic Food", "subtitle": "Bringing nature straight to your doorstep", "ctaButton": {"text": "Shop Now", "link": "/collections/all"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>About Us</h2><p>Ghorer Bazar is a leading e-commerce platform committed to delivering safe, healthy, and organic food products across Bangladesh. Renowned for its dedication to quality, Ghorer Bazar offers a diverse range of health-focused items, including premium mustard oil, pure ghee, organic honey, dates, chia seeds, and an assortment of nuts. Each product is carefully sourced and crafted to ensure maximum health benefits, meeting the highest standards of purity and freshness.</p><h2>Our Mission</h2><p>With a focus on convenience, Ghorer Bazar operates primarily online, bringing the goodness of nature straight to your doorstep. Whether you are seeking to elevate your wellness journey or simply enjoy natural, wholesome foods, Ghorer Bazar is your go-to destination for authentic, trustworthy products.</p>"}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Why Choose Us", "features": [{"icon": "🌿", "title": "100% Organic", "description": "Certified organic products"}, {"icon": "🚚", "title": "Fast Delivery", "description": "Quick delivery across Bangladesh"}, {"icon": "💯", "title": "Quality Assured", "description": "Quality guaranteed products"}, {"icon": "💬", "title": "24/7 Support", "description": "Round the clock customer support"}]}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Contact Us', 'contact', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "contactInfoBar", "type": "contactInfoBar", "data": {"phone": "+8801321208940", "whatsapp": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "categoryNavigation", "type": "categoryNavigation", "data": {"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Honey", "path": "/honey"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Contact+Us", "title": "Contact Us", "subtitle": "We would love to hear from you", "ctaButton": {"text": "Call Us", "link": "tel:+8801321208940"}}},
    {"id": "contactForm", "type": "contactForm", "data": {"title": "Contact Us", "description": "Have questions? Reach out!", "emailTo": "info@ghorerbazar.com", "fields": [{"name": "name", "label": "Your Name", "type": "text", "required": true, "placeholder": "Enter your name"}, {"name": "email", "label": "Your Email", "type": "email", "required": true, "placeholder": "Enter your email"}, {"name": "phone", "label": "Phone Number", "type": "phone", "required": false, "placeholder": "Enter your phone"}, {"name": "message", "label": "Your Message", "type": "textarea", "required": true, "placeholder": "Enter your message"}], "submitLabel": "Send Message", "showNameFields": true}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Privacy Policy', 'privacy-policy', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "contactInfoBar", "type": "contactInfoBar", "data": {"phone": "+8801321208940", "whatsapp": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "categoryNavigation", "type": "categoryNavigation", "data": {"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Honey", "path": "/honey"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Privacy+Policy", "title": "Privacy Policy", "subtitle": "Your privacy is important to us", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate, maintain, and improve our services.</p><h2>Security</h2><p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Terms of Service', 'terms-of-service', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "contactInfoBar", "type": "contactInfoBar", "data": {"phone": "+8801321208940", "whatsapp": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "categoryNavigation", "type": "categoryNavigation", "data": {"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Honey", "path": "/honey"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Terms+of+Service", "title": "Terms of Service", "subtitle": "Please read these terms carefully", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "text", "type": "text", "data": {"content": "<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Ghorer Bazar website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Ghorer Bazar website are provided on an as is basis. Ghorer Bazar makes no warranties, expressed or implied.</p>"}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published'),
(1, 'Shipping & Returns', 'shipping-returns', '{
  "blocks": [
    {"id": "systemHeader", "type": "systemHeader", "data": {}},
    {"id": "contactInfoBar", "type": "contactInfoBar", "data": {"phone": "+8801321208940", "whatsapp": "+8801321208940", "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "categoryNavigation", "type": "categoryNavigation", "data": {"categories": [{"name": "OFFER ZONE", "path": "/offer-zone"}, {"name": "Best Seller", "path": "/best-seller"}, {"name": "Mustard Oil", "path": "/mustard-oil"}, {"name": "Ghee (ঘি)", "path": "/ghee"}, {"name": "Honey", "path": "/honey"}], "backgroundColor": "#FF6B35", "textColor": "#FFFFFF"}},
    {"id": "heroBanner", "type": "heroBanner", "data": {"imageUrl": "https://via.placeholder.com/1920x400?text=Shipping+Returns", "title": "Shipping & Returns", "subtitle": "Our policies explained", "ctaButton": {"text": "Contact Us", "link": "/contact"}}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Shipping Information", "features": [{"icon": "🚚", "title": "Free Shipping", "description": "Free shipping on orders over 1000 BDT"}, {"icon": "⏱️", "title": "Fast Delivery", "description": "3-5 business days for domestic orders"}, {"icon": "🇧🇩", "title": "Nationwide Delivery", "description": "We deliver across Bangladesh"}]}},
    {"id": "featureBlocks", "type": "featureBlocks", "data": {"title": "Return Policy", "features": [{"icon": "🔄", "title": "7 Days Returns", "description": "7 days return policy for all items"}, {"icon": "✅", "title": "Easy Returns", "description": "Simple and hassle-free return process"}, {"icon": "💰", "title": "Full Refund", "description": "Full refund for eligible returns"}]}},
    {"id": "systemFooter", "type": "systemFooter", "data": {}}
  ]
}', 'published');

-- =================================================================
-- End of Script
-- =================================================================
