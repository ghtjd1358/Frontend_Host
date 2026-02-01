import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, RootState } from '@/store';
import { NavPath } from '@/routes/paths';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 인증 가드 컴포넌트
 * - 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
 * - 로그인 후 원래 페이지로 복귀할 수 있도록 현재 경로 저장
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const location = useLocation();

  if (!isAuthenticated) {
    // 현재 경로를 state로 전달하여 로그인 후 복귀 가능하도록 함
    return <Navigate to={NavPath.Login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
