import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderingStore from '../store/orderingStore';
import './CheckoutComponent.css';

const CheckoutComponent = () => {
  const { cartItems, getCart, updateQty, deleteCartItem, loading } = orderingStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    alert('Proceeding to payment...');
    // Razorpay integration would go here
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      color: '#fff',
      padding: '20px',
      paddingBottom: '100px',
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
    emptyCart: {
      textAlign: 'center',
      padding: '50px 20px',
    },
    emptyIcon: {
      fontSize: '60px',
      marginBottom: '20px',
    },
    emptyText: {
      fontSize: '18px',
      color: '#aaa',
      marginBottom: '20px',
    },
    shopButton: {
      backgroundColor: '#E50914',
      color: '#fff',
      padding: '15px 30px',
      borderRadius: '30px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    cartItem: {
      display: 'flex',
      backgroundColor: '#2A2A2A',
      borderRadius: '15px',
      padding: '15px',
      marginBottom: '15px',
    },
    itemImage: {
      width: '80px',
      height: '80px',
      borderRadius: '10px',
      objectFit: 'cover',
      marginRight: '15px',
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    itemPrice: {
      fontSize: '16px',
      color: '#E50914',
      fontWeight: 'bold',
    },
    itemVariant: {
      fontSize: '12px',
      color: '#aaa',
      marginBottom: '10px',
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    qtyButton: {
      width: '30px',
      height: '30px',
      borderRadius: '15px',
      border: '1px solid #E50914',
      backgroundColor: 'transparent',
      color: '#E50914',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyText: {
      fontSize: '16px',
      fontWeight: 'bold',
      minWidth: '30px',
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ff4444',
      cursor: 'pointer',
      fontSize: '20px',
      marginLeft: '10px',
    },
    summary: {
      backgroundColor: '#2A2A2A',
      borderRadius: '15px',
      padding: '20px',
      marginTop: '20px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    summaryLabel: {
      color: '#aaa',
    },
    summaryValue: {
      fontWeight: 'bold',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
      paddingTop: '15px',
      borderTopWidth: '1px',
      borderTopColor: '#444',
      borderTopStyle: 'solid',
    },
    totalLabel: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    totalValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#E50914',
    },
    checkoutButton: {
      backgroundColor: '#E50914',
      color: '#fff',
      padding: '15px',
      borderRadius: '30px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Checkout</h1>
        <Link to="/" style={styles.navLink}>Home</Link>
      </header>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <div style={styles.emptyIcon}>🛒</div>
          <p style={styles.emptyText}>Your cart is empty</p>
          <button style={styles.shopButton} onClick={() => navigate('/')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.cart_id} style={styles.cartItem}>
              <img 
                src={item.image || 'https://via.placeholder.com/80'} 
                alt={item.item_name}
                style={styles.itemImage}
              />
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.item_name}</h3>
                {item.variant_name && (
                  <p style={styles.itemVariant}>{item.variant_name}</p>
                )}
                <p style={styles.itemPrice}>₹{item.price}</p>
                <div style={styles.quantityControl}>
                  <button 
                    style={styles.qtyButton}
                    onClick={() => updateQty(item.cart_id, 'decrease')}
                  >-</button>
                  <span style={styles.qtyText}>{item.quantity}</span>
                  <button 
                    style={styles.qtyButton}
                    onClick={() => updateQty(item.cart_id, 'increase')}
                  >+</button>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => deleteCartItem(item.cart_id)}
                  >🗑️</button>
                </div>
              </div>
            </div>
          ))}

          <div style={styles.summary}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal</span>
              <span style={styles.summaryValue}>₹{calculateTotal()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Delivery</span>
              <span style={styles.summaryValue}>Free</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax</span>
              <span style={styles.summaryValue}>₹0</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>₹{calculateTotal()}</span>
            </div>
            <button style={styles.checkoutButton} onClick={handleCheckout}>
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutComponent;

