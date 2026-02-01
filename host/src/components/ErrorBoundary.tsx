import { Component, ErrorInfo, ReactNode } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// 기본 에러 UI
function ErrorFallback({ error }: { error: Error | null }) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div>
        <DotLottieReact
          src="/error.json"
          loop
          autoplay
          style={{ width: 200, height: 200, margin: '0 auto' }}
        />
        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1E3A5F' }}>
          오류가 발생했습니다
        </h1>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>
          예상치 못한 오류가 발생했습니다.
        </p>

        {error && (
          <details style={{ marginBottom: '24px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', color: '#64748B' }}>오류 상세</summary>
            <pre style={{
              background: '#F8FAFC',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              overflow: 'auto'
            }}>
              {error.message}
            </pre>
          </details>
        )}

        <button
          onClick={handleReload}
          style={{
            padding: '12px 24px',
            background: '#1E3A5F',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
