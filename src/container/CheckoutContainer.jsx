import React, { useEffect, useState } from 'react';
import CheckoutComponent from '../component/CheckoutComponent';
import orderingStore from '../store/orderingStore';
import useAuthStore from '../store/useAuthStore';
import useCmsStore from '../store/useCmsStore';
import useSessionStore from '../store/useSessionStore';

const CheckoutContainer = () => {
  const {
    getCart,
    cartItems,
    loading,
    updateQty,
    deleteCartItem,
    getMerchant,
    merchantData,
    clearCart,
    loyaltySettings,
    apply_coupon,
  } = orderingStore();

  const { saveUserAddress, getProfile, profile } = useAuthStore();
  const { cmsData } = useCmsStore();
  const { profileData, user } = useSessionStore();

  const [checkoutUi, setCheckoutUi] = useState({});
  const [addressUiConfig, setAddressUiConfig] = useState({});

  useEffect(() => {
    getCart();
    getMerchant();
    getProfile();
  }, [getCart, getMerchant, getProfile]);

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find(
      (item) => item.modelSlug === 'checkoutPageConfiguration'
    );

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setCheckoutUi(formatted);
  }, [cmsData]);

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find(
      (item) => item.modelSlug === 'addressPageConfiguration'
    );

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setAddressUiConfig(formatted);
  }, [cmsData]);

  return (
    <CheckoutComponent
      cartItems={cartItems}
      loading={loading}
      updateQty={updateQty}
      deleteCartItem={deleteCartItem}
      getCart={getCart}
      merchantData={merchantData}
      clearCart={clearCart}
      saveUserAddress={saveUserAddress}
      profile={profile}
      user={user}
      getProfile={getProfile}
      uiConfig={checkoutUi}
      addressUiConfig={addressUiConfig}
      loyaltySettings={loyaltySettings}
      profileData={profileData}
      apply_coupon={apply_coupon}
    />
  );
};

export default CheckoutContainer;

