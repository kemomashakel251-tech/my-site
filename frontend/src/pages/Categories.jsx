import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Categories() {
  const { t, locale } = useTranslation();
  const { token } = useAuth();
  
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
  const [slug, setSlug] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories / فشل جلب التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNameAr('');
    setNameEn('');
    setSlug('');
    setDescAr('');
    setDescEn('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setNameAr(cat.name_ar);
    setNameEn(cat.name_en);
    setSlug(cat.slug);
    setDescAr(cat.description_ar || '');
    setDescEn(cat.description_en || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name_ar: nameAr,
          name_en: nameEn,
          slug,
          description_ar: descAr,
          description_en: descEn
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Category saved successfully / تم حفظ التصنيف');
        setIsModalOpen(false);
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا التصنيف بالكامل؟' : 'Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Category deleted / تم حذف التصنيف');
        fetchCategories();
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
          <h2>{t('categoriesTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'تصنيف المنتجات يسهل التصفح للعملاء في المتجر' : 'Classifying products to simplify storefront browsing for customers'}
          </span>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>{t('addCategory')}</span>
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
                  <th>{locale === 'ar' ? 'اسم التصنيف' : 'Category Name'}</th>
                  <th>{t('categorySlug')}</th>
                  <th>{locale === 'ar' ? 'الوصف' : 'Description'}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 'bold' }}>
                        {locale === 'ar' ? cat.name_ar : cat.name_en}
                      </td>
                      <td><code>{cat.slug}</code></td>
                      <td>
                        {locale === 'ar' ? cat.description_ar || '-' : cat.description_en || '-'}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="icon-btn" onClick={() => openEditModal(cat)}>
                            <Edit size={16} />
                          </button>
                          <button className="icon-btn danger" onClick={() => handleDelete(cat.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>
                      {locale === 'ar' ? 'لا توجد تصنيفات مسجلة حالياً' : 'No categories found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingId ? locale === 'ar' ? 'تعديل تصنيف' : 'Edit Category' : t('addCategory')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="icon-btn" style={{ border: 'none', background: 'none' }}>✕</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('categoryNameAr')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={nameAr} 
                    onChange={(e) => setNameAr(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('categoryNameEn')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={nameEn} 
                    onChange={(e) => setNameEn(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('categorySlug')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    placeholder="e.g. smart-watches"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('categoryDescAr')}</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    value={descAr} 
                    onChange={(e) => setDescAr(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('categoryDescEn')}</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    value={descEn} 
                    onChange={(e) => setDescEn(e.target.value)}
                  ></textarea>
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
