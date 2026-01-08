import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Link2, BarChart3, QrCode, Sparkles, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const themes = [
  { 
    name: "تدرج نيون", 
    bg: "bg-gradient-to-b from-violet-500 via-purple-500 to-cyan-400",
    cards: "bg-purple-400/30"
  },
  { 
    name: "داكن", 
    bg: "bg-gray-900",
    cards: "bg-gray-800"
  },
  { 
    name: "نيون سيان", 
    bg: "bg-gradient-to-b from-slate-800 to-teal-900",
    cards: "bg-slate-700/50"
  },
  { 
    name: "غروب الشمس", 
    bg: "bg-gradient-to-b from-orange-400 via-pink-400 to-yellow-300",
    cards: "bg-orange-300/50"
  },
];

const features = [
  {
    icon: Link2,
    title: "روابط غير محدودة",
    description: "أضف عدد لا نهائي من الروابط لصفحتك الشخصية",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BarChart3,
    title: "تحليلات متقدمة",
    description: "تتبع عدد الضغطات والزوار لكل رابط",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: QrCode,
    title: "QR Code + PDF",
    description: "حمّل كود QR وبطاقة PDF لمشاركتها بسهولة",
    color: "from-violet-500 to-purple-500"
  },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 -z-10" />
      
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Link.iq</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-6 font-semibold">
                  لوحة التحكم
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full px-6">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-6 font-semibold border-2 border-white">
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone Mockup - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-2 lg:order-1 flex justify-center"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-purple-500/30 rounded-[2rem] blur-3xl scale-90" />
              
              {/* Phone Card */}
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 w-80 border border-white/10 shadow-2xl">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 mb-4 flex items-center justify-center text-4xl font-bold text-white">
                    ع
                  </div>
                  <h3 className="text-white font-bold text-xl">علي العراقي</h3>
                  <p className="text-white/50 text-sm">@ali_iq</p>
                </div>
                
                {/* Links */}
                <div className="space-y-3">
                  <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between group hover:bg-slate-700/80 transition-all cursor-pointer">
                    <ArrowLeft className="w-4 h-4 text-white/50" />
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">Instagram</span>
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between group hover:bg-slate-700/80 transition-all cursor-pointer">
                    <ArrowLeft className="w-4 h-4 text-white/50" />
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">YouTube</span>
                      <Youtube className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between group hover:bg-slate-700/80 transition-all cursor-pointer">
                    <ArrowLeft className="w-4 h-4 text-white/50" />
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">واتساب</span>
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="text-white/90 text-sm font-medium">بديل عربي لـ Linktree</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              رابط واحد
              <span className="block bg-gradient-to-l from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                لكل شيء
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl">
              اجمع كل روابطك في صفحة واحدة جميلة وشاركها مع العالم
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full font-bold shadow-lg"
                >
                  ابدأ مجاناً
                </Button>
              </Link>
              <Link to="/preview/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full border-2 border-white/30"
                >
                  شاهد مثال
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              لماذا Link.iq؟
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:scale-105 transition-transform"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              اختر ثيمك المفضل
            </h2>
            <p className="text-white/70 text-lg">
              4 تصاميم مختلفة لتناسب ذوقك
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
                <div className={`${theme.bg} rounded-2xl h-64 mb-4 border-2 border-white/20 group-hover:scale-105 transition-transform shadow-xl overflow-hidden p-4`}>
                  {/* Mini Profile Preview */}
                  <div className="flex flex-col items-center pt-4">
                    <div className="w-10 h-10 rounded-full bg-white/30 mb-2" />
                    <div className="w-20 h-2 bg-white/40 rounded mb-1" />
                    <div className="w-16 h-1.5 bg-white/30 rounded mb-4" />
                  </div>
                  {/* Mini Links */}
                  <div className="space-y-2 px-2">
                    <div className={`${theme.cards} h-8 rounded-lg`} />
                    <div className={`${theme.cards} h-8 rounded-lg`} />
                    <div className={`${theme.cards} h-8 rounded-lg`} />
                  </div>
                </div>
                <p className="text-white/90 text-center font-semibold">{theme.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-pink-400 via-purple-300 to-pink-400 bg-clip-text text-transparent mb-6">
              جاهز لإنشاء صفحتك؟
            </h2>
            <p className="text-white/70 text-xl mb-10">
              انضم الآن واحصل على صفحة روابط احترافية مجاناً
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 text-xl px-12 py-7 rounded-full font-bold shadow-xl"
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
          <p className="text-white/50 text-sm">
            صنع بكل حب للسوق العراقي والعربي
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
