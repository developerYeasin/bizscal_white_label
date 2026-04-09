const pool = require('./src/config/database');

async function test() {
  try {
    // Check if users table exists
    const [rows] = await pool.query("SHOW TABLES LIKE 'users'");
    if (rows.length === 0) {
      console.log('ERROR: users table does not exist.');
      return;
    }
    console.log('SUCCESS: users table exists.');

    // Check columns
    const [columns] = await pool.query("DESCRIBE users");
    console.log('Columns:', columns.map(c => c.Field).join(', '));

    // Try the owner login query with a dummy email
    const [results] = await pool.query(
      "SELECT id, store_id, password_hash, role, email FROM users WHERE email = ? AND role IN (?)",
      ['user.basic1@example.com', ['owner', 'manager', 'moderator']]
    );
    console.log('Query returned', results.length, 'rows');
    if (results.length > 0) {
      console.log('Sample row:', results[0]);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close pool
    pool.end();
  }
}

test();