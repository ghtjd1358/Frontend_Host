/**
 * useInitialize - KOMCA 패턴
 * 앱 시작 시 Refresh Token으로 Access Token 갱신 시도
 *
 * Flow:
 * 1. 앱 시작 → isInitialized: false
 * 2. POST /api/auth/refresh 호출
 * 3. 성공: Access Token을 Redux Store (메모리)에 저장
 * 4. 실패: 로그인 상태 유지 안됨 (정상)
 * 5. isInitialized: true
 */

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from '@/store';
import { postRefresh } from '@/network';

interface UseInitializeResult {
  isInitialized: boolean;
  isAuthenticated: boolean;
}

export const useInitialize = (): UseInitializeResult => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Refresh Token (Cookie)으로 Access Token 갱신 시도
        const response = await postRefresh();

        if (response.statusCode === 200 && response.data) {
          const { accessToken, user } = response.data;

          // Redux Store (메모리)에 저장
          dispatch(setAccessToken(accessToken));
          dispatch(setUser(user));
          setIsAuthenticated(true);
        }
      } catch {
        // Refresh Token이 없거나 만료됨 - 로그아웃 상태
        // 이는 정상적인 상황 (첫 방문 또는 7일 지남)
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [dispatch]);

  return { isInitialized, isAuthenticated };
};

export default useInitialize;
