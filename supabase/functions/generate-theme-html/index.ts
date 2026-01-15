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
    const { prompt } = await req.json() as { prompt: string };
    
    console.log('=== Theme Style Generator Started ===');
    console.log('Prompt:', prompt);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `أنت مصمم CSS محترف. مهمتك إنشاء أنماط تصميم (ألوان، تأثيرات، خلفيات) بناءً على وصف المستخدم.

أرجع JSON فقط بالتنسيق التالي:
{
  "colors": {
    "background": "تدرج أو لون للخلفية (CSS gradient or color)",
    "text": "لون النص الرئيسي",
    "textSecondary": "لون النص الثانوي",
    "primary": "اللون الأساسي",
    "cardBg": "خلفية الكاردات",
    "cardBorder": "لون حدود الكاردات"
  },
  "backgroundEffect": {
    "type": "نوع التأثير: rain, particles, stars, blobs, snow, bubbles, fireflies, none",
    "css": "كود CSS للتأثير (animations, keyframes)",
    "html": "عناصر HTML للتأثير (divs مع classes)"
  },
  "cardStyle": {
    "borderRadius": "قيمة الزوايا مثل 16px",
    "shadow": "ظل الكاردات",
    "backdropBlur": "blur للشفافية مثل 10px",
    "hoverEffect": "تأثير الـ hover مثل scale(1.02) أو translateY(-4px)"
  },
  "profileImageStyle": {
    "borderColor": "لون حدود الصورة",
    "borderWidth": "عرض الحدود",
    "shadow": "توهج الصورة",
    "animation": "animation للصورة مثل pulse أو glow"
  },
  "fonts": {
    "heading": "خط العناوين من Google Fonts",
    "body": "خط النصوص من Google Fonts"
  }
}

قواعد مهمة:
- استخدم ألوان HSL أو RGBA للشفافية
- اجعل التأثيرات سلسة وغير مزعجة
- تأكد من وضوح النصوص على الخلفيات
- CSS فقط، بدون JavaScript
- الخطوط من Google Fonts فقط`
          },
          {
            role: "user",
            content: `صمم ستايل لصفحة بروفايل بثيم: "${prompt}"

أريد:
1. ألوان متناسقة مع الثيم
2. تأثير خلفية جميل (اختر المناسب للثيم)
3. شكل كاردات جذاب
4. توهج للصورة الشخصية
5. خطوط مناسبة

أرجع JSON فقط بدون أي شرح أو markdown!`
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
    }

    const data = await response.json();
    let jsonStr = data.choices?.[0]?.message?.content || '';
    
    console.log('Raw response:', jsonStr.substring(0, 500));
    
    // تنظيف JSON
    jsonStr = jsonStr.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // البحث عن بداية JSON
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
    }
    
    // تحويل إلى object
    const themeStyles = JSON.parse(jsonStr);
    
    console.log('=== Theme Styles Generated Successfully ===');
    console.log('Background Effect Type:', themeStyles.backgroundEffect?.type);

    return new Response(
      JSON.stringify({ styles: themeStyles, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    const msg = error instanceof Error ? error.message : 'حدث خطأ في توليد الثيم';
    return new Response(
      JSON.stringify({ error: msg, success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
