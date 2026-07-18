import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

const Settings = () => {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  // System Settings State (Mock)
  const [storeName, setStoreName] = useState('Global Warehousing Corp');
  const [contactEmail, setContactEmail] = useState('inventory-admin@enterprise-ims.com');
  const [currency, setCurrency] = useState('USD ($)');
  const [lowStockThreshold, setLowStockThreshold] = useState(20);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('');

  // GitOps / K8s configs
  const [syncInterval, setSyncInterval] = useState('5m');
  const [autoPrune, setAutoPrune] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      setSaving(false);
      addToast('Enterprise settings updated successfully', 'success');
    }, 1200);
  };

  return (
    <div className="page-container">
      <div>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-family-heading)' }}>System Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Configure warehouse defaults, alert channels, and deployment synchronization variables.</p>
      </div>

      {saving ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* General Store Details */}
          <div className="panel-card">
            <h3 className="panel-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>General Preferences</h3>
            <div className="form-grid" style={{ marginTop: '8px' }}>
              <div className="form-group">
                <label className="form-label">Warehouse Console Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Support Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)} 
                  required
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Base Currency Standard</label>
                <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD ($)">USD - US Dollar ($)</option>
                  <option value="EUR (€)">EUR - Euro (€)</option>
                  <option value="GBP (£)">GBP - British Pound (£)</option>
                  <option value="INR (₹)">INR - Indian Rupee (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Low Stock Warn Threshold</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={lowStockThreshold} 
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10))} 
                  required
                />
              </div>
            </div>
          </div>

          {/* SCM / Alert Channels */}
          <div className="panel-card">
            <h3 className="panel-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Automated Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="emailAlerts"
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="emailAlerts" style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>
                  Enable Daily Summary Reports Email
                </label>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '28px', marginTop: '-10px' }}>
                Automatically emails warehouse managers listing all items currently marked as "Low Stock" or "Out of Stock".
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  id="slackAlerts"
                  checked={slackAlerts} 
                  onChange={(e) => setSlackAlerts(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="slackAlerts" style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>
                  Enable Real-time Slack Webhook Dispatch
                </label>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '28px', marginTop: '-10px' }}>
                Sends instantaneous notifications to dedicated channels whenever a product reaches "Out of Stock".
              </p>

              {slackAlerts && (
                <div className="form-group" style={{ marginLeft: '28px' }}>
                  <label className="form-label">Slack Webhook URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={slackWebhook} 
                    onChange={(e) => setSlackWebhook(e.target.value)} 
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* GitOps CD Sync Parameters */}
          <div className="panel-card">
            <h3 className="panel-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>GitOps & Kubernetes Delivery Sync</h3>
            <div className="form-grid" style={{ marginTop: '8px' }}>
              <div className="form-group">
                <label className="form-label">Argo CD Reconcile Interval</label>
                <select className="form-control" value={syncInterval} onChange={(e) => setSyncInterval(e.target.value)}>
                  <option value="1m">1 minute</option>
                  <option value="3m">3 minutes</option>
                  <option value="5m">5 minutes (Default)</option>
                  <option value="15m">15 minutes</option>
                </select>
              </div>
              <div className="form-group" style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="autoPrune"
                    checked={autoPrune} 
                    onChange={(e) => setAutoPrune(e.target.checked)} 
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="autoPrune" style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>
                    Auto-Prune Orphaned Resources
                  </label>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '28px', marginTop: '4px' }}>
                  Instructs the deployment controller to remove objects no longer defined in repo manifests.
                </p>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Save Configuration
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default Settings;
