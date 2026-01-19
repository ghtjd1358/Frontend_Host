/**
 * Bootstrap - KOMCA 패턴
 * Host 앱 부팅 및 초기화
 */

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToastProvider, ModalProvider } from '@sonhoseong/mfa-lib';
import App from '@/App';

const container = document.getElementById('root');
if (container) {
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
