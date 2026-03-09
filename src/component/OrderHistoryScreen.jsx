import React from 'react';

const OrderHistoryScreen = ({ orderHistoryResponse = [], uiConfig = {} }) => {
  const styles = {
    container: {
      padding: '16px',
    },
    orderCard: {
      backgroundColor: '#2A2A2A',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '12px',
      borderLeft: `4px solid ${uiConfig?.accentColor || '#E50914'}`,
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      alignItems: 'center',
    },
    orderDate: {
      fontSize: '13px',
      color: '#888',
    },
    orderTotal: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: uiConfig?.accentColor || '#E50914',
    },
    orderItemsCount: {
      fontSize: '12px',
      color: '#ccc',
      marginTop: '6px',
    },
    orderStatus: {
      fontSize: '12px',
      padding: '6px 12px',
      borderRadius: '4px',
      backgroundColor: '#3A3A3A',
      color: '#fff',
      marginTop: '8px',
      display: 'inline-block',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#888',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '12px',
    },
  };

  if (!orderHistoryResponse || orderHistoryResponse.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📦</div>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
          No orders yet
        </p>
        <p style={{ fontSize: '13px' }}>
          Your order history will appear here
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {orderHistoryResponse.map((order, idx) => (
        <div key={idx} style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <span style={styles.orderDate}>
              {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span style={styles.orderTotal}>
              ₹ {parseFloat(order.totalAmount || order.total || '0').toFixed(2)}
            </span>
          </div>

          <div style={styles.orderItemsCount}>
            Order #{order.id || idx + 1}
            {order.itemCount && ` • ${order.itemCount} item${order.itemCount > 1 ? 's' : ''}`}
          </div>

          <span style={styles.orderStatus}>
            {order.status || 'Completed'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryScreen;
