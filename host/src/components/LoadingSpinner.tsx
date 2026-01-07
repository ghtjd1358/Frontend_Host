import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <DotLottieReact
        src="/loading.json"
        loop
        autoplay
        style={{ width: 120, height: 120 }}
      />
    </div>
  );
}

export default LoadingSpinner;
