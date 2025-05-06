
import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_URL = 'https://qozznmvyuiiyrbmktgsp.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenpubXZ5dWlpeXJibWt0Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTU5NzQsImV4cCI6MjA1NzI5MTk3NH0.Q0yEI1_bYcbWTpM4AJQAzVBOb9Dxqf53LSjSDoNs408';


// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
