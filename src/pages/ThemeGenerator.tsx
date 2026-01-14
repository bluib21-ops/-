import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useLinks } from '@/hooks/useLinks';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Save, Loader2, Eye, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ThemeGenerator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { links } = useLinks();
  
  const [prompt, setPrompt] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const generateTheme = async () => {
    if (!prompt.trim()) {
      toast.error('يرجى كتابة وصف الثيم');
      return;
    }
    
    if (!user || !profile) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    
    setLoading(true);
    
    try {
      // تجهيز بيانات المستخدم
      const userData = {
        name: profile.display_name || profile.username,
        username: `@${profile.username}`,
        image: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        bio: profile.bio || '🚀 أهلاً بك في صفحتي',
        links: links.filter(l => l.is_active).map(link => ({
          title: `${link.icon || '🔗'} ${link.title}`,
          url: link.url
        }))
      };

      const { data, error } = await supabase.functions.invoke('generate-theme-html', {
        body: { prompt, userData }
      });
      
      if (error) throw error;
      
      if (data?.html) {
        setGeneratedHtml(data.html);
        toast.success('تم توليد الثيم بنجاح! 🎨');
      } else {
        throw new Error('لم يتم استلام HTML');
      }
    } catch (error) {
      console.error('Error generating theme:', error);
      toast.error('حدث خطأ في توليد الثيم');
    } finally {
      setLoading(false);
    }
  };

  const saveTheme = async () => {
    if (!generatedHtml) return;
    
    setSaving(true);
    try {
      // حفظ الثيم مع معلومات المستخدم
      localStorage.setItem('custom_theme_html', generatedHtml);
      localStorage.setItem('custom_theme_active', 'true');
      localStorage.setItem('custom_theme_username', profile?.username || '');
      
      toast.success('تم حفظ الثيم بنجاح! 💾');
      
      // الذهاب للمعاينة
      if (profile?.username) {
        navigate(`/preview/${profile.username}`);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('حدث خطأ في حفظ الثيم');
    } finally {
      setSaving(false);
    }
  };

  const examplePrompts = [
    { icon: '⚖️', text: 'ثيم محامي فخم مع ذهبي وأسود' },
    { icon: '🌸', text: 'ثيم أنثوي ناعم مع وردي وأبيض' },
    { icon: '🔥', text: 'ثيم جيمر مع نيون وتأثيرات متحركة' },
    { icon: '🌿', text: 'ثيم طبيعي هادئ مع أخضر وبيج' },
    { icon: '💼', text: 'ثيم بزنس احترافي مع أزرق داكن' },
    { icon: '🎵', text: 'ثيم موسيقي مع تدرجات بنفسجية' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            الرجوع
          </Button>
          
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              مولد الثيمات الذكي
            </h1>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">🎨 مولد الثيمات بالذكاء الاصطناعي</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            اكتب وصف الثيم الذي تريده والذكاء الاصطناعي يصممه لك بالكامل!
            <br />
            <span className="text-purple-400">نفس بياناتك، شكل جديد تماماً</span>
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <label className="block text-lg font-semibold mb-4 text-purple-300">
            ✍️ وصف الثيم:
          </label>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: ثيم محامي احترافي مع ذهبي وأسود وتأثيرات فخمة..."
            className="w-full min-h-[120px] bg-gray-800/50 text-white border-gray-700 focus:border-purple-500 text-lg resize-none rounded-xl"
            dir="rtl"
          />
          
          {/* Example Prompts */}
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-3">💡 أمثلة سريعة:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example.text)}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-purple-600/30 border border-gray-700 hover:border-purple-500 rounded-full text-sm transition-all"
                >
                  {example.icon} {example.text}
                </button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={generateTheme}
            disabled={loading || !prompt.trim()}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                جاري التوليد... (قد يستغرق 30 ثانية)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 ml-2" />
                ✨ توليد الثيم
              </>
            )}
          </Button>
        </div>

        {/* Preview Section */}
        {generatedHtml && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6 text-green-400" />
                المعاينة:
              </h2>
              <Button
                onClick={saveTheme}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 ml-2" />
                )}
                💾 حفظ وتطبيق الثيم
              </Button>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/10">
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  srcDoc={generatedHtml}
                  className="w-full h-[700px]"
                  title="Theme Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
            
            <p className="text-center text-gray-400 text-sm">
              👆 هذا هو شكل صفحتك بالثيم الجديد - نفس بياناتك بتصميم مختلف تماماً!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
