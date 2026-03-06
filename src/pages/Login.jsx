import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, loading, errorMessage } = useAuthStore();
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111',
    },
    card: {
      width: '85%',
      maxWidth: '400px',
      padding: '25px',
      borderRadius: '25px',
      backgroundColor: 'rgba(0,0,0,0.75)',
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
      borderColor: '#E50914',
      borderRadius: '12px',
      paddingHorizontal: '15px',
      paddingVertical: '12px',
      marginBottom: '18px',
    },
    input: {
      flex: 1,
      marginLeft: '10px',
      color: '#fff',
      fontSize: '16px',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
    },
    button: {
      paddingVertical: '15px',
      borderRadius: '30px',
      alignItems: 'center',
      marginTop: '10px',
      backgroundColor: '#E50914',
    },
    buttonText: {
      color: '#fff',
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
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to continue</p>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        <div style={styles.inputContainer}>
          <span>👤</span>
          <input
            type="text"
            placeholder="Email or Phone"
            placeholderTextColor="#aaa"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <span>🔒</span>
          <input
            type="password"
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button 
          style={styles.button} 
          onClick={handleLogin}
          disabled={loading}
        >
          <span style={styles.buttonText}>
            {loading ? 'Loading...' : 'Login'}
          </span>
        </button>

        <div style={styles.footer}>
          <span style={{ color: '#ccc' }}>Don't have an account? </span>
          <Link to="/register" style={styles.registerText}>Register</Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#E50914' }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

