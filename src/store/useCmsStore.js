import { create } from 'zustand';
import apiClient from '../api/apiClient';

const useCmsStore = create((set) => ({
  cmsData: null,
  loading: false,
  error: null,

  getCmsData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await apiClient.get(apiClient.Urls.getCmsByMerchant);
      set({ cmsData: data, loading: false });
    } catch (error) {
      console.error("CMS ERROR:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useCmsStore;

