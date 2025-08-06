import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user, isLoaded) => set({ user, isLoaded }),
}));
