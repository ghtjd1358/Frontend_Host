import { Suspense, Component, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface RemoteErrorBoundaryProps {
  children: ReactNode;
  name: string;
}

interface RemoteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Remote 앱 전용 에러 바운더리
 * Remote 로드 실패 시 개별 폴백 UI 표시
 */
class RemoteErrorBoundary extends Component<RemoteErrorBoundaryProps, RemoteErrorBoundaryState> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="remote-error">
          <div className="remote-error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 className="remote-error-title">{this.props.name} 앱을 불러올 수 없습니다</h2>
          <p className="remote-error-message">
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          <button onClick={this.handleRetry} className="remote-error-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface RemoteWrapperProps {
  children: ReactNode;
  name: string;
}

/**
 * Remote 앱 래퍼 컴포넌트
 * - Suspense로 로딩 상태 처리
 * - ErrorBoundary로 로드 실패 처리
 */
const RemoteWrapper = ({ children, name }: RemoteWrapperProps) => {
  return (
    <RemoteErrorBoundary name={name}>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  );
};

export default RemoteWrapper;
