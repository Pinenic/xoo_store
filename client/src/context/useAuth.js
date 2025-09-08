import { create } from 'zustand';
import { supabase } from '../supabase';
import { useProfile } from './useProfile';
import { useCartStore } from './useCart';

// Helper: Ensure user folder is created before proceeding
async function initUserFolderEnsureCreated(userId, retries = 3, delayMs = 500) {
  const edgeFunctionUrl = `${import.meta.env.VITE_EDGE_FUNCTION_CUF}/functions/v1/init-user-folder`; // replace with your function name

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANNON_KEY}`, // optional if public
        },
        body: JSON.stringify({ user: { id: userId } }),
      });

      const result = await res.json();
      if (res.ok) return result;

      console.warn(`Edge Function attempt ${attempt} failed:`, result.error);
    } catch (err) {
      console.warn(`Edge Function attempt ${attempt} threw an error:`, err);
    }

    if (attempt < retries) await new Promise(res => setTimeout(res, delayMs));
  }

  throw new Error('Failed to initialize user folder after multiple attempts.');
}

export const useAuth = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  _listener: null,

  // Initialize session and auth listener
  init: async () => {
    if (get()._listener) return;

    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, loading: false });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = get().user;
        const newUser = session?.user || null;

        if ((!currentUser && newUser) || (currentUser && !newUser) || (currentUser?.id !== newUser?.id)) {
          set({ session, user: newUser, loading: false });

          if (newUser) {
            const userId = newUser.id;

            // Ensure storage folder exists
            try {
              await initUserFolderEnsureCreated(userId);
            } catch (err) {
              console.error('Error creating user folder in listener:', err.message);
              set({ error: 'Failed to initialize user storage.' });
            }

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
          console.log("Auth event ignored: user unchanged");
        }
      }
    );

    set({ _listener: subscription });
  },

  // Signup with profile + cart fetch + storage folder
  signUp: async (email, password, firstname, lastname, avatarUrl) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.signUp({ email, password });
    set({ loading: false, error: error?.message || null });

    if (!error && data.user) {
      const { user } = data;

      await supabase.from('users').insert({
        supabase_uid: user.id,
        email,
        name: firstname + " " + lastname,
        avatar_url: avatarUrl,
      });

      // Ensure storage folder exists before proceeding
      try {
        await initUserFolderEnsureCreated(user.id);
      } catch (err) {
        console.error('Error creating user folder:', err.message);
        set({ error: 'Failed to initialize user storage. Please try again.' });
        return { error: err.message };
      }

      // Fetch profile into Zustand
      useProfile.getState().fetchProfile(user.id);

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
    }

    return { error };
  },

  // Sign in with password + fetch profile + fetch cart
  signIn: async (email, password) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }

    const user = data.user;

    // Ensure storage folder exists
    try {
      await initUserFolderEnsureCreated(user.id);
    } catch (err) {
      console.error('Error creating user folder on sign-in:', err.message);
      set({ error: 'Failed to initialize user storage.' });
    }

    // Fetch profile
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
