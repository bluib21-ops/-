import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPrompt } = await req.json();

    if (!userPrompt || typeof userPrompt !== "string") {
      return new Response(
        JSON.stringify({ error: "يرجى إدخال وصف للثيم" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "مفتاح API غير مكون" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `أنت مصمم ثيمات محترف متخصص في تصميم واجهات المستخدم الإبداعية.
المستخدم يريد: "${userPrompt}"

صمم له ثيم كامل ومتكامل مع عناصر بصرية ورسومات مذهلة!

أرجع النتيجة بصيغة JSON التالية فقط (بدون أي نص إضافي):
{
  "name": "اسم الثيم بالإنجليزي (كلمة أو كلمتين)",
  "nameAr": "اسم الثيم بالعربية",
  "description": "وصف قصير للثيم (جملة أو جملتين)",
  "mood": "الشعور العام: مثل هادئ، حيوي، احترافي، دافئ",
  "colors": {
    "primary": "#hex - اللون الرئيسي",
    "secondary": "#hex - اللون الثانوي",
    "background": "خلفية متدرجة أو لون واحد مثل: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    "cardBg": "rgba أو hex - خلفية الكروت",
    "cardBorder": "rgba أو hex - حدود الكروت",
    "text": "#hex - لون النص الرئيسي",
    "textSecondary": "rgba أو hex - لون النص الثانوي",
    "accent": "#hex - لون التأكيد",
    "hover": "#hex - لون التحويم"
  },
  "fonts": {
    "heading": "اسم الخط للعناوين من Google Fonts مثل: Cairo, Tajawal, Almarai",
    "headingWeight": "وزن الخط: 600 أو 700 أو 800",
    "body": "اسم الخط للنصوص",
    "bodyWeight": "وزن الخط: 400 أو 500"
  },
  "layout": {
    "cardRadius": "نصف قطر الكروت مثل: 16px أو 24px",
    "cardSpacing": "المسافة بين الكروت مثل: 12px أو 16px",
    "cardStyle": "نمط الكروت: glass أو solid أو gradient أو neumorphic"
  },
  "effects": {
    "cardShadow": "ظل الكروت مثل: 0 10px 40px rgba(0,0,0,0.3)",
    "backdropBlur": "تشويش الخلفية مثل: 10px أو 20px",
    "buttonHover": "تأثير التحويم: scale أو glow أو lift",
    "animation": "الأنيميشن: fade أو slide أو bounce"
  },
  "backgroundElements": {
    "type": "نوع العناصر: blurred-circles أو particles أو waves أو geometric-shapes أو gradient-orbs",
    "count": 4,
    "items": [
      {
        "x": "10%",
        "y": "15%",
        "size": "300px",
        "color": "#hex مع opacity",
        "opacity": 0.3,
        "blur": "80px"
      },
      {
        "x": "80%",
        "y": "60%",
        "size": "400px",
        "color": "#hex مع opacity",
        "opacity": 0.2,
        "blur": "100px"
      },
      {
        "x": "50%",
        "y": "80%",
        "size": "250px",
        "color": "#hex مع opacity",
        "opacity": 0.25,
        "blur": "60px"
      },
      {
        "x": "20%",
        "y": "50%",
        "size": "200px",
        "color": "#hex مع opacity",
        "opacity": 0.15,
        "blur": "50px"
      }
    ],
    "animation": "slow-float أو rotate أو pulse أو drift"
  },
  "decorativeShapes": {
    "enabled": true,
    "type": "triangles أو circles أو lines أو stars أو dots",
    "position": "corners أو random أو around-profile أو scattered",
    "count": 8,
    "opacity": 0.08,
    "color": "#hex",
    "size": "small أو medium أو large"
  },
  "particles": {
    "enabled": true,
    "count": 80,
    "type": "dots أو sparkles أو music-notes أو stars أو bubbles",
    "color": "#hex أو white",
    "opacity": 0.4,
    "speed": "slow أو medium أو fast",
    "size": "2px"
  },
  "glowEffects": {
    "aroundProfile": true,
    "behindCards": true,
    "profileGlowColor": "#hex مع opacity",
    "profileGlowSize": "100px",
    "cardGlowColor": "#hex مع opacity",
    "cardGlowSize": "30px",
    "pulseAnimation": true
  },
  "tags": ["tag1", "tag2", "tag3"]
}

مهم جداً:
1. اختر ألوان متناسقة ومتوافقة مع طبيعة النشاط
2. العناصر البصرية يجب أن تكون خفيفة ولا تشتت الانتباه
3. استخدم تدرجات جميلة للخلفية
4. الألوان يجب أن تكون بصيغة hex أو rgba
5. أرجع JSON فقط بدون أي نص قبله أو بعده`;

    console.log("Calling Anthropic API...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 6000,
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      return new Response(
        JSON.stringify({ error: "فشل في الاتصال بالذكاء الاصطناعي" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Anthropic response received");

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error("Invalid response structure:", data);
      return new Response(
        JSON.stringify({ error: "استجابة غير صالحة من الذكاء الاصطناعي" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let responseText = data.content[0].text.trim();
    console.log("Raw response:", responseText.substring(0, 500));

    // Clean up the response - extract JSON from potential markdown
    if (responseText.includes("```json")) {
      responseText = responseText.split("```json")[1].split("```")[0].trim();
    } else if (responseText.includes("```")) {
      responseText = responseText.split("```")[1].split("```")[0].trim();
    }

    // Find JSON object in response
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No JSON found in response");
      return new Response(
        JSON.stringify({ error: "فشل في تحليل بيانات الثيم" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);

    try {
      const theme = JSON.parse(jsonString);
      console.log("Theme parsed successfully:", theme.name);

      return new Response(
        JSON.stringify({ theme }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Attempted to parse:", jsonString.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "فشل في تحليل بيانات الثيم" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
