const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inventory_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // Required to execute multi-statement SQL scripts (schema & seed)
};

console.log(`Database Config: Host=${poolConfig.host}, Port=${poolConfig.port}, User=${poolConfig.user}, Database=${poolConfig.database}`);

const pool = mysql.createPool(poolConfig);

module.exports = pool;
