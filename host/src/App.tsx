/**
 * App Component - KOMCA 패턴
 * Host 앱 메인 컴포넌트
 */

import { Suspense, lazy } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RoutePath } from '@/routes/paths';
import { selectUser, selectIsAuthenticated, logout, RootState } from '@/store';
import {
  ErrorBoundary,
  GlobalLoading,
  ToastContainer,
  ModalContainer,
} from '@sonhoseong/mfa-lib';
import LoadingSpinner from '@/components/LoadingSpinner';
import Login from '@/pages/Login';
import '@/styles/App.css';

// Remote 앱들 lazy 로드
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));
const PortfolioApp = lazy(() => import('@portfolio/App'));

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => selectUser(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ErrorBoundary>
      {/* Global Components - KOMCA 패턴 */}
      <ToastContainer position="top-right" />
      <ModalContainer />
      <GlobalLoading />

      <div className="app-container">
        {/* Top Navigation */}
        <nav className="nav">
          <div className="nav-logo">
            {/* ㅅ */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M 8 40 L 24 8 L 40 40" stroke="#1E3A5F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            {/* ㅎ */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <rect x="20" y="2" width="8" height="16" rx="4" fill="#1E3A5F"/>
              <rect x="6" y="16" width="36" height="6" rx="3" fill="#1E3A5F"/>
              <ellipse cx="24" cy="36" rx="18" ry="12" fill="#1E3A5F"/>
              <ellipse cx="17" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
              <ellipse cx="31" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
            </svg>
            {/* ㅅ */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M 8 40 L 24 8 L 40 40" stroke="#1E3A5F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div className="nav-links">
            <NavLink to={RoutePath.Home} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              이력서
            </NavLink>
            <NavLink to={RoutePath.Blog} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              블로그
            </NavLink>
            <NavLink to={RoutePath.Portfolio} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              포트폴리오
            </NavLink>

            {/* 로그인/로그아웃 */}
            {!isAuthenticated ? (
              <NavLink to={RoutePath.Login} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                로그인
              </NavLink>
            ) : (
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                로그아웃 ({user?.name})
              </button>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path={RoutePath.Home} element={<ResumeApp />} />
              <Route path={RoutePath.Blog} element={<BlogApp />} />
              <Route path={RoutePath.Portfolio} element={<PortfolioApp />} />
              <Route path={RoutePath.Login} element={<Login />} />
              <Route path={RoutePath.NotFound} element={<div>페이지를 찾을 수 없습니다</div>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
