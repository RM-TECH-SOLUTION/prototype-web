import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { registerUser, loading, errorMessage } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async () => {
    const success = await registerUser(name, email, phone, password);
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
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '25px',
      borderRadius: '25px',
      backgroundColor: 'rgba(0,0,0,0.85)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#ccc',
      textAlign: 'center',
      marginBottom: '20px',
    },
    inputContainer: {
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderWidth: '1px',
      borderColor: '#E50914',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '16px',
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
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
    loginText: {
      color: '#E50914',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join us today</p>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button 
          style={styles.button} 
          onClick={handleRegister}
          disabled={loading}
        >
          <span style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </span>
        </button>

        <div style={styles.footer}>
          <span style={{ color: '#ccc' }}>Already have account? </span>
          <Link to="/login" style={styles.loginText}>Login</Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#E50914' }}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

