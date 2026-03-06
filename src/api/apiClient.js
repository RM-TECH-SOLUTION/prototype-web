// API Client - Same as React Native version

const BASE_URL = "https://api.rmtechsolution.com/";
const merchantId = 9;

const URLS = {
  register: BASE_URL + "register.php",
  login: BASE_URL + "login.php",
  updateOrAddUser: BASE_URL + "registration-update.php",
  loginVerification: BASE_URL + "loginVerification.php",
  getCatalog: BASE_URL + "catalog.php",
  getItem: BASE_URL + "item.php",
  getCmsByMerchant: BASE_URL + "getCmsByMerchant.php",
  getAddCart: BASE_URL + "add_to_cart.php",
  getCart: BASE_URL + "get_cart.php",
  updateCartQty: BASE_URL + "update_cart_qty.php",
  deleteCartItem: BASE_URL + "delete_cart_item.php",
  getCatalogueModels: BASE_URL + "getCatalogueModels.php",
  getCatalogueItems: BASE_URL + "getCatalogueItems.php",
  clearCart: BASE_URL + "clear_cart.php",
  razorpay: BASE_URL + "razorpay.php",
  getMerchant: BASE_URL + "getMerchant.php",
  saveUserAddress: BASE_URL + "save_user_address.php",
  getProfile: BASE_URL + "get_profile.php"
};

const apiClient = {
  Urls: URLS,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },

  async make(url, method = "GET", params = {}) {
    // Get user from session store (dynamically imported to avoid circular dependency)
    const { default: useSessionStore } = await import('../store/useSessionStore');
    const { user } = useSessionStore.getState();
    const userId = user?.id || null;

    // Always attach merchant_id & user_id
    const finalParams = {
      merchant_id: merchantId,
      user_id: userId,
      ...params,
    };

    const hasParams = Object.keys(finalParams).length > 0;

    const queryString =
      method === "GET" && hasParams
        ? "?" + new URLSearchParams(finalParams).toString()
        : "";

    const reqUrl = url + queryString;

    console.log(`🚀 [${method}] Request → ${reqUrl}`);

    try {
      const response = await fetch(reqUrl, {
        method,
        headers: this.headers,
        mode: 'cors',
        ...(method !== "GET"
          ? { body: JSON.stringify(finalParams) }
          : {}),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("❌ Server returned non-JSON:", text);
        throw new Error("Invalid JSON response");
      }

      console.log("📡 Response →", data);
      return data;

    } catch (error) {
      console.error(`🔥 API Error (${url}):`, error);
      throw error;
    }
  },

  get(url, params = {}) {
    return this.make(url, "GET", params);
  },

  post(url, params = {}) {
    return this.make(url, "POST", params);
  },
};

export default apiClient;

