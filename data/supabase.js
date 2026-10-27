import { createClient } from '@supabase/server';

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey)
{
    throw new Error
    (
    'Missing SUPABASE_URL or SUPABASE_SECRET_KEY'
    );
}

export const supabase = createClient(url, secretKey);
