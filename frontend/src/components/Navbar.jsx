import React from 'react';
import { Sun, Moon, Globe, User } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, locale, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return t('roleAdmin').split(' - ')[0];
      case 'manager':
        return t('roleManager').split(' - ')[0];
      case 'staff':
        return t('roleStaff').split(' - ')[0];
      default:
        return role;
    }
  };

  return (
    <nav className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        {t('storeName')} - {t('navDashboard')}
      </div>

      <div className="navbar-actions">
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage} 
          className="icon-btn" 
          title={locale === 'ar' ? 'English' : 'العربية'}
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        >
          <Globe size={18} />
        </button>

        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme} 
          className="icon-btn" 
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User Profile */}
        {user && (
          <div className="navbar-profile">
            <div className="navbar-profile-avatar">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ color: 'var(--text-primary)' }}>{user.full_name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
