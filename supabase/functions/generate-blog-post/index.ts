import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone, length, targetAudience, additionalInstructions } = await req.json();
    console.log('Received request with:', { topic, tone, length, targetAudience, additionalInstructions });

    if (!topic) {
      throw new Error('Topic is required');
    }

    const contentPrompt = `Create a comprehensive blog post about "${topic}" with the following specifications:
    - Use a ${tone} tone of voice
    - Create a ${length} length article
    - Target audience: ${targetAudience}
    - Additional instructions: ${additionalInstructions || 'None'}
    
    Format the response in this exact structure:
    TITLE:
    [title here]
    
    EXCERPT:
    [excerpt here - max 160 characters]
    
    META_DESCRIPTION:
    [meta description here - max 160 characters]
    
    IMAGE_PROMPT:
    [image generation prompt here]
    
    CONTENT:
    [main content here]
    
    KEYWORDS:
    [comma-separated list of relevant keywords]`;

    console.log('Sending request to OpenAI');
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert blog writer and SEO specialist.' },
          { role: 'user', content: contentPrompt }
        ],
      }),
    });

    if (!openAiResponse.ok) {
      const error = await openAiResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const openAiData = await openAiResponse.json();
    console.log('Received response from OpenAI');

    if (!openAiData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response:', openAiData);
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = openAiData.choices[0].message.content;

    // Parse the different sections
    const title = generatedContent.match(/TITLE:\n(.*?)\n\nEXCERPT/s)?.[1].trim();
    const excerpt = generatedContent.match(/EXCERPT:\n(.*?)\n\nMETA_DESCRIPTION/s)?.[1].trim();
    const metaDescription = generatedContent.match(/META_DESCRIPTION:\n(.*?)\n\nIMAGE_PROMPT/s)?.[1].trim();
    const imagePrompt = generatedContent.match(/IMAGE_PROMPT:\n(.*?)\n\nCONTENT/s)?.[1].trim();
    const content = generatedContent.match(/CONTENT:\n(.*?)\n\nKEYWORDS/s)?.[1].trim();
    const keywords = generatedContent.match(/KEYWORDS:\n(.*)/s)?.[1].trim().split(',').map(k => k.trim());

    // Generate image using DALL-E
    console.log('Generating image with DALL-E');
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!imageResponse.ok) {
      const error = await imageResponse.text();
      console.error('DALL-E API error:', error);
      throw new Error(`DALL-E API error: ${error}`);
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data?.[0]?.url;

    if (!imageUrl) {
      console.error('Invalid DALL-E response:', imageData);
      throw new Error('Failed to generate image');
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get current date for scheduling
    const scheduledDate = new Date().toISOString();

    const result = {
      title,
      content,
      excerpt,
      metaDescription,
      imageUrl,
      slug,
      scheduledDate,
      suggestedKeywords: keywords,
    };

    console.log('Successfully generated post');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-blog-post function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});