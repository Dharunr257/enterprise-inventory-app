import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';
import { StockStatusChart, CategoryDistributionChart, MonthlyTrendChart } from '../components/Charts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [logs, setLogs] = useState([
    { id: 1, time: '14:48:12', type: 'system', text: 'Deployment controller initialized successfully.' },
    { id: 2, time: '14:48:13', type: 'info', text: 'Checking cluster namespace \'inventory-system\' status...' },
    { id: 3, time: '14:48:15', type: 'success', text: 'Namespace verified. Pods: backend (1/1), frontend (1/1), mysql (1/1) ready.' },
    { id: 4, time: '14:50:00', type: 'info', text: 'ArgoCD polling repository: Dharunr257/enterprise-inventory-app...' },
    { id: 5, time: '14:50:02', type: 'success', text: 'Synced with HEAD commit (no changes detected).' },
  ]);

  // Digital Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live GitOps logs stream simulator
  useEffect(() => {
    const logTemplates = [
      { type: 'info', text: 'ArgoCD sync loop running: checking commit history...' },
      { type: 'success', text: 'Current deployment is in sync with repository main branch (revision: HEAD).' },
      { type: 'info', text: 'Kubernetes ingress controller routing checks passed.' },
      { type: 'system', text: 'Garbage collection: cleaning up orphaned ReplicaSets...' },
      { type: 'info', text: 'Verifying liveness / readiness probes for container group: ims-backend.' },
      { type: 'success', text: 'Probe checklist complete: all service containers healthy.' },
      { type: 'warning', text: 'Database resource load: pool capacity normal (1/10 active connections).' },
      { type: 'info', text: 'Kubernetes API server reports namespace \'inventory-system\' resources synced.' }
    ];

    const logTimer = setInterval(() => {
      const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => {
        const nextLogs = [...prev, {
          id: Date.now(),
          time: timeStr,
          type: randomTemplate.type,
          text: randomTemplate.text
        }];
        return nextLogs.slice(-12); // keep last 12 logs
      });
    }, 7000);

    return () => clearInterval(logTimer);
  }, []);

  // Auto scroll terminal logs
  useEffect(() => {
    if (consoleOpen) {
      const term = document.getElementById('terminal-body');
      if (term) {
        term.scrollTop = term.scrollHeight;
      }
    }
  }, [logs, consoleOpen]);

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
      {/* Dynamic Greetings & GitOps Control Panel Header */}
      <div className="panel-card" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        padding: '24px', 
        marginBottom: '12px', 
        borderLeft: '4px solid var(--color-primary)',
        background: 'linear-gradient(135deg, var(--color-primary-light), var(--bg-card))',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Left Side: Welcome Greeting & Real-time Clock */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
          <div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: 'var(--color-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              System Console
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginTop: '2px', color: 'var(--text-primary)' }}>
              Welcome back, Dharun!
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Here is your GitOps deployment and warehouse metrics dashboard.
            </p>
          </div>
          
          {/* Real-time Clock Widget */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)',
            marginTop: '8px',
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '20px',
            width: 'fit-content',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} •{' '}
              <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                {currentTime.toLocaleTimeString()}
              </strong>
            </span>
          </div>
        </div>

        {/* Right Side: GitOps Status Control Room */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          gap: '12px',
          background: 'rgba(0, 0, 0, 0.03)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                  display: 'inline-block'
                }}></span>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                  opacity: '0.2',
                  position: 'absolute',
                  animation: 'spin 2.5s linear infinite',
                  display: 'inline-block',
                  transform: 'scale(1.4)'
                }}></span>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>GitOps Cluster Deployment</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Namespace: inventory-system</span>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: '600' }}>Argo CD Sync</span>
              <span style={{ fontWeight: '600', color: 'var(--color-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Synced (HEAD)
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: '600' }}>Target cluster</span>
              <span style={{ fontWeight: '600', color: 'var(--color-primary)', fontSize: '0.8rem' }}>Production-K8s</span>
            </div>
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

      {/* Live GitOps Console */}
      <div className="panel-card" style={{ marginTop: '12px' }}>
        <div 
          className="panel-header" 
          style={{ cursor: 'pointer', userSelect: 'none' }} 
          onClick={() => setConsoleOpen(!consoleOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 8px #10b981'
            }}></span>
            <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              GitOps Cluster Sync Logs
            </h3>
          </div>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {consoleOpen ? 'COLLAPSE' : 'EXPAND'} LOGS
          </button>
        </div>
        
        {consoleOpen && (
          <div className="terminal-console">
            <div className="terminal-header">
              <span>console@k8s-cluster:~/inventory-system</span>
              <span>LIVE LOG STREAM</span>
            </div>
            <div className="terminal-body" id="terminal-body">
              {logs.map((log) => (
                <div key={log.id} className={`terminal-line ${log.type}`}>
                  <span className="time">[{log.time}]</span>
                  <span className="status-tag">[{log.type.toUpperCase()}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
