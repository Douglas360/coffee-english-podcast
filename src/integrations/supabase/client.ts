// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mlpyhxmsofabdkdkslfs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scHloeG1zb2ZhYmRrZGtzbGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNDMzNjQsImV4cCI6MjA1MjcxOTM2NH0.mOYns7DjnVnu9GSoPJr0fiNjnuNxA2SldJ6GB-zHxvE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);