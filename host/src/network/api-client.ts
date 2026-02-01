/**
 * API Client - KOMCA 패턴
 * - axios 인스턴스 생성
 * - 401 자동 토큰 갱신 인터셉터
 * - Access Token은 Redux Store (메모리)에서 관리
 * - Refresh Token은 HttpOnly Cookie로 관리 (서버 설정)
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store, setAccessToken, setUser, logout } from '../store';

// 토큰 갱신 중인지 여부
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

// 대기 중인 요청 처리
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// API 기본 URL - 상대 경로 사용 (개발/프로덕션 모두)
const API_BASE_URL = '/api';

/**
 * API Client 인스턴스
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie 전송을 위해 필수
});

/**
 * Request Interceptor
 * - Authorization 헤더에 Access Token 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const accessToken = state.app.accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - 401 에러 시 자동 토큰 갱신
 * - 갱신 성공 시 원래 요청 재시도
 * - 갱신 실패 시 로그아웃
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러가 아니거나, refresh 요청 자체인 경우 또는 이미 재시도한 경우
    if (
      error.response?.status !== 401 ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // 이미 토큰 갱신 중인 경우, 대기열에 추가
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh Token으로 새 Access Token 요청
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken, user } = response.data.data;

      // Redux Store 업데이트 (메모리)
      store.dispatch(setAccessToken(accessToken));
      store.dispatch(setUser(user));

      // 대기 중인 요청들 처리
      processQueue(null, accessToken);

      // 원래 요청 재시도
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      // 토큰 갱신 실패 - 로그아웃
      processQueue(refreshError as Error, null);
      store.dispatch(logout());

      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
