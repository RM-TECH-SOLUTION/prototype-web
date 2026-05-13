import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const LoginComponent = ({ cmsConfig = {} }) => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');

  const { loginUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await loginUser(identity, password);
    if (success) {
      navigate('/');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundImage: `url(${cmsConfig?.backgroundImage || '/bgHome1.png'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 1,
    backgroundColor: cmsConfig?.cardBackgroundColor || 'rgba(0,0,0,0.75)',
    padding: '28px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px',
  };

  const inputWrap = {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${cmsConfig?.inputBorderColor || '#E50914'}`,
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
  };

  const inputStyle = {
    flex: 1,
    color: '#fff',
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: 14,
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle} />

      <div style={cardStyle}>
        <img
          src={cmsConfig?.logoImage || 'https://via.placeholder.com/120'}
          alt="Logo"
          style={{ width: 120, height: 120, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }}
        />

        <h1 style={{ color: '#fff', textAlign: 'center', margin: '0 0 6px', fontSize: 26 }}>
          {cmsConfig?.title || 'Welcome Back'}
        </h1>

        <p style={{ color: '#ccc', textAlign: 'center', margin: '0 0 20px', fontSize: 14 }}>
          {cmsConfig?.subtitle || 'Login to continue'}
        </p>

        <div style={inputWrap}>
          <span style={{ color: '#E50914', marginRight: 8 }}>👤</span>
          <input
            style={inputStyle}
            placeholder="Email or Phone"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
        </div>

        <div style={inputWrap}>
          <span style={{ color: '#E50914', marginRight: 8 }}>🔒</span>
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 30,
            border: 'none',
            backgroundColor: cmsConfig?.buttonColor || '#E50914',
            color: cmsConfig?.buttonTextColor || '#fff',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ marginTop: 18, textAlign: 'center', color: '#ccc', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#E50914', fontWeight: 700, textDecoration: 'none' }}>
            Register
          </Link>
        </div>

        {cmsConfig?.skipEnabled && (
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: 14,
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: '#E50914',
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;
