/**
 * Auth API - KOMCA 패턴
 * - 인증 관련 API 함수들
 * - Access Token: 응답 body로 받아서 Redux Store (메모리)에 저장
 * - Refresh Token: HttpOnly Cookie로 자동 관리 (서버 설정)
 */

import axios from 'axios';
import { apiClient } from './api-client';

// User 타입
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// 로그인 응답 타입
export interface LoginResponse {
  statusCode: number;
  data: {
    accessToken: string;
    user: User;
  };
}

// Refresh 응답 타입
export interface RefreshResponse {
  statusCode: number;
  data: {
    accessToken: string;
    user: User;
  };
}

// Me 응답 타입
export interface MeResponse {
  statusCode: number;
  data: {
    user: User;
  };
}

// 로그아웃 응답 타입
export interface LogoutResponse {
  statusCode: number;
  message: string;
}

// API 기본 URL - 상대 경로 사용 (개발/프로덕션 모두)
const API_BASE_URL = '/api';

/**
 * 로그인
 * - POST /api/auth/login
 * - Access Token: 응답 body
 * - Refresh Token: Cookie로 자동 설정
 */
export const postLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

/**
 * 토큰 갱신
 * - POST /api/auth/refresh
 * - Cookie의 Refresh Token으로 새 Access Token 발급
 * - Rotating Refresh Token: 새 Refresh Token도 Cookie로 설정
 */
export const postRefresh = async (): Promise<RefreshResponse> => {
  const response = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

/**
 * 로그아웃
 * - POST /api/auth/logout
 * - Refresh Token Cookie 삭제
 */
export const postLogout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>('/auth/logout');
  return response.data;
};

/**
 * 현재 사용자 정보 조회
 * - GET /api/auth/me
 * - Authorization 헤더 필요
 */
export const getMe = async (): Promise<MeResponse> => {
  const response = await apiClient.get<MeResponse>('/auth/me');
  return response.data;
};

export default {
  postLogin,
  postRefresh,
  postLogout,
  getMe,
};
