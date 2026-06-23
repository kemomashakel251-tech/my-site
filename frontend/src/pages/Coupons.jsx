import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Coupons() {
  const { t, locale } = useTranslation();
  const { token } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coupons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch coupons / فشل جلب الكوبونات');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinOrderValue('');
    setExpiryDate('');
    setUsageLimit('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          discount_type: discountType,
          discount_value: parseFloat(discountValue),
          min_order_value: minOrderValue ? parseFloat(minOrderValue) : 0,
          expiry_date: expiryDate || null,
          usage_limit: usageLimit ? parseInt(usageLimit) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Coupon created successfully / تم إنشاء كوبون الخصم بنجاح');
        setIsModalOpen(false);
        fetchCoupons();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to create coupon');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const response = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          active: coupon.active === 1 ? 0 : 1,
          usage_limit: coupon.usage_limit,
          expiry_date: coupon.expiry_date
        })
      });

      if (response.ok) {
        setSuccess('Coupon updated / تم تحديث حالة الكوبون');
        fetchCoupons();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا الكوبون؟' : 'Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Coupon deleted / تم حذف الكوبون');
        fetchCoupons();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('couponsTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'إنشاء أكواد خصم ونسب خصم للعملاء لتشجيع عمليات الشراء' : 'Create promo codes and discount percentages for customers to boost sales'}
          </span>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>{t('addCoupon')}</span>
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t('loggingIn')}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'كود الخصم' : 'Promo Code'}</th>
                  <th>{t('discountType')}</th>
                  <th>{t('discountValue')}</th>
                  <th>{t('minOrderValue')}</th>
                  <th>{t('usageCount')} / {locale === 'ar' ? 'الحد الأقصى' : 'Limit'}</th>
                  <th>{t('expiryDate')}</th>
                  <th>{t('couponStatus')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td style={{ fontWeight: 'bold' }}><code>{coupon.code}</code></td>
                      <td>{coupon.discount_type === 'percentage' ? t('percentage') : t('fixed')}</td>
                      <td style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                        {coupon.discount_value} {coupon.discount_type === 'percentage' ? '%' : t('currency')}
                      </td>
                      <td>{coupon.min_order_value} {t('currency')}</td>
                      <td>
                        {coupon.usage_count} / {coupon.usage_limit !== null ? coupon.usage_limit : '∞'}
                      </td>
                      <td>
                        {coupon.expiry_date 
                          ? new Date(coupon.expiry_date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') 
                          : '∞'}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleActive(coupon)}
                          className="icon-btn"
                          style={{ 
                            border: 'none', 
                            background: 'none', 
                            color: coupon.active === 1 ? 'var(--color-success)' : 'var(--color-danger)' 
                          }}
                          title={locale === 'ar' ? 'اضغط لتعديل النشاط' : 'Click to toggle status'}
                        >
                          {coupon.active === 1 ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </button>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="icon-btn danger" onClick={() => handleDelete(coupon.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                      {locale === 'ar' ? 'لا توجد كوبونات مسجلة حالياً' : 'No coupons found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{t('addCoupon')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="icon-btn" style={{ border: 'none', background: 'none' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('couponCodeLabel')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="e.g. EXTRA15"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('discountType')}</label>
                  <select 
                    className="form-control" 
                    value={discountType} 
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="percentage">{t('percentage')}</option>
                    <option value="fixed">{t('fixed')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('discountValue')}</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={discountValue} 
                    onChange={(e) => setDiscountValue(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('minOrderValue')} ({t('currency')})</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={minOrderValue} 
                    onChange={(e) => setMinOrderValue(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('expiryDate')}</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('usageLimit')}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={usageLimit} 
                    onChange={(e) => setUsageLimit(e.target.value)} 
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
