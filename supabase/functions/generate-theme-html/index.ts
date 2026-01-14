import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserData {
  name: string;
  username: string;
  image: string;
  bio: string;
  links: Array<{ title: string; url: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userData } = await req.json() as { prompt: string; userData: UserData };
    
    console.log('=== Theme Generator Started ===');
    console.log('Prompt:', prompt);
    console.log('User:', userData.name, '-', userData.links.length, 'links');

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
        model: "openai/gpt-5",
        max_tokens: 8000,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `أنت مصمم ويب محترف. مهمتك إنشاء HTML كامل لصفحة بروفايل.

القواعد الصارمة:
1. أرجع HTML فقط - بدون أي شرح أو markdown
2. ابدأ بـ <!DOCTYPE html> وانتهي بـ </html>
3. CSS داخل <style> في head
4. استخدم placeholders بالضبط: {{name}}, {{username}}, {{image}}, {{bio}}, {{links}}
5. اجعل التصميم RTL وresponsive
6. استخدم Google Fonts: Cairo أو Tajawal`
          },
          {
            role: "user",
            content: `صمم صفحة بروفايل بثيم: "${prompt}"

استخدم هذه الـ placeholders فقط:
- {{name}} = الاسم
- {{username}} = @username  
- {{image}} = رابط الصورة
- {{bio}} = البايو
- {{links}} = الروابط (سأستبدلها)

البنية:
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Cairo', sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
    /* أضف CSS جميل حسب الثيم المطلوب */
    .container { /* الحاوية الرئيسية */ }
    .profile-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
    .name { /* الاسم */ }
    .username { /* اليوزرنيم */ }
    .bio { /* البايو */ }
    .links { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 400px; }
    .link { display: block; padding: 16px; text-decoration: none; border-radius: 12px; text-align: center; transition: transform 0.2s; }
    .link:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <img src="{{image}}" alt="Profile" class="profile-img">
    <h1 class="name">{{name}}</h1>
    <p class="username">{{username}}</p>
    <p class="bio">{{bio}}</p>
    <div class="links">
      {{links}}
    </div>
    <footer>أنشئ صفحتك مع Link.iq ✨</footer>
  </div>
</body>
</html>

المهم:
- صمم حسب الثيم المطلوب (ألوان، خلفية، تأثيرات)
- أضف animations وgradients جميلة
- {{links}} placeholder واحد فقط!
- أرجع HTML فقط!`
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
    let html = data.choices?.[0]?.message?.content || '';
    
    console.log('Raw response length:', html.length);
    
    // تنظيف HTML
    html = html.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // البحث عن بداية HTML
    const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
    if (doctypeIndex > 0) {
      html = html.substring(doctypeIndex);
    }
    
    // إنشاء HTML للروابط
    const linksHtml = userData.links.map(link => 
      `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link">${link.title}</a>`
    ).join('\n      ');
    
    // استبدال placeholders
    html = html
      .replace(/\{\{name\}\}/g, userData.name)
      .replace(/\{\{userName\}\}/g, userData.name)
      .replace(/\{\{username\}\}/g, userData.username)
      .replace(/\{\{image\}\}/g, userData.image)
      .replace(/\{\{userImage\}\}/g, userData.image)
      .replace(/\{\{bio\}\}/g, userData.bio)
      .replace(/\{\{userBio\}\}/g, userData.bio)
      .replace(/\{\{links\}\}/g, linksHtml)
      .replace(/\{\{userLinks\}\}/g, linksHtml);
    
    console.log('=== Theme Generated Successfully ===');
    console.log('Final HTML length:', html.length);

    return new Response(
      JSON.stringify({ html, success: true }),
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
