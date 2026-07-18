const Category = require('../models/categoryModel');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existing = await Category.findByName(name);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const newCategory = await Category.create(name, description);
    res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const existing = await Category.findByName(name);
    if (existing && existing.id !== parseInt(id, 10)) {
      return res.status(400).json({ success: false, message: 'Another category with this name already exists' });
    }

    const updated = await Category.update(id, name, description);
    res.status(200).json({ success: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const deleted = await Category.delete(id);
    if (!deleted) {
      return res.status(400).json({ success: false, message: 'Failed to delete category (it may have active product references)' });
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
