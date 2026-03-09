import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddAddressComponent from './AddAddressComponent';
import useAuthStore from '../store/useAuthStore';
import useCmsStore from '../store/useCmsStore';

const SavedAddressComponent = () => {
  const { profile, getProfile, saveUserAddress } = useAuthStore();
  const { cmsData } = useCmsStore();
  const [address, setAddress] = useState(null);
  const [uiConfig, setUiConfig] = useState({});

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find(
      (item) => item.modelSlug === 'addressPageConfiguration'
    );

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setUiConfig(formatted);
  }, [cmsData]);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile?.address) {
      setAddress({
        ...profile.address,
        id: 'profile-address',
      });
    }
  }, [profile]);

  const handleSaveAddress = (newAddress) => {
    setAddress({
      ...newAddress,
      id: 'profile-address',
    });
    saveUserAddress(newAddress);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: uiConfig?.pageBgColor || '#0F0F0F',
      color: '#fff',
      padding: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid #2A2A2A',
    },
    backLink: {
      color: uiConfig?.headerTextColor || '#888',
      textDecoration: 'none',
      fontSize: '20px',
      cursor: 'pointer',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: uiConfig?.headerTextColor || '#fff',
    },
    content: {
      marginBottom: '40px',
    },
    card: {
      backgroundColor: '#1C1C1C',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '20px',
      borderLeft: `4px solid ${uiConfig?.primaryColor || '#E50914'}`,
    },
    cardRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#888',
    },
    addressName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '8px',
    },
    addressDetails: {
      fontSize: '13px',
      color: '#ccc',
      lineHeight: '1.6',
      marginBottom: '4px',
    },
    emptyText: {
      textAlign: 'center',
      color: '#888',
      padding: '40px 20px',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/account" style={styles.backLink}>
          ← Back
        </Link>
        <h1 style={styles.title}>{uiConfig?.pageTitle || 'Delivery Address'}</h1>
      </div>

      <div style={styles.content}>
        {address ? (
          <div style={styles.card}>
            <div style={styles.cardRow}>
              <span style={{ color: uiConfig?.primaryColor || '#E50914' }}>📍</span>
              <span style={styles.cardTitle}>Saved Address</span>
            </div>

            <div style={styles.addressName}>{address.building}</div>

            <div style={styles.addressDetails}>
              {address.doorNo}, {address.street}
            </div>

            {address.landmark && (
              <div style={styles.addressDetails}>{address.landmark}</div>
            )}

            <div style={styles.addressDetails}>
              {address.city} - {address.pincode} - {address.state}
            </div>
          </div>
        ) : (
          <div style={styles.emptyText}>
            <p>No address added yet</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
              Add your delivery address to proceed with checkout
            </p>
          </div>
        )}
      </div>

      <AddAddressComponent onSave={handleSaveAddress} uiConfig={uiConfig} />
    </div>
  );
};

export default SavedAddressComponent;
