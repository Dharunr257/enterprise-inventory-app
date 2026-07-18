import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('summary'); // 'summary' | 'outOfStock' | 'lowStock' | 'highValue'
  const { addToast } = useToast();

  const fetchProductsForReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsForReport();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  // Calculate Metrics
  const totalSkuCount = products.length;
  const totalStockQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const averagePrice = totalSkuCount > 0 ? (products.reduce((sum, p) => sum + Number(p.price), 0) / totalSkuCount) : 0;

  // Filter products based on selected reportType
  const getFilteredProducts = () => {
    switch (reportType) {
      case 'outOfStock':
        return products.filter((p) => p.quantity === 0);
      case 'lowStock':
        return products.filter((p) => p.quantity > 0 && p.quantity <= 20);
      case 'highValue':
        // Sort by inventory value descending
        return [...products].sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price));
      default:
        return products;
    }
  };

  const filteredItems = getFilteredProducts();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      {/* Printable Area Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-heading)' }}>Inventory Reports Console</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Audit valuation, stock distributions, and operational flags.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            {/* Print Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Report
          </button>
        </div>
      </div>

      {/* Select Report View */}
      <div className="filters-bar no-print" style={{ justifyContent: 'flex-start', gap: '8px' }}>
        <button 
          className={`btn ${reportType === 'summary' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setReportType('summary')}
        >
          General Summary
        </button>
        <button 
          className={`btn ${reportType === 'outOfStock' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setReportType('outOfStock')}
        >
          Out of Stock Logs
        </button>
        <button 
          className={`btn ${reportType === 'lowStock' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setReportType('lowStock')}
        >
          Low Stock Alerts
        </button>
        <button 
          className={`btn ${reportType === 'highValue' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setReportType('highValue')}
        >
          Highest Valued Inventory
        </button>
      </div>

      {/* Report Summary Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <span className="card-title">Monitored SKUs</span>
          <div className="card-value">{totalSkuCount}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unique database catalog keys</span>
        </div>
        <div className="card">
          <span className="card-title">Accumulated Stock Units</span>
          <div className="card-value">{totalStockQuantity}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total individual items in warehouse</span>
        </div>
        <div className="card">
          <span className="card-title">Cumulative Valuation</span>
          <div className="card-value">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sum of (Price * Quantity)</span>
        </div>
        <div className="card">
          <span className="card-title">Average SKU Pricing</span>
          <div className="card-value">${averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean price of all active items</span>
        </div>
      </div>

      {/* Main Report Table Container */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title" style={{ fontSize: '1.25rem' }}>
              {reportType === 'summary' && 'Active Inventory Ledger'}
              {reportType === 'outOfStock' && 'Critical Deficit: Out of Stock Ledger'}
              {reportType === 'lowStock' && 'Replenishment Required: Low Stock Ledger'}
              {reportType === 'highValue' && 'Financial Audit: Highest Valued Inventory Ledger'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '4px' }}>
              Report compiled on {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </p>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary)' }}>
            {filteredItems.length} records found
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Category</th>
                <th>Supplier Vendor</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>Qty in Stock</th>
                <th style={{ textAlign: 'right' }}>Inventory Value</th>
                <th style={{ textAlign: 'center' }}>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                    No records found for this specific report filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((p) => {
                  const itemValue = p.quantity * p.price;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.sku}</div>
                      </td>
                      <td>{p.category_name || 'Uncategorized'}</td>
                      <td>{p.supplier_name || 'No Vendor Assigned'}</td>
                      <td style={{ textAlign: 'right' }}>${Number(p.price).toFixed(2)}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>{p.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                        ${itemValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge badge-${p.status === 'In Stock' ? 'success' : (p.status === 'Low Stock' ? 'warning' : 'danger')}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print CSS Injection */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: #ffffff;
            color: #000000;
          }
          .card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .panel-card {
            border: none !important;
            box-shadow: none !important;
          }
          .table-container {
            border: 1px solid #000 !important;
            border-radius: 0 !important;
          }
          .table th {
            background-color: #eee !important;
            color: #000 !important;
            border-bottom: 2px solid #000 !important;
          }
          .table td {
            border-bottom: 1px solid #ccc !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
