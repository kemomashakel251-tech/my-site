import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { t, locale } = useTranslation();
  const { token, user: currentUser, hasRole } = useAuth();

  // General settings state
  const [storeNameAr, setStoreNameAr] = useState('');
  const [storeNameEn, setStoreNameEn] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [currencyAr, setCurrencyAr] = useState('');
  const [currencyEn, setCurrencyEn] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Staff accounts state (Admin only)
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);

  // Staff form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('staff');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    fetchSettings();
    if (hasRole(['admin'])) {
      fetchStaff();
    }
  }, []);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setStoreNameAr(data.store_name_ar || '');
        setStoreNameEn(data.store_name_en || '');
        setWhatsappNumber(data.whatsapp_number || '');
        setCurrencyAr(data.currency_ar || '');
        setCurrencyEn(data.currency_en || '');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchStaff = async () => {
    setStaffLoading(true);
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          store_name_ar: storeNameAr,
          store_name_en: storeNameEn,
          whatsapp_number: whatsappNumber,
          currency_ar: currencyAr,
          currency_en: currencyEn
        })
      });

      if (response.ok) {
        setSuccess(t('settingsSaved'));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  const openAddStaffModal = () => {
    setEditingStaffId(null);
    setUsername('');
    setPassword('');
    setEmail('');
    setFullName('');
    setRole('staff');
    setStatus('active');
    setIsStaffModalOpen(true);
  };

  const openEditStaffModal = (member) => {
    setEditingStaffId(member.id);
    setUsername(member.username);
    setPassword(''); // Reset, only fill to change password
    setEmail(member.email);
    setFullName(member.full_name);
    setRole(member.role);
    setStatus(member.status);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    setError('');

    const staffData = {
      username,
      email,
      full_name: fullName,
      role,
      status
    };

    // Only include password if provided
    if (password) {
      staffData.password = password;
    } else if (!editingStaffId) {
      alert('Password is required for new users / كلمة المرور مطلوبة للموظف الجديد');
      return;
    }

    try {
      const url = editingStaffId ? `/api/users/${editingStaffId}` : '/api/users';
      const method = editingStaffId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(staffData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingStaffId ? 'Staff updated / تم تعديل الموظف' : 'Staff created / تم إضافة الموظف الجديد');
        setIsStaffModalOpen(false);
        fetchStaff();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (parseInt(id) === currentUser.id) {
      alert(t('roleAdmin').split(' - ')[0] + ': ' + t('cancel'));
      return;
    }
    if (!window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا الموظف نهائياً؟' : 'Are you sure you want to delete this staff member?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Staff deleted successfully / تم حذف الموظف');
        fetchStaff();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('settingsTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'تعديل الإعدادات وإدارة صلاحيات الموظفين والمشرفين' : 'Configure store preferences and manage system credentials'}
          </span>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: hasRole(['admin']) ? '1.1fr 0.9fr' : '1fr', gap: '24px' }}>
        {/* Store Settings Form (Admin/Manager) */}
        <div className="dashboard-card" style={{ marginBottom: 0 }}>
          <div className="card-header-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SettingsIcon size={20} />
              <span>{t('storeSettingsSection')}</span>
            </h3>
          </div>

          {settingsLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>{t('loggingIn')}</div>
          ) : (
            <form onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label className="form-label">{locale === 'ar' ? 'اسم المتجر (بالعربية)' : 'Store Name (Arabic)'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={storeNameAr} 
                  onChange={(e) => setStoreNameAr(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{locale === 'ar' ? 'اسم المتجر (بالإنجليزية)' : 'Store Name (English)'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={storeNameEn} 
                  onChange={(e) => setStoreNameEn(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('whatsappSettingLabel')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={whatsappNumber} 
                  onChange={(e) => setWhatsappNumber(e.target.value)} 
                  placeholder="201012345678"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('currencyArLabel')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={currencyAr} 
                  onChange={(e) => setCurrencyAr(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('currencyEnLabel')}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={currencyEn} 
                  onChange={(e) => setCurrencyEn(e.target.value)} 
                  required 
                />
              </div>

              {hasRole(['admin']) && (
                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  {t('save')}
                </button>
              )}
            </form>
          )}
        </div>

        {/* Staff Management List (Admin Only) */}
        {hasRole(['admin']) && (
          <div className="dashboard-card" style={{ marginBottom: 0 }}>
            <div className="card-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} />
                <span>{t('staffManagementSection')}</span>
              </h3>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={openAddStaffModal}>
                <Plus size={14} />
                <span>{t('addNewStaff').split(' ')[0]}</span>
              </button>
            </div>

            {staffLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>{t('loggingIn')}</div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>{t('username')}</th>
                      <th>{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                      <th>{locale === 'ar' ? 'الدور' : 'Role'}</th>
                      <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member) => (
                      <tr key={member.id}>
                        <td style={{ fontWeight: 'bold' }}>{member.username}</td>
                        <td>{member.full_name}</td>
                        <td>
                          <span className={`badge ${member.role === 'admin' ? 'badge-delivered' : member.role === 'manager' ? 'badge-confirmed' : 'badge-pending'}`}>
                            {member.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${member.status === 'active' ? 'badge-delivered' : 'badge-cancelled'}`}>
                            {member.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="icon-btn" onClick={() => openEditStaffModal(member)}>
                              <Edit size={14} />
                            </button>
                            {member.id !== currentUser.id && (
                              <button className="icon-btn danger" onClick={() => handleDeleteStaff(member.id)}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff Modal (Admin Only) */}
      {isStaffModalOpen && hasRole(['admin']) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingStaffId ? locale === 'ar' ? 'تعديل موظف' : 'Edit Staff member' : t('addNewStaff')}</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="icon-btn" style={{ border: 'none', background: 'none' }}>✕</button>
            </div>

            <form onSubmit={handleSaveStaff}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('fullName')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('username')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    disabled={editingStaffId !== null} // Cannot rename username
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('staffEmail')}</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {t('password')} {editingStaffId && `(${t('staffPassword')})`}
                  </label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required={editingStaffId === null} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('staffRole')}</label>
                  <select 
                    className="form-control" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">ADMIN (مسؤول نظام)</option>
                    <option value="manager">MANAGER (مدير عمليات)</option>
                    <option value="staff">STAFF (موظف)</option>
                  </select>
                </div>

                {editingStaffId && (
                  <div className="form-group">
                    <label className="form-label">{locale === 'ar' ? 'حالة الحساب' : 'Account Status'}</label>
                    <select 
                      className="form-control" 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active (نشط)</option>
                      <option value="inactive">Suspended (معطل)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsStaffModalOpen(false)}>
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
