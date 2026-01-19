import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from '@/store';

/**
 * 로그인 페이지 - Aurora Glass 디자인
 * - 2025 트렌드: Mesh Gradient + Glassmorphism
 * - accessToken 기반 인증
 * - Redux store와 localStorage 동기화
 */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .login-container {
    --primary: #8b5cf6;
    --primary-glow: rgba(139, 92, 246, 0.4);
    --accent: #06ffa5;
    --accent-secondary: #ff6b9d;
    --surface: rgba(255, 255, 255, 0.03);
    --surface-hover: rgba(255, 255, 255, 0.08);
    --border: rgba(255, 255, 255, 0.1);
    --text: #f8fafc;
    --text-muted: rgba(255, 255, 255, 0.5);
    --error: #ff4757;

    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;
    background: #050505;
    font-family: 'DM Sans', sans-serif;
  }

  /* Animated Mesh Gradient Background */
  .mesh-gradient {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .mesh-gradient::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    top: -25%;
    left: -25%;
    background:
      radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(6, 255, 165, 0.2) 0%, transparent 45%),
      radial-gradient(ellipse at 40% 80%, rgba(255, 107, 157, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.25) 0%, transparent 45%);
    animation: meshMove 20s ease-in-out infinite;
    filter: blur(60px);
  }

  @keyframes meshMove {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(5%, 5%) rotate(3deg) scale(1.05); }
    50% { transform: translate(-3%, 8%) rotate(-2deg) scale(1.02); }
    75% { transform: translate(-5%, -3%) rotate(2deg) scale(1.08); }
  }

  /* Floating Orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.6;
    animation: float 15s ease-in-out infinite;
    z-index: 0;
  }

  .orb-1 {
    width: 400px;
    height: 400px;
    background: var(--primary);
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 300px;
    height: 300px;
    background: var(--accent);
    bottom: -50px;
    left: -50px;
    animation-delay: -5s;
  }

  .orb-3 {
    width: 200px;
    height: 200px;
    background: var(--accent-secondary);
    top: 40%;
    right: 10%;
    animation-delay: -10s;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(30px, -30px); }
    66% { transform: translate(-20px, 20px); }
  }

  /* Noise Overlay */
  .noise {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  /* Glass Card */
  .login-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 440px;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 32px;
    padding: 48px 40px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 100px -20px var(--primary-glow);
    animation: cardAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }

  @keyframes cardAppear {
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Header */
  .login-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .login-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent-secondary) 100%);
    border-radius: 20px;
    margin-bottom: 24px;
    animation: logoAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }

  @keyframes logoAppear {
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  .login-logo svg {
    width: 32px;
    height: 32px;
    color: white;
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 8px;
    letter-spacing: -0.02em;
    animation: textAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
    opacity: 0;
    transform: translateY(10px);
  }

  @keyframes textAppear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .login-subtitle {
    font-size: 15px;
    color: var(--text-muted);
    margin: 0;
    animation: textAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
    opacity: 0;
    transform: translateY(10px);
  }

  /* Form */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Input Group */
  .input-group {
    position: relative;
    animation: inputAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(15px);
  }

  .input-group:nth-child(1) { animation-delay: 0.5s; }
  .input-group:nth-child(2) { animation-delay: 0.6s; }

  @keyframes inputAppear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .input-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    transition: color 0.3s ease;
    pointer-events: none;
  }

  .input-field {
    width: 100%;
    height: 56px;
    padding: 0 18px 0 52px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    outline: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
  }

  .input-field::placeholder {
    color: var(--text-muted);
  }

  .input-field:hover {
    background: var(--surface-hover);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .input-field:focus {
    background: var(--surface-hover);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
  }

  .input-field:focus + .input-icon,
  .input-wrapper:has(.input-field:focus) .input-icon {
    color: var(--primary);
  }

  /* Error Message */
  .error-message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: rgba(255, 71, 87, 0.1);
    border: 1px solid rgba(255, 71, 87, 0.2);
    border-radius: 12px;
    color: var(--error);
    font-size: 14px;
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }

  .error-icon {
    flex-shrink: 0;
  }

  /* Submit Button */
  .submit-btn {
    position: relative;
    height: 56px;
    margin-top: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%);
    border: none;
    border-radius: 16px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    animation: inputAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
    opacity: 0;
    transform: translateY(15px);
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #a855f7 0%, var(--accent-secondary) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -15px var(--primary-glow);
  }

  .submit-btn:hover:not(:disabled)::before {
    opacity: 1;
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .submit-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .submit-btn span {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  /* Loading Spinner */
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Test Account Box */
  .test-account {
    margin-top: 28px;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px dashed var(--border);
    border-radius: 14px;
    text-align: center;
    animation: inputAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
    opacity: 0;
    transform: translateY(15px);
  }

  .test-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .test-credentials {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--text-muted);
  }

  /* Decorative Elements */
  .decorative-line {
    position: absolute;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, var(--primary), transparent);
    border-radius: 2px;
  }

  .line-top {
    top: -1px;
    left: 40px;
  }

  .line-bottom {
    bottom: -1px;
    right: 40px;
    background: linear-gradient(90deg, transparent, var(--accent));
  }

  /* Responsive */
  @media (max-width: 480px) {
    .login-card {
      padding: 36px 24px;
      border-radius: 24px;
    }

    .login-title {
      font-size: 26px;
    }

    .input-field {
      height: 52px;
    }

    .submit-btn {
      height: 52px;
    }
  }
`;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // TODO: 실제 API 호출로 교체
            // const response = await postMemberLogin({ username: email, password });

            // Mock 로그인 검증
            if (email === 'admin@test.com' && password === '1234') {
                const mockToken = `mock-token-${Date.now()}`;
                const user = {
                    id: '1',
                    name: '관리자',
                    email: email,
                    role: 'admin' as const,
                };

                // Redux store에 저장 (localStorage는 slice에서 자동 동기화)
                dispatch(setAccessToken(mockToken));
                dispatch(setUser(user));

                navigate('/', { replace: true });
            } else {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            {/* Animated Background */}
            <div className="mesh-gradient" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="noise" />

            {/* Login Card */}
            <div className="login-card">
                {/* Decorative Lines */}
                <div className="decorative-line line-top" />
                <div className="decorative-line line-bottom" />

                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Portfolio에 로그인하세요</p>
                </div>

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <svg className="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">이메일</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">비밀번호</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        <span>
                            {isSubmitting ? (
                                <>
                                    <div className="spinner" />
                                    로그인 중...
                                </>
                            ) : (
                                '로그인'
                            )}
                        </span>
                    </button>
                </form>

                {/* Test Account */}
                <div className="test-account">
                    <div className="test-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        테스트 계정
                    </div>
                    <div className="test-credentials">admin@test.com / 1234</div>
                </div>
            </div>
        </div>
    );
}

export default Login;