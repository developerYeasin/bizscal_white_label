const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedPages() {
  const connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Check if pages already exist for store_id 23
    const [existingPages] = await connection.query(
      'SELECT COUNT(*) as count FROM pages WHERE store_id = 23'
    );
    
    if (existingPages[0].count > 0) {
      console.log('Pages for store_id 23 already exist. Skipping...');
      return;
    }

    // Akira Theme Pages (store_id: 23)
    const akiraPages = [
      {
        store_id: 23,
        title: 'Home',
        slug: 'home',
        content: JSON.stringify({
          blocks: [
            { id: 'systemHeader', type: 'systemHeader', data: {} },
            {
              id: 'heroBannerSlider',
              type: 'heroBannerSlider',
              data: {
                banners: [
                  {
                    imageUrl: 'https://via.placeholder.com/1920x600?text=Autumn+Collection+2024',
                    title: 'Autumn Jackets Collection In 2024',
                    subtitle: 'NEW WOMEN CLOTHING',
                    ctaButton: { text: 'SHOP NOW', link: '/collections/autumn' }
                  },
                  {
                    imageUrl: 'https://via.placeholder.com/1920x600?text=Summer+Sale',
                    title: 'Summer Sale',
                    subtitle: 'Up to 50% Off',
                    ctaButton: { text: 'Shop Now', link: '/collections/sale' }
                  }
                ]
              }
            },
            {
              id: 'promotionalBannerGrid',
              type: 'promotionalBannerGrid',
              data: {
                banners: [
                  {
                    imageUrl: 'https://via.placeholder.com/400x300?text=Fashion+Month',
                    title: 'Fashion Month',
                    subtitle: 'Ready in Capital Shop',
                    ctaButton: { text: 'View All', link: '/collections/fashion' }
                  },
                  {
                    imageUrl: 'https://via.placeholder.com/400x300?text=Summer+Styles',
                    title: 'Catch the Sun',
                    subtitle: 'Summer Break Styles From $5.99',
                    ctaButton: { text: 'View All', link: '/collections/summer' }
                  },
                  {
                    imageUrl: 'https://via.placeholder.com/400x300?text=Red+Dress',
                    title: 'OFF SHOULDER RED DRESS',
                    subtitle: '-20%',
                    ctaButton: { text: '$99 | Shop Now', link: '/collections/dresses' }
                  },
                  {
                    imageUrl: 'https://via.placeholder.com/400x300?text=Summer+Sale',
                    title: 'Super Summer Sale',
                    subtitle: 'Limited Time Offer',
                    ctaButton: { text: 'View All', link: '/collections/sale' }
                  }
                ]
              }
            },
            {
              id: 'productSection',
              type: 'productSection',
              data: {
                title: 'BEST SELLER',
                query: { collectionId: 'best-sellers' },
                displayStyle: 'grid',
                gridCols: 4,
                showQuickAdd: true,
                showDiscountBadge: true,
                showNewBadge: true
              }
            },
            {
              id: 'saleBanner',
              type: 'saleBanner',
              data: {
                title: 'New Season Sale',
                subtitle: '40% OFF',
                imageUrl: 'https://via.placeholder.com/1200x400?text=Sale+Banner',
                ctaButton: { text: 'SHOP NOW', link: '/collections/sale' }
              }
            },
            {
              id: 'productSection',
              type: 'productSection',
              data: {
                title: 'TRENDING',
                query: { collectionId: 'trending' },
                displayStyle: 'grid',
                gridCols: 4,
                showQuickAdd: true,
                showDiscountBadge: true,
                showNewBadge: true
              }
            },
            {
              id: 'featuresTrustBadges',
              type: 'featuresTrustBadges',
              data: {
                badges: [
                  { icon: '🚚', title: 'Free Shipping', subtitle: 'orders $50 or more' },
                  { icon: '🔄', title: 'Free Returns', subtitle: 'within 30 days' },
                  { icon: 'ℹ️', title: 'Get 20% Off 1 Item', subtitle: 'when you sign up' },
                  { icon: '💬', title: 'We Support', subtitle: '24/7 amazing services' }
                ]
              }
            },
            {
              id: 'newsletterCouponBanner',
              type: 'newsletterCouponBanner',
              data: {
                title: 'Get The Latest Deals',
                subtitle: 'and receive $20 coupon for first shopping',
                placeholder: 'Your email address',
                buttonText: 'Subscribe'
              }
            },
            { id: 'systemFooter', type: 'systemFooter', data: {} }
          ]
        }),
        status: 'published'
      },
      {
        store_id: 23,
        title: 'About Us',
        slug: 'about-us',
        content: JSON.stringify({
          blocks: [
            { id: 'systemHeader', type: 'systemHeader', data: {} },
            {
              id: 'heroBanner',
              type: 'heroBanner',
              data: {
                imageUrl: 'https://via.placeholder.com/1920x400?text=About+Us',
                title: 'About Our Brand',
                subtitle: 'Fashion since 2024',
                ctaButton: { text: 'Shop Collection', link: '/collections/all' }
              }
            },
            {
              id: 'featureBlocks',
              type: 'featureBlocks',
              data: {
                title: 'Our Story',
                features: [
                  { icon: 'check-circle', title: 'Quality Products', description: 'We offer only the best fashion items' },
                  { icon: 'truck', title: 'Fast Shipping', description: 'Quick delivery worldwide' },
                  { icon: 'heart', title: 'Customer Care', description: '24/7 support for our customers' }
                ]
              }
            },
            { id: 'systemFooter', type: 'systemFooter', data: {} }
          ]
        }),
        status: 'published'
      },
      {
        store_id: 23,
        title: 'Contact Us',
        slug: 'contact',
        content: JSON.stringify({
          blocks: [
            { id: 'systemHeader', type: 'systemHeader', data: {} },
            {
              id: 'heroBanner',
              type: 'heroBanner',
              data: {
                imageUrl: 'https://via.placeholder.com/1920x400?text=Contact+Us',
                title: 'Get in Touch',
                subtitle: 'We would love to hear from you',
                ctaButton: { text: 'Call Us', link: 'tel:+1234567890' }
              }
            },
            {
              id: 'contactForm',
              type: 'contactForm',
              data: {
                title: 'Contact Us',
                description: 'Have questions? Reach out!',
                emailTo: 'info@akirastore.com',
                fields: [
                  { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your name' },
                  { name: 'email', label: 'Your Email', type: 'email', required: true, placeholder: 'Enter your email' },
                  { name: 'phone', label: 'Phone Number', type: 'phone', required: false, placeholder: 'Enter your phone' },
                  { name: 'message', label: 'Your Message', type: 'textarea', required: true, placeholder: 'Enter your message' }
                ],
                submitLabel: 'Send Message',
                showNameFields: true
              }
            },
            { id: 'systemFooter', type: 'systemFooter', data: {} }
          ]
        }),
        status: 'published'
      },
      {
        store_id: 23,
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: JSON.stringify({
          blocks: [
            { id: 'systemHeader', type: 'systemHeader', data: {} },
            {
              id: 'heroBanner',
              type: 'heroBanner',
              data: {
                imageUrl: 'https://via.placeholder.com/1920x400?text=Privacy+Policy',
                title: 'Privacy Policy',
                subtitle: 'Your privacy is important to us',
                ctaButton: { text: 'Contact Us', link: '/contact' }
              }
            },
            {
              id: 'text',
              type: 'text',
              data: {
                content: '<h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate, maintain, and improve our services.</p><h2>Security</h2><p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>'
              }
            },
            { id: 'systemFooter', type: 'systemFooter', data: {} }
          ]
        }),
        status: 'published'
      },
      {
        store_id: 23,
        title: 'Terms of Service',
        slug: 'terms-of-service',
        content: JSON.stringify({
          blocks: [
            { id: 'systemHeader', type: 'systemHeader', data: {} },
            {
              id: 'heroBanner',
              type: 'heroBanner',
              data: {
                imageUrl: 'https://via.placeholder.com/1920x400?text=Terms+of+Service',
                title: 'Terms of Service',
                subtitle: 'Please read these terms carefully',
                ctaButton: { text: 'Contact Us', link: '/contact' }
              }
            },
            {
              id: 'text',
              type: 'text',
              data: {
                content: '<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Akira Store website for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Akira Store website are provided on an as is basis. Akira Store makes no warranties, expressed or implied.</p>'
              }
            },
            { id: 'systemFooter', type: 'systemFooter', data: {} }
          ]
        }),
        status: 'published'
      },
      {
        store_id: 23,
        title: 'Shipping & Returns',
        slug: 'shipping-returns',
        content: JSON.stringify({
          blocks: [
            { id: 'systemHeader', type: 'systemHeader', data: {} },
            {
              id: 'heroBanner',
              type: 'heroBanner',
              data: {
                imageUrl: 'https://via.placeholder.com/1920x400?text=Shipping+Returns',
                title: 'Shipping & Returns',
                subtitle: 'Our policies explained',
                ctaButton: { text: 'Contact Us', link: '/contact' }
              }
            },
            {
              id: 'featureBlocks',
              type: 'featureBlocks',
              data: {
                title: 'Shipping Information',
                features: [
                  { icon: 'truck', title: 'Free Shipping', description: 'Free shipping on orders over $50' },
                  { icon: 'clock', title: 'Fast Delivery', description: '3-5 business days for domestic orders' },
                  { icon: 'globe', title: 'International Shipping', description: 'We ship worldwide' }
                ]
              }
            },
            {
              id: 'featureBlocks',
              type: 'featureBlocks',
              data: {
                title: 'Return Policy',
                features: [
                  { icon: 'refresh-cw', title: '30 Days Returns', description: '30 days return policy for all items' },
                  { icon: 'check-circle', title: 'Easy Returns', description: 'Simple and hassle-free return process' },
                  { icon: 'dollar-sign', title: 'Full Refund', description: 'Full refund for eligible returns' }
                ]
              }
            },
            { id: 'systemFooter', type: 'systemFooter', data: {} }
          ]
        }),
        status: 'published'
      }
    ];

    // Insert all pages
    for (const page of akiraPages) {
      await connection.query(
        `INSERT INTO pages (store_id, title, slug, content, status)
         VALUES (?, ?, ?, ?, ?)`,
        [page.store_id, page.title, page.slug, page.content, page.status]
      );
    }

    console.log(`Successfully inserted ${akiraPages.length} pages for Akira theme (store_id: 23)`);
    
  } catch (error) {
    console.error('Error seeding pages:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedPages();
