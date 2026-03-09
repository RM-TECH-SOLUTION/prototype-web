import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';

const AddAddressComponent = ({ onSave, uiConfig = {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { saveUserAddress } = useAuthStore();

  const SERVICEABLE_PINCODES = uiConfig?.serviceablePincodes
    ? uiConfig.serviceablePincodes.split(',').map(p => p.trim())
    : [];

  const [address, setAddress] = useState({
    building: '',
    doorNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Use reverse geocoding API (you may need to implement this with a service like Google Maps)
            console.log('Location:', latitude, longitude);
            
            // For now, just show a message
            alert('Location detected. Please fill in the address details manually.');
            setLoading(false);
          },
          (error) => {
            alert('Unable to access location: ' + error.message);
            setLoading(false);
          }
        );
      }
    } catch (err) {
      alert('Error: ' + err.message);
      setLoading(false);
    }
  };

  const handleSave = () => {
    const { building, doorNo, street, city, state, pincode } = address;

    if (!building || !doorNo || !street || !city || !state || !pincode) {
      alert('Please fill all required fields.');
      return;
    }

    if (SERVICEABLE_PINCODES.length && !SERVICEABLE_PINCODES.includes(pincode)) {
      alert('Service not available in this area.');
      return;
    }

    saveUserAddress(address);
    onSave && onSave(address);

    setAddress({
      building: '',
      doorNo: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
    });

    setShowModal(false);
  };

  const styles = {
    addBtn: {
      backgroundColor: uiConfig?.buttonBgColor || '#E50914',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginBottom: '20px',
      transition: 'all 0.3s',
    },
    modalOverlay: {
      display: showModal ? 'flex' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      alignItems: 'flex-end',
    },
    modalContent: {
      backgroundColor: uiConfig?.modalBgColor || '#1C1C1C',
      color: '#fff',
      width: '100%',
      maxHeight: '90vh',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: '20px',
      overflowY: 'auto',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.3)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid #2A2A2A',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: uiConfig?.titleColor || '#fff',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '24px',
      cursor: 'pointer',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#888',
      marginBottom: '6px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #3A3A3A',
      backgroundColor: '#2A2A2A',
      color: '#fff',
      fontSize: '14px',
      transition: 'border-color 0.3s',
    },
    inputFocus: {
      borderColor: uiConfig?.accentColor || '#E50914',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    saveBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: uiConfig?.buttonBgColor || '#E50914',
      color: '#fff',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s',
    },
    cancelBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #3A3A3A',
      backgroundColor: 'transparent',
      color: '#ccc',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s',
    },
    locationBtn: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#2A2A2A',
      border: '1px solid #3A3A3A',
      color: '#E50914',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '12px',
    },
  };

  return (
    <>
      <button
        style={styles.addBtn}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#d40710')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = uiConfig?.buttonBgColor || '#E50914')}
      >
        {uiConfig?.addAddressText || '+ Add Delivery Address'}
      </button>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
              <h2 style={styles.title}>Add Address</h2>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <button
              style={styles.locationBtn}
              onClick={handleGetLocation}
              disabled={loading}
            >
              {loading ? 'Getting location...' : '📍 Use Current Location'}
            </button>

            {/* Form Fields */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Building/House Name *</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Building/Apt name"
                value={address.building}
                onChange={(e) => handleInputChange('building', e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Door/Flat Number *</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Door/Flat number"
                value={address.doorNo}
                onChange={(e) => handleInputChange('doorNo', e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Street *</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Street"
                value={address.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Landmark (Optional)</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Landmark"
                value={address.landmark}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City *</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>State *</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pincode *</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
                onMouseEnter={(e) => (e.target.backgroundColor = '#3A3A3A')}
              >
                Cancel
              </button>
              <button
                style={styles.saveBtn}
                onClick={handleSave}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#d40710')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = uiConfig?.buttonBgColor || '#E50914')}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAddressComponent;
