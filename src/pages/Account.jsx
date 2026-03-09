import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileComponent from '../component/ProfileComponent';
import useSessionStore from '../store/useSessionStore';
import useAuthStore from '../store/useAuthStore';
import useCmsStore from '../store/useCmsStore';

const Account = () => {
  const { user, isLoggedIn, profileData } = useSessionStore();
  const { logoutUser, getProfile } = useAuthStore();
  const { cmsData } = useCmsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      getProfile();
    }
  }, [isLoggedIn]);

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
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#2A2A2A',
      borderRadius: '12px',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    menuItemHover: {
      backgroundColor: '#3A3A3A',
    },
    menuIcon: {
      marginRight: '14px',
      fontSize: '20px',
    },
    menuText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
    },
    logoutButton: {
      width: '100%',
      backgroundColor: '#E50914',
      color: '#fff',
      padding: '15px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'all 0.3s',
    },
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Account</h1>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
        </header>
        <ProfileComponent user={null} uiConfig={{}} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Account</h1>
        <Link to="/" style={styles.navLink}>
          Home
        </Link>
      </header>

      <ProfileComponent user={user} uiConfig={{}} />

      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          Account Settings
        </h2>

        <Link to="/order-history" style={{ textDecoration: 'none' }}>
          <div
            style={styles.menuItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3A3A3A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2A2A2A')}
          >
            <span style={styles.menuIcon}>📦</span>
            <span style={styles.menuText}>Order History</span>
          </div>
        </Link>

        <Link to="/account/saved-address" style={{ textDecoration: 'none' }}>
          <div
            style={styles.menuItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3A3A3A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2A2A2A')}
          >
            <span style={styles.menuIcon}>📍</span>
            <span style={styles.menuText}>My Address</span>
          </div>
        </Link>

        <Link to="/help" style={{ textDecoration: 'none' }}>
          <div
            style={styles.menuItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3A3A3A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2A2A2A')}
          >
            <span style={styles.menuIcon}>❓</span>
            <span style={styles.menuText}>Help & Support</span>
          </div>
        </Link>
      </div>

      <button
        style={styles.logoutButton}
        onClick={handleLogout}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#d40710')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#E50914')}
      >
        Logout
      </button>
    </div>
  );
};

export default Account;

