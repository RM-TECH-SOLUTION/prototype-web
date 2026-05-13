import React from "react";
import { useNavigate } from "react-router-dom";

const steps = ["pending", "accepted", "shipped", "delivered"];

const stepLabels = {
  pending: "Order",
  accepted: "Accepted",
  shipped: "Shipped",
  delivered: "Delivered"
};

const OrderHistoryScreen = ({ orderHistoryResponse = [], uiConfig = {}, loading = false }) => {
  const navigate = useNavigate();

  const backgroundColor = uiConfig?.backgroundColor || "#0F0F0F";
  const cardBackgroundColor = uiConfig?.cardBackgroundColor || "#1C1C1C";
  const progressBarColor = uiConfig?.progressBarColor || "#444";
  const progressBarFillColor = uiConfig?.progressBarFillColor || "#4CAF50";
  const titleColor = uiConfig?.cardTextTitleColor || "#fff";
  const subTitleColor = uiConfig?.cardTextSubTitleColor || "#aaa";

  const renderProgress = (status) => {
    const currentStep = steps.indexOf((status || "").toLowerCase());

    return (
      <div style={styles.progressContainer}>
        {steps.map((step, index) => {
          const active = index <= currentStep;

          return (
            <div key={step} style={styles.step}>
              <div
                style={{
                  ...styles.circle,
                  backgroundColor: active ? progressBarFillColor : progressBarColor
                }}
              />

              {index !== steps.length - 1 && (
                <div
                  style={{
                    ...styles.line,
                    backgroundColor: index < currentStep ? progressBarFillColor : progressBarColor
                  }}
                />
              )}

              <span
                style={{
                  ...styles.stepLabel,
                  color: active ? progressBarFillColor : subTitleColor
                }}
              >
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderOrderCard = (item, idx) => {
    const product = item?.items?.[0] || {};

    const image =
      product?.images?.[0] ||
      product?.image?.[0] ||
      product?.image ||
      "https://via.placeholder.com/100";

    const name = product?.item_name || product?.name || "Product";
    const dateSource = item?.created_at || item?.createdAt || Date.now();
    const date = new Date(dateSource).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    return (
      <div key={item?.order_id || idx} style={{ ...styles.card, backgroundColor: cardBackgroundColor }}>
        <div style={styles.topRow}>
          <div style={styles.leftCol}>
            <img src={image} alt={name} style={styles.image} />
            <div style={{ ...styles.miniText, color: "gold" }}>
              Earn Points:- {item?.earned_points || 0}
            </div>
          </div>

          <div style={styles.rightCol}>
            <div style={{ ...styles.name, color: titleColor }}>{name}</div>

            {!!product?.variant_name && (
              <div style={{ ...styles.meta, color: subTitleColor }}>{product.variant_name}</div>
            )}

            <div style={{ ...styles.meta, color: subTitleColor }}>
              Order ID: {item?.order_id || item?.id || idx + 1}
            </div>
            <div style={{ ...styles.meta, color: subTitleColor }}>Ordered on {date}</div>
            <div style={{ ...styles.meta, color: subTitleColor }}>
              Total Discount:- {item?.discount || 0}
            </div>
            <div style={{ ...styles.price, color: titleColor }}>₹{item?.amount || item?.total || 0}</div>
          </div>
        </div>

        <div style={styles.progressWrap}>{renderProgress(item?.order_status || item?.status)}</div>
      </div>
    );
  };

  return (
    <div style={{ ...styles.page, backgroundColor }}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ←
        </button>

        <h1 style={{ ...styles.title, color: titleColor }}>Order History</h1>

        <div style={styles.headerSpacer} />
      </div>

      {loading && <div style={styles.loading}>Loading orders...</div>}

      {!loading && (!orderHistoryResponse || orderHistoryResponse.length === 0) && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <p style={styles.emptyTitle}>No orders yet</p>
          <p style={styles.emptySubTitle}>Your order history will appear here</p>
        </div>
      )}

      {!loading && orderHistoryResponse?.length > 0 && (
        <div style={styles.list}>{orderHistoryResponse.map(renderOrderCard)}</div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh"
  },
  header: {
    backgroundColor: "#111",
    padding: "18px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  backBtn: {
    width: "26px",
    height: "26px",
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    lineHeight: 1
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800
  },
  headerSpacer: {
    width: "26px"
  },
  loading: {
    textAlign: "center",
    color: "#aaa",
    padding: "22px"
  },
  list: {
    padding: "20px"
  },
  card: {
    borderRadius: "20px",
    marginBottom: "14px",
    padding: "16px"
  },
  topRow: {
    display: "flex",
    flexDirection: "row"
  },
  leftCol: {
    marginRight: "15px"
  },
  rightCol: {
    flex: 1
  },
  image: {
    width: "85px",
    height: "85px",
    borderRadius: "12px",
    objectFit: "cover"
  },
  miniText: {
    marginTop: "4px",
    fontSize: "12px"
  },
  name: {
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.3,
    maxWidth: "70%"
  },
  meta: {
    fontSize: "12px",
    marginTop: "2px"
  },
  price: {
    fontSize: "16px",
    fontWeight: 700,
    marginTop: "4px"
  },
  progressWrap: {
    marginLeft: "12px"
  },
  progressContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "12px"
  },
  step: {
    flex: 1,
    textAlign: "center",
    position: "relative"
  },
  circle: {
    width: "14px",
    height: "14px",
    borderRadius: "7px",
    margin: "0 auto"
  },
  line: {
    position: "absolute",
    top: "6px",
    left: "50%",
    width: "100%",
    height: "3px"
  },
  stepLabel: {
    display: "block",
    marginTop: "6px",
    fontSize: "10px",
    textTransform: "capitalize"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#888"
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px"
  },
  emptyTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600
  },
  emptySubTitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "13px"
  }
};

export default OrderHistoryScreen;
