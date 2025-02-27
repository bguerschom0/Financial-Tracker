// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// You can use these default values for development to avoid errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-temporary-key';

// Define table names with 'F' prefix (without schema)
export const TABLES = {
  USERS: 'fusers',
  TRANSACTIONS: 'ftransactions',
  BUDGETS: 'fbudgets',
  DEBTS: 'fdebts',
  SAVINGS: 'fsavings',
  SETTINGS: 'fsettings',
  CATEGORIES: 'fcategories',
  SESSIONS: 'fsessions',
  REPORTS: 'freports',
  LOGS: 'flogs'
};

// Create the Supabase client with default schema
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
