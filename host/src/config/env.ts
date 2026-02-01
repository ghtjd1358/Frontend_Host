/**
 * 환경 변수 검증 및 타입 안전한 접근
 */

// Firebase 환경 변수 검증
const FIREBASE_REQUIRED_VARS = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
] as const;

// Firebase 선택 변수 (향후 확장용)
const _FIREBASE_OPTIONAL_VARS = [
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
] as const;
void _FIREBASE_OPTIONAL_VARS;

/**
 * 환경 변수 유효성 검사
 * - 개발 환경: 경고만 출력
 * - 프로덕션 환경: 필수 변수 누락 시 경고
 */
export const validateEnv = (): { isValid: boolean; missing: string[] } => {
  const missing: string[] = [];

  FIREBASE_REQUIRED_VARS.forEach((key) => {
    const value = process.env[key];
    if (!value || value === 'undefined' || value === 'null') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const message = `[ENV] Missing required environment variables: ${missing.join(', ')}`;

    if (process.env.NODE_ENV === 'production') {
      console.warn(message);
    } else {
      console.info(`${message}\nFirebase 로그인이 비활성화됩니다.`);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
};

/**
 * 환경 변수 가져오기 (타입 안전)
 */
export const getEnv = (key: string, defaultValue = ''): string => {
  const value = process.env[key];
  if (!value || value === 'undefined' || value === 'null') {
    return defaultValue;
  }
  return value;
};

/**
 * 개발 환경 여부
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 프로덕션 환경 여부
 */
export const isProduction = process.env.NODE_ENV === 'production';
