/**
 * Lnb (Left Navigation Bar) Component - KOMCA 패턴
 *
 * lnbItems만 받고 내부에서 navigate 처리
 */
import React, { useState, isValidElement, cloneElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/app-store';

export interface LnbMenuItem {
  id: string;
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: Omit<LnbMenuItem, 'icon' | 'children'>[];
}

export interface LnbProps {
  lnbItems: LnbMenuItem[];
  title?: string;
  appName?: string;
  logo?: React.ReactNode;
}

export const Lnb: React.FC<LnbProps> = ({ lnbItems, title, appName, logo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const user = useSelector((state: any) => state.app?.user);
  const isAuthenticated = useSelector((state: any) => !!state.app?.accessToken);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className={`app-lnb ${collapsed ? 'collapsed' : ''}`}>
      <div className="app-lnb-header">
        {(logo || appName) && (
          <div className="app-lnb-logo" onClick={() => handleNavigate('/')}>
            {isValidElement(logo)
              ? cloneElement(logo as React.ReactElement<{ centerOnly?: boolean }>, { centerOnly: collapsed })
              : (collapsed ? null : appName)
            }
          </div>
        )}
        {title && !collapsed && <div className="app-lnb-title">{title}</div>}
        <button
          className="app-lnb-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="app-lnb-nav">
        {lnbItems.map((item) => (
          <div key={item.id} className="app-lnb-item">
            {item.children ? (
              <>
                <button
                  className={`app-lnb-item-btn ${expandedItems.includes(item.id) ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  {item.icon && <span className="app-lnb-icon">{item.icon}</span>}
                  {!collapsed && <span className="app-lnb-text">{item.title}</span>}
                  {!collapsed && (
                    <span className="app-lnb-arrow">
                      {expandedItems.includes(item.id) ? '▼' : '▶'}
                    </span>
                  )}
                </button>
                {expandedItems.includes(item.id) && !collapsed && (
                  <div className="app-lnb-subitems">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        className={`app-lnb-subitem ${isActive(child.path) ? 'active' : ''}`}
                        onClick={() => child.path && handleNavigate(child.path)}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                className={`app-lnb-item-btn ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => item.path && handleNavigate(item.path)}
              >
                {item.icon && <span className="app-lnb-icon">{item.icon}</span>}
                {!collapsed && <span className="app-lnb-text">{item.title}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      {isAuthenticated && (
        <div className={`app-lnb-footer ${collapsed ? 'collapsed' : ''}`}>
          <div className="app-lnb-user-section">
            <div className="app-lnb-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            {!collapsed && user && (
              <span className="app-lnb-user-name">{user.name || user.email}</span>
            )}
          </div>
          <button className="app-lnb-logout-icon" onClick={handleLogout} title="로그아웃">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Lnb;
