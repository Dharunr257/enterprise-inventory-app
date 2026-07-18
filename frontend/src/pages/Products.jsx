import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0.00);

  const fetchFiltersAndOptions = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        api.get('/categories'),
        api.get('/suppliers')
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (supRes.success) setSuppliers(supRes.data);
    } catch (err) {
      console.error('Error fetching categories/suppliers options:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search;
      if (filterCategory) params.categoryId = filterCategory;
      if (filterStatus) params.status = filterStatus;

      const res = await api.get('/products', { params });
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      addToast(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersAndOptions();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, filterCategory, filterStatus]);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setName('');
    setSku('');
    setCategoryId('');
    setSupplierId('');
    setQuantity(0);
    setPrice(0.00);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setSku(product.sku);
    setCategoryId(product.category_id || '');
    setSupplierId(product.supplier_id || '');
    setQuantity(product.quantity);
    setPrice(product.price);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      addToast('Product name and SKU are required', 'warning');
      return;
    }
    if (quantity < 0 || price < 0) {
      addToast('Quantity and price must be positive numbers', 'warning');
      return;
    }

    const payload = {
      name,
      sku,
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      supplier_id: supplierId ? parseInt(supplierId, 10) : null,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      user_name: 'Dharun Admin' // Pass active user for inventory audit logger
    };

    try {
      if (selectedProduct) {
        // Edit Mode
        const res = await api.put(`/products/${selectedProduct.id}`, payload);
        if (res.success) {
          addToast('Product updated successfully', 'success');
          fetchProducts();
          setIsFormOpen(false);
        }
      } else {
        // Add Mode
        const res = await api.post('/products', payload);
        if (res.success) {
          addToast('Product created successfully', 'success');
          fetchProducts();
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      addToast(error.message, 'danger');
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const res = await api.delete(`/products/${selectedProduct.id}`);
      if (res.success) {
        addToast('Product deleted successfully', 'success');
        fetchProducts();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      addToast(error.message, 'danger');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock': return <span className="badge badge-success">In Stock</span>;
      case 'Low Stock': return <span className="badge badge-warning">Low Stock</span>;
      case 'Out of Stock': return <span className="badge badge-danger">Out of Stock</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-heading)' }}>Product Catalog</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Direct CRUD manager for SKU items, valuations, and supplier mapping.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Search Name / SKU</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Category</label>
          <select
            className="form-control"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Stock Status</label>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <button className="btn btn-secondary btn-reset" onClick={handleResetFilters}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Category</th>
                <th>Supplier</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>In Stock</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th>Updated Date</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No products matching current filter criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.sku}</div>
                    </td>
                    <td>{p.category_name || <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Uncategorized</span>}</td>
                    <td>{p.supplier_name || <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Supplier</span>}</td>
                    <td style={{ textAlign: 'right', fontWeight: '500' }}>${Number(p.price).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>{p.quantity}</td>
                    <td style={{ textAlign: 'center' }}>{getStatusBadge(p.status)}</td>
                    <td>{new Date(p.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-icon" 
                          onClick={() => handleOpenEdit(p)}
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleOpenDelete(p)}
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedProduct ? 'Edit Product SKU' : 'Create Product Entry'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {selectedProduct ? 'Save SKU Details' : 'Create Product'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Wireless Ergonomic Mouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">SKU Identifier *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. EL-WEMS-003"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Product Category</label>
              <select
                className="form-control"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sourcing Supplier</label>
            <select
              className="form-control"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm SKU Retirement"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Confirm Delete</button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" style={{ marginBottom: '16px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>Are you sure you want to delete this product SKU?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Product <strong>{selectedProduct?.name}</strong> (SKU: {selectedProduct?.sku}) will be deleted from active tracking.
          </p>
          <p style={{ color: 'var(--text-danger)', fontSize: '0.75rem', marginTop: '12px', fontWeight: '500' }}>
            Warning: This deletes all historical quantities and calculations tied to this SKU.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
