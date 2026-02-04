/**
 * RoutesAuthPages - 로그인 사용자용 라우트
 * KOMCA 패턴: top-level await로 remote pathPrefix 가져오기
 */
import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RoutePath } from './paths';
import Dashboard from '../Dashboard';

// Remote lazy imports (KOMCA 패턴)
// @ts-ignore
const ResumeApp = React.lazy(() => import('@resume/App'));
// @ts-ignore
const { pathPrefix: resumePathPrefix } = await import('@resume/LnbItems');
// @ts-ignore
const BlogApp = React.lazy(() => import('@blog/App'));
// @ts-ignore
const { pathPrefix: blogPathPrefix } = await import('@blog/LnbItems');

const NotFound = () => (
    <div style={{ textAlign: 'center', padding: 48 }}>
        <h1>404</h1>
        <p>페이지를 찾을 수 없습니다.</p>
    </div>
);

function RoutesAuthPages() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={RoutePath.Dashboard} replace />} />
            <Route path={RoutePath.Dashboard} element={<Dashboard />} />
            <Route path={`${resumePathPrefix}/*`} element={<ResumeApp />} />
            <Route path={`${blogPathPrefix}/*`} element={<BlogApp />} />
            <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export { RoutesAuthPages };
