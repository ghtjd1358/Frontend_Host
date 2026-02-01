/**
 * useLogout - KOMCA 패턴
 * 로그아웃 처리 훅
 *
 * Flow:
 * 1. POST /api/auth/logout 호출 (Cookie 삭제)
 * 2. Redux Store 클리어 (메모리 클리어)
 * 3. 로그인 페이지로 리다이렉트
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store';
import { postLogout } from '@/network';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      // API 호출로 Cookie 삭제
      await postLogout();
    } catch {
      // API 실패해도 클라이언트 측 로그아웃은 진행
      console.warn('Logout API failed, but continuing with client-side logout');
    } finally {
      // Redux Store 클리어 (메모리)
      dispatch(logout());
      // 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]);

  return handleLogout;
};

export default useLogout;
