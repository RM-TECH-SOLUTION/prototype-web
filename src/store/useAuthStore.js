import { create } from 'zustand';
import apiClient from '../api/apiClient';
import useSessionStore from './useSessionStore';

const useAuthStore = create((set) => ({
  loading: false,
  success: false,
  errorMessage: null,
  profile: null,

  loginUser: async (identity, password) => {
    set({ errorMessage: null, success: false });

    if (!identity || !password) {
      alert("Please enter email/phone and password");
      return false;
    }

    set({ loading: true });

    try {
      const payload = { identity, password };
      const result = await apiClient.post(apiClient.Urls.login, payload);

      if (result?.success) {
        const session = useSessionStore.getState();
        session.setUser(result.user);
        set({ success: true, errorMessage: null });
        return true;
      } else {
        alert(result?.message || "Invalid credentials");
        set({ success: false, errorMessage: result?.message });
        return false;
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error.message);
      set({ success: false, errorMessage: error.message });
      alert("Network error: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  registerUser: async (name, email, phone, password, referralCode = null, gender = null) => {
    set({ errorMessage: null, success: false });

    if (!name || !email || !phone || !password) {
      alert("All fields are required");
      return false;
    }

    set({ loading: true });

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        referral_code: referralCode,
        gender
      };
      const result = await apiClient.post(apiClient.Urls.register, payload);

      if (result?.success) {
        const session = useSessionStore.getState();
        session.setUser(result.user);
        set({ success: true, errorMessage: null });
        return true;
      } else {
        alert(result?.message || "Registration failed");
        set({ success: false, errorMessage: result?.message });
        return false;
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error.message);
      set({ success: false, errorMessage: error.message });
      alert("Network error: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  saveUserAddress: async (address) => {
    set({ loading: true });
    try {
      const result = await apiClient.post(
        apiClient.Urls.saveUserAddress,
        { address: address }
      );

      if (result?.success) {
        alert("Address saved successfully");
      } else {
        alert(result?.message || "Failed to save address");
      }

      return result;
    } catch (error) {
      console.error("SAVE ADDRESS ERROR:", error.message);
      alert("Network error: " + error.message);
    } finally {
      set({ loading: false });
    }
  },

  getProfile: async () => {
    const session = useSessionStore.getState();
    set({ loading: true });

    try {
      const result = await apiClient.post(apiClient.Urls.getProfile);
      console.log(result, "profile result");

      if (result?.success) {
        set({ profile: result?.user });
        session.setProfile(result?.user);
      }
      return result;
    } catch (error) {
      console.error("GET PROFILE ERROR:", error.message);
    } finally {
      set({ loading: false });
    }
  },

  logoutUser: () => {
    const session = useSessionStore.getState();
    session.clearSession();
    set({ success: false, errorMessage: null, profile: null });
  },
}));

export default useAuthStore;

