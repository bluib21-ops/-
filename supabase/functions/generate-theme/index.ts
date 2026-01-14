import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (inString && ch === "\\") {
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return text.slice(start, i + 1);
      }
    }
  }

  return null; // likely truncated output
}

function sanitizeJsonString(json: string): string {
  return json
    .replace(/\uFEFF/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    // remove trailing commas: {"a":1,} or [1,]
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

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

    const systemPrompt = `أنت مصمم ثيمات محترف. صمم ثيم كامل بناءً على: "${userPrompt}"

أرجع JSON فقط بهذا الشكل بالضبط:

{
  "name": "اسم الثيم بالإنجليزي",
  "nameAr": "اسم الثيم بالعربية",
  "description": "وصف قصير",
  "mood": "الشعور العام",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "linear-gradient(180deg, #color1, #color2)",
    "cardBg": "rgba(255,255,255,0.05)",
    "cardBorder": "rgba(255,255,255,0.1)",
    "text": "#hex",
    "textSecondary": "rgba(255,255,255,0.7)",
    "accent": "#hex",
    "hover": "#hex"
  },
  "fonts": {
    "heading": "Cairo",
    "headingWeight": "700",
    "body": "Tajawal",
    "bodyWeight": "400"
  },
  "layout": {
    "cardRadius": "16px",
    "cardSpacing": "12px",
    "cardStyle": "glass"
  },
  "effects": {
    "backdropBlur": "20px",
    "cardShadow": "0 8px 32px rgba(0,0,0,0.3)",
    "glassEffect": true,
    "profileGlow": {
      "enabled": true,
      "color": "rgba(96,165,250,0.5)",
      "size": "60px"
    },
    "backgroundBlobs": {
      "enabled": true,
      "count": 3,
      "blobs": [
        {"x": "20%", "y": "30%", "size": "500px", "color": "rgba(96,165,250,0.15)"},
        {"x": "80%", "y": "70%", "size": "600px", "color": "rgba(168,85,247,0.12)"},
        {"x": "50%", "y": "50%", "size": "450px", "color": "rgba(103,232,249,0.1)"}
      ]
    },
    "animations": {
      "blobsMove": true,
      "profilePulse": true,
      "cardHover": "translateY(-4px)"
    }
  },
  "tags": ["tag1", "tag2", "tag3"]
}

مهم جداً: 
- الألوان متناسقة ومبدعة
- effects يجب أن تكون قابلة للتطبيق بـ CSS
- backgroundBlobs للدوائر الضبابية في الخلفية (3-5 دوائر بألوان مختلفة)
- profileGlow للتوهج حول الصورة الشخصية
- اختر ألوان تناسب وصف المستخدم`;

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
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content:
              systemPrompt +
              "\n\n⚠️ أعد JSON صالح 100% بدون أي فاصلة زائدة، وبدون أي علامات اقتباس داخل النصوص (أو قم بعمل escape لها). لا تضف أي نص خارج JSON.",
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

    const extracted = extractFirstJsonObject(responseText);
    if (!extracted) {
      console.error("No complete JSON object found (maybe truncated)");
      return new Response(
        JSON.stringify({ error: "فشل في تحليل بيانات الثيم" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jsonString = sanitizeJsonString(extracted);

    try {
      const theme = JSON.parse(jsonString);
      console.log("Theme parsed successfully:", theme.name);

      return new Response(JSON.stringify({ theme }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Attempted to parse (first 900 chars):", jsonString.substring(0, 900));
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