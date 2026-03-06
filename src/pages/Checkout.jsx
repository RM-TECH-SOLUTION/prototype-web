import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSessionStore from '../store/useSessionStore';

const Checkout = () => {
  const { user, isLoggedIn } = useSessionStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      padding: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    backButton: {
      marginRight: '15px',
      color: '#fff',
      fontSize: '24px',
      cursor: 'pointer',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    card: {
      backgroundColor: '#1A1A1A',
      padding: '16px',
      borderRadius: '18px',
      marginBottom: '16px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '800',
      marginBottom: '15px',
      color: '#E50914',
    },
    addressCard: {
      padding: '15px',
      borderRadius: '12px',
      backgroundColor: '#2A2A2A',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: '#444',
      backgroundColor: '#222',
      color: '#fff',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '15px',
      borderTopWidth: '1px',
      borderTopColor: '#333',
      marginTop: '10px',
    },
    totalLabel: {
      fontSize: '16px',
      fontWeight: '700',
    },
    totalValue: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#E50914',
    },
    payButton: {
      backgroundColor: '#E50914',
      padding: '16px',
      borderRadius: '14px',
      alignItems: 'center',
      marginTop: '20px',
    },
    payText: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: '800',
    },
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
    },
    emptyText: {
      color: '#999',
      fontSize: '16px',
      marginBottom: '20px',
    },
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>Please login to checkout</p>
          <Link to="/login" style={styles.payButton}>
            <span style={styles.payText}>Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.backButton}>←</Link>
        <h1 style={styles.title}>Checkout</h1>
      </header>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Delivery Address</h3>
        <div style={styles.addressCard}>
          <input
            type="text"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Order Summary</h3>
        <p style={{ color: '#999' }}>No items in cart</p>
      </div>

      <div style={styles.card}>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalValue}>₹0.00</span>
        </div>
      </div>

      <button style={styles.payButton}>
        <span style={styles.payText}>Pay Now</span>
      </button>
    </div>
  );
};

export default Checkout;

