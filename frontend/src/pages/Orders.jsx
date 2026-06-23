import React, { useState, useEffect } from 'react';
import { ShoppingBag, Edit, Trash2, Printer, Check, Phone, Eye } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { t, locale } = useTranslation();
  const { token, hasRole } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState('');

  // Details Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingFeeInput, setShippingFeeInput] = useState('');
  const [orderStatusSelect, setOrderStatusSelect] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders / فشل جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
        setShippingFeeInput(data.shipping_fee.toString());
        setOrderStatusSelect(data.status);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (statusVal) => {
    if (!selectedOrder) return;
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusVal })
      });
      
      if (response.ok) {
        setOrderStatusSelect(statusVal);
        setSuccess('Order status updated / تم تحديث حالة الطلب');
        // Refresh details
        openDetailsModal(selectedOrder.id);
        fetchOrders();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Shipping Fee update and Total Recalculation
  // "في لوحة التحكم خانة مصاريف الشحن يدوية لكل طلب، والإجمالي النهائي يتحدث بعد ما أكتبها. ممنوع أي رقم شحن ثابت في الكود"
  const handleSaveShippingFee = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    const feeVal = parseFloat(shippingFeeInput);
    if (isNaN(feeVal) || feeVal < 0) {
      alert('Please enter a valid non-negative shipping fee / يرجى إدخال قيمة مصاريف شحن صحيحة');
      return;
    }

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}/shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shipping_fee: feeVal })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('shippingSavedMsg'));
        // Refresh order details immediately to show the recalculated total
        openDetailsModal(selectedOrder.id);
        fetchOrders();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Connection error / خطأ في الاتصال بالخادم');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(t('orderDeleteConfirm'))) return;

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setSuccess('Order deleted successfully / تم حذف الطلب');
        setIsModalOpen(false);
        fetchOrders();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppCustomer = (phone, orderNum, total) => {
    // Format message: Arabic or English
    const msg = locale === 'ar'
      ? `مرحباً، عميلنا العزيز. بخصوص طلبك رقم ${orderNum} من متجر Your Place، نود تأكيد شحن طلبك بمجموع ${total} ${t('currency')}.`
      : `Hello. Regarding your order #${orderNum} from Your Place store, we would like to confirm shipping with total amount of ${total} ${t('currency')}.`;
    
    // Open Whatsapp URL: https://wa.me/number?text=message
    // Strip leading '+' or '00'
    const formattedPhone = phone.replace(/^(\+|00)/, '');
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('ordersTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'متابعة الطلبات وتحديث حالتها وتحديد مصاريف الشحن وإصدار الفواتير' : 'Track orders, update statuses, set shipping fees, and print invoices'}
          </span>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Options */}
      <div className="dashboard-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>{locale === 'ar' ? 'تصفية حسب الحالة:' : 'Filter by status:'}</span>
        <select 
          className="form-control" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: '240px' }}
        >
          <option value="">{locale === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
          <option value="pending">{t('pending')}</option>
          <option value="confirmed">{t('confirmed')}</option>
          <option value="shipped">{t('shipped')}</option>
          <option value="delivered">{t('delivered')}</option>
          <option value="cancelled">{t('cancelled')}</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t('loggingIn')}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{locale === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                  <th>{locale === 'ar' ? 'اسم العميل' : 'Customer Name'}</th>
                  <th>{t('mobileNumber')}</th>
                  <th>{t('total')}</th>
                  <th>{t('shippingFee')}</th>
                  <th>{t('logStatus')}</th>
                  <th>{t('logDate')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 'bold' }}>{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td><code>{order.customer_phone}</code></td>
                      <td style={{ fontWeight: '700', color: 'var(--btn-order)' }}>
                        {order.total_amount} {t('currency')}
                      </td>
                      <td>
                        {order.shipping_fee > 0 ? (
                          `${order.shipping_fee} ${t('currency')}`
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {locale === 'ar' ? 'لم تُحدد' : 'Not set'}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${order.status}`}>
                          {t(order.status)}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => openDetailsModal(order.id)}>
                          <Eye size={14} />
                          <span>{locale === 'ar' ? 'عرض' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                      {locale === 'ar' ? 'لا توجد طلبات مطابقة للبحث حالياً' : 'No matching orders found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice and Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal" id="invoice-printable" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>{t('orderDetails')}: {selectedOrder.order_number}</h3>
              <button onClick={() => setIsModalOpen(false)} className="icon-btn no-print" style={{ border: 'none', background: 'none' }}>✕</button>
            </div>

            <div className="modal-body">
              {/* Customer Info Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ marginBottom: '8px', color: 'var(--btn-order)' }}>{t('customerInfo')}</h4>
                  <p style={{ fontWeight: 'bold' }}>{selectedOrder.customer_name}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {selectedOrder.customer_phone}
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '8px', color: 'var(--btn-order)' }}>{locale === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}</h4>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{selectedOrder.customer_address}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {t('trackingCode')}: <code>{selectedOrder.tracking_code}</code>
                  </p>
                </div>
              </div>

              {/* Order Status Controller (RBAC-friendly) */}
              <div className="no-print" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <span style={{ fontWeight: 'bold' }}>{t('updateStatus')}:</span>
                <select 
                  className="form-control" 
                  value={orderStatusSelect} 
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  style={{ maxWidth: '200px' }}
                >
                  <option value="pending">{t('pending')}</option>
                  <option value="confirmed">{t('confirmed')}</option>
                  <option value="shipped">{t('shipped')}</option>
                  <option value="delivered">{t('delivered')}</option>
                  <option value="cancelled">{t('cancelled')}</option>
                </select>
                
                {/* Contact Customer */}
                <button 
                  onClick={() => handleWhatsAppCustomer(selectedOrder.customer_phone, selectedOrder.order_number, selectedOrder.total_amount)}
                  className="btn btn-success"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                >
                  <Phone size={14} />
                  <span>{t('whatsappMessageSend')}</span>
                </button>
              </div>

              {/* Dynamic Shipping Fee Manual Input */}
              {/* "في لوحة التحكم خانة مصاريف الشحن يدوية لكل طلب، والإجمالي النهائي يتحدث بعد ما أكتبها. ممنوع أي رقم شحن ثابت في الكود" */}
              <div className="no-print" style={{ border: '1.5px dashed var(--border-color)', padding: '16px', borderRadius: '12px', marginBottom: '20px', backgroundColor: 'rgba(37, 99, 235, 0.03)' }}>
                <h4 style={{ marginBottom: '10px' }}>📦 {locale === 'ar' ? 'حساب تكاليف الشحن وتحديث الفاتورة' : 'Calculate Shipping and Update Invoice'}</h4>
                <form onSubmit={handleSaveShippingFee} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>{t('shippingInputLabel')}</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      value={shippingFeeInput} 
                      onChange={(e) => setShippingFeeInput(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 16px' }}>
                    <Check size={16} />
                    <span>{t('saveShippingBtn')}</span>
                  </button>
                </form>
              </div>

              {/* Items List */}
              <h4 style={{ marginBottom: '10px' }}>{t('orderItemsLabel')}</h4>
              <table className="table" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th>{locale === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th>{t('sku')}</th>
                    <th>{t('productPrice')}</th>
                    <th>{t('quantity')}</th>
                    <th>{locale === 'ar' ? 'المجموع' : 'Subtotal'}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{locale === 'ar' ? item.name_ar : item.name_en}</td>
                      <td><code>{item.sku || '-'}</code></td>
                      <td>{item.price} {t('currency')}</td>
                      <td>{item.quantity}</td>
                      <td style={{ fontWeight: 'bold' }}>{item.price * item.quantity} {t('currency')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations Block */}
              <div style={{ width: '100%', maxWidth: '280px', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{t('subtotal')}:</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedOrder.subtotal} {t('currency')}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-danger)' }}>
                    <span>{locale === 'ar' ? 'الخصم (كوبون):' : 'Discount (Coupon):'}</span>
                    <span>-{selectedOrder.discount_amount} {t('currency')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{t('shippingFee')}:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {selectedOrder.shipping_fee > 0 ? (
                      `+${selectedOrder.shipping_fee} ${t('currency')}`
                    ) : (
                      `0.00 ${t('currency')}`
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: 'var(--btn-order)', borderTop: '1px double var(--border-color)', paddingTop: '8px' }}>
                  <span>{t('total')}:</span>
                  <span style={{ fontWeight: '900' }}>{selectedOrder.total_amount} {t('currency')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer no-print">
              {hasRole(['admin']) && (
                <button 
                  onClick={() => handleDeleteOrder(selectedOrder.id)} 
                  className="btn btn-danger" 
                  style={{ marginRight: 'auto' }}
                >
                  <Trash2 size={16} />
                  <span>{locale === 'ar' ? 'حذف الطلب' : 'Delete Order'}</span>
                </button>
              )}
              <button onClick={handlePrint} className="btn btn-secondary">
                <Printer size={16} />
                <span>{t('printInvoice')}</span>
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-primary">
                ✕ {locale === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS overrides for print media so print invoice looks clean */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-printable, #invoice-printable * {
            visibility: visible;
          }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
