const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function initializeDatabase() {
  try {
    console.log('Checking database connection and initialization status...');
    
    // Check if the products table exists
    const [rows] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
        AND table_name = 'products'
    `);
    
    const tableExists = rows[0].count > 0;
    
    if (tableExists) {
      console.log('Database tables already exist. Skipping schema initialization.');
      
      // Check if products are seeded
      const [productRows] = await pool.query('SELECT COUNT(*) as count FROM products');
      if (productRows[0].count === 0) {
        console.log('Products table is empty. Running seeds...');
        await runSeedScript();
      } else {
        console.log(`Database is ready. Found ${productRows[0].count} products in DB.`);
      }
      return;
    }
    
    console.log('Database is not initialized. Running schema and seed scripts...');
    
    // 1. Run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      console.log('Executing schema.sql...');
      await pool.query(schemaSql);
      console.log('Schema created successfully.');
    } else {
      console.warn('schema.sql file not found at:', schemaPath);
    }
    
    // 2. Run seed.sql
    await runSeedScript();
    
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    // Do not crash the application immediately, but log the error
  }
}

async function runSeedScript() {
  const seedPath = path.join(__dirname, 'seed.sql');
  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('Executing seed.sql...');
    await pool.query(seedSql);
    console.log('Seed data inserted successfully.');
  } else {
    console.warn('seed.sql file not found at:', seedPath);
  }
}

module.exports = initializeDatabase;
