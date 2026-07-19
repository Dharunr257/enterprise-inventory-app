import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form values
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      addToast(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setName('');
    setDescription('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Category name is required', 'warning');
      return;
    }

    try {
      if (selectedCategory) {
        // Edit Mode
        const res = await api.put(`/categories/${selectedCategory.id}`, { name, description });
        if (res.success) {
          addToast('Category updated successfully', 'success');
          fetchCategories();
          setIsFormOpen(false);
        }
      } else {
        // Add Mode
        const res = await api.post('/categories', { name, description });
        if (res.success) {
          addToast('Category created successfully', 'success');
          fetchCategories();
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      addToast(error.message, 'danger');
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      const res = await api.delete(`/categories/${selectedCategory.id}`);
      if (res.success) {
        addToast('Category deleted successfully', 'success');
        fetchCategories();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      addToast(error.message, 'danger');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-heading)' }}>Category Library</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Organize products into distinct structural classifications.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Category
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th style={{ width: '200px' }}>Created Date</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No categories found. Create a category to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td><strong>#{category.id}</strong></td>
                    <td style={{ fontWeight: '600' }}>{category.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{category.description || 'No description provided.'}</td>
                    <td>{new Date(category.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-icon" 
                          onClick={() => handleOpenEdit(category)}
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleOpenDelete(category)}
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Create New Category'}
        type="drawer"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {selectedCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Storage Devices"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Add information about products inside this category..."
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete Category</button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" style={{ marginBottom: '16px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>Are you absolutely sure?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            This action cannot be undone. Category <strong>{selectedCategory?.name}</strong> will be permanently deleted from database.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '12px' }}>
            Note: If products are referencing this category, they will remain but their category reference will become empty.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
