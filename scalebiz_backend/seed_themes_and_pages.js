/**
 * Script to seed Akira, Axon, and Ghorer Bazar themes and pages
 * This script reads the SQL file and executes it against the database
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seedThemesAndPages() {
  const sqlFilePath = path.join(__dirname, 'seed_complete_themes_pages.sql');
  
  // Check if SQL file exists
  if (!fs.existsSync(sqlFilePath)) {
    console.error('❌ SQL file not found:', sqlFilePath);
    process.exit(1);
  }

  // Read SQL file
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Database configuration from .env
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'scalebiz_new',
  };

  console.log('📝 Database Configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log('');

  try {
    // Create connection
    console.log('🔄 Connecting to database...');
    const connection = await mysql.createConnection(dbConfig);
    
    // Test connection
    await connection.ping();
    console.log('✅ Connected to database successfully!\n');

    // Execute SQL
    console.log('📜 Executing SQL script...');
    console.log('   This may take a few moments...\n');
    
    // Use multi-statements to execute the SQL file
    const results = await connection.execute(sql);
    
    console.log('✅ SQL script executed successfully!\n');
    
    // Close connection
    await connection.end();
    console.log('👋 Database connection closed.\n');

    console.log('🎉 Themes and pages have been seeded successfully!');
    console.log('\n📋 Summary:');
    console.log('   - 3 new themes created (Akira, Axon, Ghorer Bazar)');
    console.log('   - 18 theme blocks created (6 per theme)');
    console.log('   - 18 pages created (6 per theme)');
    console.log('\n📂 SQL file used: seed_complete_themes_pages.sql');
    console.log('\n🚀 You can now select these themes in the Builder.jsx Theme Settings panel!');
    
  } catch (error) {
    console.error('❌ Error executing SQL script:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.log('   1. Check if MySQL/MariaDB is running');
    console.log('   2. Verify database credentials in .env file');
    console.log('   3. Ensure the database exists:', dbConfig.database);
    console.log('   4. Check if the SQL file exists:', sqlFilePath);
    process.exit(1);
  }
}

// Run the script
seedThemesAndPages();
