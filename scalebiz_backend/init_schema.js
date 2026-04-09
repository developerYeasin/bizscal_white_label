const pool = require('./src/config/database');
const fs = require('fs').promises;

async function initializeSchema() {
  try {
    const schemaSql = await fs.readFile('./src/config/schema.sql', 'utf8');
    // Split by semicolon to execute multiple statements, ignoring empty ones
    const statements = schemaSql.split(';').filter(sql => sql.trim());
    for (const sql of statements) {
      if (sql.trim()) {
        await pool.query(sql);
      }
    }
    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Error initializing database schema:", error);
    throw error;
  }
}

async function main() {
  try {
    await initializeSchema();
    console.log('Schema initialization complete.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize schema:', error);
    process.exit(1);
  }
}

main();