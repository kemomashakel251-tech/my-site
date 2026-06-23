import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { t, locale } = useTranslation();
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Failed to fetch dashboard data / فشل جلب بيانات الإحصائيات');
        }
      } catch (err) {
        console.error(err);
        setError('Network error / خطأ في الاتصال بالشبكة');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loggingIn')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger" style={{ margin: '30px' }}>{error}</div>;
  }

  const { summary, salesChart, lowStockProducts, recentOrders, orderStatuses } = stats;

  // Find max sales value to scale the SVG chart bars correctly
  const maxSales = salesChart && salesChart.length > 0
    ? Math.max(...salesChart.map(item => item.sales))
    : 0;

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('navDashboard')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'نظرة عامة على مبيعات متجر Your Place والعمليات الجارية' : 'Overview of Your Place store sales and current operations'}
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stat-grid">
        <StatCard 
          label={t('totalSales')} 
          value={`${summary.totalSales.toLocaleString()} ${t('currency')}`}
          icon={DollarSign}
          themeClass="sales"
        />
        <StatCard 
          label={t('totalOrders')} 
          value={summary.totalOrders}
          icon={ShoppingBag}
          themeClass="orders"
        />
        <StatCard 
          label={t('lowStockAlerts')} 
          value={summary.lowStockAlerts}
          icon={AlertTriangle}
          themeClass="alerts"
        />
        <StatCard 
          label={t('activeCouponsCount')} 
          value={summary.activeCoupons}
          icon={CheckCircle}
          themeClass="coupons"
        />
      </div>

      {/* SVG Bar Chart */}
      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <div className="card-header-section">
          <h3>{t('salesChartTitle')}</h3>
        </div>
        
        {salesChart && salesChart.length > 0 ? (
          <div className="chart-container">
            {salesChart.map((item, idx) => {
              // Calculate height percentage for CSS
              const heightPercent = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
              // Format date for tooltip and axis label
              const formattedDate = new Date(item.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                month: 'short',
                day: 'numeric'
              });
              
              return (
                <div key={idx} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  >
                    <div className="chart-bar-tooltip">
                      {item.sales} {t('currency')} ({item.count} {t('navOrders')})
                    </div>
                  </div>
                  <span className="chart-bar-label">{formattedDate}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {locale === 'ar' ? 'لا توجد بيانات مبيعات كافية لعرض المخطط حتى الآن' : 'No sales data available for the chart yet'}
          </div>
        )}
      </div>

      {/* Lower Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card">
          <div className="card-header-section">
            <h3>{t('recentOrdersTitle')}</h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                  <th>{t('customerName')}</th>
                  <th>{t('total')}</th>
                  <th>{t('logStatus')}</th>
                  <th>{t('logDate')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 'bold' }}>{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td style={{ fontWeight: '700', color: 'var(--btn-order)' }}>
                        {order.total_amount} {t('currency')}
                      </td>
                      <td>
                        <span className={`badge badge-${order.status}`}>
                          {t(order.status)}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      {locale === 'ar' ? 'لا توجد طلبات مسجلة حالياً' : 'No orders recorded yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Order Status Breakdown Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Low Stock Products */}
          <div className="dashboard-card" style={{ flex: 1, marginBottom: 0 }}>
            <div className="card-header-section">
              <h3>{t('lowStockTitle')}</h3>
            </div>
            <div className="low-stock-list">
              {lowStockProducts && lowStockProducts.length > 0 ? (
                lowStockProducts.map((prod) => (
                  <div key={prod.id} className="low-stock-item">
                    <div className="low-stock-details">
                      <span className="low-stock-name">{locale === 'ar' ? prod.name_ar : prod.name_en}</span>
                      <span className="low-stock-sku">{t('sku')}: {prod.sku || '-'}</span>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <span className="low-stock-qty">
                        {prod.stock} / <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{prod.min_stock_alert}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {locale === 'ar' ? 'جميع المنتجات متوفرة بمخزون كافٍ ✅' : 'All products have sufficient stock ✅'}
                </div>
              )}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="dashboard-card" style={{ flex: 1, marginBottom: 0 }}>
            <div className="card-header-section">
              <h3>{t('orderStatusBreakdown')}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orderStatuses && orderStatuses.length > 0 ? (
                orderStatuses.map((stat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge badge-${stat.status}`}>{t(stat.status)}</span>
                    <span style={{ fontWeight: 'bold' }}>{stat.count}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {locale === 'ar' ? 'لا توجد طلبات مسجلة للتحليل' : 'No orders recorded for breakdown'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
