import React from 'react';

// 1. Stock Status Donut Chart
export const StockStatusChart = ({ data = [] }) => {
  const statusConfig = {
    'In Stock': { color: 'var(--color-success)', bg: 'var(--color-success-light)' },
    'Low Stock': { color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
    'Out of Stock': { color: 'var(--color-danger)', bg: 'var(--color-danger-light)' }
  };

  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Compute angles and offsets for Donut chart
  let accumulatedPercent = 0;
  const donutSegments = data.map((item) => {
    const percent = total > 0 ? (item.count / total) * 100 : 0;
    const offset = 100 - accumulatedPercent;
    accumulatedPercent += percent;
    return {
      name: item.status,
      count: item.count,
      percent,
      offset
    };
  });

  const radius = 15.91549430918954; // 2 * pi * r = 100 circumference
  const strokeDasharray = `${100} ${100}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ width: '150px', height: '150px', position: 'relative' }}>
        <svg viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          <circle cx="21" cy="21" r={radius} fill="transparent" stroke="var(--border-color)" strokeWidth="4" />
          {donutSegments.map((seg, idx) => {
            const config = statusConfig[seg.name] || { color: 'var(--text-muted)' };
            const dash = `${seg.percent} ${100 - seg.percent}`;
            const strokeOffset = seg.offset === 100 ? 0 : 100 - seg.offset;
            return (
              <circle
                key={idx}
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke={config.color}
                strokeWidth="5.5"
                strokeDasharray={dash}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            );
          })}
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-family-heading)' }}>{total}</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Products</p>
        </div>
      </div>

      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
        {donutSegments.map((seg, idx) => {
          const config = statusConfig[seg.name] || { color: 'var(--text-muted)' };
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: config.color }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>{seg.name}</span>
              </div>
              <span style={{ fontWeight: '600' }}>{seg.count} ({Math.round(seg.percent)}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Inventory by Category (Horizontal Bar Chart)
export const CategoryDistributionChart = ({ data = [] }) => {
  const maxQty = Math.max(...data.map(d => d.total_quantity || 0), 1);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((item, idx) => {
        const percent = ((item.total_quantity || 0) / maxQty) * 100;
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.category}</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                {item.total_quantity} units <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({item.product_count} items)</span>
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${percent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))',
                borderRadius: '4px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 3. Monthly Added Products (Vertical SVG Bar Chart)
export const MonthlyTrendChart = ({ data = [] }) => {
  // Ensure we have at least some columns
  const chartData = data.length > 0 ? data : [
    { month: 'N/A', count: 0 }
  ];

  const maxVal = Math.max(...chartData.map(d => d.count), 5);
  
  // SVG Dimensions
  const width = 500;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;
  
  const colWidth = graphWidth / chartData.length;

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-hover)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-hover)" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Y Axis Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + graphHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                className="chart-grid"
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 4} 
                textAnchor="end" 
                className="chart-text"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bar drawings */}
        {chartData.map((item, idx) => {
          const barHeight = (item.count / maxVal) * graphHeight;
          const x = paddingLeft + idx * colWidth + colWidth * 0.15;
          const y = height - paddingBottom - barHeight;
          const w = colWidth * 0.7;

          // Format month name (e.g. 2026-03 -> Mar)
          let label = item.month;
          if (item.month.includes('-')) {
            const parts = item.month.split('-');
            const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
            label = dateObj.toLocaleString('default', { month: 'short' });
          }

          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={w}
                height={Math.max(barHeight, 2)}
                rx="6"
                fill="url(#barGradient)"
                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.target.setAttribute('fill', 'url(#barGradientHover)');
                  e.target.setAttribute('style', 'transform: scaleY(1.02); transform-origin: bottom; transition: all 0.2s ease; cursor: pointer;');
                }}
                onMouseLeave={(e) => {
                  e.target.setAttribute('fill', 'url(#barGradient)');
                  e.target.setAttribute('style', 'transition: all 0.2s ease; cursor: pointer;');
                }}
              />
              {/* Tooltip value */}
              <text 
                x={x + w/2} 
                y={y - 6} 
                textAnchor="middle" 
                className="chart-text" 
                style={{ fontWeight: '600', fill: 'var(--text-primary)' }}
              >
                {item.count}
              </text>
              {/* X label */}
              <text 
                x={x + w/2} 
                y={height - paddingBottom + 16} 
                textAnchor="middle" 
                className="chart-text"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* X Axis Line */}
        <line 
          x1={paddingLeft} 
          y1={height - paddingBottom} 
          x2={width - paddingRight} 
          y2={height - paddingBottom} 
          className="chart-axis"
        />
      </svg>
    </div>
  );
};
