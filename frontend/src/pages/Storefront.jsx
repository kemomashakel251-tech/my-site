import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Star, AlertCircle, ShoppingCart, MessageCircle, Copy, CheckSquare } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Storefront() {
  const { t, locale } = useTranslation();
  const { id } = useParams(); // Optional product ID

  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checkout Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or whatsapp
  const [submitting, setSubmitting] = useState(false);
  
  // Coupon details
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState('percentage');
  const [couponError, setCouponError] = useState('');

  // Order Success states
  const [orderCreated, setOrderCreated] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // References for scrolling
  const checkoutFormRef = useRef(null);

  // Countdown timer states (default 12 hours)
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60);

  useEffect(() => {
    fetchProductAndSettings();
    
    // Countdown Interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id]);

  const fetchProductAndSettings = async () => {
    setLoading(true);
    try {
      // 1. Fetch Store Settings (WhatsApp number, store names)
      const settingsResp = await fetch('/api/settings');
      let settingsData = {};
      if (settingsResp.ok) {
        settingsData = await settingsResp.json();
        setSettings(settingsData);
      }

      // 2. Fetch Product (Either by route ID, or fetch the first active product in DB)
      let productUrl = '/api/products';
      if (id) {
        productUrl = `/api/products/${id}`;
      }
      
      const productResp = await fetch(productUrl);
      if (productResp.ok) {
        const data = await productResp.json();
        if (id) {
          setProduct(data);
        } else {
          // If fetched all, select the first active product
          const activeProducts = data.filter(p => p.status === 'active');
          if (activeProducts.length > 0) {
            setProduct(activeProducts[0]);
          } else {
            setError(locale === 'ar' ? 'لا توجد منتجات نشطة حالياً في المتجر' : 'No active products available in store');
          }
        }
      } else {
        setError(locale === 'ar' ? 'فشل تحميل بيانات المنتج' : 'Failed to load product details');
      }
    } catch (err) {
      console.error(err);
      setError(locale === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToCheckout = () => {
    checkoutFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    
    setCouponError('');
    try {
      const subtotal = product.price * quantity;
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: couponCode, subtotal })
      });

      const data = await response.json();

      if (response.ok) {
        setCouponApplied(true);
        setDiscountType(data.discount_type);
        setDiscountValue(data.discount_value);
      } else {
        setCouponApplied(false);
        setCouponError(locale === 'ar' ? 'الكوبون غير صالح أو انتهت صلاحيته' : data.message);
      }
    } catch (err) {
      console.error(err);
      setCouponError('Error validating coupon');
    }
  };

  // Calculate prices
  const subtotal = product ? product.price * quantity : 0;
  let discount = 0;
  if (couponApplied) {
    if (discountType === 'percentage') {
      discount = (subtotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }
    if (discount > subtotal) discount = subtotal;
  }
  const clientTotal = subtotal - discount; // Client subtotal/total on storefront, shipping manually set by admin

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress || quantity <= 0) {
      alert('Please fill out all fields / يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          quantity: quantity,
          product_id: product.id,
          coupon_code: couponApplied ? couponCode : null,
          payment_method: paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderCreated(data);
        
        // WhatsApp Redirect logic if paymentMethod is WhatsApp
        if (paymentMethod === 'whatsapp') {
          const waNum = settings.whatsapp_number || '201000000000';
          const prodName = locale === 'ar' ? product.name_ar : product.name_en;
          
          // Construct formatted message
          const msg = locale === 'ar'
            ? `السلام عليكم، أريد طلب منتج: ${prodName}
الكمية: ${quantity}
السعر: ${product.price} ${t('currency')}
المجموع: ${subtotal} ${t('currency')}
${couponApplied ? `الخصم: -${discount} ${t('currency')}\n` : ''}الإجمالي الفرعي للطلب: ${clientTotal} ${t('currency')}
(يضاف مصاريف الشحن حسب العنوان)

بيانات العميل:
الاسم: ${customerName}
الهاتف: ${customerPhone}
العنوان: ${customerAddress}

رقم الطلب: #${data.order_number}
كود التتبع: ${data.tracking_code}`
            : `Hello, I want to order product: ${prodName}
Quantity: ${quantity}
Price: ${product.price} ${t('currency')}
Subtotal: ${subtotal} ${t('currency')}
${couponApplied ? `Discount: -${discount} ${t('currency')}\n` : ''}Order Client Total: ${clientTotal} ${t('currency')}
(Shipping fees will be added depending on address)

Customer Info:
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

Order Number: #${data.order_number}
Tracking Code: ${data.tracking_code}`;

          // Open WhatsApp API link
          window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
        }
      } else {
        alert(data.message || 'Checkout failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during checkout');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (orderCreated) {
      navigator.clipboard.writeText(orderCreated.tracking_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#fff', minHeight: '100vh' }}>{t('loggingIn')}</div>;
  }

  if (error) {
    return (
      <div className="storefront-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="store-header">
          <div className="store-header-container">
            <div className="store-logo-section">
              <span className="store-logo-link">🛍️ {settings.store_name_ar || 'مكانك'}</span>
            </div>
          </div>
        </header>
        <div style={{ maxWidth: '600px', margin: '80px auto', padding: '20px', textAlign: 'center' }}>
          <div className="alert alert-danger">{error}</div>
          <Link to="/admin/dashboard" className="btn btn-secondary" style={{ marginTop: '16px' }}>
            {locale === 'ar' ? 'دخول لوحة التحكم' : 'Admin Login'}
          </Link>
        </div>
      </div>
    );
  }

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="storefront-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Sticky Header: Dark Blue, Logo left, WhatsApp right */}
      <header className="store-header">
        <div className="store-header-container">
          <div className="store-logo-section">
            <span className="store-logo-link">
              <span className="store-logo-emoji">🛍️</span>
              <span>{locale === 'ar' ? settings.store_name_ar : settings.store_name_en}</span>
            </span>
          </div>

          <button 
            className="store-whatsapp-btn"
            onClick={() => {
              const waNum = settings.whatsapp_number || '201000000000';
              window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(locale === 'ar' ? 'السلام عليكم، أريد الاستفسار عن منتجات متجر Your Place' : 'Hello, I want to inquire about Your Place products')}`, '_blank');
            }}
          >
            <MessageCircle size={18} />
            <span>{t('contactUs')}</span>
          </button>
        </div>
      </header>

      {/* 2. Order Success Screen */}
      {orderCreated ? (
        <div className="success-card">
          <div className="success-icon-wrapper">✓</div>
          <h2 className="success-title">{t('orderSuccess')}</h2>
          <p className="success-text">{t('successMsg')}</p>
          
          <div className="order-info-box">
            <div className="order-info-row">
              <span className="order-info-label">{t('orderNumber')}</span>
              <span className="order-info-value">{orderCreated.order_number}</span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">{t('trackingCode')}</span>
              <span className="order-info-value" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <code>{orderCreated.tracking_code}</code>
                <button 
                  onClick={copyToClipboard}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--btn-order)', display: 'inline-flex' }}
                  title={t('copyCode')}
                >
                  <Copy size={14} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {copiedCode ? t('copied') : t('copyCode')}
                  </span>
                </button>
              </span>
            </div>
            <div className="order-info-row">
              <span className="order-info-label">{t('total')}:</span>
              <span className="order-info-value" style={{ color: 'var(--btn-order)' }}>
                {orderCreated.total_amount} {t('currency')}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 'bold', marginTop: '6px', textAlign: 'center' }}>
              * {t('shippingNotice')} *
            </p>
          </div>

          <div className="success-actions">
            <Link to={`/track?code=${orderCreated.tracking_code}`} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              {t('trackMyOrder')}
            </Link>
            <button onClick={() => setOrderCreated(null)} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              {t('backToHome')}
            </button>
          </div>
        </div>
      ) : (
        /* 3. Main Landing Page */
        <main className="landing-container">
          <div className="product-hero-grid">
            {/* Gallery (Left/Right) */}
            <div className="product-gallery">
              <div className="product-main-image-wrapper">
                <img 
                  className="product-main-image"
                  src={product.image_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eee%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%23666%22>🛍️ Image</text></svg>'} 
                  alt={product.name_ar} 
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eee%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%23666%22>🛍️ Image</text></svg>';
                  }}
                />
              </div>
            </div>

            {/* Info details */}
            <div className="product-info-details">
              <span className="offer-badge">{t('specialOffer')}</span>
              
              <h1 className="product-title">
                {locale === 'ar' ? product.name_ar : product.name_en}
              </h1>

              <div className="product-rating">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="rating-count">(4.9/5) - {locale === 'ar' ? '128 تقييم حقيقي' : '128 Real Reviews'}</span>
              </div>

              <div className="product-prices">
                <span className="price-now">{product.price} {t('currency')}</span>
                {product.compare_at_price && (
                  <span className="price-before">{product.compare_at_price} {t('currency')}</span>
                )}
              </div>

              {/* Countdown Timer */}
              <div className="countdown-card">
                <span className="countdown-title">🔥 {t('timeLeft')}</span>
                <div className="countdown-timer">
                  <div className="timer-segment">
                    <span className="timer-number">{hours}</span>
                    <span className="timer-label">{t('hours')}</span>
                  </div>
                  <div className="timer-segment">
                    <span className="timer-number">{minutes}</span>
                    <span className="timer-label">{t('minutes')}</span>
                  </div>
                  <div className="timer-segment">
                    <span className="timer-number">{seconds}</span>
                    <span className="timer-label">{t('seconds')}</span>
                  </div>
                </div>
              </div>

              {/* Benefits list */}
              <div>
                <h4 style={{ marginBottom: '10px' }}>{t('benefitsTitle')}</h4>
                <ul className="benefits-list">
                  <li className="benefit-item">
                    <CheckSquare size={18} className="benefit-icon" />
                    <span>{t('benefit1')}</span>
                  </li>
                  <li className="benefit-item">
                    <CheckSquare size={18} className="benefit-icon" />
                    <span>{t('benefit2')}</span>
                  </li>
                  <li className="benefit-item">
                    <CheckSquare size={18} className="benefit-icon" />
                    <span>{t('benefit3')}</span>
                  </li>
                  <li className="benefit-item">
                    <CheckSquare size={18} className="benefit-icon" />
                    <span>{t('benefit4')}</span>
                  </li>
                </ul>
              </div>

              <p className="product-desc">
                {locale === 'ar' ? product.description_ar : product.description_en}
              </p>

              {/* Royal Blue button, rounded borders (اطلب الآن) */}
              <button onClick={handleScrollToCheckout} className="btn-order-now">
                {t('orderNow')}
              </button>
            </div>
          </div>

          {/* 4. Quick 4-field Checkout Form */}
          <section ref={checkoutFormRef} className="checkout-section">
            <h3 className="checkout-title">🛍️ {t('checkoutTitle')}</h3>
            
            <form onSubmit={handleCheckoutSubmit}>
              {/* Field 1: Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="customer-name">{t('fullName')} *</label>
                <input 
                  type="text"
                  id="customer-name"
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={locale === 'ar' ? 'اكتب اسمك الثلاثي لضمان الشحن' : 'Enter your full name'}
                  required
                />
              </div>

              {/* Field 2: Mobile Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="customer-phone">{t('mobileNumber')} *</label>
                <input 
                  type="tel"
                  id="customer-phone"
                  className="form-control"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 01012345678"
                  required
                />
              </div>

              {/* Field 3: Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="customer-address">{t('address')} *</label>
                <input 
                  type="text"
                  id="customer-address"
                  className="form-control"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={locale === 'ar' ? 'المحافظة - المركز/المدينة - اسم الشارع ورقم المنزل' : 'Detailed address for delivery'}
                  required
                />
              </div>

              {/* Field 4: Quantity */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="order-quantity">{t('quantity')} *</label>
                <select 
                  id="order-quantity"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>

              {/* Coupon input */}
              <div className="form-group" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                <label className="form-label">{t('couponCode')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    className="form-control"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. EXTRA10"
                    disabled={couponApplied}
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon} 
                    className="btn btn-secondary"
                    disabled={couponApplied || !couponCode}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {t('applyCoupon')}
                  </button>
                </div>
                {couponApplied && (
                  <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '6px' }}>
                    ✓ {t('couponSuccess')}
                  </p>
                )}
                {couponError && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '6px' }}>
                    ✕ {couponError}
                  </p>
                )}
              </div>

              {/* Calculation Panel */}
              <div className="checkout-summary-card">
                <div className="summary-row subtotal">
                  <span>{t('subtotal')}:</span>
                  <span>{subtotal} {t('currency')}</span>
                </div>
                
                {couponApplied && (
                  <div className="summary-row subtotal" style={{ color: 'var(--color-danger)' }}>
                    <span>{locale === 'ar' ? 'الخصم (كوبون):' : 'Discount (Coupon):'}</span>
                    <span>-{discount} {t('currency')}</span>
                  </div>
                )}

                {/* Shipping notice under subtotal calculations */}
                <div className="summary-row total">
                  <span>{t('total')}:</span>
                  <span>{clientTotal} {t('currency')}</span>
                </div>
                <div className="shipping-notice">
                  ⚠️ {t('shippingNotice')}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">{t('paymentMethod')}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')} 
                    />
                    <span>💵 {t('cod')}</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="whatsapp" 
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')} 
                    />
                    <span>💬 {t('whatsappOrder')}</span>
                  </label>
                </div>
              </div>

              {/* Submit Checkout */}
              <button 
                type="submit" 
                className="btn-order-now" 
                style={{ width: '100%', padding: '16px' }}
                disabled={submitting}
              >
                {submitting ? t('submitting') : t('submitOrder')}
              </button>
            </form>
          </section>

          {/* Testimonials */}
          <section className="reviews-section">
            <h3 className="reviews-title">⭐⭐⭐⭐⭐ {t('reviewsTitle')}</h3>
            <div className="reviews-grid">
              <div className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{locale === 'ar' ? 'محمد العتيبي' : 'Mohamed O.'}</span>
                  <span className="review-rating">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="review-text">"{t('review1')}"</p>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{locale === 'ar' ? 'أحمد عبد الله' : 'Ahmed A.'}</span>
                  <span className="review-rating">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="review-text">"{t('review2')}"</p>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{locale === 'ar' ? 'سارة محمود' : 'Sara M.'}</span>
                  <span className="review-rating">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="review-text">"{t('review3')}"</p>
              </div>
            </div>
          </section>

          {/* Sticky CTA bottom for mobile screens (max-width: 480px) */}
          <div className="sticky-mobile-cta" style={{ display: 'none' }}>
            <button onClick={handleScrollToCheckout} className="btn-order-now" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
              🛒 {t('orderNow')}
            </button>
          </div>
          
          <script>{`
            // Dynamic display toggle for sticky bottom CTA on mobile scroll
            window.addEventListener('scroll', () => {
              const cta = document.querySelector('.sticky-mobile-cta');
              const form = document.querySelector('.checkout-section');
              if (cta && form && window.innerWidth <= 480) {
                const rect = form.getBoundingClientRect();
                // Show sticky CTA if form is not in view and scrolled past hero
                if (window.scrollY > 200 && rect.top > window.innerHeight) {
                  cta.style.display = 'block';
                } else {
                  cta.style.display = 'none';
                }
              }
            });
          `}</script>
        </main>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', padding: '24px', backgroundColor: '#f8fafc', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        <p>© 2026 {locale === 'ar' ? settings.store_name_ar || 'مكانك' : settings.store_name_en || 'Your Place'}. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/track" style={{ color: 'var(--btn-order)', fontWeight: 'bold' }}>🔍 {t('trackTitle')}</Link>
          <Link to="/admin/dashboard" style={{ color: 'var(--text-secondary)' }}>🔒 {locale === 'ar' ? 'دخول الموظفين' : 'Staff Login'}</Link>
        </div>
      </footer>
    </div>
  );
}
