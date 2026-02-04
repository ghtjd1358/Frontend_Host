/**
 * RoutesAuthPages - 로그인 사용자용 라우트
 * Platform 없이 직접 라우팅, Suspense 없음 (App.tsx에서 처리)
 */
import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RoutePath } from './paths';

// Remote 앱 lazy 로드
const ResumeApp = lazy(() => import('@resume/App'));
const BlogApp = lazy(() => import('@blog/App'));

// 대시보드 페이지
const Dashboard = () => (
    <div style={{ padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>대시보드</h1>
        <p style={{ color: '#64748b' }}>포트폴리오 플랫폼에 오신 것을 환영합니다.</p>
    </div>
);

// 404 페이지
const NotFound = () => (
    <div style={{ textAlign: 'center', padding: 48 }}>
        <h1>404</h1>
        <p>페이지를 찾을 수 없습니다.</p>
    </div>
);

function RoutesAuthPages() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/platform/dashboard" replace />} />
            <Route path="/platform" element={<Navigate to="/platform/dashboard" replace />} />
            <Route path="/platform/dashboard" element={<Dashboard />} />
            <Route path="/platform/resume/*" element={<ResumeApp />} />
            <Route path="/platform/blog/*" element={<BlogApp />} />
            <Route path={RoutePath.Login} element={<Navigate to="/platform/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export { RoutesAuthPages };
