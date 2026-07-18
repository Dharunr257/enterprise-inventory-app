import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';
import { StockStatusChart, CategoryDistributionChart, MonthlyTrendChart } from '../components/Charts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard');
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      addToast(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return <Spinner />;
  }

  const { summary, recentProducts, lowStockProducts, recentActivity, charts } = data;

  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'Product Created': return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'CR' };
      case 'Stock In': return { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'IN' };
      case 'Stock Out': return { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'OT' };
      case 'Stock Adjustment': return { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'AD' };
      default: return { bg: 'var(--bg-active)', color: 'var(--text-secondary)', label: 'EV' };
    }
  };

  return (
    <div className="page-container">
      {/* GitOps Delivery Control Center Status Header */}
      <div className="panel-card" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px 24px', 
        marginBottom: '24px', 
        borderLeft: '4px solid var(--color-success)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Glowing Green Sync Icon */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
              display: 'inline-block'
            }}></span>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success)',
              opacity: '0.2',
              position: 'absolute',
              animation: 'spin 2s linear infinite',
              display: 'inline-block',
              transform: 'scale(1.5)'
            }}></span>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>GitOps Cluster Deployment</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Environment: <strong style={{ color: 'var(--text-primary)' }}>Production-K8s</strong> • Namespace: <strong style={{ color: 'var(--text-primary)' }}>inventory-system</strong>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '0.8rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600' }}>Argo CD Sync</span>
            <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>Synced (HEAD)</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600' }}>Pipeline Status</span>
            <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>Active (paths-filtered)</span>
          </div>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="dashboard-grid">
        {/* Total Products */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Total SKUs</span>
            <div className="card-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.89 2.24L2 8.11v7.78l10.89 5.87 10.89-5.87V8.11z" />
                <line x1="12" y1="22" x2="12" y2="8.5" />
                <line x1="2" y1="8" x2="22" y2="8" />
              </svg>
            </div>
          </div>
          <div className="card-value">{summary.totalProducts}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Active products monitored</span>
        </div>

        {/* Categories */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Categories</span>
            <div className="card-icon" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
          </div>
          <div className="card-value">{summary.totalCategories}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Asset classifications</span>
        </div>

        {/* Suppliers */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Suppliers</span>
            <div className="card-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div className="card-value">{summary.totalSuppliers}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Active supply chain vendors</span>
        </div>

        {/* Low Stock Items */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Low Stock / Out</span>
            <div className="card-icon" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div className="card-value" style={{ color: 'var(--color-danger)' }}>
            {summary.lowStockItems} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ {summary.outOfStockItems} out</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Requires immediate refill</span>
        </div>

        {/* Total Inventory Value */}
        <div className="card">
          <div className="card-header-flex">
            <span className="card-title">Valuation</span>
            <div className="card-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="card-value">${summary.totalValue}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Cumulative stock valuation</span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Category distribution */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Inventory by Category</h3>
          </div>
          <CategoryDistributionChart data={charts.categoryDistribution} />
        </div>

        {/* Stock Status breakdown */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Stock Status Metrics</h3>
          </div>
          <StockStatusChart data={charts.stockStatus} />
        </div>

        {/* Registration trend */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Monthly Added Products</h3>
          </div>
          <MonthlyTrendChart data={charts.monthlyTrend} />
        </div>
      </div>

      {/* Tables & Activities Panel */}
      <div className="dashboard-panels">
        {/* Left Side: Recent and Low Stock Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Products */}
          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title">Recently Registered SKUs</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '500' }}>
                        <div>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.sku}</div>
                      </td>
                      <td>{p.category_name || 'N/A'}</td>
                      <td style={{ textAlign: 'right' }}>${Number(p.price).toFixed(2)}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>{p.quantity}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge badge-${p.status === 'In Stock' ? 'success' : (p.status === 'Low Stock' ? 'warning' : 'danger')}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title" style={{ color: 'var(--color-danger)' }}>Critical Stock Shortages</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Available Qty</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        All products are fully stocked. No shortages.
                      </td>
                    </tr>
                  ) : (
                    lowStockProducts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: '500' }}>{p.name}</td>
                        <td>{p.category_name || 'N/A'}</td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--color-danger)' }}>{p.quantity}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge badge-${p.status === 'Low Stock' ? 'warning' : 'danger'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Audit Log Activity stream */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">Audit Activity Feed</h3>
          </div>
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>No log feeds available.</p>
            ) : (
              recentActivity.map((act) => {
                const conf = getActivityTypeColor(act.activity_type);
                return (
                  <div key={act.id} className="activity-item">
                    <div className="activity-avatar" style={{ backgroundColor: conf.bg, color: conf.color }}>
                      {conf.label}
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">
                        <strong>{act.user_name}</strong> triggered <strong>{act.activity_type}</strong>
                      </div>
                      <div className="activity-notes">
                        {act.notes}
                        {act.product_name && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Item: {act.product_name} ({act.product_sku})
                          </div>
                        )}
                      </div>
                      <div className="activity-time">
                        {new Date(act.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} • {new Date(act.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
