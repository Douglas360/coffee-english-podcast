import type { APIRoute } from "astro";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us1", // e.g. us1 - get this from your Mailchimp API key
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, name, listId } = await request.json();

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name,
      },
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Successfully subscribed!",
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to subscribe",
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};