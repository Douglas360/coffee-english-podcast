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
    const { topic } = await req.json();
    console.log('Generating blog post for topic:', topic);

    if (!topic) {
      throw new Error('Topic is required');
    }

    const contentPrompt = `Create a comprehensive blog post about "${topic}" with the following specifications:
    - Include a compelling excerpt (max 160 characters)
    - Structure the content with proper markdown headings (H2, H3)
    - Include bullet points for key takeaways
    - Optimize for SEO with relevant keywords
    - Include a detailed meta description
    - Suggest an image prompt that captures the essence of the post
    
    Format the response in this exact structure:
    EXCERPT:
    [excerpt here]
    
    META_DESCRIPTION:
    [meta description here]
    
    IMAGE_PROMPT:
    [image generation prompt here]
    
    CONTENT:
    [main content here]`;

    // Generate content using OpenAI
    const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const contentData = await contentResponse.json();
    console.log('OpenAI response received');
    
    const generatedContent = contentData.choices[0].message.content;

    // Parse the different sections
    const excerpt = generatedContent.match(/EXCERPT:\n(.*?)\n\nMETA_DESCRIPTION/s)?.[1].trim();
    const metaDescription = generatedContent.match(/META_DESCRIPTION:\n(.*?)\n\nIMAGE_PROMPT/s)?.[1].trim();
    const imagePrompt = generatedContent.match(/IMAGE_PROMPT:\n(.*?)\n\nCONTENT/s)?.[1].trim();
    const content = generatedContent.match(/CONTENT:\n(.*)/s)?.[1].trim();

    // Generate image using DALL-E
    console.log('Generating image with prompt:', imagePrompt);
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

    const imageData = await imageResponse.json();
    const imageUrl = imageData.data?.[0]?.url;
    console.log('Image generated successfully');

    // Generate slug from title
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get current date for scheduling
    const scheduledDate = new Date().toISOString();

    // Extract keywords from content for SEO
    const words = content.toLowerCase().split(/\W+/);
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'a', 'an']);
    const keywords = words
      .filter(word => word.length > 3 && !stopWords.has(word))
      .reduce((acc: Record<string, number>, word: string) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});

    const suggestedKeywords = Object.entries(keywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    const result = {
      title: topic,
      content,
      excerpt,
      metaDescription,
      imageUrl,
      slug,
      scheduledDate,
      suggestedKeywords,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-blog-post function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});