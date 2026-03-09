import React from 'react';

const SplashScreen = ({ fadeOut = false }) => {
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1C1C1C',
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: fadeOut ? 'none' : 'auto',
    },
    content: {
      textAlign: 'center',
    },
    logo: {
      width: '120px',
      height: '120px',
      borderRadius: '12px',
      backgroundColor: '#E50914',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '60px',
      fontWeight: 'bold',
      color: '#fff',
      boxShadow: '0 10px 40px rgba(229, 9, 20, 0.3)',
      margin: '0 auto',
    },
    text: {
      marginTop: '20px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#fff',
    },
    subtitle: {
      marginTop: '8px',
      fontSize: '13px',
      color: '#888',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logo}>P</div>
        <div style={styles.text}>Prototype</div>
        <div style={styles.subtitle}>Loading...</div>
      </div>
    </div>
  );
};

export default SplashScreen;
