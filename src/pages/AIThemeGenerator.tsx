import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Check, 
  Palette,
  Type,
  Layers,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface GeneratedTheme {
  name: string;
  nameAr: string;
  description: string;
  mood: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    cardBg: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    accent: string;
    hover: string;
  };
  fonts: {
    heading: string;
    headingWeight: string;
    body: string;
    bodyWeight: string;
  };
  layout: {
    cardRadius: string;
    cardSpacing: string;
    cardStyle: string;
  };
  effects: {
    cardShadow: string;
    backdropBlur: string;
    buttonHover: string;
    animation: string;
  };
  tags: string[];
}

const examplePrompts = [
  "مصور فوتوغرافي - عصري وإبداعي بألوان داكنة",
  "طبيب أسنان - نظيف ومريح بألوان طبية هادئة",
  "كافيه - دافئ وبني بلمسات برتقالية",
  "محامي - رسمي وجاد بألوان داكنة أنيقة",
  "مصمم جرافيك - ملون وجريء بتدرجات نيون"
];

export default function AIThemeGenerator() {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();

  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const generateTheme = async () => {
    if (!userPrompt.trim()) {
      toast.error("يرجى إدخال وصف للثيم");
      return;
    }

    setIsGenerating(true);
    setGeneratedTheme(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-theme", {
        body: { userPrompt: userPrompt.trim() }
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "حدث خطأ في توليد الثيم");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.theme) {
        setGeneratedTheme(data.theme);
        toast.success("تم توليد الثيم بنجاح!");
      } else {
        throw new Error("لم يتم استلام بيانات الثيم");
      }
    } catch (error) {
      console.error("Error generating theme:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ في توليد الثيم");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyTheme = async () => {
    if (!generatedTheme) return;

    // Save theme to localStorage for now
    localStorage.setItem("custom-ai-theme", JSON.stringify(generatedTheme));
    toast.success("تم تطبيق الثيم بنجاح!");
    
    // Navigate back to dashboard
    navigate("/dashboard");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" dir="rtl">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 -z-10" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للوحة التحكم
          </Button>
          <div className="flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-pink-400" />
            <h1 className="text-xl font-bold text-white">مولد الثيمات الذكي</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-pink-300 text-sm">مدعوم بالذكاء الاصطناعي</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            صف ما تريد، <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">والذكاء الاصطناعي يصممه!</span>
          </h2>
          <p className="text-white/60 text-lg">
            أخبرنا عن نشاطك أو شخصيتك وسنولد لك ثيماً مخصصاً بالكامل
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-3">
                صِف الثيم الذي تريده:
              </label>
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="مثال: أنا طبيب أسنان، أبي ثيم نظيف ومريح بألوان طبية..."
                className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40 min-h-[120px] resize-none"
                dir="rtl"
              />

              <div className="mt-4">
                <p className="text-white/60 text-sm mb-3">💡 أمثلة لمساعدتك:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setUserPrompt(prompt)}
                      className="bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white/70 hover:text-white text-xs rounded-full px-3 py-1.5 transition-colors"
                    >
                      {prompt.split(" - ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateTheme}
                disabled={isGenerating || !userPrompt.trim()}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl py-6 text-lg gap-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    توليد الثيم الآن
                  </>
                )}
              </Button>
            </div>

            {/* Theme Details */}
            <AnimatePresence>
              {generatedTheme && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-400" />
                    تفاصيل الثيم
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{generatedTheme.name}</span>
                      <span className="text-white/60">الاسم</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg text-white/80">{generatedTheme.nameAr}</span>
                      <span className="text-white/60">بالعربية</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/80">{generatedTheme.mood}</span>
                      <span className="text-white/60">المزاج</span>
                    </div>

                    <p className="text-white/60 text-sm border-t border-white/10 pt-4">
                      {generatedTheme.description}
                    </p>

                    {/* Color Swatches */}
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-white/60 text-sm mb-3">الألوان:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(generatedTheme.colors).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2"
                          >
                            <div
                              className="w-6 h-6 rounded-md border border-white/20"
                              style={{ background: value }}
                            />
                            <span className="text-white/60 text-xs">{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      {generatedTheme.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-pink-500/20 text-pink-300 text-xs rounded-full px-3 py-1"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={applyTheme}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-4 gap-2"
                    >
                      <Check className="w-5 h-5" />
                      تطبيق الثيم
                    </Button>
                    <Button
                      onClick={generateTheme}
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-xl py-4 gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      جرب مرة أخرى
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBack(false)}
                  variant={!showBack ? "default" : "outline"}
                  size="sm"
                  className={!showBack ? "bg-pink-500 hover:bg-pink-600" : "border-white/20 text-white hover:bg-white/10"}
                >
                  الأمامية
                </Button>
                <Button
                  onClick={() => setShowBack(true)}
                  variant={showBack ? "default" : "outline"}
                  size="sm"
                  className={showBack ? "bg-pink-500 hover:bg-pink-600" : "border-white/20 text-white hover:bg-white/10"}
                >
                  الخلفية
                </Button>
              </div>
              <h3 className="text-lg font-bold text-white">معاينة حية</h3>
            </div>

            {/* Preview Card */}
            <div
              className="rounded-2xl overflow-hidden border border-white/20"
              style={{
                background: generatedTheme?.colors.background || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                minHeight: "500px"
              }}
            >
              <AnimatePresence mode="wait">
                {!showBack ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    className="p-6 h-full"
                  >
                    {/* Profile Preview */}
                    <div className="flex flex-col items-center text-center pt-8">
                      <div
                        className="w-24 h-24 rounded-full border-4 mb-4"
                        style={{
                          borderColor: generatedTheme?.colors.primary || "#fff",
                          backgroundColor: generatedTheme?.colors.cardBg || "rgba(255,255,255,0.1)"
                        }}
                      />
                      <h4
                        className="text-2xl font-bold mb-1"
                        style={{
                          color: generatedTheme?.colors.text || "#fff",
                          fontFamily: generatedTheme?.fonts.heading || "Cairo"
                        }}
                      >
                        {profile?.display_name || "اسمك هنا"}
                      </h4>
                      <p
                        className="mb-6"
                        style={{ color: generatedTheme?.colors.textSecondary || "rgba(255,255,255,0.7)" }}
                      >
                        @{profile?.username || "username"}
                      </p>

                      {/* Sample Links */}
                      <div className="w-full space-y-3">
                        {["Instagram", "Twitter", "YouTube"].map((link, index) => (
                          <div
                            key={index}
                            className="w-full py-4 px-6 text-center transition-all"
                            style={{
                              backgroundColor: generatedTheme?.colors.cardBg || "rgba(255,255,255,0.1)",
                              borderRadius: generatedTheme?.layout.cardRadius || "12px",
                              borderWidth: "1px",
                              borderColor: generatedTheme?.colors.cardBorder || "rgba(255,255,255,0.2)",
                              color: generatedTheme?.colors.text || "#fff",
                              boxShadow: generatedTheme?.effects.cardShadow || "none",
                              backdropFilter: `blur(${generatedTheme?.effects.backdropBlur || "10px"})`
                            }}
                          >
                            {link}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    className="p-6 h-full flex flex-col items-center justify-center"
                  >
                    <p
                      className="text-center mb-6"
                      style={{ color: generatedTheme?.colors.textSecondary || "rgba(255,255,255,0.7)" }}
                    >
                      امسح للوصول لجميع روابطي
                    </p>
                    <div
                      className="w-40 h-40 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: generatedTheme?.effects.cardShadow || "0 4px 20px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div className="w-32 h-32 bg-gray-800 rounded-lg grid grid-cols-5 grid-rows-5 gap-0.5 p-1">
                        {[...Array(25)].map((_, i) => (
                          <div
                            key={i}
                            className={`${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 opacity-50">
                      <Sparkles className="w-4 h-4" style={{ color: generatedTheme?.colors.accent || "#fff" }} />
                      <span style={{ color: generatedTheme?.colors.textSecondary || "rgba(255,255,255,0.7)" }}>
                        Link.iq
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading State */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" />
                  </div>
                  <p className="text-white mt-4">الذكاء الاصطناعي يصمم ثيمك...</p>
                  <p className="text-white/60 text-sm mt-2">قد يستغرق هذا بضع ثوانٍ</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                <Palette className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">ألوان متناسقة</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                <Type className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">خطوط عربية</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs">تأثيرات حية</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
