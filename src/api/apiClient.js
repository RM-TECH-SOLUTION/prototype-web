import axios from 'axios';
import { config } from '../config';

const BASE_URL = String(config.baseUrl || '').replace(/\/+$/, '');

export let DEFAULT_MERCHANT_ID = Number(config.merchantId || 0);

export const setMerchantId = (id) => {
  DEFAULT_MERCHANT_ID = Number(id || 0);
};

const API_URLS = {
  register: '/register.php',
  login: '/login.php',
  updateOrAddUser: '/registration-update.php',
  loginVerification: '/loginVerification.php',
  getCatalog: '/catalog.php',
  getItem: '/item.php',
  getCmsByMerchant: '/getCmsByMerchant.php',
  getAddCart: '/add_to_cart.php',
  getCart: '/get_cart.php',
  updateCartQty: '/update_cart_qty.php',
  deleteCartItem: '/delete_cart_item.php',
  getCatalogueModels: '/getCatalogueModels.php',
  getCatalogueItems: '/getCatalogueItems.php',
  clearCart: '/clear_cart.php',
  razorpay: '/razorpay.php',
  createOrder: '/create_order.php',
  getMerchant: '/getMerchant.php',
  saveUserAddress: '/save_user_address.php',
  getProfile: '/get_profile.php',
  getLoyaltySettings: '/get_loyalty_settings.php',
  apply_coupon: '/apply_coupon.php',
  order_history: '/order_history.php',
  getMainCatalogues: '/getMainCatalogues',
};

const getStoredUserId = async () => {
  try {
    const { default: useSessionStore } = await import('../store/useSessionStore');
    const { user } = useSessionStore.getState();
    return user?.id || null;
  } catch {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.Urls = API_URLS;

apiClient.withContext = async (params = {}) => {
  const {
    forceMerchantId,
    merchant_id: _merchantIdLegacy,
    merchantId: _merchantIdCamel,
    user_id,
    userId,
    ...rest
  } = params;

  const storedUserId = await getStoredUserId();
  const merchantValue = forceMerchantId ?? DEFAULT_MERCHANT_ID;

  return {
    ...rest,
    merchantId: merchantValue,
    merchant_id: merchantValue,
    user_id: user_id ?? userId ?? storedUserId,
  };
};

apiClient.get = async (url, params = {}) => {
  try {
    const contextParams = await apiClient.withContext(params);
    const response = await apiClient.request({
      method: 'get',
      url,
      params: contextParams,
    });
    return response.data;
  } catch (error) {
    console.error(`API GET Error [${error?.response?.status}] ${url}:`, {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};

apiClient.post = async (url, body = {}) => {
  try {
    const contextBody = await apiClient.withContext(body);
    const response = await apiClient.request({
      method: 'post',
      url,
      data: contextBody,
      headers: apiClient.defaults.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`API POST Error [${error?.response?.status}] ${url}:`, {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};

export const getMerchantNameFromUrl = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const merchantParam = urlParams.get('merchant');
    if (merchantParam) {
      return merchantParam.toLowerCase().trim();
    }

    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (
      parts.length >= 4 &&
      parts[parts.length - 3] === 'storehub' &&
      parts[parts.length - 2] === 'co' &&
      parts[parts.length - 1] === 'in'
    ) {
      return parts[0];
    }
    return null;
  } catch {
    return null;
  }
};

export const findMerchantByName = async (merchantName) => {
  try {
    const response = await axios.get(`${apiClient.defaults.baseURL}/findMerchant.php`, {
      params: { name: merchantName },
    });
    return response.data?.data || response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to find merchant';
    console.error(`Merchant lookup failed for "${merchantName}":`, errorMessage);
    return { error: true, message: errorMessage };
  }
};

export default apiClient;

