import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import orderingStore from "../store/orderingStore";
import useSessionStore from "../store/useSessionStore";
import useAuthStore from "../store/useAuthStore";
import "./CheckoutComponent.css";

const CheckoutComponent = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    updateQty,
    deleteCartItem,
    getCart,
    merchantData,
    getMerchant,
  } = orderingStore();

  const { user } = useSessionStore();
  const { profile, getProfile } = useAuthStore();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [pointsInput, setPointsInput] = useState("");
  const [pointsDiscount, setPointsDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getCart();
    getMerchant();
    getProfile();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.total || i.price * i.quantity),
    0
  );

  const total = subtotal - discount - pointsDiscount;
  const availablePoints = profile?.total_points || 0;

  const applyCoupon = async () => {
    const res = await fetch(
      "https://api.rmtechsolution.com/apply_coupon.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: subtotal }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setDiscount(data.discount);
    } else {
      alert(data.message);
    }
  };

  const applyPoints = () => {
    const pts = Number(pointsInput);
    const pointValue = 1;
    setPointsDiscount(pts * pointValue);
  };

  const createOrder = async (type) => {
    if (!profile?.address) {
      alert("Please add delivery address");
      navigate("/saved-address");
      return;
    }

    setProcessing(true);

    try {
      const orderRes = await fetch(
        "https://api.rmtechsolution.com/razorpay.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            currency: "INR",
            merchant_id: merchantData?.merchantId,
            user_id: user?.id,
          }),
        }
      );

      const order = await orderRes.json();

      if (type === "COD") {
        alert("Order placed successfully");
        navigate("/order-history");
        return;
      }

      const options = {
        key: merchantData?.keyId,
        amount: order.amount,
        currency: "INR",
        name: merchantData?.name,
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          await fetch(
            "https://api.rmtechsolution.com/create_order.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                user_id: user?.id,
                merchant_id: merchantData?.merchantId,
                items: cartItems,
                address: profile?.address,
                amount: total,
                couponDiscount: discount,
                pointsDiscount: pointsDiscount,
                orderType: "online",
                status: "success",
              }),
            }
          );

          alert("Payment successful");
          navigate("/order-history");
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },

        theme: { color: "#E50914" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment error");
    }

    setProcessing(false);
  };

  return (
    <div className="checkout-container">

      <header className="checkout-header">
        <h1>Checkout</h1>
        <Link to="/">Home</Link>
      </header>

      {/* ADDRESS */}

      <div className="checkout-card">
        <h3>Delivery Address</h3>

        {profile?.address ? (
          <>
            <p>{profile.address.building}</p>
            <p>{profile.address.street}</p>
            <p>
              {profile.address.city} - {profile.address.pincode}
            </p>

            <button
              className="btn-primary"
              onClick={() => navigate("/account/saved-address")}
            >
              Change Address
            </button>
          </>
        ) : (
          <button
            className="btn-primary"
            onClick={() => navigate("/saved-address")}
          >
            Add Address
          </button>
        )}
      </div>

      {/* CART ITEMS */}

      {cartItems.map((item) => (
        <div key={item.cart_id} className="cart-item">
          <div>
            <img
              src={item.images[0] || "https://via.placeholder.com/80"}
              alt={item.item_name}
              className="cart-item-image"
              style={{ width: "60px", height: "60px", objectFit: "cover",borderRadius:"8px" }}
            />
            <h4>{item.item_name}</h4>
            <p className="price">₹{item.total}</p>
          </div>

          <div className="qty-control">
            <button onClick={() => updateQty(item.cart_id, "dec")}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQty(item.cart_id, "inc")}>+</button>

            <button
              className="delete-btn"
              onClick={() => deleteCartItem(item.cart_id)}
            >
              🗑
            </button>
          </div>
        </div>
      ))}

      {/* COUPON */}

      <div className="checkout-card">
        <h3>Have a coupon?</h3>

        <div className="input-row">
          <input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          <button onClick={applyCoupon}>Apply</button>
        </div>
      </div>

      {/* POINTS */}

      <div className="checkout-card">
        <h3> Redeem Points (Available Points: {availablePoints})</h3>

        <div className="input-row">
          <input
            placeholder="Enter points"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
          />

          <button onClick={applyPoints}>Redeem</button>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="checkout-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="summary-row discount">
            <span>Coupon Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        {pointsDiscount > 0 && (
          <div className="summary-row discount">
            <span>Points Discount</span>
            <span>-₹{pointsDiscount}</span>
          </div>
        )}

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* PAYMENT OPTIONS */}

      <div className="payment-options">
        <button
          className={`payment-btn ${
            paymentMethod === "online" ? "active" : ""
          }`}
          onClick={() => setPaymentMethod("online")}
        >
          Pay Online
        </button>

        <button
          className={`payment-btn ${
            paymentMethod === "COD" ? "active" : ""
          }`}
          onClick={() => setPaymentMethod("COD")}
        >
          Cash on Delivery
        </button>
      </div>

      <button
        className="checkout-btn"
        disabled={!paymentMethod || processing}
        onClick={() => createOrder(paymentMethod)}
      >
        {processing ? "Processing..." : "Continue"}
      </button>
    </div>
  );
};

export default CheckoutComponent;