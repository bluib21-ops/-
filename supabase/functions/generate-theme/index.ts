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
    const { userPrompt } = await req.json();

    if (!userPrompt || userPrompt.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'يرجى إدخال وصف للثيم' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'مفتاح API غير مكون' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating theme for prompt:', userPrompt);

    const systemPrompt = `أنت مصمم ثيمات محترف. المستخدم يريد: "${userPrompt}"

أرجع JSON فقط بدون أي نص:
{
  "name": "Theme Name",
  "nameAr": "اسم الثيم",
  "description": "وصف مختصر",
  "mood": "المزاج",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex or linear-gradient(...)",
    "cardBg": "#hex",
    "cardBorder": "#hex",
    "text": "#hex",
    "textSecondary": "#hex",
    "accent": "#hex",
    "hover": "#hex"
  },
  "fonts": {
    "heading": "Cairo",
    "headingWeight": "700",
    "body": "Cairo",
    "bodyWeight": "400"
  },
  "layout": {
    "cardRadius": "12px",
    "cardSpacing": "16px",
    "cardStyle": "elevated"
  },
  "effects": {
    "cardShadow": "0 4px 12px rgba(0,0,0,0.1)",
    "backdropBlur": "10px",
    "buttonHover": "lift",
    "animation": "fade"
  },
  "tags": ["tag1", "tag2"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'حدث خطأ في توليد الثيم، يرجى المحاولة مرة أخرى' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Anthropic API response received');

    const content = data.content[0]?.text;
    if (!content) {
      console.error('No content in response');
      return new Response(
        JSON.stringify({ error: 'لم يتم استلام رد من الذكاء الاصطناعي' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JSON from response - handle code blocks
    let jsonString = content;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
    } else {
      // Try to extract raw JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
    }

    if (!jsonString || !jsonString.includes('{')) {
      console.error('No JSON found in response:', content);
      return new Response(
        JSON.stringify({ error: 'فشل في استخراج بيانات الثيم' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const theme = JSON.parse(jsonString);
      console.log('Theme generated successfully:', theme.name);
      
      return new Response(
        JSON.stringify({ theme }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', jsonString.substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'فشل في تحليل بيانات الثيم، جرب وصفاً أبسط' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in generate-theme function:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
