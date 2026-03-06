import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './LoginComponent.css';

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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      backgroundColor: cmsConfig?.cardBackgroundColor || 'rgba(0,0,0,0.75)',
      padding: '30px',
      borderRadius: '25px',
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      width: '120px',
      height: '120px',
      alignSelf: 'center',
      marginBottom: '15px',
      objectFit: 'contain',
    },
    title: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#ccc',
      textAlign: 'center',
      marginBottom: '25px',
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      borderWidth: '1px',
      borderColor: cmsConfig?.inputBorderColor || '#E50914',
      borderRadius: '12px',
      paddingHorizontal: '15px',
      paddingVertical: '12px',
      marginBottom: '18px',
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    inputIcon: {
      marginRight: '10px',
      color: '#E50914',
    },
    input: {
      flex: 1,
      color: '#fff',
      fontSize: '16px',
      border: 'none',
      backgroundColor: 'transparent',
      outline: 'none',
    },
    button: {
      backgroundColor: cmsConfig?.buttonColor || '#E50914',
      paddingVertical: '15px',
      borderRadius: '30px',
      alignItems: 'center',
      marginTop: '10px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
    },
    buttonText: {
      color: cmsConfig?.buttonTextColor || '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    registerText: {
      color: '#E50914',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    skipText: {
      color: '#E50914',
      textAlign: 'center',
      marginTop: '20px',
      cursor: 'pointer',
    },
    errorText: {
      color: '#ff4444',
      textAlign: 'center',
      marginBottom: '15px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img 
          src={cmsConfig?.logoImage || 'https://via.placeholder.com/120'} 
          alt="Logo" 
          style={styles.logo} 
        />

        <h1 style={styles.title}>{cmsConfig?.title || 'Welcome Back'}</h1>
        <p style={styles.subtitle}>{cmsConfig?.subtitle || 'Login to continue'}</p>

        <div style={styles.inputContainer}>
          <span style={styles.inputIcon}>👤</span>
          <input
            type="text"
            style={styles.input}
            placeholder="Email or Phone"
            placeholderTextColor="#aaa"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
        </div>

        <div style={styles.inputContainer}>
          <span style={styles.inputIcon}>🔒</span>
          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          style={styles.button} 
          onClick={handleLogin}
          disabled={loading}
        >
          <span style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </span>
        </button>

        <div style={styles.footer}>
          <span style={{ color: '#ccc' }}>Don't have an account? </span>
          <Link to="/register" style={styles.registerText}>Register</Link>
        </div>

        {cmsConfig?.skipEnabled && (
          <p style={styles.skipText} onClick={() => navigate('/')}>
            Skip
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;

