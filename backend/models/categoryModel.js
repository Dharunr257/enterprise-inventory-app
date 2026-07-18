const db = require('../config/db');

class Category {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByName(name) {
    const [rows] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);
    return rows[0] || null;
  }

  static async create(name, description) {
    const [result] = await db.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    return { id: result.insertId, name, description };
  }

  static async update(id, name, description) {
    await db.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return { id, name, description };
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Category;
