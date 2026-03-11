import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project values
// Get them from: https://supabase.com → your project → Settings → API
const SUPABASE_URL = 'https://gjsyahnrdtopyppydwiu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqc3lhaG5yZHRvcHlwcHlkd2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzk3NjUsImV4cCI6MjA4ODgxNTc2NX0.i2RwbEg6_YuDI4GB_p908-P77XesLFIDZzEWkA1jkgM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
