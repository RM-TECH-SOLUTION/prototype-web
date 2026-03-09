import React, { useEffect, useState } from 'react';
import useCmsStore from '../store/useCmsStore';

const MerchantInfoContainer = () => {
  const { cmsData } = useCmsStore();
  const [uiConfig, setUiConfig] = useState({});
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find(
      (item) => item.modelSlug === 'merchantInfo'
    );

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setUiConfig(formatted);
  }, [cmsData]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      color: '#fff',
      padding: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: uiConfig?.headingColor || '#fff',
    },
    card: {
      backgroundColor: '#2A2A2A',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    merchantName: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: uiConfig?.merchantNameColor || '#fff',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #3A3A3A',
      cursor: 'pointer',
    },
    rowText: {
      marginLeft: '12px',
      fontSize: '14px',
      color: '#ccc',
    },
    actionColor: {
      color: uiConfig?.actionColor || '#E50914',
      marginRight: '8px',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      borderBottom: '1px solid #3A3A3A',
    },
    tab: {
      padding: '12px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      fontSize: '14px',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s',
    },
    activeTab: {
      color: uiConfig?.actionColor || '#E50914',
      borderBottomColor: uiConfig?.actionColor || '#E50914',
    },
    content: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#ccc',
    },
  };

  const handleCall = () => {
    if (uiConfig?.merchantPhoneNumber) {
      window.location.href = `tel:${uiConfig.merchantPhoneNumber}`;
    }
  };

  const handleLocation = () => {
    if (uiConfig?.merchantLocation) {
      window.open(uiConfig.merchantLocation, '_blank');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{uiConfig?.merchantName || 'Merchant Info'}</h1>
      </div>

      <div style={styles.card}>
        <h2 style={styles.merchantName}>{uiConfig?.merchantName || 'Support'}</h2>

        <div style={styles.row} onClick={handleCall} role="button">
          <span style={styles.actionColor}>📞</span>
          <span style={styles.rowText}>{uiConfig?.merchantPhoneNumber || 'Contact us'}</span>
        </div>

        <div style={styles.row} onClick={handleLocation} role="button">
          <span style={styles.actionColor}>📍</span>
          <span style={styles.rowText}>
            {uiConfig?.merchantLocationName || 'View Location'}
          </span>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'info' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('info')}
        >
          Info
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'terms' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('terms')}
        >
          Terms & Conditions
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'privacy' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy Policy
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'info' && (
          <div>
            <h3 style={{ marginBottom: '12px', color: '#fff' }}>About Us</h3>
            <p>{uiConfig?.aboutUs || 'Visit our location and get in touch with our team.'}</p>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              Available during business hours
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <h3 style={{ marginBottom: '12px', color: '#fff' }}>Terms & Conditions</h3>
            <p>{uiConfig?.termsAndConditions || 'Please review our terms before using our services.'}</p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h3 style={{ marginBottom: '12px', color: '#fff' }}>Privacy Policy</h3>
            <p>{uiConfig?.privacyPolicy || 'Your privacy is important to us.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantInfoContainer;
