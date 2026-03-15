import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./CheckoutComponent.css";

const CheckoutComponent = ({
  cartItems = [],
  getCart,
  merchantData,
  updateQty,
  deleteCartItem,
  clearCart,
  saveUserAddress,
  getProfile,
  profile,
  user,
  uiConfig = {},
  addressUiConfig = {},
  loyaltySettings,
  profileData,
  apply_coupon,
  loading,
}) => {
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [pointsInput, setPointsInput] = useState("");
  const [appliedPoints, setAppliedPoints] = useState(null);
  const [pointsDiscount, setPointsDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const profileToUse = profile || profileData || {};
  const availablePoints = profileToUse?.total_points || 0;

  useEffect(() => {
    if (getCart) getCart();
    if (getProfile) getProfile();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay checkout script");
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [getCart, getProfile]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, i) => sum + Number(i.total || i.price * i.quantity || 0),
        0
      ),
    [cartItems]
  );

  const total = useMemo(() => {
    const value = subtotal - discount - pointsDiscount;
    return value > 0 ? value : 0;
  }, [subtotal, discount, pointsDiscount]);

  const maxRedeemablePoints = useMemo(() => {
    if (!loyaltySettings) return 0;

    const maxRedeemPercentage = Number(loyaltySettings?.max_redeem_percentage || 0);
    const pointValue = Number(loyaltySettings?.point_value || 1);
    const maxRedeemPoints = Number(loyaltySettings?.max_redeem_points || 0);
    const userPoints = Number(availablePoints || 0);

    const percentLimit = (subtotal * maxRedeemPercentage) / 100;
    const percentPoints = pointValue ? percentLimit / pointValue : 0;

    const maxPoints = Math.min(userPoints, maxRedeemPoints, percentPoints);
    return Math.floor(maxPoints);
  }, [subtotal, availablePoints, loyaltySettings]);

  const applyCoupon = async () => {
    if (!apply_coupon) {
      alert("Coupon service not available");
      return;
    }

    const res = await apply_coupon(couponCode, subtotal);
    if (res?.success) {
      setDiscount(res?.discount || 0);
      setAppliedCoupon(couponCode);
      setCouponCode("");
    } else {
      alert(res?.message || "Invalid coupon");
    }
  };

  const applyPoints = () => {
    if (!loyaltySettings?.enable_redeem) {
      alert("Redeem Disabled");
      return;
    }

    const pts = Number(pointsInput);
    if (!pts || pts <= 0) {
      alert("Enter valid points");
      return;
    }

    if (pts > availablePoints) {
      alert(`Insufficient Points. You only have ${availablePoints} points`);
      return;
    }

    if (pts < (loyaltySettings?.min_redeem_points || 0)) {
      alert(
        `Minimum redeem is ${loyaltySettings?.min_redeem_points || 0} points`
      );
      return;
    }

    if (pts > maxRedeemablePoints) {
      alert(`You can redeem maximum ${maxRedeemablePoints} points`);
      return;
    }

    const discountValue = pts * Number(loyaltySettings?.point_value || 1);
    setAppliedPoints(pts);
    setPointsDiscount(discountValue);
  };

  const removePoints = () => {
    setAppliedPoints(null);
    setPointsDiscount(0);
    setPointsInput("");
  };

  const createOrder = async (type) => {
    if (!profileToUse?.address) {
      alert("Please add delivery address");
      navigate("/saved-address");
      return;
    }

    setProcessing(true);

    try {
      // Create order on server (same as native app)
      const order = await fetch(apiClient.Urls.createOrder, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(total),
          merchant_id: merchantData?.merchantId,
          keyId: merchantData?.keyId,
          keySecret: merchantData?.keySecret,
          user_id: user?.id,
          phone: user?.phone,
          items: cartItems,
          orderType: type,
          couponDiscount: discount || 0,
          pointsDiscount: pointsDiscount || 0,
          address: JSON.stringify(profileToUse?.address || {}),
        }),
      }).then((res) => res.json());

      if (!order?.success) {
        alert(order?.message || "Order failed");
        return;
      }

      // Cash on Delivery
      if (type === "COD") {
        if (clearCart) clearCart();
        if (getCart) getCart();

        alert("Order placed successfully");
        navigate("/order-history");
        return;
      }

      // Online payment
      if (!razorpayLoaded || !window.Razorpay) {
        alert("Payment gateway is not ready yet. Please try again in a moment.");
        return;
      }

      const options = {
        key: order.key || merchantData?.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: merchantData?.name,
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          await fetch(apiClient.Urls.createOrder, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              user_id: user?.id,
              merchant_id: merchantData?.merchantId,
              items: cartItems,
              address: JSON.stringify(profileToUse?.address || {}),
              amount: total,
              couponDiscount: discount,
              pointsDiscount: pointsDiscount,
              orderType: "online",
              status: "success",
            }),
          });

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
    <div
      className="checkout-container"
      style={{ backgroundColor: uiConfig?.backgroundColor || "#0B0B0F" }}
    >
      <header
        className="checkout-header"
        style={{ backgroundColor: uiConfig?.headerBgColor || "#111" }}
      >
        <h1>Checkout</h1>
        <Link to="/">Home</Link>
      </header>

      {/* ADDRESS */}
      <div className="checkout-card">
        <h3>Delivery Address</h3>

        {profileToUse?.address ? (
          <>
            <p>{profileToUse.address.building}</p>
            <p>{profileToUse.address.street}</p>
            <p>
              {profileToUse.address.city} - {profileToUse.address.pincode}
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
              src={item.images?.[0] || "https://via.placeholder.com/80"}
              alt={item.item_name}
              className="cart-item-image"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
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
        {appliedCoupon ? (
          <div className="coupon-row-between">
            <div>
              <p className="coupon-title">Coupon Applied</p>
              <p className="coupon-applied-text">{appliedCoupon}</p>
            </div>
            <button
              className="secondary-btn"
              onClick={() => {
                setAppliedCoupon(null);
                setDiscount(0);
                setCouponCode("");
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <h3>Have a coupon?</h3>
            <div className="input-row">
              <input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
          </>
        )}

        {discount > 0 && (
          <p className="discount-text">Coupon applied: -₹{discount}</p>
        )}
      </div>

      {/* POINTS */}
      <div className="checkout-card">
        <h3>Redeem Points (Available Points: {availablePoints})</h3>
        <div className="input-row">
          <input
            placeholder="Enter points"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
          />
          <button onClick={applyPoints}>Redeem</button>
          <button
            className="secondary-btn"
            onClick={removePoints}
            disabled={!appliedPoints}
          >
            Remove
          </button>
        </div>
        {pointsDiscount > 0 && (
          <p className="discount-text">Points discount: -₹{pointsDiscount}</p>
        )}
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
        disabled={
          !paymentMethod ||
          processing ||
          (paymentMethod === "online" && !razorpayLoaded)
        }
        onClick={() => createOrder(paymentMethod)}
      >
        {processing ? "Processing..." : "Continue"}
      </button>
    </div>
  );
};

export default CheckoutComponent;
