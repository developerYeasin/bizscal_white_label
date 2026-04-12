const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedThemeBlocks() {
  const connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Check if theme blocks already exist for themes 6, 7, 8
    const [existingBlocks] = await connection.query(
      'SELECT COUNT(*) as count FROM theme_blocks WHERE theme_id IN (6, 7, 8)'
    );
    
    if (existingBlocks[0].count > 0) {
      console.log('Theme blocks for themes 6, 7, 8 already exist. Skipping...');
      return;
    }

    // Akira Theme Blocks (Theme ID: 6)
    const akiraBlocks = [
      {
        theme_id: 6,
        block_type: 'promotionalBannerGrid',
        default_config: JSON.stringify({
          banners: [
            {
              imageUrl: 'https://via.placeholder.com/400x300?text=Banner+1',
              title: 'Fashion Month',
              subtitle: 'Ready in Capital Shop',
              ctaButton: { text: 'View All', link: '/collections/fashion' }
            },
            {
              imageUrl: 'https://via.placeholder.com/400x300?text=Banner+2',
              title: 'Summer Sale',
              subtitle: 'Up to 50% Off',
              ctaButton: { text: 'Shop Now', link: '/collections/sale' }
            }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              imageUrl: { type: 'string' },
              title: { type: 'string' },
              subtitle: { type: 'string' },
              ctaButton: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  link: { type: 'string' }
                }
              }
            }
          }
        }),
        sort_order: 1
      },
      {
        theme_id: 6,
        block_type: 'saleBanner',
        default_config: JSON.stringify({
          title: 'New Season Sale',
          subtitle: '40% OFF',
          imageUrl: 'https://via.placeholder.com/1200x400?text=Sale+Banner',
          ctaButton: { text: 'SHOP NOW', link: '/collections/sale' }
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            imageUrl: { type: 'string' },
            ctaButton: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                link: { type: 'string' }
              }
            }
          }
        }),
        sort_order: 2
      },
      {
        theme_id: 6,
        block_type: 'featuresTrustBadges',
        default_config: JSON.stringify({
          badges: [
            { icon: '🚚', title: 'Free Shipping', subtitle: 'orders $50 or more' },
            { icon: '🔄', title: 'Free Returns', subtitle: 'within 30 days' },
            { icon: 'ℹ️', title: 'Get 20% Off', subtitle: 'when you sign up' },
            { icon: '💬', title: 'We Support', subtitle: '24/7 amazing services' }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              icon: { type: 'string' },
              title: { type: 'string' },
              subtitle: { type: 'string' }
            }
          }
        }),
        sort_order: 3
      },
      {
        theme_id: 6,
        block_type: 'newsletterCouponBanner',
        default_config: JSON.stringify({
          title: 'Get The Latest Deals',
          subtitle: 'and receive $20 coupon for first shopping',
          placeholder: 'Your email address',
          buttonText: 'Subscribe'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            placeholder: { type: 'string' },
            buttonText: { type: 'string' }
          }
        }),
        sort_order: 4
      },
      {
        theme_id: 6,
        block_type: 'topNavigationBar',
        default_config: JSON.stringify({
          links: [
            { text: 'My Wishlist', icon: 'heart' },
            { text: 'Compare', icon: 'compare' },
            { text: 'ENGLISH', icon: 'globe' },
            { text: '$ USD', icon: 'dollar' }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              icon: { type: 'string' }
            }
          }
        }),
        sort_order: 5
      },
      {
        theme_id: 6,
        block_type: 'megaMenuNavigation',
        default_config: JSON.stringify({
          menuItems: [
            {
              title: 'Apparel',
              path: '/collections/apparel',
              subCategories: [
                { title: 'Tops', path: '/collections/tops' },
                { title: 'Bottoms', path: '/collections/bottoms' }
              ]
            },
            {
              title: 'Accessories',
              path: '/collections/accessories',
              subCategories: [
                { title: 'Bags', path: '/collections/bags' },
                { title: 'Jewelry', path: '/collections/jewelry' }
              ]
            }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              path: { type: 'string' },
              subCategories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    path: { type: 'string' }
                  }
                }
              }
            }
          }
        }),
        sort_order: 6
      }
    ];

    // Axon Theme Blocks (Theme ID: 7)
    const axonBlocks = [
      {
        theme_id: 7,
        block_type: 'announcementBar',
        default_config: JSON.stringify({
          message: 'Free shipping on orders over $50!',
          backgroundColor: '#FF6B6B',
          textColor: '#FFFFFF'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            message: { type: 'string' },
            backgroundColor: { type: 'string' },
            textColor: { type: 'string' }
          }
        }),
        sort_order: 1
      },
      {
        theme_id: 7,
        block_type: 'megaMenuWithCategories',
        default_config: JSON.stringify({
          menuItems: [
            { title: 'Furniture', path: '/furniture' },
            { title: 'Cooking', path: '/cooking' },
            { title: 'Fashion', path: '/fashion' },
            { title: 'Accessories', path: '/accessories' }
          ],
          backgroundColor: '#E63946',
          textColor: '#FFFFFF'
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              path: { type: 'string' }
            }
          }
        }),
        sort_order: 2
      },
      {
        theme_id: 7,
        block_type: 'productTabsFilter',
        default_config: JSON.stringify({
          tabs: [
            { name: "Women's", active: true },
            { name: "Mens", active: false },
            { name: "Kids", active: false }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              active: { type: 'boolean' }
            }
          }
        }),
        sort_order: 3
      },
      {
        theme_id: 7,
        block_type: 'dualPromotionalBanners',
        default_config: JSON.stringify({
          banners: [
            {
              imageUrl: 'https://via.placeholder.com/600x300?text=Banner+1',
              title: 'MODERN ACCENTS FOR HIM',
              subtitle: "SHOP MEN'S ACCESSORIES",
              link: '/collections/men'
            },
            {
              imageUrl: 'https://via.placeholder.com/600x300?text=Banner+2',
              title: 'MODERN ACCENTS FOR HER',
              subtitle: "SHOP WOMEN'S ACCESSORIES",
              link: '/collections/women'
            }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              imageUrl: { type: 'string' },
              title: { type: 'string' },
              subtitle: { type: 'string' },
              link: { type: 'string' }
            }
          }
        }),
        sort_order: 4
      },
      {
        theme_id: 7,
        block_type: 'brandLogoRow',
        default_config: JSON.stringify({
          brands: [
            { name: 'RETROGE', logo: 'https://via.placeholder.com/150x50?text=RETROGE' },
            { name: 'BARBERSHOP', logo: 'https://via.placeholder.com/150x50?text=BARBERSHOP' },
            { name: 'DESIGNERS', logo: 'https://via.placeholder.com/150x50?text=DESIGNERS' }
          ]
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              logo: { type: 'string' }
            }
          }
        }),
        sort_order: 5
      },
      {
        theme_id: 7,
        block_type: 'backToTopButton',
        default_config: JSON.stringify({
          backgroundColor: '#E63946',
          textColor: '#FFFFFF',
          position: 'bottom-right'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            backgroundColor: { type: 'string' },
            textColor: { type: 'string' },
            position: { type: 'string', enum: ['bottom-right', 'bottom-left'] }
          }
        }),
        sort_order: 6
      }
    ];

    // Ghorer Bazar Theme Blocks (Theme ID: 8)
    const ghorerBazarBlocks = [
      {
        theme_id: 8,
        block_type: 'contactInfoBar',
        default_config: JSON.stringify({
          phone: '+8801321208940',
          whatsapp: '+8801321208940',
          phone2: '+8801321208940',
          whatsapp2: '+8801321208940',
          backgroundColor: '#FF6B35',
          textColor: '#FFFFFF'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            phone: { type: 'string' },
            whatsapp: { type: 'string' },
            phone2: { type: 'string' },
            whatsapp2: { type: 'string' },
            backgroundColor: { type: 'string' },
            textColor: { type: 'string' }
          }
        }),
        sort_order: 1
      },
      {
        theme_id: 8,
        block_type: 'categoryNavigation',
        default_config: JSON.stringify({
          categories: [
            { name: 'OFFER ZONE', path: '/offer-zone' },
            { name: 'Best Seller', path: '/best-seller' },
            { name: 'Mustard Oil', path: '/mustard-oil' },
            { name: 'Ghee (ঘি)', path: '/ghee' },
            { name: 'Dates (খেজুর)', path: '/dates' },
            { name: 'খোজরা গুড়', path: '/khajorgur' },
            { name: 'Honey', path: '/honey' },
            { name: 'Masala', path: '/masala' },
            { name: 'Nuts & Seeds', path: '/nuts-seeds' }
          ],
          backgroundColor: '#FF6B35',
          textColor: '#FFFFFF'
        }),
        config_schema: JSON.stringify({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              path: { type: 'string' }
            }
          }
        }),
        sort_order: 2
      },
      {
        theme_id: 8,
        block_type: 'heroBannerWithProduct',
        default_config: JSON.stringify({
          title: 'আফ্রিকার ওয়াইল্ড অর্গানিক খাবার',
          subtitle: 'এখন বাংলাদেশে',
          imageUrl: 'https://via.placeholder.com/1200x500?text=African+Wild+Organic+Food',
          phone: '09642922922',
          backgroundColor: '#FF9F1C',
          textColor: '#FFFFFF'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            imageUrl: { type: 'string' },
            phone: { type: 'string' },
            backgroundColor: { type: 'string' },
            textColor: { type: 'string' }
          }
        }),
        sort_order: 3
      },
      {
        theme_id: 8,
        block_type: 'productGridQuickAdd',
        default_config: JSON.stringify({
          columns: 5,
          showQuickAdd: true,
          showDiscountBadge: true,
          showNewBadge: true
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            columns: { type: 'number' },
            showQuickAdd: { type: 'boolean' },
            showDiscountBadge: { type: 'boolean' },
            showNewBadge: { type: 'boolean' }
          }
        }),
        sort_order: 4
      },
      {
        theme_id: 8,
        block_type: 'productBadges',
        default_config: JSON.stringify({
          showDiscountBadge: true,
          showNewBadge: true,
          showOutOfStockBadge: true,
          discountBadgeColor: '#FF0000',
          newBadgeColor: '#00FF00'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            showDiscountBadge: { type: 'boolean' },
            showNewBadge: { type: 'boolean' },
            showOutOfStockBadge: { type: 'boolean' },
            discountBadgeColor: { type: 'string' },
            newBadgeColor: { type: 'string' }
          }
        }),
        sort_order: 5
      },
      {
        theme_id: 8,
        block_type: 'onlineStatusIndicator',
        default_config: JSON.stringify({
          status: 'online',
          message: 'Online',
          backgroundColor: '#00FF00',
          textColor: '#FFFFFF'
        }),
        config_schema: JSON.stringify({
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['online', 'offline'] },
            message: { type: 'string' },
            backgroundColor: { type: 'string' },
            textColor: { type: 'string' }
          }
        }),
        sort_order: 6
      }
    ];

    // Insert all blocks
    const allBlocks = [...akiraBlocks, ...axonBlocks, ...ghorerBazarBlocks];
    
    for (const block of allBlocks) {
      await connection.query(
        `INSERT INTO theme_blocks (theme_id, block_type, default_config, config_schema, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [block.theme_id, block.block_type, block.default_config, block.config_schema, block.sort_order]
      );
    }

    console.log(`Successfully inserted ${allBlocks.length} theme blocks for themes 6, 7, and 8`);
    
  } catch (error) {
    console.error('Error seeding theme blocks:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedThemeBlocks();
