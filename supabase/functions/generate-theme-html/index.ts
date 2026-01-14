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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userData } = await req.json() as { prompt: string; userData: UserData };
    
    console.log('Generating HTML theme for prompt:', prompt);
    console.log('User data:', JSON.stringify(userData));

    // استخدام Lovable AI Gateway
    const response = await fetch("https://ai-gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY") || ""}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        max_tokens: 8000,
        messages: [
          {
            role: "system",
            content: `أنت مصمم ويب محترف متخصص في تصميم صفحات البروفايل الجميلة والعصرية.
مهمتك: تصميم صفحة HTML كاملة بناءً على وصف المستخدم.

القواعد:
1. أرجع HTML كامل من <!DOCTYPE html> إلى </html>
2. CSS مدمج داخل <style> في الـ <head>
3. JavaScript مدمج داخل <script> قبل </body>
4. التصميم responsive تماماً
5. RTL للعربي
6. استخدم Google Fonts (Cairo, Tajawal, Almarai)
7. أضف تأثيرات CSS جميلة (gradients, shadows, animations)
8. لا تضف أي نص خارج الـ placeholders`
          },
          {
            role: "user",
            content: `صمم صفحة بروفايل HTML كاملة بهذا الثيم: "${prompt}"

✅ استخدم هذه الـ placeholders بالضبط (سنستبدلها بالبيانات):
- {{userName}} للاسم
- {{username}} لليوزرنيم (يبدأ بـ @)
- {{userImage}} لرابط الصورة
- {{userBio}} للبايو
- {{userLinks}} للروابط (placeholder واحد فقط)

✅ البنية المطلوبة:
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{userName}}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    /* CSS هنا - اجعله جميلاً ومتناسقاً مع الثيم */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Cairo', sans-serif; min-height: 100vh; }
    /* أضف تأثيرات خلفية، ألوان، animations */
    .profile-container { /* container رئيسي */ }
    .profile-image { /* صورة البروفايل - دائرية مع تأثيرات */ }
    .profile-name { /* الاسم */ }
    .profile-username { /* اليوزرنيم */ }
    .profile-bio { /* البايو */ }
    .links { /* container الروابط */ }
    .link-item { /* كل رابط - اجعله جميلاً مع hover effects */ }
    .footer { /* فوتر */ }
  </style>
</head>
<body>
  <div class="background-effects">
    <!-- أضف عناصر خلفية ديكورية -->
  </div>
  
  <div class="profile-container">
    <div class="profile-header">
      <img src="{{userImage}}" alt="Profile" class="profile-image">
      <h1 class="profile-name">{{userName}}</h1>
      <p class="profile-username">{{username}}</p>
      <p class="profile-bio">{{userBio}}</p>
    </div>
    
    <div class="links">
      {{userLinks}}
    </div>
    
    <footer class="footer">
      <p>أنشئ صفحتك مع Link.iq ✨</p>
    </footer>
  </div>
  
  <script>
    // JavaScript للتأثيرات التفاعلية
  </script>
</body>
</html>

⚠️ مهم جداً:
1. {{userLinks}} placeholder واحد فقط - لا تكتب روابط وهمية!
2. أضف animations وتأثيرات CSS جميلة حسب الثيم
3. اجعل التصميم مميز ومختلف
4. أرجع HTML فقط بدون أي شرح أو markdown!`
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
    console.log('AI Response received');
    
    let html = data.choices?.[0]?.message?.content || '';
    
    // تنظيف الـ HTML (إزالة ```html إذا كان موجود)
    html = html.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // التأكد من أن الـ HTML يبدأ بـ <!DOCTYPE
    if (!html.toLowerCase().startsWith('<!doctype')) {
      const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
      if (doctypeIndex > -1) {
        html = html.substring(doctypeIndex);
      }
    }
    
    console.log('HTML before replacement (first 500 chars):', html.substring(0, 500));
    
    // إنشاء HTML للروابط
    const linksHtml = userData.links.map(link => 
      `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-item">${link.title}</a>`
    ).join('\n      ');
    
    // استبدال placeholders بالبيانات الحقيقية
    html = html
      .replace(/\{\{userName\}\}/g, userData.name)
      .replace(/\{\{username\}\}/g, userData.username)
      .replace(/\{\{userImage\}\}/g, userData.image)
      .replace(/\{\{userBio\}\}/g, userData.bio)
      .replace(/\{\{userLinks\}\}/g, linksHtml);
    
    console.log('HTML after replacement generated successfully');
    console.log('Final HTML length:', html.length);

    return new Response(
      JSON.stringify({ html, success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error('Error in generate-theme-html:', error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في توليد الثيم';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
