import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>로딩 중...</p>
    </div>
  );
}

export default LoadingSpinner;
