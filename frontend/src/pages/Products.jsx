import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Camera, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { t, locale } = useTranslation();
  const { token } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('5');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState('active');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products / فشل جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNameAr('');
    setNameEn('');
    setDescAr('');
    setDescEn('');
    setPrice('');
    setComparePrice('');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setStock('');
    setMinStock('5');
    setSku('');
    setStatus('active');
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setNameAr(product.name_ar);
    setNameEn(product.name_en);
    setDescAr(product.description_ar || '');
    setDescEn(product.description_en || '');
    setPrice(product.price.toString());
    setComparePrice(product.compare_at_price ? product.compare_at_price.toString() : '');
    setCategoryId(product.category_id || '');
    setStock(product.stock.toString());
    setMinStock(product.min_stock_alert.toString());
    setSku(product.sku || '');
    setStatus(product.status);
    setImageFile(null);
    setImagePreview(product.image_url);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Construct Multipart Form Data
    const formData = new FormData();
    formData.append('name_ar', nameAr);
    formData.append('name_en', nameEn);
    formData.append('description_ar', descAr);
    formData.append('description_en', descEn);
    formData.append('price', price);
    if (comparePrice) formData.append('compare_at_price', comparePrice);
    if (categoryId) formData.append('category_id', categoryId);
    formData.append('stock', stock);
    formData.append('min_stock_alert', minStock);
    if (sku) formData.append('sku', sku);
    formData.append('status', status);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Body is FormData, do not set Content-Type header manually (browser sets it automatically with boundary string)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingId ? t('settingsSaved') : 'Product created successfully / تم حفظ المنتج بنجاح');
        setIsModalOpen(false);
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error / خطأ في الاتصال');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setSuccess('Product deleted successfully / تم حذف المنتج');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('productsTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'إضافة وتعديل وحذف المنتجات وضبط المخازن' : 'Add, edit, delete products and adjust inventory levels'}
          </span>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>{t('addProduct')}</span>
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter and search bar */}
      <div className="dashboard-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>{locale === 'ar' ? 'تصفية حسب التصنيف:' : 'Filter by category:'}</span>
        <select 
          className="form-control" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: '240px' }}
        >
          <option value="">{locale === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {locale === 'ar' ? cat.name_ar : cat.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t('loggingIn')}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('productImage')}</th>
                  <th>{locale === 'ar' ? 'اسم المنتج' : 'Product Name'}</th>
                  <th>{t('sku')}</th>
                  <th>{t('productPrice')}</th>
                  <th>{t('stock')}</th>
                  <th>{t('productStatus')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                          <img 
                            src={prod.image_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ddd%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%23666%22>🛍️</text></svg>'} 
                            alt={prod.name_ar} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ddd%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%23666%22>🛍️</text></svg>';
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 'bold' }}>{locale === 'ar' ? prod.name_ar : prod.name_en}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {locale === 'ar' ? prod.category_name_ar : prod.category_name_en}
                          </span>
                        </div>
                      </td>
                      <td><code>{prod.sku || '-'}</code></td>
                      <td style={{ fontWeight: '700', color: 'var(--btn-order)' }}>{prod.price} {t('currency')}</td>
                      <td>
                        <span 
                          style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                          className={prod.stock <= prod.min_stock_alert ? 'color-danger' : ''}
                        >
                          {prod.stock}
                          {prod.stock <= prod.min_stock_alert && (
                            <AlertTriangle size={16} color="var(--color-danger)" title="Low stock alert!" />
                          )}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${prod.status === 'active' ? 'badge-delivered' : 'badge-pending'}`}>
                          {prod.status === 'active' ? t('active') : t('draft')}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="icon-btn" onClick={() => openEditModal(prod)}>
                            <Edit size={16} />
                          </button>
                          <button className="icon-btn danger" onClick={() => handleDelete(prod.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                      {locale === 'ar' ? 'لا توجد منتجات مسجلة حالياً' : 'No products found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>{editingId ? t('editProduct') : t('addProduct')}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="icon-btn"
                style={{ border: 'none', background: 'none' }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Product Name Arabic */}
                <div className="form-group">
                  <label className="form-label">{t('productNameAr')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={nameAr} 
                    onChange={(e) => setNameAr(e.target.value)} 
                    required 
                  />
                </div>

                {/* Product Name English */}
                <div className="form-group">
                  <label className="form-label">{t('productNameEn')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={nameEn} 
                    onChange={(e) => setNameEn(e.target.value)} 
                    required 
                  />
                </div>

                {/* Product Price */}
                <div className="form-group">
                  <label className="form-label">{t('productPrice')} ({t('currency')})</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                  />
                </div>

                {/* Compare Price */}
                <div className="form-group">
                  <label className="form-label">{t('comparePrice')} ({t('currency')})</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={comparePrice} 
                    onChange={(e) => setComparePrice(e.target.value)} 
                  />
                </div>

                {/* Category ID */}
                <div className="form-group">
                  <label className="form-label">{t('productCategory')}</label>
                  <select 
                    className="form-control" 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">{locale === 'ar' ? 'اختر التصنيف' : 'Select Category'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {locale === 'ar' ? cat.name_ar : cat.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU */}
                <div className="form-group">
                  <label className="form-label">{t('productSku')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={sku} 
                    onChange={(e) => setSku(e.target.value)} 
                  />
                </div>

                {/* Stock */}
                <div className="form-group">
                  <label className="form-label">{t('productStock')}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                  />
                </div>

                {/* Min Stock Alert */}
                <div className="form-group">
                  <label className="form-label">{t('productMinStock')}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={minStock} 
                    onChange={(e) => setMinStock(e.target.value)} 
                    required 
                  />
                </div>

                {/* Description Arabic */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{t('productDescAr')}</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={descAr} 
                    onChange={(e) => setDescAr(e.target.value)}
                  ></textarea>
                </div>

                {/* Description English */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{t('productDescEn')}</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={descEn} 
                    onChange={(e) => setDescEn(e.target.value)}
                  ></textarea>
                </div>

                {/* Product Image Upload */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{t('productImage')}</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Camera size={24} color="var(--text-secondary)" />
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="product-image-file" 
                        style={{ display: 'none' }} 
                        onChange={handleImageChange} 
                      />
                      <label htmlFor="product-image-file" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        {locale === 'ar' ? 'اختر صورة للمنتج' : 'Upload Image'}
                      </label>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {locale === 'ar' ? 'يُسمح بامتداد JPG, PNG, WEBP فقط، بحد أقصى 5 ميجابايت.' : 'Allowed extensions: JPG, PNG, WEBP. Max size: 5MB.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">{t('productStatus')}</label>
                  <select 
                    className="form-control" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">{t('active')}</option>
                    <option value="draft">{t('draft')}</option>
                  </select>
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
