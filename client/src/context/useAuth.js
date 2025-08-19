import { create } from 'zustand'
import { supabase } from '../supabase'
import { useProfile } from './useProfile'

export const useAuth = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ session, user: session?.user || null, loading: false })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ session, user: session?.user || null, loading: false })
      }
    )

    // keep ref to unsubscribe later if needed
    set({ _listener: subscription })
  },

  signUp: async (email, password, firstname, lastname, url) => {
  set({ loading: true, error: null })
  const { data, error } = await supabase.auth.signUp({ email, password })
  set({ loading: false, error: error?.message || null })

  if (!error && data.user) {
    const { user } = data

    // Insert into profiles with firstname & lastname
    await supabase.from('users').insert({
      supabase_uid: user.id,
      email: email,
      name: firstname + " " + lastname,  // fallback username
      avatar_url: url,
    })

    // fetch it into Zustand
    useProfile.getState().fetchProfile(user.id)
  }

  return { error }
},


  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      throw error;
    }

    const user = data.user;

    // fetch profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("supabase_uid", user.id)
      .single();

    if (profileError) {
      set({ loading: false });
      throw profileError;
    }

    set({ user, profile, loading: false });
  },

  signOut: async () => {
    set({ loading: true })
    await supabase.auth.signOut()
    set({ user: null, session: null, loading: false })
  },

  clearError: () => set({ error: null })
}))
