import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const { t, locale } = useTranslation();
  const { token } = useAuth();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch customers / فشل جلب بيانات العملاء');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('customersTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'سجل العملاء الذين قاموا بإتمام عمليات الشراء والطلب في المتجر' : 'Directory of customers who completed checkout orders in the store'}
          </span>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t('loggingIn')}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('customerName')}</th>
                  <th>{t('customerPhone')}</th>
                  <th>{locale === 'ar' ? 'العنوان الأخير' : 'Last Address'}</th>
                  <th>{t('ordersCount')}</th>
                  <th>{t('totalSpent')}</th>
                  <th>{t('customerSince')}</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((cust) => (
                    <tr key={cust.id}>
                      <td style={{ fontWeight: 'bold' }}>{cust.name}</td>
                      <td><code>{cust.phone}</code></td>
                      <td>{cust.address || '-'}</td>
                      <td style={{ fontWeight: 'bold' }}>{cust.orders_count}</td>
                      <td style={{ fontWeight: '700', color: 'var(--btn-order)' }}>
                        {cust.total_spent.toLocaleString()} {t('currency')}
                      </td>
                      <td>{new Date(cust.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                      {locale === 'ar' ? 'لا يوجد عملاء مسجلين حالياً' : 'No customers recorded yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
