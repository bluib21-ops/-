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

    const systemPrompt = `أنت مصمم ثيمات محترف متخصص في تصميم واجهات المستخدم.

المستخدم يريد: "${userPrompt}"

صمم له ثيم كامل ومتكامل. أرجع النتيجة بصيغة JSON التالية فقط (بدون أي نص إضافي):

{
  "name": "اسم الثيم بالإنجليزي",
  "nameAr": "اسم الثيم بالعربية",
  "description": "وصف مختصر للثيم بالعربية",
  "mood": "المزاج (احترافي، مرح، جاد، إلخ)",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "linear-gradient(...) or #hex",
    "cardBg": "#hex or rgba(...)",
    "cardBorder": "#hex",
    "text": "#hex",
    "textSecondary": "#hex",
    "accent": "#hex",
    "hover": "#hex"
  },
  "fonts": {
    "heading": "Cairo/Tajawal/Almarai",
    "headingWeight": "700",
    "body": "Cairo/Tajawal/Almarai",
    "bodyWeight": "400"
  },
  "layout": {
    "cardRadius": "12px",
    "cardSpacing": "16px",
    "cardStyle": "elevated/flat/outlined"
  },
  "effects": {
    "cardShadow": "0 4px 12px rgba(0,0,0,0.1)",
    "backdropBlur": "10px",
    "buttonHover": "lift/scale/glow",
    "animation": "fade/slide/none"
  },
  "tags": ["tag1", "tag2", "tag3"]
}

ملاحظات مهمة:
- الألوان يجب أن تكون متناسقة ومتناغمة
- الخطوط يجب أن تكون من Google Fonts العربية
- التصميم يجب أن يكون احترافي وعصري
- راعِ accessibility (تباين الألوان جيد)
- الثيم يجب أن يعكس طبيعة عمل/مهنة المستخدم`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
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

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', content);
      return new Response(
        JSON.stringify({ error: 'فشل في استخراج بيانات الثيم' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const theme = JSON.parse(jsonMatch[0]);
      console.log('Theme generated successfully:', theme.name);
      
      return new Response(
        JSON.stringify({ theme }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'فشل في تحليل بيانات الثيم' }),
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
