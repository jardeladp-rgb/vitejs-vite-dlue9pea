import { createClient } from '@supabase/supabase-js';

// A URL TEM QUE SER COMPLETA COM https:// E .supabase.co
const supabaseUrl = 'https://eawzlprqzzlhvrgtgbfm.supabase.co';
const supabaseAnonKey = 'sb_publishable_Tw2TFQmuRnZ0IDMUw3BnAQ_CkPGE61Y'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);