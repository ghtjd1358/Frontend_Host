import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from '@/store';

/**
 * 로그인 페이지 - KOMCA 패턴 적용
 * - accessToken 기반 인증
 * - Redux store와 localStorage 동기화
 */

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit(e as any);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            padding: '20px'
        }}>
            <div style={{
                background: '#1a1a2e',
                padding: '40px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ color: 'white', marginBottom: '8px', textAlign: 'center' }}>로그인</h1>
                <p style={{ color: '#888', marginBottom: '24px', textAlign: 'center' }}>Portfolio에 오신 것을 환영합니다</p>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ background: '#ff4444', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '8px' }}>이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: '#0f0f1a',
                                color: 'white',
                                boxSizing: 'border-box'
                            }}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '8px' }}>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: '#0f0f1a',
                                color: 'white',
                                boxSizing: 'border-box'
                            }}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#6366f1',
                            color: 'white',
                            fontSize: '16px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.7 : 1,
                        }}
                    >
                        {isSubmitting ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div style={{ marginTop: '24px', padding: '16px', background: '#0f0f1a', borderRadius: '8px', textAlign: 'center' }}>
                    <strong style={{ color: '#6366f1' }}>테스트 계정</strong>
                    <p style={{ color: '#888', margin: '8px 0 0' }}>admin@test.com / 1234</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
