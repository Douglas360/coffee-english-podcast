import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratePostRequest {
  title: string;
  tone?: 'formal' | 'informal' | 'technical' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, tone = 'formal', length = 'medium' } = await req.json() as GeneratePostRequest;

    // Define length parameters
    const lengthGuide = {
      short: '500-800 words',
      medium: '1000-1500 words',
      long: '2000-2500 words'
    };

    const systemPrompt = `You are an expert blog post writer and SEO specialist. Create a well-structured blog post with the following characteristics:
    - Use a ${tone} tone
    - Target length: ${lengthGuide[length]}
    - Include proper HTML heading tags (h1, h2, h3)
    - Include meta title and meta description optimized for SEO
    - Include relevant keywords
    - Structure content with bullet points and paragraphs for readability
    - Add internal linking suggestions`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a blog post about: ${title}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate blog post');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the generated content to extract different components
    const metaTitle = title;
    const metaDescription = generatedContent.split('\n')[0];
    const suggestedKeywords = extractKeywords(generatedContent);

    const result = {
      content: generatedContent,
      metaTitle,
      metaDescription,
      suggestedKeywords,
      suggestedLinks: [] // This could be enhanced with link extraction logic
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
  // Simple keyword extraction - this could be enhanced with more sophisticated logic
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