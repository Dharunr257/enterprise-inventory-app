const Product = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { search, categoryId, status } = req.query;
    const products = await Product.getAll({ search, categoryId, status });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, sku, category_id, supplier_id, quantity, price, user_name } = req.body;

    // Field Validations
    if (!name || !sku) {
      return res.status(400).json({ success: false, message: 'Product name and SKU are required' });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be 0 or greater' });
    }

    if (price === undefined || price < 0) {
      return res.status(400).json({ success: false, message: 'Price must be 0 or greater' });
    }

    // SKU uniqueness check
    const existing = await Product.findBySku(sku);
    if (existing) {
      return res.status(400).json({ success: false, message: `SKU '${sku}' is already assigned to another product.` });
    }

    const newProduct = await Product.create({
      name,
      sku,
      category_id,
      supplier_id,
      quantity,
      price,
      user_name
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, sku, category_id, supplier_id, quantity, price, user_name } = req.body;
    const { id } = req.params;

    // Field Validations
    if (!name || !sku) {
      return res.status(400).json({ success: false, message: 'Product name and SKU are required' });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be 0 or greater' });
    }

    if (price === undefined || price < 0) {
      return res.status(400).json({ success: false, message: 'Price must be 0 or greater' });
    }

    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // SKU uniqueness check for other products
    const existing = await Product.findBySku(sku);
    if (existing && existing.id !== parseInt(id, 10)) {
      return res.status(400).json({ success: false, message: `SKU '${sku}' is already assigned to another product.` });
    }

    const updatedProduct = await Product.update(id, {
      name,
      sku,
      category_id,
      supplier_id,
      quantity,
      price,
      user_name
    });

    res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deleted = await Product.delete(id);
    if (!deleted) {
      return res.status(400).json({ success: false, message: 'Failed to delete product' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
