// stores/sessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  isLoggedIn: boolean;
  accessToken: string | null;
  role: string | null;
  clearSession: () => void;
  setSession: (data: { accessToken: string; role: string }) => void;
  // New state for tracking hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      role: null,
      _hasHydrated: false, // Initial state: NOT hydrated

      setSession: (data) =>
        set({
          isLoggedIn: true,
          accessToken: data.accessToken,
          role: data.role,
        }),

      clearSession: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          role: null,
        }),

      setHasHydrated: (state) =>
        set({
          _hasHydrated: state,
        }),
    }),
    {
      name: "session-storage", // key for localStorage
      onRehydrateStorage: () => (state) => {
        // This function runs after the data is pulled from storage
        state?.setHasHydrated(true);
      },
    }
  )
);
