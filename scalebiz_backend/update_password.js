const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

async function updatePassword() {
  try {
    const email = 'user.basic1@example.com';
    const plainPassword = 'password123';
    const passwordHash = await bcrypt.hash(plainPassword, 12);
    const [result] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [passwordHash, email]
    );
    console.log('Updated password for', email, 'rows affected:', result.affectedRows);
    console.log('New hash:', passwordHash);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    pool.end();
  }
}

updatePassword();