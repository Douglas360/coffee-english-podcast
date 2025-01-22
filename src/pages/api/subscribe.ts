import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../supabase/types';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Create Supabase client
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // First, save to newsletter_subscriptions table
    const { error: dbError } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }]);

    if (dbError) throw new Error('Failed to save subscription');

    // Then send to Mailchimp
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER;

    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: name,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to subscribe to Mailchimp');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to subscribe',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}