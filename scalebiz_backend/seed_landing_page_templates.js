const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedLandingPageTemplates() {
  const connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Check if templates already exist for Akira, Axon, Ghorer Bazar
    const [existingTemplates] = await connection.query(
      'SELECT COUNT(*) as count FROM landing_page_templates WHERE name IN ("Akira", "Axon", "Ghorer Bazar")'
    );
    
    if (existingTemplates[0].count > 0) {
      console.log('Landing page templates already exist. Skipping...');
      return;
    }

    // Akira Theme Template
    const akiraTemplate = {
      name: 'Akira',
      description: 'Fashion e-commerce theme with promotional grids and sale banners',
      version: '1.0.0',
      status: 'published',
      access_level: 'free',
      category: 'Fashion',
      features: JSON.stringify([
        'Promotional Banner Grid',
        'Sale Banner',
        'Trust Badges',
        'Newsletter with Coupon',
        'Top Navigation Bar',
        'Mega Menu Navigation'
      ]),
      preview_image_url: 'https://via.placeholder.com/800x600?text=Akira+Theme',
      live_demo_url: '#',
      template_config: JSON.stringify({
        theme_id: 6,
        blocks: [
          'promotionalBannerGrid',
          'saleBanner',
          'featuresTrustBadges',
          'newsletterCouponBanner',
          'topNavigationBar',
          'megaMenuNavigation'
        ]
      })
    };

    // Axon Theme Template
    const axonTemplate = {
      name: 'Axon',
      description: 'Multi-level navigation theme with mega menu and product tabs',
      version: '1.0.0',
      status: 'published',
      access_level: 'standard',
      category: 'Modern',
      features: JSON.stringify([
        'Announcement Bar',
        'Mega Menu with Categories',
        'Product Tabs Filter',
        'Dual Promotional Banners',
        'Brand Logo Row',
        'Back to Top Button'
      ]),
      preview_image_url: 'https://via.placeholder.com/800x600?text=Axon+Theme',
      live_demo_url: '#',
      template_config: JSON.stringify({
        theme_id: 7,
        blocks: [
          'announcementBar',
          'megaMenuWithCategories',
          'productTabsFilter',
          'dualPromotionalBanners',
          'brandLogoRow',
          'backToTopButton'
        ]
      })
    };

    // Ghorer Bazar Theme Template
    const ghorerBazarTemplate = {
      name: 'Ghorer Bazar',
      description: 'Organic food e-commerce theme with contact bar and category navigation',
      version: '1.0.0',
      status: 'published',
      access_level: 'free',
      category: 'Organic Food',
      features: JSON.stringify([
        'Contact Info Bar',
        'Category Navigation',
        'Hero Banner with Product',
        'Product Grid with Quick Add',
        'Product Badges',
        'Online Status Indicator'
      ]),
      preview_image_url: 'https://via.placeholder.com/800x600?text=Ghorer+Bazar+Theme',
      live_demo_url: '#',
      template_config: JSON.stringify({
        theme_id: 8,
        blocks: [
          'contactInfoBar',
          'categoryNavigation',
          'heroBannerWithProduct',
          'productGridQuickAdd',
          'productBadges',
          'onlineStatusIndicator'
        ]
      })
    };

    // Insert all templates
    const templates = [akiraTemplate, axonTemplate, ghorerBazarTemplate];
    
    for (const template of templates) {
      await connection.query(
        `INSERT INTO landing_page_templates 
         (name, description, version, status, access_level, category, features, preview_image_url, live_demo_url, template_config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          template.name,
          template.description,
          template.version,
          template.status,
          template.access_level,
          template.category,
          template.features,
          template.preview_image_url,
          template.live_demo_url,
          template.template_config
        ]
      );
    }

    console.log(`Successfully inserted ${templates.length} landing page templates`);
    
  } catch (error) {
    console.error('Error seeding landing page templates:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedLandingPageTemplates();
