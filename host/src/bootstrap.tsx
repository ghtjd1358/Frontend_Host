/**
 * Bootstrap - Host Container (KOMCA 패턴)
 * 모듈 사전 로드 후 앱 렌더링
 */

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, ToastProvider, ModalProvider, storage } from '@sonhoseong/mfa-lib';

// Host 앱임을 표시 (Remote에서 prefix 결정에 사용)
storage.setHostApp();

// 모듈 사전 로드 함수
const preloadRemotes = async () => {
  try {
    // Remote LnbItems 병렬 로드
    await Promise.all([
      // @ts-ignore
      import('@resume/LnbItems'),
      // @ts-ignore
      import('@blog/LnbItems'),
    ]);
    console.log('[Bootstrap] Remote 모듈 사전 로드 완료');
  } catch (error) {
    console.warn('[Bootstrap] Remote 모듈 사전 로드 실패:', error);
  }
};

async function start() {
  const container = document.getElementById('root');
  if (!container) throw new Error('Failed to find the root element');

  // 1. 모듈 사전 로드
  await preloadRemotes();

  // 2. App 동적 임포트 (LnbItems 로드 후)
  const { default: App } = await import('./App');

  // 3. 렌더링
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <ToastProvider>
        <ModalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ModalProvider>
      </ToastProvider>
    </Provider>
  );
}

start();
