import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import AddAddressComponent from "./AddAddressComponent";
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
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const profileToUse = profile || profileData || {};
  const availablePoints = profileToUse?.total_points || 0;

  // Match app: read enableCOD / enableOnline from uiConfig
  const enableCOD = uiConfig?.enableCOD;
  const enableOnline = uiConfig?.enableOnline;

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

  const handleAddressSave = async (data) => {
    if (saveUserAddress) {
      await saveUserAddress(data);
    }
    if (getProfile) {
      await getProfile();
    }
    alert("Address saved");
  };

  const createOrder = async (type) => {
    if (!profileToUse?.address) {
      alert("Please add delivery address");
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
        if (clearCart) {
          await clearCart();
        }
        if (getCart) {
          await getCart();
        }

        setAppliedCoupon(null);
        setDiscount(0);
        setCouponCode("");
        setAppliedPoints(null);
        setPointsDiscount(0);
        setPointsInput("");
        setPaymentMethod(null);

        alert("Order placed successfully");
        setShowPaymentSheet(false);
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

          if (clearCart) {
            await clearCart();
          }
          if (getCart) {
            await getCart();
          }

          setAppliedCoupon(null);
          setDiscount(0);
          setCouponCode("");
          setAppliedPoints(null);
          setPointsDiscount(0);
          setPointsInput("");
          setPaymentMethod(null);

          alert("Payment successful");
          setShowPaymentSheet(false);
          navigate("/order-history");
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#E50914" },
        modal: {
          ondismiss: async function () {
            await fetch(apiClient.Urls.createOrder, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: order.id,
                merchant_id: merchantData?.merchantId,
                user_id: user?.id,
                phone: user?.phone,
                items: cartItems,
                address: JSON.stringify(profileToUse?.address || {}),
                amount: Number(total),
                orderType: "online",
                couponDiscount: discount || 0,
                pointsDiscount: pointsDiscount || 0,
                status: "failure",
              }),
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {
        await fetch(apiClient.Urls.createOrder, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: order.id,
            merchant_id: merchantData?.merchantId,
            user_id: user?.id,
            phone: user?.phone,
            items: cartItems,
            address: JSON.stringify(profileToUse?.address || {}),
            amount: Number(total),
            orderType: "online",
            couponDiscount: discount || 0,
            pointsDiscount: pointsDiscount || 0,
            status: "failure",
          }),
        });

        alert("Payment cancelled");
      });

      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment error");
    } finally {
      setProcessing(false);
    }
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
        <button className="checkout-back-btn" onClick={() => navigate(-1)}>
          &#8592;
        </button>
        <h1 style={{ color: uiConfig?.headerTextColor || "#fff" }}>Checkout</h1>
        <div style={{ width: 32 }} />
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
          <AddAddressComponent
            onSave={handleAddressSave}
            uiConfig={addressUiConfig}
            getProfile={getProfile}
          />
        )}
      </div>

      {/* CART ITEMS */}
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      ) : (
        cartItems.map((item) => (
          <div key={item.cart_id} className="cart-item">
            <div className="cart-item-info">
              <img
                src={item.images?.[0] || "https://via.placeholder.com/80"}
                alt={item.item_name}
                className="cart-item-image"
              />
              <div>
                <h4>{item.item_name}</h4>
                {item.variant_name && <p className="variant-name">{item.variant_name}</p>}
                <p className="price">₹{item.total}</p>
              </div>
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
        ))
      )}

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

      {/* PAY BUTTON — opens payment sheet */}
      <div className="checkout-bottom">
        <span className="bottom-total">₹{total}</span>
        <button
          className="pay-btn"
          style={{
            backgroundColor: uiConfig?.primaryColor || "#E50914",
            color: uiConfig?.primaryTextColor || "#fff",
          }}
          onClick={() => setShowPaymentSheet(true)}
        >
          Pay ₹{total}
        </button>
      </div>

      {/* PAYMENT SHEET OVERLAY — matches app modal */}
      {showPaymentSheet && (
        <div className="payment-overlay" onClick={() => setShowPaymentSheet(false)}>
          <div className="payment-sheet" onClick={(e) => e.stopPropagation()}>

            <div className="sheet-header">
              <span className="sheet-title">Choose Payment Method</span>
              <button className="sheet-close" onClick={() => setShowPaymentSheet(false)}>✕</button>
            </div>

            {/* REDEEM POINTS */}
            <div
              className="coupon-card"
              style={{ borderColor: uiConfig?.primaryColor || "#E50914" }}
            >
              {appliedPoints ? (
                <div className="coupon-row-between">
                  <div>
                    <p className="coupon-title">Points Applied</p>
                    <p className="coupon-applied-text">{appliedPoints} Points</p>
                  </div>
                  <button className="remove-btn" onClick={removePoints}>Remove</button>
                </div>
              ) : (
                <>
                  <p className="coupon-title">
                    Redeem Points (Available: {availablePoints})
                  </p>
                  <p className="coupon-hint">
                    Max: {loyaltySettings?.max_redeem_points} pts or {loyaltySettings?.max_redeem_percentage}% of order
                  </p>
                  <div className="coupon-row">
                    <input
                      className="coupon-input"
                      placeholder="Enter points"
                      value={pointsInput}
                      type="number"
                      onChange={(e) => setPointsInput(e.target.value)}
                    />
                    <button
                      className="apply-btn"
                      style={{ backgroundColor: uiConfig?.primaryColor || "#E50914" }}
                      onClick={applyPoints}
                    >
                      Redeem
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* COUPON */}
            <div
              className="coupon-card"
              style={{ borderColor: uiConfig?.primaryColor || "#E50914" }}
            >
              {appliedCoupon ? (
                <div className="coupon-row-between">
                  <div>
                    <p className="coupon-title">Coupon Applied</p>
                    <p className="coupon-applied-text">{appliedCoupon}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => { setAppliedCoupon(null); setDiscount(0); setCouponCode(""); }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <p className="coupon-title">Have a coupon?</p>
                  <div className="coupon-row">
                    <input
                      className="coupon-input"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      className="apply-btn"
                      style={{ backgroundColor: uiConfig?.primaryColor || "#E50914" }}
                      onClick={applyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* PAYMENT OPTIONS — controlled by CMS config same as app */}
            {(enableOnline === true || enableOnline === "true") && (
              <button
                className={`payment-option-btn ${paymentMethod === "online" ? "active-option" : ""}`}
                style={paymentMethod === "online" ? { borderColor: uiConfig?.primaryColor || "#E50914" } : {}}
                onClick={() => setPaymentMethod("online")}
              >
                <div className="option-row">
                  <div>
                    <span className="option-label">Pay Online</span>
                    <span className="option-amount">₹{total}</span>
                  </div>
                  {paymentMethod === "online" && <span className="check-icon">✓</span>}
                </div>
              </button>
            )}

            {(enableCOD === true || enableCOD === "true") && (
              <button
                className={`payment-option-btn ${paymentMethod === "COD" ? "active-option" : ""}`}
                style={paymentMethod === "COD" ? { borderColor: uiConfig?.primaryColor || "#E50914" } : {}}
                onClick={() => setPaymentMethod("COD")}
              >
                <div className="option-row">
                  <div>
                    <span className="option-label">Cash on Delivery</span>
                    <span className="option-amount">₹{total}</span>
                  </div>
                  {paymentMethod === "COD" && <span className="check-icon">✓</span>}
                </div>
              </button>
            )}

            {/* PRICE BREAKDOWN */}
            <div className="price-breakdown">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="summary-row discount"><span>Coupon Discount</span><span>-₹{discount}</span></div>
              )}
              {pointsDiscount > 0 && (
                <div className="summary-row discount"><span>Points Discount</span><span>-₹{pointsDiscount}</span></div>
              )}
              <div className="sheet-divider" />
              <div className="summary-row total"><span>Total Payable</span><span>₹{total}</span></div>
            </div>

            {/* CONTINUE */}
            <button
              className="continue-btn"
              style={paymentMethod ? { backgroundColor: uiConfig?.primaryColor || "#E50914" } : {}}
              disabled={!paymentMethod || processing}
              onClick={() => createOrder(paymentMethod)}
            >
              {processing ? "Processing..." : "Continue"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutComponent;
