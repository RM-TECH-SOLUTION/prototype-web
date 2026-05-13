import React, { useEffect, useState } from "react";
import OrderHistoryScreen from "../component/OrderHistoryScreen";
import orderingStore from "../store/orderingStore";
import useCmsStore from "../store/useCmsStore";
import useAuthStore from "../store/useAuthStore";

const OrderHistoryContainer = () => {
  const { orderHistory, orderHistoryResponse, loading } = orderingStore();
  const { cmsData } = useCmsStore();
  const { getProfile } = useAuthStore();
  const [uiConfig, setUiConfig] = useState({});

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find((item) => item.modelSlug === "orderHistoryConfig");

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setUiConfig(formatted);
  }, [cmsData]);

  useEffect(() => {
    orderHistory();
    getProfile();
  }, []);

  return (
    <OrderHistoryScreen
      orderHistoryResponse={orderHistoryResponse}
      uiConfig={uiConfig}
      loading={loading}
    />
  );
};

export default OrderHistoryContainer;
