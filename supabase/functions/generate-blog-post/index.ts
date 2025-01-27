import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, tone = 'formal', length = 'medium' } = await req.json();

    // First, generate an optimized title
    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate an engaging, SEO-optimized title based on the given topic. The title should be catchy and under 60 characters.'
          },
          { role: 'user', content: `Generate a title based on this topic: ${title}` }
        ],
      }),
    });

    const titleData = await titleResponse.json();
    const optimizedTitle = titleData.choices[0].message.content.replace(/["']/g, '');

    // Generate the main content
    const contentPrompt = `Create a comprehensive blog post about "${optimizedTitle}" with the following specifications:
    - Use a ${tone} tone
    - Length: ${length}
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the different sections
    const excerpt = generatedContent.match(/EXCERPT:\n(.*?)\n\nMETA_DESCRIPTION/s)?.[1].trim();
    const metaDescription = generatedContent.match(/META_DESCRIPTION:\n(.*?)\n\nIMAGE_PROMPT/s)?.[1].trim();
    const imagePrompt = generatedContent.match(/IMAGE_PROMPT:\n(.*?)\n\nCONTENT/s)?.[1].trim();
    const content = generatedContent.match(/CONTENT:\n(.*)/s)?.[1].trim();

    // Generate image using DALL-E
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

    // Generate slug from title
    const slug = optimizedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get current date for scheduling
    const scheduledDate = new Date().toISOString();

    const result = {
      title: optimizedTitle,
      content,
      excerpt,
      metaDescription,
      imageUrl,
      slug,
      scheduledDate,
      suggestedKeywords: extractKeywords(content),
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

function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().split(/\W+/);
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'a', 'an']);
  const keywords = words
    .filter(word => word.length > 3 && !stopWords.has(word))
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(keywords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}