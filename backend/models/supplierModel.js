const db = require('../config/db');

class Supplier {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY name ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByName(name) {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE name = ?', [name]);
    return rows[0] || null;
  }

  static async create({ name, contact_name, email, phone, address }) {
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, contact_name, email, phone, address]
    );
    return { id: result.insertId, name, contact_name, email, phone, address };
  }

  static async update(id, { name, contact_name, email, phone, address }) {
    await db.query(
      'UPDATE suppliers SET name = ?, contact_name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, contact_name, email, phone, address, id]
    );
    return { id, name, contact_name, email, phone, address };
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Supplier;
