// Ordering Store - Cart and Catalog Management
import { create } from 'zustand';
import apiClient from '../api/apiClient';

const orderingStore = create((set, get) => ({
  loading: false,
  success: false,
  errorMessage: null,

  // Catalog
  catalogModels: [],
  catalogItems: [],
  selectedCatalogId: null,

  // Cart
  cartItems: [],
  merchantData: null,

  /* ================= GET CATALOG MODELS ================= */
  getCatalogModels: async () => {
    set({ loading: true, errorMessage: null });

    try {
      const res = await apiClient.get(apiClient.Urls.getCatalogueModels);

      if (res?.success) {
        set({ catalogModels: res.data || [] });
      } else {
        set({
          catalogModels: [],
          errorMessage: res?.message || "Failed to load catalogs",
        });
      }
    } catch (err) {
      console.log("getCatalogModels error", err);
      set({ errorMessage: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= GET ITEMS BY CATALOG ================= */
  getCatalogItems: async (catalogueModelId) => {
    set({
      loading: true,
      errorMessage: null,
      selectedCatalogId: catalogueModelId,
    });

    try {
      const res = await apiClient.get(
        apiClient.Urls.getCatalogueItems,
        { catalogueModelId }
      );

      if (res?.success) {
        set({ catalogItems: res.data || [] });
      } else {
        set({
          catalogItems: [],
          errorMessage: res?.message || "No items found",
        });
      }
    } catch (err) {
      console.log("getCatalogItems error", err);
      set({ errorMessage: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= GET CART ================= */
  getCart: async () => {
    set({ loading: true, errorMessage: null });

    try {
      const res = await apiClient.get(apiClient.Urls.getCart);

      if (res?.success) {
        set({ cartItems: res.cart || [] });
      } else {
        set({
          cartItems: [],
          errorMessage: res?.message || "Cart empty",
        });
      }
    } catch (err) {
      console.log("getCart error", err);
      set({ errorMessage: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= GET MERCHANT ================= */
  getMerchant: async () => {
    set({ loading: true, errorMessage: null });

    try {
      const res = await apiClient.get(apiClient.Urls.getMerchant);

      if (res?.success) {
        set({ merchantData: res.data || [] });
      } else {
        set({
          merchantData: [],
          errorMessage: res?.message || "merchant empty",
        });
      }
    } catch (err) {
      console.log("merchantData error", err);
      set({ errorMessage: err.message });
    } finally {
      set({ loading: false });
    }
  },

  /* ================= ADD TO CART ================= */
  addToCart: async ({
    item_id,
    item_name,
    description = "",
    price,
    compare_price = null,
    quantity = 1,
    variant_id = null,
    variant_name = null
  }) => {
    set({ loading: true, errorMessage: null });

    try {
      const payload = {
        item_id,
        item_name,
        description,
        price,
        compare_price,
        quantity
      };

      if (variant_id) {
        payload.variant_id = variant_id;
        payload.variant_name = variant_name;
      }

      const res = await apiClient.post(
        apiClient.Urls.getAddCart,
        payload
      );

      if (res?.success) {
        get().getCart();
        return true;
      } else {
        set({ errorMessage: res?.message || "Add to cart failed" });
        return false;
      }
    } catch (err) {
      console.log("addToCart error", err);
      set({ errorMessage: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  /* ================= UPDATE QTY ================= */
  updateQty: async (cart_id, type) => {
    set({ loading: true, errorMessage: null });

    try {
      const res = await apiClient.post(
        apiClient.Urls.updateCartQty,
        { cart_id, type }
      );

      if (res?.success) {
        get().getCart();
        return true;
      } else {
        set({ errorMessage: res?.message || "Update failed" });
        return false;
      }
    } catch (err) {
      console.log("updateQty error", err);
      set({ errorMessage: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  /* ================= DELETE CART ITEM ================= */
  deleteCartItem: async (cart_id) => {
    set({ loading: true, errorMessage: null });

    try {
      const res = await apiClient.post(
        apiClient.Urls.deleteCartItem,
        { cart_id }
      );

      if (res?.success) {
        get().getCart();
        return true;
      } else {
        set({ errorMessage: res?.message || "Delete failed" });
        return false;
      }
    } catch (err) {
      console.log("deleteCartItem error", err);
      set({ errorMessage: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  /* ================= CLEAR CART ================= */
  clearCart: async () => {
    set({ loading: true, errorMessage: null });

    try {
      const res = await apiClient.get(apiClient.Urls.clearCart);

      if (res?.success) {
        set({ cartItems: [] });
        return true;
      } else {
        set({ errorMessage: res?.message || "Clear failed" });
        return false;
      }
    } catch (err) {
      console.log("clearCart error", err);
      set({ errorMessage: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

export default orderingStore;

