import { create } from 'zustand';
import { supabase } from '../supabase';
import { useProfile } from './useProfile';
import { useCartStore } from './useCart';

export const useAuth = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  _listener: null,

  // Initialize session and auth listener
init: async () => {
  // Prevent duplicate listener setup
  if (get()._listener) return;

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();
  set({ session, user: session?.user || null, loading: false });

  // Set up the auth state change listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      const currentUser = get().user;
      const newUser = session?.user || null;

      // Only update state if the user has actually changed
      if (
        (!currentUser && newUser) ||
        (currentUser && !newUser) ||
        (currentUser?.id !== newUser?.id)
      ) {
        set({ session, user: newUser, loading: false });

        // If there's a user, fetch profile and cart
        if (newUser) {
          const userId = newUser.id;

          // Fetch profile
          useProfile.getState().fetchProfile(userId);

          // Fetch or create cart
          const { data: cartData, error: cartError } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (!cartError && cartData) {
            const cartStore = useCartStore.getState();
            cartStore.setCartId(cartData.id);
            cartStore.fetchCart(userId);
          }
        }
      } else {
        // If user is unchanged, do nothing
        console.log("Auth event ignored: user unchanged");
      }
    }
  );

  // Store the listener so we can clean it up later
  set({ _listener: subscription });
}
,

  // Signup with profile + cart fetch
  signUp: async (email, password, firstname, lastname, avatarUrl) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.signUp({ email, password });
    set({ loading: false, error: error?.message || null });

    if (!error && data.user) {
      const { user } = data;

      // Insert into profiles table
      await supabase.from('users').insert({
        supabase_uid: user.id,
        email,
        name: firstname + " " + lastname,
        avatar_url: avatarUrl,
      });

      // Fetch profile into Zustand
      useProfile.getState().fetchProfile(user.id);

      // Fetch cart (trigger ensures cart exists)
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cartError && cartData) {
        useCartStore.getState().setCartId(cartData.id);
        useCartStore.getState().fetchCart(user.id);
      }
    }

    return { error };
  },

  // Sign in with password + fetch profile + fetch cart
  signIn: async (email, password) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }

    const user = data.user;

    // Fetch profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_uid', user.id)
      .single();

    if (profileError) {
      set({ loading: false });
      throw profileError;
    }

    set({ user, profile, loading: false });

    // Fetch cart
    const { data: cartData, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!cartError && cartData) {
      useCartStore.getState().setCartId(cartData.id);
      useCartStore.getState().fetchCart(user.id);
    }
  },

  // Sign out
  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, loading: false });
    useCartStore.getState().clearCart();
  },

  clearError: () => set({ error: null }),
}));
