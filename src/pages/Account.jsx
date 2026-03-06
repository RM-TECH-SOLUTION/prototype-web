import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSessionStore from '../store/useSessionStore';
import useAuthStore from '../store/useAuthStore';
import useCmsStore from '../store/useCmsStore';

const Account = () => {
  const { user, isLoggedIn, profileData } = useSessionStore();
  const { logoutUser } = useAuthStore();
  const { cmsData } = useCmsStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      color: '#fff',
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    navLink: {
      color: '#E50914',
      textDecoration: 'none',
    },
    card: {
      backgroundColor: '#1C1C1C',
      padding: '20px',
      borderRadius: '20px',
      marginBottom: '20px',
      borderWidth: '1px',
      borderColor: '#2A2A2A',
    },
    avatarCircle: {
      width: '70px',
      height: '70px',
      borderRadius: '35px',
      backgroundColor: '#E50914',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
    },
    avatarText: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#fff',
    },
    name: {
      fontSize: '20px',
      fontWeight: '800',
      marginBottom: '5px',
    },
    email: {
      fontSize: '14px',
      color: '#ccc',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#1C1C1C',
      borderRadius: '18px',
      marginBottom: '14px',
      borderWidth: '1px',
      borderColor: '#2A2A2A',
    },
    menuText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
    },
    logoutButton: {
      backgroundColor: '#E50914',
      padding: '15px',
      borderRadius: '14px',
      alignItems: 'center',
      marginTop: '20px',
    },
    logoutText: {
      color: '#fff',
      fontSize: '15px',
      fontWeight: '700',
    },
    guestContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
    },
    guestTitle: {
      fontSize: '18px',
      fontWeight: '800',
      marginTop: '10px',
    },
    guestSub: {
      fontSize: '14px',
      color: '#aaa',
      marginBottom: '15px',
    },
    loginButton: {
      backgroundColor: '#E50914',
      paddingVertical: '10px',
      paddingHorizontal: '30px',
      borderRadius: '14px',
    },
    loginText: {
      color: '#fff',
      fontWeight: '700',
    },
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Account</h1>
          <Link to="/" style={styles.navLink}>Home</Link>
        </header>
        <div style={styles.guestContainer}>
          <div style={styles.avatarCircle}>
            <span style={{ fontSize: '30px' }}>👤</span>
          </div>
          <h2 style={styles.guestTitle}>Hey Guest 👋</h2>
          <p style={styles.guestSub}>Login to manage your account</p>
          <Link to="/login" style={styles.loginButton}>
            <span style={styles.loginText}>Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Account</h1>
        <Link to="/" style={styles.navLink}>Home</Link>
      </header>

      <div style={styles.card}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={styles.avatarCircle}>
            <span style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <h2 style={styles.name}>{user?.name || 'User'}</h2>
          <p style={styles.email}>{user?.email || 'No email'}</p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.menuItem}>
          <span style={{ marginRight: '14px', fontSize: '22px' }}>📦</span>
          <span style={styles.menuText}>My Orders</span>
        </div>
        <div style={styles.menuItem}>
          <span style={{ marginRight: '14px', fontSize: '22px' }}>📍</span>
          <span style={styles.menuText}>My Address</span>
        </div>
        <div style={styles.menuItem}>
          <span style={{ marginRight: '14px', fontSize: '22px' }}>❓</span>
          <span style={styles.menuText}>Help</span>
        </div>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        <span style={styles.logoutText}>Logout</span>
      </button>
    </div>
  );
};

export default Account;

