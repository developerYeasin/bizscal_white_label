const mysql = require("mysql2/promise");
const fs = require("fs").promises;
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true, 
});

// Monkey-patch the query method to log queries
const originalQuery = pool.query;
pool.query = (...args) => {
  const [sql, params] = args;
  console.log(`\n[MySQL Query]`);
  console.log('SQL:', sql);
  if (params) {
    console.log('PARAMS:', params);
  }
  console.log(`[/MySQL Query]\n`);
  return originalQuery.apply(pool, args);
};

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
    // Don't exit - the app might still work if tables already exist
  }
}

// Only auto-initialize schema if explicitly requested or if tables are missing
// To prevent accidental data loss in production
const shouldInitialize = process.env.INITIALIZE_DB === 'true' || process.env.NODE_ENV === 'development';

// Use an async IIFE to allow await at top level without module errors
(async () => {
  if (shouldInitialize) {
    try {
      const [tables] = await pool.query("SHOW TABLES");
      if (tables.length === 0) {
        console.log("No tables found. Initializing database schema...");
        await initializeSchema();
      } else {
        console.log(`Found ${tables.length} existing tables. Skipping schema initialization.`);
      }
    } catch (error) {
      console.error("Error checking existing tables:", error);
    }
  } else {
    console.log("Database schema initialization skipped (set INITIALIZE_DB=true to enable)");
  }
})(); 

console.log("MySQL Connection Pool Created.");

module.exports = pool;

// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     logging: false, // Set to true to see SQL queries in console
//   }
// );

// async function connectDB() {
//   try {
//     await sequelize.authenticate();
//     console.log(
//       "Connection to the database has been established successfully."
//     );
//     await sequelize.sync({ force: true }); // Use { force: true } to drop existing tables
//     // console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     process.exit(1);
//   }
// }

// connectDB();

// module.exports = sequelize;
