import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If Supabase is not configured, create a dummy client for demo purposes
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    } as any