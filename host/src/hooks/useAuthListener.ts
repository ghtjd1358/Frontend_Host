import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/config/firebase';
import { setAccessToken, setUser, logout } from '@/store';

/**
 * Firebase 인증 상태 리스너 훅
 * - 토큰 자동 갱신
 * - 세션 만료 시 자동 로그아웃
 */
export const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Firebase 미설정 시 리스너 등록 안함
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 토큰 갱신
          const token = await user.getIdToken(true);
          dispatch(setAccessToken(token));

          // 사용자 정보 업데이트
          dispatch(setUser({
            id: user.uid,
            name: user.displayName || '사용자',
            email: user.email || '',
            role: 'user' as const,
          }));
        } catch (error) {
          console.error('Token refresh failed:', error);
          dispatch(logout());
        }
      } else {
        // Firebase 세션 만료 시 로그아웃
        // (테스트 계정 로그인은 영향 없음)
        const currentToken = localStorage.getItem('@sonhoseong:auth:accessToken');
        if (currentToken && !currentToken.startsWith('mock-token-')) {
          dispatch(logout());
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuthListener;
