import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Logs() {
  const { t, locale } = useTranslation();
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        setError('Unauthorized access or server error / غير مصرح أو حدث خطأ في السيرفر');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error / خطأ في الاتصال بالشبكة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-body">
      <div className="page-header">
        <div className="page-title-section">
          <h2>{t('logsTitle')}</h2>
          <span className="page-subtitle">
            {locale === 'ar' ? 'سجل الرقابة الأمنية لرصد محاولات الاختراق، العمليات الحساسة، والدخول غير المصرح به' : 'Audit logs tracking failed authentication attempts, RBAC violations, and data changes'}
          </span>
        </div>
        <button className="btn btn-secondary" onClick={fetchLogs}>
          <RefreshCw size={16} />
          <span>{locale === 'ar' ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t('loggingIn')}</div>
        ) : (
          <div className="table-responsive">
            <table className="table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>{t('logDate')}</th>
                  <th>{t('logAction')}</th>
                  <th>{t('logDetails')}</th>
                  <th>{t('logUser')}</th>
                  <th>{t('logIp')}</th>
                  <th>{t('logStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr 
                      key={log.id} 
                      className={`log-row ${log.status === 'success' ? 'success-log' : 'failed-log'}`}
                    >
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(log.created_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontWeight: 'bold', 
                            color: log.status === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
                            fontFamily: 'monospace'
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-all' }}>
                        {log.details}
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        {log.username ? (
                          `@${log.username}`
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            {locale === 'ar' ? 'زائر / خارجي' : 'Guest / External'}
                          </span>
                        )}
                      </td>
                      <td><code>{log.ip_address || '-'}</code></td>
                      <td>
                        <span className={`badge ${log.status === 'success' ? 'badge-delivered' : 'badge-cancelled'}`}>
                          {log.status === 'success' ? t('success') : t('failed')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                      {locale === 'ar' ? 'سجل العمليات فارغ حالياً' : 'Audit logs registry is empty'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
