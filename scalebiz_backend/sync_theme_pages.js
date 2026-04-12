const mysql = require('mysql2/promise');
require('dotenv').config();

async function syncThemePages() {
  const connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Get all stores
    const [stores] = await connection.query(
      'SELECT id as store_id, theme_id FROM stores'
    );

    console.log(`Found ${stores.length} stores`);

    // Define page templates for each theme
    const themePageTemplates = {
      1: { // Basic Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'basic-home' },
          { title: 'About Us', slug: 'about-us', template: 'basic-about' },
          { title: 'Contact Us', slug: 'contact', template: 'basic-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'basic-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'basic-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'basic-shipping' }
        ]
      },
      2: { // Modern Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'modern-home' },
          { title: 'About Us', slug: 'about-us', template: 'modern-about' },
          { title: 'Contact Us', slug: 'contact', template: 'modern-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'modern-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'modern-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'modern-shipping' }
        ]
      },
      3: { // Minimal Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'minimal-home' },
          { title: 'About Us', slug: 'about-us', template: 'minimal-about' },
          { title: 'Contact Us', slug: 'contact', template: 'minimal-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'minimal-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'minimal-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'minimal-shipping' }
        ]
      },
      4: { // Premium Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'premium-home' },
          { title: 'About Us', slug: 'about-us', template: 'premium-about' },
          { title: 'Contact Us', slug: 'contact', template: 'premium-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'premium-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'premium-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'premium-shipping' }
        ]
      },
      5: { // Diamond Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'diamond-home' },
          { title: 'About Us', slug: 'about-us', template: 'diamond-about' },
          { title: 'Contact Us', slug: 'contact', template: 'diamond-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'diamond-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'diamond-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'diamond-shipping' }
        ]
      },
      6: { // Akira Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'akira-home' },
          { title: 'About Us', slug: 'about-us', template: 'akira-about' },
          { title: 'Contact Us', slug: 'contact', template: 'akira-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'akira-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'akira-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'akira-shipping' }
        ]
      },
      7: { // Axon Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'axon-home' },
          { title: 'About Us', slug: 'about-us', template: 'axon-about' },
          { title: 'Contact Us', slug: 'contact', template: 'axon-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'axon-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'axon-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'axon-shipping' }
        ]
      },
      8: { // Ghorer Bazar Theme
        pages: [
          { title: 'Home', slug: 'home', template: 'ghorer-home' },
          { title: 'About Us', slug: 'about-us', template: 'ghorer-about' },
          { title: 'Contact Us', slug: 'contact', template: 'ghorer-contact' },
          { title: 'Privacy Policy', slug: 'privacy-policy', template: 'ghorer-policy' },
          { title: 'Terms of Service', slug: 'terms-of-service', template: 'ghorer-terms' },
          { title: 'Shipping & Returns', slug: 'shipping-returns', template: 'ghorer-shipping' }
        ]
      }
    };

    // Define page content for each template
    const pageContentTemplates = {
      // Basic Theme Pages
      'basic-home': {
        blocks: [
          { id: 'systemHeader', type: 'systemHeader', data: {} },
          {
            id: 'heroBannerSlider',
            type: 'heroBannerSlider',
            data: {
              banners: [
                {
                  imageUrl: 'https://via.placeholder.com/1920x600?text=Welcome',
                  title: 'Welcome to Our Store',
                  subtitle: 'Discover amazing products',
                  ctaButton: { text: 'Shop Now', link: '/collections/all' }
                },
                {
                  imageUrl: 'https://via.placeholder.com/1920x600?text=New+Arrivals',
                  title: 'New Arrivals',
                  subtitle: 'Check out the latest',
                  ctaButton: { text: 'View Collection', link: '/collections/new' }
                }
              ]
            }
          },
          {
            id: 'productCarousel',
            type: 'productCarousel',
            data: {
              title: 'Featured Products',
              query: { collectionId: 'featured' },
              displayStyle: 'carousel',
              productsPerView: 4
            }
          },
          {
            id: 'featuredCategories',
            type: 'featuredCategories',
            data: {
              title: 'Shop by Category',
              categories: [
                { name: 'Apparel', imageUrl: 'https://via.placeholder.com/300x400?text=Apparel', link: '/collections/apparel' },
                { name: 'Accessories', imageUrl: 'https://via.placeholder.com/300x400?text=Accessories', link: '/collections/accessories' },
                { name: 'Footwear', imageUrl: 'https://via.placeholder.com/300x400?text=Footwear', link: '/collections/footwear' },
                { name: 'Outerwear', imageUrl: 'https://via.placeholder.com/300x400?text=Outerwear', link: '/collections/outerwear' }
              ]
            }
          },
          {
            id: 'marketingBanner',
            type: 'marketingBanner',
            data: {
              text: 'Free shipping on orders over $50!',
              backgroundColor: '#3F51B5',
              textColor: '#FFFFFF'
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'basic-about': {
        blocks: [
          { id: 'systemHeader', type: 'systemHeader', data: {} },
          {
            id: 'heroBanner',
            type: 'heroBanner',
            data: {
              imageUrl: 'https://via.placeholder.com/1920x400?text=About+Us',
              title: 'About Our Brand',
              subtitle: 'Quality products since 2024',
              ctaButton: { text: 'Shop Collection', link: '/collections/all' }
            }
          },
          {
            id: 'featureBlocks',
            type: 'featureBlocks',
            data: {
              title: 'Our Story',
              features: [
                { icon: 'check-circle', title: 'Quality Products', description: 'We offer only the best items' },
                { icon: 'truck', title: 'Fast Shipping', description: 'Quick delivery worldwide' },
                { icon: 'heart', title: 'Customer Care', description: '24/7 support for our customers' }
              ]
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'basic-contact': {
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
              emailTo: 'info@store.com',
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
      },
      'basic-policy': {
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
              content: '<h2>Information We Collect</h2><p>We collect information you provide directly to us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate our services.</p><h2>Security</h2><p>We take reasonable measures to protect your information.</p>'
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'basic-terms': {
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
              content: '<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms.</p><h2>Use License</h2><p>Permission is granted to temporarily download materials for personal viewing.</p><h2>Disclaimer</h2><p>The materials are provided on an as is basis.</p>'
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'basic-shipping': {
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
                { icon: 'clock', title: 'Fast Delivery', description: '3-5 business days' },
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
                { icon: 'refresh-cw', title: '30 Days Returns', description: '30 days return policy' },
                { icon: 'check-circle', title: 'Easy Returns', description: 'Simple return process' },
                { icon: 'dollar-sign', title: 'Full Refund', description: 'Full refund for eligible returns' }
              ]
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      // Modern Theme Pages
      'modern-home': {
        blocks: [
          { id: 'systemHeader', type: 'systemHeader', data: {} },
          {
            id: 'heroBannerSlider',
            type: 'heroBannerSlider',
            data: {
              banners: [
                {
                  imageUrl: 'https://via.placeholder.com/1920x600?text=Modern+Style',
                  title: 'Modern Living',
                  subtitle: 'Contemporary design',
                  ctaButton: { text: 'Explore', link: '/collections/all' }
                }
              ]
            }
          },
          {
            id: 'productCarousel',
            type: 'productCarousel',
            data: {
              title: 'Trending Now',
              query: { collectionId: 'trending' },
              displayStyle: 'carousel',
              productsPerView: 5
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'modern-about': {
        blocks: [
          { id: 'systemHeader', type: 'systemHeader', data: {} },
          {
            id: 'heroBanner',
            type: 'heroBanner',
            data: {
              imageUrl: 'https://via.placeholder.com/1920x400?text=About+Us',
              title: 'About Our Brand',
              subtitle: 'Modern design since 2024',
              ctaButton: { text: 'Shop Collection', link: '/collections/all' }
            }
          },
          {
            id: 'featureBlocks',
            type: 'featureBlocks',
            data: {
              title: 'Our Story',
              features: [
                { icon: 'check-circle', title: 'Quality Products', description: 'We offer only the best items' },
                { icon: 'truck', title: 'Fast Shipping', description: 'Quick delivery worldwide' },
                { icon: 'heart', title: 'Customer Care', description: '24/7 support for our customers' }
              ]
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'modern-contact': {
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
              emailTo: 'info@modernstore.com',
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
      },
      'modern-policy': {
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
              content: '<h2>Information We Collect</h2><p>We collect information you provide directly to us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to operate our services.</p><h2>Security</h2><p>We take reasonable measures to protect your information.</p>'
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'modern-terms': {
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
              content: '<h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms.</p><h2>Use License</h2><p>Permission is granted to temporarily download materials for personal viewing.</p><h2>Disclaimer</h2><p>The materials are provided on an as is basis.</p>'
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      },
      'modern-shipping': {
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
                { icon: 'clock', title: 'Fast Delivery', description: '3-5 business days' },
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
                { icon: 'refresh-cw', title: '30 Days Returns', description: '30 days return policy' },
                { icon: 'check-circle', title: 'Easy Returns', description: 'Simple return process' },
                { icon: 'dollar-sign', title: 'Full Refund', description: 'Full refund for eligible returns' }
              ]
            }
          },
          { id: 'systemFooter', type: 'systemFooter', data: {} }
        ]
      }
    };

    // Process each store
    for (const store of stores) {
      const { store_id, theme_id } = store;
      const themePages = themePageTemplates[theme_id];

      if (!themePages) {
        console.log(`Store ${store_id} has unsupported theme ${theme_id}, using basic template...`);
        continue;
      }

      // Delete existing pages for this store
      await connection.query(
        'DELETE FROM pages WHERE store_id = ?',
        [store_id]
      );
      console.log(`Deleted existing pages for store ${store_id}`);

      // Create new pages for this store
      for (const pageTemplate of themePages.pages) {
        const contentTemplate = pageContentTemplates[`${pageTemplate.template}`];
        
        if (!contentTemplate) {
          console.log(`Warning: No content template found for ${pageTemplate.template}`);
          continue;
        }

        await connection.query(
          `INSERT INTO pages (store_id, title, slug, content, status)
           VALUES (?, ?, ?, ?, ?)`,
          [
            store_id,
            pageTemplate.title,
            pageTemplate.slug,
            JSON.stringify(contentTemplate),
            'published'
          ]
        );
      }

      console.log(`Created ${themePages.pages.length} pages for store ${store_id} with theme ${theme_id}`);
    }

    console.log('Theme pages synchronization completed!');
    
  } catch (error) {
    console.error('Error syncing theme pages:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

syncThemePages();
