import { create } from 'zustand';
import { createClient } from '../utils/supabase/client';

interface User {
  id: string | null;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, router: any) => void;
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: false,
  setUser: (user: any) => {
    set({
      user: {
        id: user?.id ?? null,
        name: user?.user_metadata?.full_name ?? '',
        email: user?.user_metadata?.email ?? '',
        avatar: user?.user_metadata?.avatar ?? '',
      },
    });
  },
  setLoading: (loading: boolean) => set({ loading }),

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false });
      return { error };
    }
    set({
      user: {
        id: data.user.id,
        name: data.user.user_metadata?.name || 'Anonymous', // Default to 'Anonymous' if name is missing
        email: data.user.user_metadata?.email || '',
        avatar: data.user.user_metadata?.avatar || '',
      },
    });
    set({ loading: false });
    return data.user;
  },

  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },

  // checkAuth: async () => {
  //   const supabase = createClient();
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();

  //   set({
  //     user: session?.user ?? null,
  //     loading: false,
  //   });

  //   return session;
  // },
}));
