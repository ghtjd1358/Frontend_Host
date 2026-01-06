import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">페이지를 찾을 수 없습니다</h2>
        <p className="not-found-desc">
          요청하신 페이지 <code>{location.pathname}</code>가 존재하지 않습니다.
        </p>

        <div className="not-found-actions">
          <button onClick={() => navigate(-1)} className="not-found-btn secondary">
            이전 페이지
          </button>
          <Link to="/" className="not-found-btn primary">
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
