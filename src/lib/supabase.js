// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// You can use these default values for development to avoid errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-temporary-key';

// Define table names with 'F' prefix
export const TABLES = {
  USERS: 'Fusers',
  TRANSACTIONS: 'Ftransactions',
  BUDGETS: 'Fbudgets',
  DEBTS: 'Fdebts',
  SAVINGS: 'Fsavings',
  SETTINGS: 'Fsettings',
  CATEGORIES: 'Fcategories',
  SESSIONS: 'Fsessions',
  REPORTS: 'Freports',
  LOGS: 'Flogs'
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
