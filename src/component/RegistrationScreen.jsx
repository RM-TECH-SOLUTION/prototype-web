import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './RegistrationScreen.css';

const RegistrationScreen = ({ cmsConfig = {} }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { registerUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const success = await registerUser(name, email, phone, password);
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
      backgroundColor: 'rgba(0,0,0,0.85)',
      padding: '30px',
      borderRadius: '25px',
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      width: '100px',
      height: '100px',
      display: 'block',
      margin: '0 auto 15px',
      objectFit: 'contain',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '5px',
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
      marginBottom: '15px',
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    inputIcon: {
      marginRight: '10px',
      fontSize: '18px',
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
      backgroundColor: '#E50914',
      paddingVertical: '15px',
      borderRadius: '30px',
      alignItems: 'center',
      marginTop: '15px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
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
      color: '#ccc',
    },
    linkText: {
      color: '#E50914',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img 
          src={cmsConfig?.logoImage || 'https://via.placeholder.com/100'} 
          alt="Logo" 
          style={styles.logo} 
        />

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register to get started</p>

        <div style={styles.inputContainer}>
          <span style={styles.inputIcon}>👤</span>
          <input
            type="text"
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.inputContainer}>
          <span style={styles.inputIcon}>📧</span>
          <input
            type="email"
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.inputContainer}>
          <span style={styles.inputIcon}>📱</span>
          <input
            type="tel"
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#aaa"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        <div style={styles.inputContainer}>
          <span style={styles.inputIcon}>🔒</span>
          <input
            type="password"
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button 
          style={styles.button} 
          onClick={handleRegister}
          disabled={loading}
        >
          <span style={styles.buttonText}>
            {loading ? 'Registering...' : 'Register'}
          </span>
        </button>

        <div style={styles.footer}>
          <span style={styles.loginText}>Already have an account? </span>
          <Link to="/login" style={styles.linkText}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;

