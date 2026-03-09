import React from 'react';

const ProfileComponent = ({ user = null, profileData = null, uiConfig = {} }) => {
  const userData = user || profileData;

  const styles = {
    container: {
      backgroundColor: '#1C1C1C',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    avatarCircle: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      backgroundColor: uiConfig?.primaryColor || '#E50914',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#fff',
    },
    name: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '4px',
    },
    email: {
      fontSize: '13px',
      color: '#888',
      textAlign: 'center',
      marginBottom: '8px',
    },
    phone: {
      fontSize: '13px',
      color: '#888',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    referralSection: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #2A2A2A',
    },
    referralLabel: {
      fontSize: '12px',
      color: '#888',
      marginBottom: '6px',
    },
    referralCode: {
      fontSize: '14px',
      fontWeight: '600',
      color: uiConfig?.primaryColor || '#E50914',
      backgroundColor: '#2A2A2A',
      padding: '8px 12px',
      borderRadius: '6px',
      textAlign: 'center',
      marginBottom: '12px',
      fontFamily: 'monospace',
    },
    shareBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: uiConfig?.primaryColor || '#E50914',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    guestContainer: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#2A2A2A',
      borderRadius: '12px',
    },
    guestTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '8px',
    },
    guestSub: {
      fontSize: '14px',
      color: '#888',
      marginBottom: '20px',
    },
    loginBtn: {
      padding: '10px 24px',
      backgroundColor: uiConfig?.primaryColor || '#E50914',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
  };

  if (!userData) {
    return (
      <div style={styles.guestContainer}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
        <h2 style={styles.guestTitle}>Hey Guest 👋</h2>
        <p style={styles.guestSub}>Login to manage your account</p>
        <a href="/login">
          <button
            style={styles.loginBtn}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#d40710')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = uiConfig?.primaryColor || '#E50914')}
          >
            Login Now
          </button>
        </a>
      </div>
    );
  }

  const handleShareReferral = async () => {
    if (!userData?.referral_code) {
      alert('Referral code not available');
      return;
    }

    const shareText = `🎉 Join using my referral code: ${userData.referral_code}\n\nDownload the app and earn rewards!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Referral Code',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled or error:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Referral code copied to clipboard!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.avatarCircle}>
        {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>

      <div style={styles.name}>{userData?.name || 'User'}</div>
      <div style={styles.email}>{userData?.email || 'email@example.com'}</div>

      {userData?.phone && (
        <div style={styles.phone}>
          📞 {userData.phone}
        </div>
      )}

      {userData?.referral_code && (
        <div style={styles.referralSection}>
          <div style={styles.referralLabel}>Referral Code</div>
          <div style={styles.referralCode}>
            {userData.referral_code}
          </div>
          <button
            style={styles.shareBtn}
            onClick={handleShareReferral}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#d40710')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = uiConfig?.primaryColor || '#E50914')}
          >
            📤 Share Referral Code
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
