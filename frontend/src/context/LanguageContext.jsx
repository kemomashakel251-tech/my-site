import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ar: {
    // Header
    storeName: 'مكانك',
    contactUs: 'تواصل معنا',
    orderNow: 'اطلب الآن',
    
    // Storefront
    specialOffer: 'عرض خاص ومحدود!',
    timeLeft: 'ينتهي العرض خلال:',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    currency: 'جنيه',
    description: 'الوصف',
    benefitsTitle: 'لماذا تشتري هذا المنتج؟',
    benefit1: 'شحن سريع لجميع المحافظات',
    benefit2: 'الدفع عند الاستلام بعد معاينة المنتج',
    benefit3: 'ضمان استرجاع واستبدال مجاني خلال 14 يوم',
    benefit4: 'خدمة عملاء متوفرة على مدار الساعة',
    reviewsTitle: 'آراء عملائنا الكرام',
    review1: 'المنتج رائع جداً والتوصيل كان سريع جداً والتغليف ممتاز، أنصح بالتعامل معهم!',
    review2: 'جودة ممتازة وسعر مناسب جداً، خدمة العملاء سريعة الرد وحلوا لي مشكلة المقاس بكل ذوق.',
    review3: 'سهولة مذهلة في الطلب! كتبت بياناتي وضغطت على زر واتساب، وتواصلوا معي فوراً لتأكيد العنوان.',
    
    // Checkout Form
    checkoutTitle: 'نموذج الطلب السريع',
    fullName: 'الاسم الكامل',
    mobileNumber: 'رقم الهاتف / الموبايل',
    address: 'العنوان بالتفصيل (المحافظة/المدينة/الشارع)',
    quantity: 'الكمية المطلوبة',
    subtotal: 'المجموع الفرعي (المنتجات)',
    shippingFee: 'مصاريف الشحن',
    shippingNotice: 'يضاف مصاريف الشحن حسب العنوان',
    total: 'الإجمالي النهائي',
    paymentMethod: 'طريقة الدفع المفضلّة',
    cod: 'الدفع عند الاستلام (COD)',
    whatsappOrder: 'إتمام الطلب وتأكيده عبر واتساب مباشر',
    submitOrder: 'تأكيد وشراء الطلب الآن 🛍️',
    couponCode: 'هل لديك كوبون خصم؟',
    applyCoupon: 'تطبيق',
    couponSuccess: 'تم تطبيق الكوبون بنجاح!',
    couponError: 'الكوبون غير صالح أو منتهي الصلاحية',
    submitting: 'جاري إرسال الطلب...',
    
    // Success Screen
    orderSuccess: 'تهانينا! تم تسجيل طلبك بنجاح',
    successMsg: 'سيتواصل معك فريق خدمة العملاء خلال ساعات لتأكيد الشحن وتوصيل الطلب.',
    orderNumber: 'رقم الطلب:',
    trackingCode: 'كود التتبع للطلب:',
    copyCode: 'نسخ الكود',
    copied: 'تم النسخ!',
    trackMyOrder: 'تتبع حالة طلبي الآن',
    backToHome: 'العودة للمتجر',

    // Order Tracking Page
    trackTitle: 'تتبع حالة طلبك',
    trackLabel: 'أدخل كود تتبع الطلب (TR-XXXXXX)',
    trackBtn: 'تتبع الآن',
    orderStatusLabel: 'حالة الطلب الحالية:',
    orderDateLabel: 'تاريخ الطلب:',
    orderItemsLabel: 'المنتجات المطلوبة',
    noOrderFound: 'لم يتم العثور على أي طلب بالكود المدخل، يرجى التحقق وإعادة المحاولة.',
    
    // Statuses
    pending: 'معلق (بانتظار التأكيد)',
    confirmed: 'تم التأكيد (جاري التجهيز)',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل بنجاح',
    cancelled: 'ملغي',
    
    // Admin Login
    loginTitle: 'تسجيل دخول الإدارة',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginBtn: 'تسجيل الدخول',
    loggingIn: 'جاري التحقق...',
    loginError: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    
    // Sidebar
    navDashboard: 'لوحة التحكم',
    navProducts: 'إدارة المنتجات',
    navCategories: 'التصنيفات',
    navOrders: 'إدارة الطلبات',
    navCustomers: 'إدارة العملاء',
    navCoupons: 'كوبونات الخصم',
    navSettings: 'الإعدادات العامة',
    navLogs: 'سجلات الأمان',
    logout: 'تسجيل الخروج',
    
    // Dashboard Stats
    totalSales: 'إجمالي المبيعات المؤكدة',
    totalOrders: 'إجمالي عدد الطلبات',
    lowStockAlerts: 'تنبيهات المخزون المنخفض',
    activeCouponsCount: 'الكوبونات النشطة',
    salesChartTitle: 'مخطط المبيعات اليومية (آخر 15 يوم)',
    recentOrdersTitle: 'أحدث 5 طلبات مسجلة',
    lowStockTitle: 'المنتجات التي قاربت على النفاد',
    orderStatusBreakdown: 'تحليل حالات الطلبات',
    sku: 'الرمز (SKU)',
    stock: 'المخزون الحالي',
    alertLimit: 'حد التنبيه',
    actions: 'إجراءات',
    
    // Products Page
    productsTitle: 'إدارة المنتجات',
    addProduct: 'إضافة منتج جديد',
    editProduct: 'تعديل المنتج',
    productNameAr: 'اسم المنتج (بالعربية)',
    productNameEn: 'اسم المنتج (بالإنجليزية)',
    productPrice: 'السعر الحالي',
    comparePrice: 'السعر السابق (للخصم)',
    productCategory: 'تصنيف المنتج',
    productStock: 'الكمية في المخزن',
    productMinStock: 'الحد الأدنى للتنبيه عند النفاد',
    productSku: 'رمز المنتج (SKU)',
    productDescAr: 'وصف المنتج (بالعربية)',
    productDescEn: 'وصف المنتج (بالإنجليزية)',
    productImage: 'صورة المنتج',
    productStatus: 'حالة المنتج',
    active: 'نشط (معروض في المتجر)',
    draft: 'مسودة (مخفي)',
    save: 'حفظ البيانات',
    cancel: 'إلغاء',
    deleteConfirm: 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
    
    // Categories Page
    categoriesTitle: 'إدارة تصنيفات المنتجات',
    addCategory: 'إضافة تصنيف جديد',
    categoryNameAr: 'اسم التصنيف (بالعربية)',
    categoryNameEn: 'اسم التصنيف (بالإنجليزية)',
    categorySlug: 'رابط التصنيف (Slug)',
    categoryDescAr: 'وصف التصنيف (بالعربية)',
    categoryDescEn: 'وصف التصنيف (بالإنجليزية)',
    
    // Orders Page
    ordersTitle: 'إدارة ومتابعة الطلبات',
    orderDetails: 'تفاصيل فاتورة الطلب',
    customerInfo: 'بيانات العميل',
    notes: 'ملاحظات العميل / العنوان الإضافي',
    updateStatus: 'تحديث حالة الطلب',
    shippingInputLabel: 'أدخل مصاريف الشحن يدوياً:',
    saveShippingBtn: 'حفظ وتحديث الإجمالي',
    shippingSavedMsg: 'تم تحديث مصاريف الشحن وإعادة حساب الإجمالي النهائي بنجاح.',
    orderDeleteConfirm: 'هل أنت متأكد من حذف هذا الطلب بالكامل؟',
    printInvoice: 'طباعة الفاتورة',
    whatsappMessageSend: 'مراسلة العميل واتساب',
    
    // Customers Page
    customersTitle: 'إدارة ملفات العملاء',
    customerName: 'اسم العميل',
    customerPhone: 'رقم الهاتف',
    ordersCount: 'عدد الطلبات',
    totalSpent: 'إجمالي الإنفاق',
    customerSince: 'عميل منذ',
    
    // Coupons Page
    couponsTitle: 'إدارة كوبونات الخصم',
    addCoupon: 'إنشاء كوبون خصم جديد',
    couponCodeLabel: 'رمز الكوبون (مثال: SAVE20)',
    discountType: 'نوع الخصم',
    percentage: 'نسبة مئوية (%)',
    fixed: 'مبلغ ثابت',
    discountValue: 'قيمة الخصم',
    minOrderValue: 'الحد الأدنى لقيمة الطلب لتطبيق الكوبون',
    expiryDate: 'تاريخ انتهاء الصلاحية (اختياري)',
    usageLimit: 'الحد الأقصى لمرات الاستخدام (اختياري)',
    usageCount: 'عدد مرات الاستخدام الحالية',
    couponStatus: 'حالة الكوبون',
    
    // Settings Page
    settingsTitle: 'إعدادات المنصة وإدارة الموظفين',
    settingsSaved: 'تم حفظ إعدادات المتجر بنجاح.',
    storeSettingsSection: 'إعدادات المتجر الأساسية',
    whatsappSettingLabel: 'رقم واتساب لاستقبال الطلبات (صيغة دولية بدون + أو 00، مثل 201023456789):',
    currencyArLabel: 'اسم العملة بالعربية (مثل: جنيه، ريال):',
    currencyEnLabel: 'اسم العملة بالإنجليزية (مثل: EGP, SAR):',
    staffManagementSection: 'إدارة حسابات الموظفين والصلاحيات (RBAC)',
    addNewStaff: 'إضافة موظف جديد',
    staffUsername: 'اسم المستخدم للدخول',
    staffPassword: 'كلمة المرور (اتركها فارغة للتعديل بدون تغيير)',
    staffEmail: 'البريد الإلكتروني للموظف',
    staffRole: 'الصلاحية والوظيفة',
    roleAdmin: 'مسؤول نظام (Admin) - تحكم كامل وحماية',
    roleManager: 'مدير عمليات (Manager) - إدارة المنتجات والطلبات',
    roleStaff: 'موظف (Staff) - متابعة الطلبات والمخازن فقط',
    
    // Security Logs Page
    logsTitle: 'سجلات الأمان وتتبع محاولات الاختراق (Audit Logs)',
    logAction: 'نوع العملية',
    logDetails: 'تفاصيل العملية',
    logUser: 'المستخدم / المسؤول',
    logIp: 'عنوان IP',
    logDate: 'التوقيت والتاريخ',
    logStatus: 'الحالة',
    success: 'ناجحة',
    failed: 'فاشلة / تم التصدي لها'
  },
  en: {
    // Header
    storeName: 'Your Place',
    contactUs: 'Contact Us',
    orderNow: 'Order Now',
    
    // Storefront
    specialOffer: 'Special Limited Offer!',
    timeLeft: 'Offer ends in:',
    hours: 'Hours',
    minutes: 'Mins',
    seconds: 'Secs',
    currency: 'EGP',
    description: 'Description',
    benefitsTitle: 'Why buy from us?',
    benefit1: 'Fast shipping to all cities',
    benefit2: 'Cash on delivery after inspection',
    benefit3: 'Free 14-day replacement & return guarantee',
    benefit4: '24/7 customer service availability',
    reviewsTitle: 'Our Customer Reviews',
    review1: 'The product is very wonderful, the delivery was very fast and packaging is great, I recommend them!',
    review2: 'Excellent quality and very suitable price, support is fast and solved my size exchange nicely.',
    review3: 'Incredible checkout simplicity! Wrote my info, clicked WhatsApp, and they contacted me instantly.',
    
    // Checkout Form
    checkoutTitle: 'Quick Checkout Form',
    fullName: 'Full Name',
    mobileNumber: 'Mobile / Phone Number',
    address: 'Detailed Address (City/Street/Building)',
    quantity: 'Requested Quantity',
    subtotal: 'Products Subtotal',
    shippingFee: 'Shipping Fees',
    shippingNotice: 'Shipping fees will be added depending on address',
    total: 'Final Total',
    paymentMethod: 'Preferred Payment Method',
    cod: 'Cash on Delivery (COD)',
    whatsappOrder: 'Complete and confirm order via WhatsApp',
    submitOrder: 'Confirm and Buy Now 🛍️',
    couponCode: 'Do you have a coupon code?',
    applyCoupon: 'Apply',
    couponSuccess: 'Coupon applied successfully!',
    couponError: 'Invalid or expired coupon code',
    submitting: 'Sending your order...',
    
    // Success Screen
    orderSuccess: 'Congratulations! Your order has been placed',
    successMsg: 'Our customer support team will contact you in a few hours to confirm shipment.',
    orderNumber: 'Order Number:',
    trackingCode: 'Order Tracking Code:',
    copyCode: 'Copy Code',
    copied: 'Copied!',
    trackMyOrder: 'Track My Order',
    backToHome: 'Back to Store',

    // Order Tracking Page
    trackTitle: 'Track Your Order',
    trackLabel: 'Enter Order Tracking Code (TR-XXXXXX)',
    trackBtn: 'Track Now',
    orderStatusLabel: 'Current Status:',
    orderDateLabel: 'Order Date:',
    orderItemsLabel: 'Ordered Items',
    noOrderFound: 'No order found with the provided code. Please verify and try again.',
    
    // Statuses
    pending: 'Pending (Awaiting Confirmation)',
    confirmed: 'Confirmed (Preparing)',
    shipped: 'Shipped',
    delivered: 'Delivered successfully',
    cancelled: 'Cancelled',
    
    // Admin Login
    loginTitle: 'Admin Login Panel',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Login',
    loggingIn: 'Checking...',
    loginError: 'Invalid username or password',
    
    // Sidebar
    navDashboard: 'Dashboard',
    navProducts: 'Products',
    navCategories: 'Categories',
    navOrders: 'Orders',
    navCustomers: 'Customers',
    navCoupons: 'Coupons',
    navSettings: 'Settings',
    navLogs: 'Security Logs',
    logout: 'Logout',
    
    // Dashboard Stats
    totalSales: 'Confirmed Total Sales',
    totalOrders: 'Total Orders Count',
    lowStockAlerts: 'Low Stock Alerts',
    activeCouponsCount: 'Active Coupons',
    salesChartTitle: 'Daily Sales Chart (Last 15 Days)',
    recentOrdersTitle: 'Recent 5 Orders',
    lowStockTitle: 'Products Low in Stock',
    orderStatusBreakdown: 'Order Status Breakdown',
    sku: 'SKU',
    stock: 'Current Stock',
    alertLimit: 'Alert Limit',
    actions: 'Actions',
    
    // Products Page
    productsTitle: 'Product Management',
    addProduct: 'Add New Product',
    editProduct: 'Edit Product',
    productNameAr: 'Product Name (Arabic)',
    productNameEn: 'Product Name (English)',
    productPrice: 'Current Price',
    comparePrice: 'Previous Price (for discount)',
    productCategory: 'Product Category',
    productStock: 'Stock Quantity',
    productMinStock: 'Alert threshold on low stock',
    productSku: 'Product SKU',
    productDescAr: 'Product Description (Arabic)',
    productDescEn: 'Product Description (English)',
    productImage: 'Product Image',
    productStatus: 'Product Status',
    active: 'Active (Visible in Store)',
    draft: 'Draft (Hidden)',
    save: 'Save Data',
    cancel: 'Cancel',
    deleteConfirm: 'Are you sure you want to delete this product? This action cannot be undone.',
    
    // Categories Page
    categoriesTitle: 'Product Categories',
    addCategory: 'Add New Category',
    categoryNameAr: 'Category Name (Arabic)',
    categoryNameEn: 'Category Name (English)',
    categorySlug: 'Category Slug',
    categoryDescAr: 'Category Description (Arabic)',
    categoryDescEn: 'Category Description (English)',
    
    // Orders Page
    ordersTitle: 'Order Management',
    orderDetails: 'Order Invoice Details',
    customerInfo: 'Customer Information',
    notes: 'Customer Notes / Extra Address info',
    updateStatus: 'Update Order Status',
    shippingInputLabel: 'Enter shipping fee manually:',
    saveShippingBtn: 'Save & Update Total',
    shippingSavedMsg: 'Shipping fee updated and total recalculated successfully.',
    orderDeleteConfirm: 'Are you sure you want to delete this order completely?',
    printInvoice: 'Print Invoice',
    whatsappMessageSend: 'Contact Customer via WhatsApp',
    
    // Customers Page
    customersTitle: 'Customer Accounts',
    customerName: 'Customer Name',
    customerPhone: 'Phone Number',
    ordersCount: 'Orders Count',
    totalSpent: 'Total Spent',
    customerSince: 'Customer Since',
    
    // Coupons Page
    couponsTitle: 'Discount Coupons',
    addCoupon: 'Create New Coupon',
    couponCodeLabel: 'Coupon Code (e.g. SAVE20)',
    discountType: 'Discount Type',
    percentage: 'Percentage (%)',
    fixed: 'Fixed Amount',
    discountValue: 'Discount Value',
    minOrderValue: 'Minimum Order Value to apply',
    expiryDate: 'Expiry Date (Optional)',
    usageLimit: 'Usage Limit count (Optional)',
    usageCount: 'Current usages',
    couponStatus: 'Coupon Status',
    
    // Settings Page
    settingsTitle: 'Settings & Staff Management',
    settingsSaved: 'Store settings saved successfully.',
    storeSettingsSection: 'Basic Store Settings',
    whatsappSettingLabel: 'WhatsApp number to receive orders (International format, e.g. 201023456789):',
    currencyArLabel: 'Currency Name in Arabic (e.g., جنيه, ريال):',
    currencyEnLabel: 'Currency Name in English (e.g., EGP, SAR):',
    staffManagementSection: 'Staff Accounts & Roles (RBAC)',
    addNewStaff: 'Add New Staff member',
    staffUsername: 'Access Username',
    staffPassword: 'Password (leave blank if updating without change)',
    staffEmail: 'Staff Email address',
    staffRole: 'Staff Permission Role',
    roleAdmin: 'System Admin - Full Access & Security logs',
    roleManager: 'Operations Manager - Manage Products & Orders',
    roleStaff: 'Staff Employee - Handle orders and inventory',
    
    // Security Logs Page
    logsTitle: 'Security Audit & Intrusion Tracking (Audit Logs)',
    logAction: 'Action Logged',
    logDetails: 'Details',
    logUser: 'Responsible Staff',
    logIp: 'IP Address',
    logDate: 'Date & Time',
    logStatus: 'Status',
    success: 'Success',
    failed: 'Blocked / Failed'
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', locale);
    htmlElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  const toggleLanguage = () => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key) => {
    if (!translations[locale] || !translations[locale][key]) {
      // Fallback to ar, then empty
      return translations['ar'][key] || key;
    }
    return translations[locale][key];
  };

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
export default LanguageContext;
