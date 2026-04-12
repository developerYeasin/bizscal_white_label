-- =================================================================
-- Page Templates for Akira Theme
-- =================================================================
-- This creates default pages for the Akira fashion e-commerce theme
-- =================================================================

-- =================================================================
-- Page: Home (Akira Theme)
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
      "id": "heroBannerSlider",
      "type": "heroBannerSlider",
      "data": {
        "banners": [
          {
            "imageUrl": "https://via.placeholder.com/1920x600?text=Autumn+Collection+2024",
            "title": "Autumn Jackets Collection In 2024",
            "subtitle": "NEW WOMEN CLOTHING",
            "ctaButton": {"text": "SHOP NOW", "link": "/collections/autumn"}
          },
          {
            "imageUrl": "https://via.placeholder.com/1920x600?text=Summer+Sale",
            "title": "Summer Sale",
            "subtitle": "Up to 50% Off",
            "ctaButton": {"text": "Shop Now", "link": "/collections/sale"}
          }
        ]
      }
    },
    {
      "id": "promotionalBannerGrid",
      "type": "promotionalBannerGrid",
      "data": {
        "banners": [
          {
            "imageUrl": "https://via.placeholder.com/400x300?text=Fashion+Month",
            "title": "Fashion Month",
            "subtitle": "Ready in Capital Shop",
            "ctaButton": {"text": "View All", "link": "/collections/fashion"}
          },
          {
            "imageUrl": "https://via.placeholder.com/400x300?text=Summer+Styles",
            "title": "Catch the Sun",
            "subtitle": "Summer Break Styles From $5.99",
            "ctaButton": {"text": "View All", "link": "/collections/summer"}
          },
          {
            "imageUrl": "https://via.placeholder.com/400x300?text=Red+Dress",
            "title": "OFF SHOULDER RED DRESS",
            "subtitle": "-20%",
            "ctaButton": {"text": "$99 | Shop Now", "link": "/collections/dresses"}
          },
          {
            "imageUrl": "https://via.placeholder.com/400x300?text=Summer+Sale",
            "title": "Super Summer Sale",
            "subtitle": "Limited Time Offer",
            "ctaButton": {"text": "View All", "link": "/collections/sale"}
          }
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "BEST SELLER",
        "query": {"collectionId": "best-sellers"},
        "displayStyle": "grid",
        "gridCols": 4,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "saleBanner",
      "type": "saleBanner",
      "data": {
        "title": "New Season Sale",
        "subtitle": "40% OFF",
        "imageUrl": "https://via.placeholder.com/1200x400?text=Sale+Banner",
        "ctaButton": {"text": "SHOP NOW", "link": "/collections/sale"}
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "TRENDING",
        "query": {"collectionId": "trending"},
        "displayStyle": "grid",
        "gridCols": 4,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "featuresTrustBadges",
      "type": "featuresTrustBadges",
      "data": {
        "badges": [
          {"icon": "🚚", "title": "Free Shipping", "subtitle": "orders $50 or more"},
          {"icon": "🔄", "title": "Free Returns", "subtitle": "within 30 days"},
          {"icon": "ℹ️", "title": "Get 20% Off 1 Item", "subtitle": "when you sign up"},
          {"icon": "💬", "title": "We Support", "subtitle": "24/7 amazing services"}
        ]
      }
    },
    {
      "id": "newsletterCouponBanner",
      "type": "newsletterCouponBanner",
      "data": {
        "title": "Get The Latest Deals",
        "subtitle": "and receive $20 coupon for first shopping",
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
-- Page: About Us (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=About+Us",
        "title": "About Our Brand",
        "subtitle": "Fashion since 2024",
        "ctaButton": {"text": "Shop Collection", "link": "/collections/all"}
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Our Story",
        "features": [
          {"icon": "check-circle", "title": "Quality Products", "description": "We offer only the best fashion items"},
          {"icon": "truck", "title": "Fast Shipping", "description": "Quick delivery worldwide"},
          {"icon": "heart", "title": "Customer Care", "description": "24/7 support for our customers"}
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
-- Page: Contact (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Contact+Us",
        "title": "Get in Touch",
        "subtitle": "We would love to hear from you",
        "ctaButton": {"text": "Call Us", "link": "tel:+1234567890"}
      }
    },
    {
      "id": "contactForm",
      "type": "contactForm",
      "data": {
        "title": "Contact Us",
        "description": "Have questions? Reach out!",
        "emailTo": "info@akirastore.com",
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
-- Page: Privacy Policy (Akira Theme)
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
-- Page: Product Detail (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Product+Detail",
        "title": "Product Details",
        "subtitle": "View product information",
        "ctaButton": {"text": "Add to Cart", "link": "/cart"}
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
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Collection (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Collection",
        "title": "Collection",
        "subtitle": "Browse our collection",
        "ctaButton": {"text": "Shop Now", "link": "/collections/all"}
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "collectionId": "dynamic",
        "displayStyle": "grid",
        "gridCols": 4,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
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
-- Page: Cart (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Shopping+Cart",
        "title": "Shopping Cart",
        "subtitle": "Review your items",
        "ctaButton": {"text": "Checkout", "link": "/checkout"}
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
        "subtitle": "On orders over $50",
        "ctaButton": {"text": "Shop Now", "link": "/collections/all"}
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
-- Page: Checkout (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Checkout",
        "title": "Checkout",
        "subtitle": "Complete your order",
        "ctaButton": {"text": "Place Order", "link": "/order-confirmation"}
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
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Order Confirmation (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Order+Confirmed",
        "title": "Order Confirmed!",
        "subtitle": "Thank you for your purchase",
        "ctaButton": {"text": "Continue Shopping", "link": "/"}
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
      "id": "newsletterSubscription",
      "type": "newsletterSubscription",
      "data": {
        "title": "Subscribe to Our Newsletter",
        "subtitle": "Get updates on new arrivals and special offers",
        "placeholder": "Enter your email",
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
-- Page: Receipt (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Order+Receipt",
        "title": "Order Receipt",
        "subtitle": "Your order details",
        "ctaButton": {"text": "Continue Shopping", "link": "/"}
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
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Policy (Akira Theme)
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
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=Policy",
        "title": "Policy",
        "subtitle": "Policy information",
        "ctaButton": {"text": "Contact Us", "link": "/contact"}
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
      "id": "systemFooter",
      "type": "systemFooter",
      "data": {}
    }
  ]
}', 'published');

-- =================================================================
-- Page: Terms of Service (Akira Theme)
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
        "content": "<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Akira Store website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Akira Store website are provided on an as is basis. Akira Store makes no warranties, expressed or implied.</p>"
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
-- Page: Shipping & Returns (Akira Theme)
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
          {"icon": "truck", "title": "Free Shipping", "description": "Free shipping on orders over $50"},
          {"icon": "clock", "title": "Fast Delivery", "description": "3-5 business days for domestic orders"},
          {"icon": "globe", "title": "International Shipping", "description": "We ship worldwide"}
        ]
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Return Policy",
        "features": [
          {"icon": "refresh-cw", "title": "30 Days Returns", "description": "30 days return policy for all items"},
          {"icon": "check-circle", "title": "Easy Returns", "description": "Simple and hassle-free return process"},
          {"icon": "dollar-sign", "title": "Full Refund", "description": "Full refund for eligible returns"}
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
