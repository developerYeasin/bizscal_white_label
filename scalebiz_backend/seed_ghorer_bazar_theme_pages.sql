 -- =================================================================
-- Page Templates for Ghorer Bazar Theme
-- =================================================================
-- This creates default pages for the Ghorer Bazar organic food e-commerce theme
-- =================================================================

-- =================================================================
-- Page: Home (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Home', 'home', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "phone2": "+8801321208940",
        "whatsapp2": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Dates (খেজুর)", "path": "/dates"},
          {"name": "খোজরা গুড়", "path": "/khajorgur"},
          {"name": "Honey", "path": "/honey"},
          {"name": "Masala", "path": "/masala"},
          {"name": "Nuts & Seeds", "path": "/nuts-seeds"},
          {"name": "Tea/Coffee", "path": "/tea-coffee"},
          {"name": "Honeycomb", "path": "/honeycomb"},
          {"name": "Organic Zone", "path": "/organic-zone"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "আফ্রিকার ওয়াইল্ড অর্গানিক খাবার",
        "subtitle": "এখন বাংলাদেশে",
        "imageUrl": "https://via.placeholder.com/1200x500?text=African+Wild+Organic+Food",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "ALL PRODUCT",
        "query": {"collectionId": "all"},
        "displayStyle": "grid",
        "gridCols": 5,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "productTabsFilter",
      "type": "productTabsFilter",
      "data": {
        "tabs": [
          {"name": "Collection", "active": true}
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "COLLECTION",
        "query": {"collectionId": "collections"},
        "displayStyle": "grid",
        "gridCols": 5,
        "showQuickAdd": false,
        "showDiscountBadge": false,
        "showNewBadge": false
      }
    },
    {
      "id": "featuresTrustBadges",
      "type": "featuresTrustBadges",
      "data": {
        "badges": [
          {"icon": "🌿", "title": "Organic Products", "subtitle": "100% organic and natural"},
          {"icon": "🚚", "title": "Free Shipping", "subtitle": "On orders over 1000 BDT"},
          {"icon": "💯", "title": "Quality Guarantee", "subtitle": "Quality assured products"},
          {"icon": "💬", "title": "Customer Support", "subtitle": "24/7 support"}
        ]
      }
    },
    {
      "id": "newsletterCouponBanner",
      "type": "newsletterCouponBanner",
      "data": {
        "title": "Get The Latest Deals",
        "subtitle": "Subscribe to our newsletter",
        "placeholder": "Your email address",
        "buttonText": "Subscribe"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: About Us (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'About Us', 'about-us', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=About+Ghorer+Bazar",
        "title": "Ghorer Bazar: Your Trusted Source for Safe & Organic Food",
        "subtitle": "Bringing nature straight to your doorstep",
        "ctaButton": {"text": "Shop Now", "link": "/collections/all"}
      }
    },
    {
      "id": "text",
      "type": "text",
      "data": {
        "content": "<h2>About Us</h2><p>Ghorer Bazar is a leading e-commerce platform committed to delivering safe, healthy, and organic food products across Bangladesh. Renowned for its dedication to quality, Ghorer Bazar offers a diverse range of health-focused items, including premium mustard oil, pure ghee, organic honey, dates, chia seeds, and an assortment of nuts. Each product is carefully sourced and crafted to ensure maximum health benefits, meeting the highest standards of purity and freshness.</p><h2>Our Mission</h2><p>With a focus on convenience, Ghorer Bazar operates primarily online, bringing the goodness of nature straight to your doorstep. Whether you are seeking to elevate your wellness journey or simply enjoy natural, wholesome foods, Ghorer Bazar is your go-to destination for authentic, trustworthy products.</p>"
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Why Choose Us",
        "features": [
          {"icon": "🌿", "title": "100% Organic", "description": "Certified organic products"},
          {"icon": "🚚", "title": "Fast Delivery", "description": "Quick delivery across Bangladesh"},
          {"icon": "💯", "title": "Quality Assured", "description": "Quality guaranteed products"},
          {"icon": "💬", "title": "24/7 Support", "description": "Round the clock customer support"}
        ]
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Contact (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Contact Us', 'contact', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Contact+Us",
        "title": "Contact Us",
        "subtitle": "We would love to hear from you",
        "ctaButton": {"text": "Call Us", "link": "tel:+8801321208940"}
      }
    },
    {
      "id": "contactForm",
      "type": "contactForm",
      "data": {
        "title": "Contact Us",
        "description": "Have questions? Reach out!",
        "emailTo": "info@ghorerbazar.com",
        "fields": [
          {"name": "name", "label": "Your Name", "type": "text", "required": true, "placeholder": "Enter your name"},
          {"name": "email", "label": "Your Email", "type": "email", "required": true, "placeholder": "Enter your email"},
          {"name": "phone", "label": "Phone Number", "type": "phone", "required": false, "placeholder": "Enter your phone"},
          {"name": "message", "label": "Your Message", "type": "textarea", "required": true, "placeholder": "Enter your message"}
        ],
        "submitLabel": "Send Message",
        "showNameFields": true
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Privacy Policy (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Privacy Policy', 'privacy-policy', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Privacy+Policy",
        "title": "Privacy Policy",
        "subtitle": "Your privacy is important to us",
        "ctaButton": {"text": "Contact Us", "link": "/contact"}
      }
    },
    {
      "id": "text",
      "type": "text",
      "data": {
        "content": "<h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate, maintain, and improve our services.</p><h2>Security</h2><p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Product Detail (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Product Detail', 'products/:productId', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Product Details",
        "subtitle": "View product information",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Product+Detail",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "productId": "dynamic",
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "productRelatedCarousel",
      "type": "productRelatedCarousel",
      "data": {
        "title": "Related Products",
        "query": {"type": "related"},
        "displayStyle": "carousel",
        "productsPerView": 4
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Collection (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Collection', 'collections/:collectionId', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Collection",
        "subtitle": "Browse our collection",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Collection",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "collectionId": "dynamic",
        "displayStyle": "grid",
        "gridCols": 5,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Cart (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Cart', 'cart', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Shopping Cart",
        "subtitle": "Review your items",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Shopping+Cart",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Your Cart Items",
        "features": []
      }
    },
    {
      "id": "midPageCallToAction",
      "type": "midPageCallToAction",
      "data": {
        "title": "Free Shipping",
        "subtitle": "On orders over 1000 BDT",
        "ctaButton": {"text": "Shop Now", "link": "/collections/all"}
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Checkout (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Checkout', 'checkout', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Checkout",
        "subtitle": "Complete your order",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Checkout",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "contactForm",
      "type": "contactForm",
      "data": {
        "title": "Shipping Information",
        "description": "Enter your shipping details",
        "emailTo": "",
        "fields": [
          {"name": "name", "label": "Full Name", "type": "text", "required": true, "placeholder": "Enter your name"},
          {"name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "Enter your email"},
          {"name": "phone", "label": "Phone", "type": "phone", "required": true, "placeholder": "Enter your phone"},
          {"name": "address", "label": "Address", "type": "textarea", "required": true, "placeholder": "Enter your address"}
        ],
        "submitLabel": "Continue to Payment",
        "showNameFields": true
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Order Confirmation (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Order Confirmation', 'order-confirmation', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Order Confirmed!",
        "subtitle": "Thank you for your purchase",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Order+Confirmed",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Order Details",
        "features": []
      }
    },
    {
      "id": "newsletterCouponBanner",
      "type": "newsletterCouponBanner",
      "data": {
        "title": "Subscribe to Our Newsletter",
        "subtitle": "Get updates on new arrivals and special offers",
        "placeholder": "Enter your email",
        "buttonText": "Subscribe"
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Receipt (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Receipt', 'receipt/:orderId', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Order Receipt",
        "subtitle": "Your order details",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Order+Receipt",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Receipt Details",
        "features": []
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Policy (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Policy', 'policies/:policyKey', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBannerWithProduct",
      "type": "heroBannerWithProduct",
      "data": {
        "title": "Policy",
        "subtitle": "Policy information",
        "imageUrl": "https://via.placeholder.com/1920x400?text=Policy",
        "phone": "09642922922",
        "backgroundColor": "#FF9F1C",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "text",
      "type": "text",
      "data": {
        "content": "<h2>Policy Information</h2><p>Policy details will be dynamically loaded based on the policy key.</p>"
      }
    },
    {
      "id": "onlineStatusIndicator",
      "type": "onlineStatusIndicator",
      "data": {
        "status": "online",
        "message": "Online",
        "backgroundColor": "#00FF00",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Terms of Service (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Terms of Service', 'terms-of-service', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Terms+of+Service",
        "title": "Terms of Service",
        "subtitle": "Please read these terms carefully",
        "ctaButton": {"text": "Contact Us", "link": "/contact"}
      }
    },
    {
      "id": "text",
      "type": "text",
      "data": {
        "content": "<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Ghorer Bazar website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Ghorer Bazar website are provided on an as is basis. Ghorer Bazar makes no warranties, expressed or implied.</p>"
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Shipping & Returns (Ghorer Bazar Theme)
-- =================================================================
INSERT INTO `pages` (`store_id`, `title`, `slug`, `content`, `status`) VALUES
(1, 'Shipping & Returns', 'shipping-returns', '{
  "blocks": [
    {
      "id": "systemHeader",
      "type": "systemHeader",
      "data": {}
    },
    {
      "id": "contactInfoBar",
      "type": "contactInfoBar",
      "data": {
        "phone": "+8801321208940",
        "whatsapp": "+8801321208940",
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "categoryNavigation",
      "type": "categoryNavigation",
      "data": {
        "categories": [
          {"name": "OFFER ZONE", "path": "/offer-zone"},
          {"name": "Best Seller", "path": "/best-seller"},
          {"name": "Mustard Oil", "path": "/mustard-oil"},
          {"name": "Ghee (ঘি)", "path": "/ghee"},
          {"name": "Honey", "path": "/honey"}
        ],
        "backgroundColor": "#FF6B35",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Shipping+Returns",
        "title": "Shipping & Returns",
        "subtitle": "Our policies explained",
        "ctaButton": {"text": "Contact Us", "link": "/contact"}
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Shipping Information",
        "features": [
          {"icon": "🚚", "title": "Free Shipping", "description": "Free shipping on orders over 1000 BDT"},
          {"icon": "⏱️", "title": "Fast Delivery", "description": "3-5 business days for domestic orders"},
          {"icon": "🇧🇩", "title": "Nationwide Delivery", "description": "We deliver across Bangladesh"}
        ]
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Return Policy",
        "features": [
          {"icon": "🔄", "title": "7 Days Returns", "description": "7 days return policy for all items"},
          {"icon": "✅", "title": "Easy Returns", "description": "Simple and hassle-free return process"},
          {"icon": "💰", "title": "Full Refund", "description": "Full refund for eligible returns"}
        ]
      }
    },
    {
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');
