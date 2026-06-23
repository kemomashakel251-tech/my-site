import React from 'react';

export default function StatCard({ label, value, icon: Icon, themeClass }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className={`stat-icon ${themeClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
