import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Link2, BarChart3, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const themes = [
  { name: "نيون بنفسجي", gradient: "from-purple-600 via-blue-500 to-cyan-400" },
  { name: "داكن", gradient: "from-gray-900 via-gray-800 to-gray-900" },
  { name: "سيان نيون", gradient: "from-black via-cyan-900 to-cyan-400" },
  { name: "غروب", gradient: "from-pink-500 via-orange-400 to-yellow-300" },
];

const features = [
  {
    icon: "🔗",
    title: "روابط غير محدودة",
    description: "أضف جميع روابطك في مكان واحد وشاركها بسهولة",
  },
  {
    icon: "📊",
    title: "تتبع النقرات",
    description: "اعرف كم مرة تم النقر على كل رابط",
  },
  {
    icon: "🎨",
    title: "ثيمات متعددة",
    description: "اختر من بين ثيمات نيون جذابة تناسب أسلوبك",
  },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">Link.iq</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white border-0">
                  لوحة التحكم
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white border-0">
                    ابدأ مجاناً
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80 text-sm">منصة عربية 100%</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              جميع روابطك في
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                مكان واحد
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
              أنشئ صفحتك الشخصية وشارك جميع روابطك مع متابعيك بسهولة تامة
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-purple-500/25"
                >
                  ابدأ مجاناً
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/preview/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full"
                >
                  شاهد مثال
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative mx-auto w-72 md:w-80">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-[3rem] blur-2xl opacity-30" />
              <div className="relative bg-gray-900 rounded-[3rem] p-4 border border-white/20 shadow-2xl">
                <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-[2.5rem] p-6 min-h-[400px]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 flex items-center justify-center text-3xl">
                      👤
                    </div>
                    <h3 className="text-white font-bold text-lg">أحمد محمد</h3>
                    <p className="text-white/60 text-sm mb-6">@ahmed</p>
                    
                    <div className="w-full space-y-3">
                      {["🌐 موقعي الشخصي", "📸 انستقرام", "🐦 تويتر", "📺 يوتيوب"].map((link, i) => (
                        <div
                          key={i}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white text-sm hover:bg-white/20 transition-all cursor-pointer"
                        >
                          {link}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              لماذا Link.iq؟
            </h2>
            <p className="text-white/60 text-lg">
              كل ما تحتاجه لإدارة روابطك في مكان واحد
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:scale-105 transition-transform"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <Palette className="inline-block w-10 h-10 ml-2" />
              ثيمات مميزة
            </h2>
            <p className="text-white/60 text-lg">
              اختر الثيم الذي يناسب شخصيتك
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {themes.map((theme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${theme.gradient} rounded-2xl h-40 mb-3 border border-white/20 group-hover:scale-105 transition-transform shadow-lg`}
                />
                <p className="text-white/80 text-center font-medium">{theme.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600/50 to-cyan-600/50 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-white/70 text-lg mb-8">
              أنشئ صفحتك الشخصية في أقل من دقيقة
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full font-bold"
              >
                ابدأ الآن مجاناً
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link2 className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold text-white">Link.iq</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2024 Link.iq - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
