import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Folders, 
  ShoppingCart, 
  Users, 
  BadgePercent, 
  Settings, 
  ShieldAlert, 
  LogOut 
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, logout, hasRole } = useAuth();

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      label: t('navDashboard'), 
      icon: LayoutDashboard,
      roles: ['admin', 'manager', 'staff']
    },
    { 
      path: '/admin/orders', 
      label: t('navOrders'), 
      icon: ShoppingCart,
      roles: ['admin', 'manager', 'staff']
    },
    { 
      path: '/admin/products', 
      label: t('navProducts'), 
      icon: Package,
      roles: ['admin', 'manager']
    },
    { 
      path: '/admin/categories', 
      label: t('navCategories'), 
      icon: Folders,
      roles: ['admin', 'manager']
    },
    { 
      path: '/admin/customers', 
      label: t('navCustomers'), 
      icon: Users,
      roles: ['admin', 'manager']
    },
    { 
      path: '/admin/coupons', 
      label: t('navCoupons'), 
      icon: BadgePercent,
      roles: ['admin', 'manager']
    },
    { 
      path: '/admin/settings', 
      label: t('navSettings'), 
      icon: Settings,
      roles: ['admin'] // Admin-only: WhatsApp and Staff User permissions
    },
    { 
      path: '/admin/logs', 
      label: t('navLogs'), 
      icon: ShieldAlert,
      roles: ['admin'] // Admin-only: Audit Logs tracking
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-emoji">🛍️</span>
        <span className="sidebar-logo-text">{t('storeName')}</span>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          // Check role restrictions
          if (!hasRole(item.roles)) return null;
          
          return (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? 'sidebar-item-link active' : 'sidebar-item-link'
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div style={{ padding: '20px 12px', borderTop: '1px solid var(--border-color)' }}>
        <button 
          onClick={logout} 
          className="sidebar-item-link" 
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'inherit' }}
        >
          <LogOut size={20} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
