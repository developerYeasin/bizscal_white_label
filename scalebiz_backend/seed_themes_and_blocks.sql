-- =================================================================
-- Seed Themes and Theme Blocks
-- =================================================================
-- This creates the base themes with their available blocks
-- =================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =================================================================
-- Insert Themes
-- =================================================================
INSERT INTO `themes` (`id`, `name`, `description`, `access_level`) VALUES
(1, 'Basic', 'Simple and clean theme for any store', 'free'),
(2, 'Modern', 'Contemporary design with bold typography', 'standard'),
(3, 'Minimal', 'Clean and minimal aesthetic', 'free'),
(4, 'Premium', 'Feature-rich premium theme', 'premium'),
(5, 'Diamond', 'Luxury theme for high-end brands', 'premium');

-- =================================================================
-- Insert Theme Blocks for each theme
-- Each block defines a component type that can be used in page builder
-- =================================================================

-- Theme 1: Basic Theme Blocks
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'heroBanner',
  '{"imageUrl": "https://via.placeholder.com/1920x600?text=Hero+Banner", "title": "Welcome to Our Store", "subtitle": "Discover amazing products", "ctaButton": {"text": "Shop Now", "link": "/collections/all"}}',
  '{"type":"object","properties":{"imageUrl":{"type":"string","title":"Background Image URL"},"title":{"type":"string","title":"Title"},"subtitle":{"type":"string","title":"Subtitle"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}',
  1
),
(1, 'heroBannerSlider',
  '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Slide+1", "title": "Slide 1", "subtitle": "First slide", "ctaButton": {"text": "Learn More", "link": "/"}}, {"imageUrl": "https://via.placeholder.com/1920x600?text=Slide+2", "title": "Slide 2", "subtitle": "Second slide", "ctaButton": {"text": "Shop", "link": "/collections"}}]}',
  '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}',
  2
),
(1, 'productCarousel',
  '{"title": "Featured Products", "query": {"collectionId": "all", "limit": 10}, "displayStyle": "carousel", "productsPerView": 4}',
  '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string","enum":["carousel","grid"]},"productsPerView":{"type":"number"}}}',
  3
),
(1, 'productSection',
  '{"title": "Products", "query": {}, "displayStyle": "grid", "gridCols": 4, "tabs": []}',
  '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string","enum":["carousel","grid"]},"gridCols":{"type":"number"},"tabs":{"type":"array"}}}',
  4
),
(1, 'featuredCategories',
  '{"title": "Shop by Category", "categories": [{"name": "Category 1", "imageUrl": "https://via.placeholder.com/300x400?text=Cat1", "link": "/collections/cat1"}, {"name": "Category 2", "imageUrl": "https://via.placeholder.com/300x400?text=Cat2", "link": "/collections/cat2"}]}',
  '{"type":"object","properties":{"title":{"type":"string"},"categories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"imageUrl":{"type":"string"},"link":{"type":"string"}}}}}}',
  5
),
(1, 'newsletterSubscription',
  '{"title": "Subscribe to Our Newsletter", "subtitle": "Get updates on new arrivals and special offers", "placeholder": "Enter your email", "buttonText": "Subscribe"}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}',
  6
),
(1, 'marketingBanner',
  '{"text": "Free shipping on orders over $50!", "backgroundColor": "#3F51B5", "textColor": "#FFFFFF"}',
  '{"type":"object","properties":{"text":{"type":"string"},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}',
  7
),
(1, 'featureBlocks',
  '{"title": "Why Choose Us", "features": [{"icon": "check-circle", "title": "Quality Products", "description": "We offer only the best"}, {"icon": "truck", "title": "Fast Shipping", "description": "Quick delivery"}]}',
  '{"type":"object","properties":{"title":{"type":"string"},"features":{"type":"array","items":{"type":"object","properties":{"icon":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}}}}',
  8
),
(1, 'blogPostsSection',
  '{"title": "Latest Blog Posts", "posts": []}',
  '{"type":"object","properties":{"title":{"type":"string"},"posts":{"type":"array"}}}',
  9
);

-- Theme 2: Modern Theme (similar blocks, different defaults)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(2, 'heroBannerSlider',
  '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Modern+Slide+1", "title": "New Season Arrivals", "subtitle": "Step into the future", "ctaButton": {"text": "Explore", "link": "/collections/new"}}]}',
  '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}',
  1
),
(2, 'productCarousel',
  '{"title": "Trending Now", "query": {"collectionId": "trending"}, "displayStyle": "carousel", "productsPerView": 5}',
  '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string","enum":["carousel","grid"]},"productsPerView":{"type":"number"}}}',
  2
),
(2, 'featuredCategories',
  '{"title": "Explore Collections", "categories": [{"name": "Men", "imageUrl": "https://via.placeholder.com/300x400?text=Men", "link": "/collections/men"}, {"name": "Women", "imageUrl": "https://via.placeholder.com/300x400?text=Women", "link": "/collections/women"}]}',
  '{"type":"object","properties":{"title":{"type":"string"},"categories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"imageUrl":{"type":"string"},"link":{"type":"string"}}}}}}',
  3
),
(2, 'newsletterSubscription',
  '{"title": "Stay in the Loop", "subtitle": "Subscribe for exclusive offers", "placeholder": "Your email", "buttonText": "Sign Up"}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}',
  4
);

-- Theme 3: Minimal Theme
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(3, 'heroBanner',
  '{"imageUrl": "https://via.placeholder.com/1920x600?text=Minimal+Hero", "title": "Less is More", "subtitle": "Simple elegance", "ctaButton": {"text": "Browse", "link": "/"}}',
  '{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}',
  1
),
(3, 'productGrid',
  '{"title": "All Products", "query": {"collectionId": "all"}, "columns": 4}',
  '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"columns":{"type":"number"}}}',
  2
),
(3, 'featureBlocks',
  '{"title": "Our Values", "features": [{"title": "Sustainability", "description": "Eco-friendly materials"}]}',
  '{"type":"object","properties":{"title":{"type":"string"},"features":{"type":"array"}}}',
  3
);

-- Theme 4: Premium Theme
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(4, 'heroBannerSlider',
  '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Premium+1", "title": "Premium Quality", "subtitle": "Exclusive collection", "ctaButton": {"text": "Discover", "link": "/collections/premium"}}]}',
  '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}',
  1
),
(4, 'productCarousel',
  '{"title": "Premium Collection", "query": {"collectionId": "premium"}, "displayStyle": "carousel", "productsPerView": 4, "cardType": "premium"}',
  '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string"},"productsPerView":{"type":"number"},"cardType":{"type":"string"}}}',
  2
),
(4, 'featuredCategories',
  '{"title": "Curated Categories", "categories": [{"name": "Electronics", "imageUrl": "https://via.placeholder.com/300x400?text=Electronics", "link": "/collections/electronics"}, {"name": "Accessories", "imageUrl": "https://via.placeholder.com/300x400?text=Accessories", "link": "/collections/accessories"}]}',
  '{"type":"object","properties":{"title":{"type":"string"},"categories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"imageUrl":{"type":"string"},"link":{"type":"string"}}}}}}',
  3
),
(4, 'newsletterSubscription',
  '{"title": "Join Premium Club", "subtitle": "Get exclusive deals", "placeholder": "Enter email", "buttonText": "Join"}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}',
  4
);

-- Theme 5: Diamond Theme
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(5, 'heroBannerSlider',
  '{"banners": [{"imageUrl": "https://via.placeholder.com/1920x600?text=Diamond+Collection", "title": "Diamond Collection", "subtitle": "Luxury redefined", "ctaButton": {"text": "View Collection", "link": "/collections/diamond"}}]}',
  '{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"title":{"type":"string"},"subtitle":{"type":"string"},"ctaButton":{"type":"object","properties":{"text":{"type":"string"},"link":{"type":"string"}}}}}}',
  1
),
(5, 'productCarousel',
  '{"title": "Featured Items", "query": {"collectionId": "featured"}, "displayStyle": "carousel", "productsPerView": 3}',
  '{"type":"object","properties":{"title":{"type":"string"},"query":{"type":"object"},"displayStyle":{"type":"string"},"productsPerView":{"type":"number"}}}',
  2
),
(5, 'newsletterSubscription',
  '{"title": "Exclusive Updates", "subtitle": "Be the first to know about new arrivals", "placeholder": "Your email address", "buttonText": "Subscribe"}',
  '{"type":"object","properties":{"title":{"type":"string"},"subtitle":{"type":"string"},"placeholder":{"type":"string"},"buttonText":{"type":"string"}}}',
  3
),
(5, 'featureBlocks',
  '{"title": "The Diamond Experience", "features": [{"title": "Exclusive", "description": "Members only"}, {"title": "Luxury", "description": "Premium quality"}]}',
  '{"type":"object","properties":{"title":{"type":"string"},"features":{"type":"array"}}}',
  4
);

-- Advanced blocks for all themes (tabs, testimonials, countdown, video, contact, map)
-- Theme 1: Basic
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'tabs',
  '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
  '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
  10
),
(1, 'testimonials',
  '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
  '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
  11
),
(1, 'countdown',
  '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
  '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
  12
),
(1, 'video',
  '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
  '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
  13
),
(1, 'contact',
  '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
  '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
  14
),
(1, 'map',
  '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
  '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
  15
);

-- Theme 2: Modern
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(2, 'tabs',
  '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
  '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
  5
),
(2, 'testimonials',
  '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
  '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
  6
),
(2, 'countdown',
  '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
  '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
  7
),
(2, 'video',
  '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
  '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
  8
),
(2, 'contact',
  '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
  '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
  9
),
(2, 'map',
  '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
  '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
  10
);

-- Theme 3: Minimal
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(3, 'tabs',
  '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
  '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
  4
),
(3, 'testimonials',
  '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
  '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
  5
),
(3, 'countdown',
  '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
  '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
  6
),
(3, 'video',
  '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
  '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
  7
),
(3, 'contact',
  '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
  '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
  8
),
(3, 'map',
  '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
  '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
  9
);

-- Theme 4: Premium
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(4, 'tabs',
  '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
  '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
  5
),
(4, 'testimonials',
  '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
  '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
  6
),
(4, 'countdown',
  '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
  '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
  7
),
(4, 'video',
  '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
  '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
  8
),
(4, 'contact',
  '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
  '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
  9
),
(4, 'map',
  '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
  '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
  10
);

-- Theme 5: Diamond
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `default_config`, `config_schema`, `sort_order`) VALUES
(5, 'tabs',
  '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
  '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
  5
),
(5, 'testimonials',
  '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
  '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
  6
),
(5, 'countdown',
  '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
  '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
  7
),
(5, 'video',
  '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
  '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
  8
),
(5, 'contact',
  '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
  '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
  9
),
(5, 'map',
  '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
  '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
  10
);

SET FOREIGN_KEY_CHECKS = 1;
