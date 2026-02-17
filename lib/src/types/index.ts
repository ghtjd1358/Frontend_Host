/**
 * MFA 공통 타입 정의
 */

// Service Types
export * from './service';

// ============================================
// 권한 관련 타입 (KOMCA 패턴)
// ============================================

/** 사용자 역할 */
export type UserRole = 'admin' | 'user' | 'editor' | 'viewer' | 'guest';

/** 권한 액션 타입 */
export type PermissionAction = 'read' | 'write' | 'delete' | 'admin';

/** 개별 권한 */
export interface Permission {
  /** 메뉴/리소스 코드 */
  code: string;
  /** 허용된 액션 목록 */
  actions: PermissionAction[];
}

/** 사용자 타입 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole | string;
  avatar?: string;
  /** 사용자 권한 목록 */
  permissions?: Permission[];
}

/** 메뉴 권한 요구사항 */
export interface MenuPermission {
  /** 필요한 메뉴 코드 (OR 조건) */
  requiredCodes?: string[];
  /** 필요한 역할 (OR 조건) */
  requiredRoles?: UserRole[];
  /** 필요한 액션 */
  requiredAction?: PermissionAction;
}

// App State 타입
export interface AppState {
  accessToken: string;
  user: User | null;
  isLoading: boolean;
  globalLoadingTitle: string;
  service: string;
  selectedGnb: string;
}

// Recent Menu (탭) 타입
export interface RecentMenu {
  id: string;
  pathname: string;
  search: string;
  title: string;
  service?: string;
  state?: any;
  data?: any;
}

// Menu 아이템 타입 (LNB) - 권한 기반
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  /** 권한 요구사항 (없으면 모두 접근 가능) */
  permission?: MenuPermission;
  /** 메뉴 숨김 여부 */
  hidden?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 뱃지 (새 기능, 업데이트 등) */
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
}

// Note: MenuState와 RecentMenuState는 각 slice 파일에서 정의됨
// store/menu-slice.ts, store/recent-menu-slice.ts 참조

// Host Root State 타입
export interface HostRootState {
  app: AppState;
  recentMenu: {
    list: RecentMenu[];
    currentId: string;
    maxTabs?: number;
  };
  menu?: {
    gnbItems: MenuItem[];
    lnbItems: MenuItem[];
    selectedGnbId: string;
    selectedLnbId: string;
    expandedIds: string[];
    isLoading: boolean;
  };
  [key: string]: unknown;
}

// Redux Store 타입
export interface HostStore {
  getState: () => HostRootState;
  dispatch: (action: any) => any;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (reducer: any) => void;
}

// Reducer Injector 타입
export type InjectReducerFn = (key: string, reducer: import('@reduxjs/toolkit').Reducer) => void;

// 전역 Window 타입 확장
declare global {
  interface Window {
    __REDUX_STORE__: HostStore;
    __INJECT_REDUCER__?: InjectReducerFn;
  }
}