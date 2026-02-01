import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NotFound.css';

/**
 * 404 Not Found 페이지
 * - 존재하지 않는 경로 접근 시 표시
 * - 이전 페이지 또는 홈으로 이동 옵션 제공
 */
function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // 히스토리가 있으면 이전 페이지로, 없으면 홈으로
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="not-found-container" role="main" aria-labelledby="not-found-title">
      <div className="not-found-content">
        <div className="not-found-icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h1 className="not-found-code" aria-hidden="true">404</h1>
        <h2 id="not-found-title" className="not-found-title">페이지를 찾을 수 없습니다</h2>
        <p className="not-found-desc">
          요청하신 페이지 <code>{location.pathname}</code>가 존재하지 않거나 이동되었습니다.
        </p>

        <div className="not-found-actions">
          <button
            onClick={handleGoBack}
            className="not-found-btn secondary"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            이전 페이지
          </button>
          <Link to="/" className="not-found-btn primary">
            홈으로 이동
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
