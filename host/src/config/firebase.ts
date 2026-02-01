import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Firebase 설정이 유효한지 확인
export const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'undefined' &&
    firebaseConfig.authDomain
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    // 구글 로그인 시 항상 계정 선택 화면 표시
    googleProvider.setCustomParameters({
        prompt: 'select_account',
    });
}

export { auth, googleProvider };