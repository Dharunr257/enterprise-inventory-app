const db = require('../config/db');

class Dashboard {
  static async getSummaryStats() {
    const queries = {
      totalProducts: 'SELECT COUNT(*) as count FROM products',
      totalCategories: 'SELECT COUNT(*) as count FROM categories',
      totalSuppliers: 'SELECT COUNT(*) as count FROM suppliers',
      lowStockItems: "SELECT COUNT(*) as count FROM products WHERE status = 'Low Stock'",
      outOfStockItems: "SELECT COUNT(*) as count FROM products WHERE status = 'Out of Stock'",
      totalValue: 'SELECT SUM(quantity * price) as value FROM products'
    };

    const stats = {};
    
    const [pCount] = await db.query(queries.totalProducts);
    stats.totalProducts = pCount[0].count;

    const [cCount] = await db.query(queries.totalCategories);
    stats.totalCategories = cCount[0].count;

    const [sCount] = await db.query(queries.totalSuppliers);
    stats.totalSuppliers = sCount[0].count;

    const [lsCount] = await db.query(queries.lowStockItems);
    stats.lowStockItems = lsCount[0].count;

    const [osCount] = await db.query(queries.outOfStockItems);
    stats.outOfStockItems = osCount[0].count;

    const [tVal] = await db.query(queries.totalValue);
    stats.totalValue = Number(tVal[0].value || 0).toFixed(2);

    return stats;
  }

  static async getRecentProducts(limit = 5) {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }

  static async getLowStockProducts(limit = 5) {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'Low Stock' OR p.status = 'Out of Stock'
      ORDER BY p.quantity ASC
      LIMIT ?
    `, [limit]);
    return rows;
  }

  static async getRecentActivity(limit = 10) {
    const [rows] = await db.query(`
      SELECT a.*, p.name as product_name, p.sku as product_sku 
      FROM inventory_activities a
      LEFT JOIN products p ON a.product_id = p.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }

  static async getChartCategoryDistribution() {
    // Inventory value and quantity per category
    const [rows] = await db.query(`
      SELECT c.name as category, COUNT(p.id) as product_count, SUM(p.quantity) as total_quantity
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY total_quantity DESC
      LIMIT 8
    `);
    return rows;
  }

  static async getChartStockStatus() {
    // Product count by stock status
    const [rows] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM products 
      GROUP BY status
    `);
    return rows;
  }

  static async getChartMonthlyTrend() {
    // Products added per month over the last 6 months
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
      FROM products
      GROUP BY month
      ORDER BY month ASC
      LIMIT 6
    `);
    return rows;
  }
}

module.exports = Dashboard;
