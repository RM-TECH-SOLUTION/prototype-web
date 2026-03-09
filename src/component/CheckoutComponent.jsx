import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderingStore from '../store/orderingStore';
import useSessionStore from '../store/useSessionStore';
import useAuthStore from '../store/useAuthStore';
import './CheckoutComponent.css';

const CheckoutComponent = () => {
  const { cartItems, catalogItems, getCart, updateQty, deleteCartItem, loading, getMerchant, merchantData, getCatalogItems, getCatalogModels, selectedCatalogId } = orderingStore();
  const { user } = useSessionStore();
  const { getProfile, profile } = useAuthStore();
  const navigate = useNavigate();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [itemsWithImages, setItemsWithImages] = useState([]);

  useEffect(() => {
    getCart();
    getMerchant();
    getProfile();
    getCatalogModels();
  }, []);

  // Whenever cart items change, try to load catalog items to get images
  useEffect(() => {
    if (cartItems.length === 0) return;
    
    // If we don't have catalog items, try to load from the first catalog
    const state = orderingStore.getState();
    if (state.catalogModels && state.catalogModels.length > 0 && !state.catalogItems?.length) {
      getCatalogItems(state.catalogModels[0].id);
    }
  }, [cartItems.length]);

  // Merge cart items with catalog items to get images
  useEffect(() => {
    if (cartItems.length > 0 && catalogItems.length > 0) {
      const itemsMap = new Map();
      catalogItems.forEach(catItem => {
        const images = Array.isArray(catItem.images) ? catItem.images : 
                      Array.isArray(catItem.image) ? catItem.image : 
                      catItem.image ? [catItem.image] : [];
        itemsMap.set(catItem.id, {
          ...catItem,
          image: images[0] || 'https://via.placeholder.com/80'
        });
      });

      const mergedItems = cartItems.map(cartItem => ({
        ...cartItem,
        image: itemsMap.get(cartItem.item_id)?.image || 'https://via.placeholder.com/80'
      }));

      setItemsWithImages(mergedItems);
    } else {
      setItemsWithImages(cartItems);
    }
  }, [cartItems, catalogItems]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    if (!cartItems.length) {
      alert('Cart is empty');
      return;
    }

    setProcessingPayment(true);

    try {
      const total = calculateTotal();
      const orderId = `ORD-${Date.now()}-${user.id}`;

      // Create Razorpay order from backend
      const orderResponse = await fetch('https://api.rmtechsolution.com/razorpay.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Razorpay expects amount in paise
          currency: 'INR',
          receipt: orderId,
          merchant_id: 9,
          user_id: user.id,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.id) {
        alert('Failed to create order');
        setProcessingPayment(false);
        return;
      }

      // Open Razorpay checkout
    const options = {
  key: merchantData?.keyId,
  amount: orderData.amount,
  currency: "INR",
  name: merchantData?.name || "RM Tech Solution",
  description: "Order Payment",
  order_id: orderData.id,

  handler: async function (response) {

    if (response.razorpay_payment_id) {

      await fetch("https://api.rmtechsolution.com/create_order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderData.id,
          payment_id: response.razorpay_payment_id,
          merchant_id: merchantData?.merchantId,
          user_id: user?.id,
          items: cartItems,
          amount: total,
          orderType: "online",
          status: "success",
        }),
      });

      alert("Payment successful");

      await getCart();
      navigate("/order-history");
    }
  },

  prefill: {
    name: user?.name,
    email: user?.email,
    contact: user?.phone,
  },

  theme: {
    color: "#E50914",
  },
};

      const rzp = new window.Razorpay(options);
      console.log("Opening Razorpay with options:", rzp);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error processing payment: ' + error.message);
    } finally {
      setProcessingPayment(false);
    }
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
          {itemsWithImages.map((item) => (
            <div key={item.cart_id} style={styles.cartItem}>
              <img 
                src={item.image} 
                alt={item.item_name}
                style={styles.itemImage}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
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
                    onClick={() => updateQty(item.cart_id, 'dec')}
                  >−</button>
                  <span style={styles.qtyText}>{item.quantity}</span>
                  <button 
                    style={styles.qtyButton}
                    onClick={() => updateQty(item.cart_id, 'inc')}
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
            <button 
              style={{...styles.checkoutButton, opacity: processingPayment ? 0.6 : 1}}
              onClick={handleCheckout}
              disabled={processingPayment}
            >
              {processingPayment ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutComponent;

