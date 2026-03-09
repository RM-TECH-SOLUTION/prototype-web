import React, { useEffect, useState } from 'react';
import OrderHistoryScreen from '../component/OrderHistoryScreen';
import orderingStore from '../store/orderingStore';
import useCmsStore from '../store/useCmsStore';

const OrderHistoryContainer = () => {
  const { orderHistory, orderHistoryResponse, loading } = orderingStore();
  const { cmsData } = useCmsStore();
  const [uiConfig, setUiConfig] = useState({});

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find(
      (item) => item.modelSlug === 'orderHistoryConfig'
    );

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setUiConfig(formatted);
  }, [cmsData]);

  useEffect(() => {
    orderHistory();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      color: '#fff',
      padding: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: uiConfig?.titleColor || '#fff',
    },
    loadingText: {
      textAlign: 'center',
      color: '#888',
      padding: '40px 20px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{uiConfig?.title || 'Order History'}</h1>

      {loading && <div style={styles.loadingText}>Loading orders...</div>}

      {!loading && (
        <OrderHistoryScreen
          orderHistoryResponse={orderHistoryResponse}
          uiConfig={uiConfig}
        />
      )}
    </div>
  );
};

export default OrderHistoryContainer;
