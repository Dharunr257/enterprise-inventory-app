const db = require('../config/db');

class Product {
  // Helper to determine status based on quantity
  static getStatus(quantity) {
    const qty = parseInt(quantity, 10);
    if (qty === 0) return 'Out of Stock';
    if (qty <= 20) return 'Low Stock';
    return 'In Stock';
  }

  static async getAll({ search, categoryId, status } = {}) {
    let sql = `
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name, s.name as supplier_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ?
    `, [id]);
    return rows[0] || null;
  }

  static async findBySku(sku) {
    const [rows] = await db.query('SELECT * FROM products WHERE sku = ?', [sku]);
    return rows[0] || null;
  }

  static async create({ name, sku, category_id, supplier_id, quantity, price, user_name }) {
    const status = this.getStatus(quantity);
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO products (name, sku, category_id, supplier_id, quantity, price, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, sku, category_id || null, supplier_id || null, quantity, price, status]
      );
      
      const newProductId = result.insertId;

      // Log activity
      await connection.query(
        `INSERT INTO inventory_activities (product_id, activity_type, quantity_changed, user_name, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [newProductId, 'Product Created', quantity, user_name || 'System', `Initial stock loaded: ${quantity} units.`]
      );

      await connection.commit();
      return { id: newProductId, name, sku, category_id, supplier_id, quantity, price, status };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async update(id, { name, sku, category_id, supplier_id, quantity, price, user_name }) {
    const status = this.getStatus(quantity);
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get original product info to compare quantity
      const [orig] = await connection.query('SELECT quantity FROM products WHERE id = ?', [id]);
      if (orig.length === 0) {
        throw new Error('Product not found');
      }
      const oldQty = orig[0].quantity;
      const newQty = parseInt(quantity, 10);
      const diff = newQty - oldQty;

      await connection.query(
        `UPDATE products 
         SET name = ?, sku = ?, category_id = ?, supplier_id = ?, quantity = ?, price = ?, status = ? 
         WHERE id = ?`,
        [name, sku, category_id || null, supplier_id || null, newQty, price, status, id]
      );

      if (diff !== 0) {
        const activityType = diff > 0 ? 'Stock In' : 'Stock Out';
        await connection.query(
          `INSERT INTO inventory_activities (product_id, activity_type, quantity_changed, user_name, notes) 
           VALUES (?, ?, ?, ?, ?)`,
          [id, activityType, diff, user_name || 'System', `Stock updated from ${oldQty} to ${newQty}.`]
        );
      } else {
        await connection.query(
          `INSERT INTO inventory_activities (product_id, activity_type, quantity_changed, user_name, notes) 
           VALUES (?, ?, ?, ?, ?)`,
          [id, 'Stock Adjustment', 0, user_name || 'System', 'Product details edited, quantity unchanged.']
        );
      }

      await connection.commit();
      return { id, name, sku, category_id, supplier_id, quantity: newQty, price, status };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;
