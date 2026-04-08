const mysql = require('mysql2/promise');
require('dotenv').config();

async function testCreateStore() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1,
  });

  // Get a user without a store
  const [users] = await pool.query('SELECT id, email FROM users WHERE store_id IS NULL LIMIT 1');
  if (users.length === 0) {
    console.log('No user available without a store');
    await pool.end();
    return;
  }
  const userId = users[0].id;
  console.log('Test user ID:', userId, 'Email:', users[0].email);

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const payload = {
      store_name: 'yeasin',
      business_type: 'E-commerce',
      country: 'Bangladesh',
      shop_address: 'Awona, Sholla, Nawabgonj, Dhaka.',
      shop_email: 'testowner2@bizscal.com',
      shop_phone_number: '+8801834886669',
      shop_details: '',
      topbar_announcement: '',
    };

    const generateHostname = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    };

    const hostname = generateHostname(payload.store_name);
    const theme_id = 1;

    console.log('Generated hostname:', hostname);

    const [storeResult] = await connection.query(
      `INSERT INTO stores
        (store_name, theme_id, hostname, country, contact_email,
         business_type, address, phone_number, shop_details, topbar_announcement)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.store_name,
        theme_id,
        hostname,
        payload.country,
        payload.shop_email,
        payload.business_type,
        payload.shop_address,
        payload.shop_phone_number,
        payload.shop_details,
        payload.topbar_announcement,
      ]
    );

    const store_id = storeResult.insertId;
    console.log('Store created, ID:', store_id);

    const defaultLandingPage = {
      policies: {},
      landingPage: {
        components: [
          {
            id: 1760266910721,
            data: {
              title: 'All Products',
              cardType: 'default',
              subtitle: 'Catchy subtitle goes here.',
              productsPerView: 4,
            },
            type: 'allProducts',
          },
        ],
      },
    };

    const paymentSettings = { note: '', cod_enabled: true };

    await connection.query(
      'INSERT INTO store_configurations (store_id, page_settings, payment_settings) VALUES (?, ?, ?)',
      [store_id, JSON.stringify(defaultLandingPage), JSON.stringify(paymentSettings)]
    );

    await connection.query(
      'INSERT INTO store_theme_settings (store_id, theme_id) VALUES (?, ?)',
      [store_id, theme_id]
    );

    await connection.query(
      'INSERT INTO store_landing_page_settings (store_id, landing_page_template_id) VALUES (?, ?)',
      [store_id, 1]
    );

    await connection.query('UPDATE users SET store_id = ? WHERE id = ?', [
      store_id,
      userId,
    ]);

    await connection.commit();
    console.log('✓ Store created successfully!');

    const [store] = await connection.query('SELECT * FROM stores WHERE id = ?', [store_id]);
    console.log('Created store data:', store[0]);

  } catch (error) {
    await connection.rollback();
    console.error('✗ Error:', error.code, error.message);
    if (error.sqlMessage) console.error('SQL:', error.sqlMessage);
    if (error.stack) console.error('Stack:', error.stack);
  } finally {
    connection.release();
    pool.end();
  }
}

testCreateStore();
