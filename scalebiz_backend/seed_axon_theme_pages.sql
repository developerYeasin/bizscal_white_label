-- =================================================================
-- Page Templates for Axon Theme
-- =================================================================
-- This creates default pages for the Axon fashion e-commerce theme
-- =================================================================

-- =================================================================
-- Page: Home (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"},
          {"title": "Clocks", "path": "/clocks"},
          {"title": "Lighting", "path": "/lighting"},
          {"title": "Toys", "path": "/toys"},
          {"title": "Hand Made", "path": "/hand-made"},
          {"title": "Minimalism", "path": "/minimalism"},
          {"title": "Electronics", "path": "/electronics"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x600?text=TERRY+WEBB+-+FRANCO+DESIGNER",
        "title": "TERRY WEBB - FRANCO DESIGNER",
        "subtitle": "Proin at sapien ipsum. Aenean placerat, quam ac tempor congue, orci est luctus ex, ut vestibulum ipsum",
        "ctaButton": {"text": "Shop Now!", "link": "/collections/new"}
      }
    },
    {
      "id": "featuresTrustBadges",
      "type": "featuresTrustBadges",
      "data": {
        "badges": [
          {"icon": "📦", "title": "NO LIMITED", "subtitle": "Worldwide free shipping"},
          {"icon": "💰", "title": "MONEY BACK", "subtitle": "7 days money back guaranteed"},
          {"icon": "🔒", "title": "SAFETY", "subtitle": "We never share your individual info"}
        ]
      }
    },
    {
      "id": "productTabsFilter",
      "type": "productTabsFilter",
      "data": {
        "tabs": [
          {"name": "Women\'s", "active": true},
          {"name": "Mens", "active": false},
          {"name": "Kids", "active": false}
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "ELECTRONICS",
        "query": {"collectionId": "electronics"},
        "displayStyle": "grid",
        "gridCols": 4,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "dualPromotionalBanners",
      "type": "dualPromotionalBanners",
      "data": {
        "banners": [
          {
            "imageUrl": "https://via.placeholder.com/600x300?text=Modern+Accents+For+Him",
            "title": "MODERN ACCENTS FOR HIM",
            "subtitle": "SHOP MEN\'S ACCESSORIES",
            "link": "/collections/men"
          },
          {
            "imageUrl": "https://via.placeholder.com/600x300?text=Modern+Accents+For+Her",
            "title": "MODERN ACCENTS FOR HER",
            "subtitle": "SHOP WOMEN\'S ACCESSORIES",
            "link": "/collections/women"
          }
        ]
      }
    },
    {
      "id": "productTabsFilter",
      "type": "productTabsFilter",
      "data": {
        "tabs": [
          {"name": "Women\'s", "active": true},
          {"name": "Mens", "active": false},
          {"name": "Kids", "active": false}
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "FASHIONS",
        "query": {"collectionId": "fashion"},
        "displayStyle": "grid",
        "gridCols": 4,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "brandLogoRow",
      "type": "brandLogoRow",
      "data": {
        "brands": [
          {"name": "RETROGE", "logo": "https://via.placeholder.com/150x50?text=RETROGE"},
          {"name": "BARBERSHOP", "logo": "https://via.placeholder.com/150x50?text=BARBERSHOP"},
          {"name": "DESIGNERS", "logo": "https://via.placeholder.com/150x50?text=DESIGNERS"},
          {"name": "BARBERSHOP", "logo": "https://via.placeholder.com/150x50?text=BARBERSHOP"},
          {"name": "RETROGE", "logo": "https://via.placeholder.com/150x50?text=RETROGE"},
          {"name": "DESIGNERS", "logo": "https://via.placeholder.com/150x50?text=DESIGNERS"}
        ]
      }
    },
    {
      "id": "productTabsFilter",
      "type": "productTabsFilter",
      "data": {
        "tabs": [
          {"name": "Women\'s", "active": true},
          {"name": "Mens", "active": false},
          {"name": "Kids", "active": false}
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "BRAND SHOWCASE",
        "query": {"collectionId": "brands"},
        "displayStyle": "grid",
        "gridCols": 4,
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
          {"name": "New Arrivals", "active": true},
          {"name": "Best Seller", "active": false},
          {"name": "Specials", "active": false}
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "NEW ARRIVALS",
        "query": {"collectionId": "new-arrivals"},
        "displayStyle": "grid",
        "gridCols": 3,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "BEST SELLER",
        "query": {"collectionId": "best-sellers"},
        "displayStyle": "grid",
        "gridCols": 3,
        "showQuickAdd": true,
        "showDiscountBadge": true,
        "showNewBadge": true
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "SPECIALS",
        "query": {"collectionId": "specials"},
        "displayStyle": "grid",
        "gridCols": 3,
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
          {"name": "Latest News", "active": true}
        ]
      }
    },
    {
      "id": "productSection",
      "type": "productSection",
      "data": {
        "title": "LATEST NEW",
        "query": {"collectionId": "blog"},
        "displayStyle": "grid",
        "gridCols": 3,
        "showQuickAdd": false,
        "showDiscountBadge": false,
        "showNewBadge": true
      }
    },
    {
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: About Us (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "heroBanner",
      "type": "heroBanner",
      "data": {
        "imageUrl": "https://via.placeholder.com/1920x400?text=About+Us",
        "title": "About Our Brand",
        "subtitle": "Quality products since 2024",
        "ctaButton": {"text": "Shop Collection", "link": "/collections/all"}
      }
    },
    {
      "id": "featureBlocks",
      "type": "featureBlocks",
      "data": {
        "title": "Our Story",
        "features": [
          {"icon": "check-circle", "title": "Quality Products", "description": "We offer only the best items"},
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
-- Page: Product Detail (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Collection (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Cart (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Checkout (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Order Confirmation (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Receipt (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Policy (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
      "id": "backToTopButton",
      "type": "backToTopButton",
      "data": {
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF",
        "position": "bottom-right"
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
-- Page: Contact (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
        "textColor": "#FFFFFF"
      }
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
        "emailTo": "info@axonstore.com",
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
-- Page: Privacy Policy (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
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
-- Page: Terms of Service (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
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
        "content": "<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Axon Store website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Axon Store website are provided on an as is basis. Axon Store makes no warranties, expressed or implied.</p>"
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
-- Page: Shipping & Returns (Axon Theme)
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
      "id": "announcementBar",
      "type": "announcementBar",
      "data": {
        "message": "Free shipping on orders over $50!",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF"
      }
    },
    {
      "id": "megaMenuWithCategories",
      "type": "megaMenuWithCategories",
      "data": {
        "menuItems": [
          {"title": "Furniture", "path": "/furniture"},
          {"title": "Cooking", "path": "/cooking"},
          {"title": "Fashion", "path": "/fashion"},
          {"title": "Accessories", "path": "/accessories"}
        ],
        "backgroundColor": "#E63946",
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
