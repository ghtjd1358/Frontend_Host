/**
 * App - Host Container
 */

import { lazy, Suspense, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  store,
  exposeStore,
  selectIsAuthenticated,
  ErrorBoundary,
  GlobalLoading,
  ToastContainer,
  ModalContainer,
  Lnb,
  Container,
  Logo,
  LoginPage,
} from '@sonhoseong/mfa-lib';
import './App.css';

// Store를 전역에 노출
exposeStore(store);

// Remote 앱 lazy 로드
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));

// 로딩 UI
const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
    <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// 404 페이지
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: 48 }}>
    <h1>404</h1>
    <p>페이지를 찾을 수 없습니다.</p>
  </div>
);

// 사이드바 아이콘
const icons = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  blog: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>,
  login: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>,
};

const guestMenu = [
  { id: 'home', title: '홈', path: '/', icon: icons.home },
  { id: 'blog', title: '블로그', path: '/blog', icon: icons.blog },
  { id: 'login', title: '로그인', path: '/login', icon: icons.login },
];

const authMenu = [
  { id: 'home', title: '홈', path: '/', icon: icons.home },
  { id: 'blog', title: '블로그', path: '/blog', icon: icons.blog },
];

// 로그인 페이지 래퍼
const LoginWrapper = () => {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLoginSuccess={() => navigate('/', { replace: true })}
      showTestAccount={true}
    />
  );
};

const App = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const lnbItems = useMemo(() => isAuthenticated ? authMenu : guestMenu, [isAuthenticated]);
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <ErrorBoundary>
        <ToastContainer position="top-right" />
        <ModalContainer />
        <LoginWrapper />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ToastContainer position="top-right" />
      <ModalContainer />
      <Container>
        <Lnb lnbItems={lnbItems} logo={<Logo customSize={36} />} />
        <main className="main-content">
          <Routes>
            <Route path="/*" element={<Suspense fallback={<Loading />}><ResumeApp /></Suspense>} />
            <Route path="/blog/*" element={<Suspense fallback={<Loading />}><BlogApp /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <GlobalLoading />
        </main>
      </Container>
    </ErrorBoundary>
  );
};

export default App;
