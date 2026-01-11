import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPrompt } = await req.json();
    
    if (!userPrompt || userPrompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "يرجى إدخال وصف للثيم" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "حدث خطأ في الإعدادات" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating theme for prompt:", userPrompt);

    const systemPrompt = `أنت مصمم ثيمات محترف متخصص في تصميم واجهات المستخدم.
المستخدم سيصف ما يريده، وعليك تصميم ثيم كامل ومتناسق له.

ملاحظات مهمة:
- الألوان يجب أن تكون متناسقة ومتناغمة
- الخطوط يجب أن تكون من Google Fonts العربية (Cairo, Tajawal, Almarai)
- التصميم يجب أن يكون احترافي وعصري
- راعِ accessibility (تباين الألوان جيد)
- الثيم يجب أن يعكس طبيعة عمل/مهنة المستخدم`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `صمم ثيم لـ: ${userPrompt}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_theme",
              description: "توليد ثيم كامل ومتكامل بناءً على وصف المستخدم",
              parameters: {
                type: "object",
                properties: {
                  name: { 
                    type: "string", 
                    description: "اسم الثيم بالإنجليزي (مثل: Medical Serenity)"
                  },
                  nameAr: { 
                    type: "string", 
                    description: "اسم الثيم بالعربية (مثل: الطبي الهادئ)"
                  },
                  description: { 
                    type: "string", 
                    description: "وصف مختصر للثيم بالعربية"
                  },
                  mood: { 
                    type: "string", 
                    description: "المزاج (احترافي، مرح، جاد، هادئ، إلخ)"
                  },
                  colors: {
                    type: "object",
                    properties: {
                      primary: { type: "string", description: "اللون الأساسي بصيغة hex" },
                      secondary: { type: "string", description: "اللون الثانوي بصيغة hex" },
                      background: { type: "string", description: "لون الخلفية (linear-gradient أو hex)" },
                      cardBg: { type: "string", description: "لون خلفية الكروت (hex أو rgba)" },
                      cardBorder: { type: "string", description: "لون حدود الكروت" },
                      text: { type: "string", description: "لون النص الأساسي" },
                      textSecondary: { type: "string", description: "لون النص الثانوي" },
                      accent: { type: "string", description: "لون التمييز" },
                      hover: { type: "string", description: "لون الـ hover" }
                    },
                    required: ["primary", "secondary", "background", "cardBg", "cardBorder", "text", "textSecondary", "accent", "hover"]
                  },
                  fonts: {
                    type: "object",
                    properties: {
                      heading: { type: "string", enum: ["Cairo", "Tajawal", "Almarai"] },
                      headingWeight: { type: "string", enum: ["400", "500", "600", "700", "800"] },
                      body: { type: "string", enum: ["Cairo", "Tajawal", "Almarai"] },
                      bodyWeight: { type: "string", enum: ["300", "400", "500", "600"] }
                    },
                    required: ["heading", "headingWeight", "body", "bodyWeight"]
                  },
                  layout: {
                    type: "object",
                    properties: {
                      cardRadius: { type: "string", description: "مثل: 12px, 16px, 20px" },
                      cardSpacing: { type: "string", description: "مثل: 12px, 16px, 20px" },
                      cardStyle: { type: "string", enum: ["elevated", "flat", "outlined"] }
                    },
                    required: ["cardRadius", "cardSpacing", "cardStyle"]
                  },
                  effects: {
                    type: "object",
                    properties: {
                      cardShadow: { type: "string", description: "box-shadow CSS" },
                      backdropBlur: { type: "string", description: "مثل: 10px, 15px, 20px" },
                      buttonHover: { type: "string", enum: ["lift", "scale", "glow"] },
                      animation: { type: "string", enum: ["fade", "slide", "none"] }
                    },
                    required: ["cardShadow", "backdropBlur", "buttonHover", "animation"]
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 وسوم تصف الثيم"
                  }
                },
                required: ["name", "nameAr", "description", "mood", "colors", "fonts", "layout", "effects", "tags"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_theme" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد لاستخدام الميزة" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "حدث خطأ في توليد الثيم" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data, null, 2));

    // Extract the theme from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_theme") {
      console.error("No valid tool call in response");
      return new Response(
        JSON.stringify({ error: "فشل في توليد الثيم" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const theme = JSON.parse(toolCall.function.arguments);
    console.log("Generated theme:", theme);

    return new Response(
      JSON.stringify({ theme }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating theme:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
