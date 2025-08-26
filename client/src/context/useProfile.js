import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../supabase'

export const useProfile = create(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,

      fetchProfile: async (userId) => {
        set({ loading: true, error: null })
        const { data, error } = await supabase
          .from('users')
          .select('supabase_uid, name,email, avatar_url')
          .eq('supabase_uid', userId)
          .single()

        if (error) {
          set({ error: error.message, loading: false })
        } else {
          set({ profile: data, loading: false })
        }
      },

      updateProfile: async (updates) => {
        set({ loading: true, error: null })
        const { error } = await supabase
          .from('users')
          .upsert(updates)

        if (error) {
          set({ error: error.message, loading: false })
        } else {
          set({ profile: { ...get().profile, ...updates }, loading: false })
        }
      },

      clearProfile: () => set({ profile: null })
    }),
    {
      name: 'profile-storage', // key in localStorage
    }
  )
)
