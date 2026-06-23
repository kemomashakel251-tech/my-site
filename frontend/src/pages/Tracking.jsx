import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Tracking() {
  const { t, locale } = useTranslation();
  const [searchParams] = useSearchParams();
  const codeParam = searchParams.get('code');

  const [trackingCode, setTrackingCode] = useState(codeParam || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (codeParam) {
      handleTrack(codeParam);
    }
  }, [codeParam]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingCode) return;
    handleTrack(trackingCode);
  };

  const handleTrack = async (code) => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const response = await fetch(`/api/orders/track/${code.trim()}`);
      const data = await response.json();
      if (response.ok) {
        setOrder(data);
      } else {
        setError(t('noOrderFound'));
      }
    } catch (err) {
      console.error(err);
      setError('Connection error / خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storefront-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Small Header */}
      <header className="store-header">
        <div className="store-header-container">
          <div className="store-logo-section">
            <Link to="/" className="store-logo-link">🛍️ {t('storeName')}</Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '600px', width: '100%', margin: '40px auto', padding: '0 20px', flex: 1 }}>
        <div className="checkout-section" style={{ marginTop: 0 }}>
          <h2 className="checkout-title" style={{ fontSize: '1.6rem' }}>🔍 {t('trackTitle')}</h2>
          
          <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder={t('trackLabel')}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0 24px' }} disabled={loading}>
              <Search size={18} />
              <span>{loading ? '...' : t('trackBtn')}</span>
            </button>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading && <div style={{ textAlign: 'center', padding: '20px' }}>{t('loggingIn')}</div>}

          {/* Tracking Details */}
          {order && (
            <div style={{ animation: 'slideIn 0.3s ease-out' }}>
              {/* Status Banner */}
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                  {t('orderStatusLabel')}
                </span>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge badge-${order.status}`} style={{ padding: '8px 18px', fontSize: '1rem' }}>
                    {t(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} />
                    {t('orderNumber')}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{order.order_number}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} />
                    {t('orderDateLabel')}
                  </span>
                  <span>{new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>

              {/* Items List */}
              <h4 style={{ marginBottom: '10px', fontSize: '1.05rem' }}>📦 {t('orderItemsLabel')}</h4>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <table className="table" style={{ fontSize: '0.85rem' }}>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold' }}>{locale === 'ar' ? item.name_ar : item.name_en}</td>
                        <td style={{ textAlign: locale === 'ar' ? 'left' : 'right' }}>
                          {item.quantity} × {item.price} {t('currency')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations Block */}
              <div className="checkout-summary-card">
                <div className="summary-row subtotal">
                  <span>{t('subtotal')}:</span>
                  <span>{order.subtotal} {t('currency')}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="summary-row subtotal" style={{ color: 'var(--color-danger)' }}>
                    <span>{locale === 'ar' ? 'الخصم (كوبون):' : 'Discount (Coupon):'}</span>
                    <span>-{order.discount_amount} {t('currency')}</span>
                  </div>
                )}
                <div className="summary-row subtotal">
                  <span>{t('shippingFee')}:</span>
                  <span>
                    {order.shipping_fee > 0 ? (
                      `+${order.shipping_fee} ${t('currency')}`
                    ) : (
                      <span style={{ color: '#b45309', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        ({t('shippingNotice').split(' ').slice(1).join(' ')})
                      </span>
                    )}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>{t('total')}:</span>
                  <span>{order.total_amount} {t('currency')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', padding: '24px', backgroundColor: '#f8fafc', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        <p>© 2026 {t('storeName')}. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        <div style={{ marginTop: '8px' }}>
          <Link to="/" style={{ color: 'var(--btn-order)', fontWeight: 'bold' }}>🏠 {locale === 'ar' ? 'العودة للمتجر الرئيسي' : 'Back to Store'}</Link>
        </div>
      </footer>
    </div>
  );
}
