const Supplier = require('../models/supplierModel');

exports.getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.getAll();
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
};

exports.getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.getById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

exports.createSupplier = async (req, res, next) => {
  try {
    const { name, contact_name, email, phone, address } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Supplier name is required' });
    }

    const existing = await Supplier.findByName(name);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Supplier with this name already exists' });
    }

    const newSupplier = await Supplier.create({ name, contact_name, email, phone, address });
    res.status(201).json({ success: true, message: 'Supplier created successfully', data: newSupplier });
  } catch (error) {
    next(error);
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const { name, contact_name, email, phone, address } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Supplier name is required' });
    }

    const supplier = await Supplier.getById(id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const existing = await Supplier.findByName(name);
    if (existing && existing.id !== parseInt(id, 10)) {
      return res.status(400).json({ success: false, message: 'Another supplier with this name already exists' });
    }

    const updated = await Supplier.update(id, { name, contact_name, email, phone, address });
    res.status(200).json({ success: true, message: 'Supplier updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.getById(id);
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const deleted = await Supplier.delete(id);
    if (!deleted) {
      return res.status(400).json({ success: false, message: 'Failed to delete supplier' });
    }

    res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};
