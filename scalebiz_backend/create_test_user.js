const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUser() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1,
  });

  const email = 'testowner@bizscal.com';
  const password = 'admin123';
  const name = 'Test Owner';

  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, account_status) VALUES (?, ?, ?, ?, ?) ' +
      'ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash)',
      [name, email, passwordHash, 'owner', 'active']
    );

    if (result.affectedRows > 0) {
      console.log('User created/updated successfully:', email);
      const [rows] = await pool.query('SELECT id, email, store_id, role FROM users WHERE email = ?', [email]);
      console.log('User data:', rows[0]);
    } else {
      console.log('No changes made');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await pool.end();
  }
}

createUser();
