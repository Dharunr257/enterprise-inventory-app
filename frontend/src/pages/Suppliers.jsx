import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers');
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (error) {
      addToast(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenAdd = () => {
    setSelectedSupplier(null);
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setName(supplier.name);
    setContactName(supplier.contact_name || '');
    setEmail(supplier.email || '');
    setPhone(supplier.phone || '');
    setAddress(supplier.address || '');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Supplier name is required', 'warning');
      return;
    }

    const payload = { 
      name, 
      contact_name: contactName, 
      email, 
      phone, 
      address 
    };

    try {
      if (selectedSupplier) {
        // Edit Mode
        const res = await api.put(`/suppliers/${selectedSupplier.id}`, payload);
        if (res.success) {
          addToast('Supplier updated successfully', 'success');
          fetchSuppliers();
          setIsFormOpen(false);
        }
      } else {
        // Add Mode
        const res = await api.post('/suppliers', payload);
        if (res.success) {
          addToast('Supplier created successfully', 'success');
          fetchSuppliers();
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      addToast(error.message, 'danger');
    }
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    try {
      const res = await api.delete(`/suppliers/${selectedSupplier.id}`);
      if (res.success) {
        addToast('Supplier deleted successfully', 'success');
        fetchSuppliers();
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
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-heading)' }}>Supplier Database</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage vendor supply chains, contact accounts, and active locations.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Supplier
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Contact Representative</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Fulfillment Address</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No suppliers configured. Add a supplier profile to start sourcing.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{supplier.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{supplier.id}</div>
                    </td>
                    <td>{supplier.contact_name || '-'}</td>
                    <td>
                      {supplier.email ? (
                        <a href={`mailto:${supplier.email}`} style={{ color: 'var(--color-primary)' }}>{supplier.email}</a>
                      ) : '-'}
                    </td>
                    <td>{supplier.phone || '-'}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {supplier.address || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-icon" 
                          onClick={() => handleOpenEdit(supplier)}
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleOpenDelete(supplier)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedSupplier ? 'Edit Supplier' : 'Create Supplier Profile'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {selectedSupplier ? 'Save Changes' : 'Add Supplier'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Supplier Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Acme Tech Solutions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-control"
                placeholder="Jane Smith"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="sales@acmetech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fulfillment Address</label>
            <textarea
              className="form-control"
              placeholder="Enter building, street, state, ZIP code..."
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Remove Supplier Account"
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
          <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>Are you sure you want to remove this supplier?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            The vendor record <strong>{selectedSupplier?.name}</strong> will be deleted.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '12px' }}>
            Note: If products are sourced from this vendor, their supplier reference will become empty but the products will not be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Suppliers;
