// Session Store - Using localStorage for web
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSessionStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      profileData: null,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
        }),

      setProfile: (profileData) =>
        set({
          profileData,
          isLoggedIn: !!profileData,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      clearSession: () =>
        set({
          user: null,
          isLoggedIn: false,
          profileData: null,
        }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSessionStore;

