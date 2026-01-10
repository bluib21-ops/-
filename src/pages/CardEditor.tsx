import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Building2,
  User,
  Briefcase,
  Upload,
  Download,
  RotateCcw,
  Check
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CardData {
  fullName: string;
  profession: string;
  company: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  website: string;
  address: string;
  logo: string;
  template: string;
  primaryColor: string;
  secondaryColor: string;
}

const templates = [
  { id: "medical", name: "Medical", nameAr: "طبي", description: "مثالي للأطباء والمهنيين الصحيين" },
  { id: "modern", name: "Modern Minimalist", nameAr: "عصري بسيط", description: "تصميم أنيق وبسيط" },
  { id: "gradient", name: "Gradient Premium", nameAr: "تدرج فاخر", description: "ألوان نيون متدرجة" },
  { id: "corporate", name: "Corporate", nameAr: "رسمي", description: "احترافي للشركات" },
  { id: "creative", name: "Creative", nameAr: "إبداعي", description: "أشكال هندسية جريئة" },
];

const defaultCardData: CardData = {
  fullName: "",
  profession: "",
  company: "",
  primaryPhone: "",
  secondaryPhone: "",
  email: "",
  website: "",
  address: "",
  logo: "",
  template: "gradient",
  primaryColor: "#a855f7",
  secondaryColor: "#06b6d4",
};

export default function CardEditor() {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  const [cardData, setCardData] = useState<CardData>(defaultCardData);
  const [showBack, setShowBack] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("linkiq-card-data");
    if (savedData) {
      setCardData(JSON.parse(savedData));
    } else if (profile) {
      setCardData(prev => ({
        ...prev,
        fullName: profile.display_name || "",
        email: user?.email || "",
      }));
    }
  }, [profile, user]);

  // Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      if (profile?.username) {
        const url = `${window.location.origin}/preview/${profile.username}`;
        const qr = await QRCode.toDataURL(url, {
          width: 400,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setQrCodeUrl(qr);
      }
    };
    generateQR();
  }, [profile?.username]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("linkiq-card-data", JSON.stringify(cardData));
  }, [cardData]);

  const updateField = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getTemplateStyles = () => {
    const { template, primaryColor, secondaryColor } = cardData;
    
    switch (template) {
      case "medical":
        return {
          front: `bg-white`,
          frontStyle: { background: 'white' },
          accent: primaryColor,
          textPrimary: "#1f2937",
          textSecondary: "#6b7280",
        };
      case "modern":
        return {
          front: `bg-white`,
          frontStyle: { background: 'white' },
          accent: "#000000",
          textPrimary: "#000000",
          textSecondary: "#6b7280",
        };
      case "gradient":
        return {
          front: "",
          frontStyle: { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` },
          accent: "#ffffff",
          textPrimary: "#ffffff",
          textSecondary: "rgba(255,255,255,0.8)",
        };
      case "corporate":
        return {
          front: "",
          frontStyle: { background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` },
          accent: "#ffffff",
          textPrimary: "#ffffff",
          textSecondary: "rgba(255,255,255,0.8)",
        };
      case "creative":
        return {
          front: "",
          frontStyle: { background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})` },
          accent: "#ffffff",
          textPrimary: "#ffffff",
          textSecondary: "rgba(255,255,255,0.9)",
        };
      default:
        return {
          front: "",
          frontStyle: { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` },
          accent: "#ffffff",
          textPrimary: "#ffffff",
          textSecondary: "rgba(255,255,255,0.8)",
        };
    }
  };

  const downloadPDF = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;
    
    setIsGenerating(true);
    toast.loading("جاري إنشاء PDF...");

    try {
      // Card dimensions in mm (standard business card)
      const cardWidthMM = 85;
      const cardHeightMM = 55;
      
      // PDF dimensions with margins
      const pdfWidth = cardWidthMM + 20;
      const pdfHeight = cardHeightMM + 30;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pdfHeight, pdfWidth],
      });

      // Capture front card
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const frontImg = frontCanvas.toDataURL('image/png');
      
      // Add front to PDF
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text('الوجه الأمامي', pdfWidth / 2, 8, { align: 'center' });
      pdf.addImage(frontImg, 'PNG', 10, 12, cardWidthMM, cardHeightMM);

      // New page for back
      pdf.addPage();
      
      // Capture back card
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const backImg = backCanvas.toDataURL('image/png');
      
      // Add back to PDF
      pdf.text('الوجه الخلفي', pdfWidth / 2, 8, { align: 'center' });
      pdf.addImage(backImg, 'PNG', 10, 12, cardWidthMM, cardHeightMM);

      pdf.save(`${cardData.fullName || 'business-card'}-card.pdf`);
      toast.dismiss();
      toast.success("تم تحميل البطاقة بنجاح!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error("حدث خطأ أثناء إنشاء PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = getTemplateStyles();

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
      <header className="fixed top-0 right-0 left-0 z-50 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            onClick={downloadPDF}
            disabled={isGenerating || !cardData.fullName || !cardData.profession || !cardData.primaryPhone || !cardData.email}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-6 gap-2"
          >
            <Download className="w-5 h-5" />
            تحميل PDF
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">تصميم البطاقة الرقمية</h1>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 rounded-full"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Personal Info */}
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                المعلومات الشخصية
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-white/80 mb-2 block">الاسم الكامل *</Label>
                  <Input
                    value={cardData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">المهنة / التخصص *</Label>
                  <Input
                    value={cardData.profession}
                    onChange={(e) => updateField("profession", e.target.value)}
                    placeholder="مثال: طبيب أسنان، مهندس برمجيات"
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">اسم الشركة</Label>
                  <Input
                    value={cardData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    placeholder="اسم الشركة أو المؤسسة"
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                معلومات التواصل
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80 mb-2 block">رقم الهاتف الأساسي *</Label>
                    <Input
                      value={cardData.primaryPhone}
                      onChange={(e) => updateField("primaryPhone", e.target.value)}
                      placeholder="+966 5XX XXX XXXX"
                      className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">رقم الهاتف الثانوي</Label>
                    <Input
                      value={cardData.secondaryPhone}
                      onChange={(e) => updateField("secondaryPhone", e.target.value)}
                      placeholder="+966 5XX XXX XXXX"
                      className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">البريد الإلكتروني *</Label>
                  <Input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="example@email.com"
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">الموقع الإلكتروني</Label>
                  <Input
                    value={cardData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="www.example.com"
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">العنوان</Label>
                  <Input
                    value={cardData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="المدينة، الدولة"
                    className="bg-slate-800/50 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                الصورة / الشعار
              </h2>
              <div className="flex items-center gap-4">
                {cardData.logo ? (
                  <div className="relative">
                    <img
                      src={cardData.logo}
                      alt="Logo"
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -left-2 w-6 h-6 rounded-full"
                      onClick={() => updateField("logo", "")}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-white/50 transition-colors">
                    <Upload className="w-6 h-6 text-white/50" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-white/50 text-sm">
                  ارفع صورتك الشخصية أو شعار الشركة
                </p>
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                اختر التصميم
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => updateField("template", tmpl.id)}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      cardData.template === tmpl.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/20 hover:border-white/40 bg-slate-800/30"
                    }`}
                  >
                    {cardData.template === tmpl.id && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`h-12 rounded-lg mb-2 ${
                      tmpl.id === "medical" ? "bg-white" :
                      tmpl.id === "modern" ? "bg-gradient-to-br from-gray-800 to-black" :
                      tmpl.id === "gradient" ? "bg-gradient-to-br from-purple-500 to-cyan-500" :
                      tmpl.id === "corporate" ? "bg-gradient-to-br from-blue-600 to-blue-800" :
                      "bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500"
                    }`} />
                    <p className="text-white text-sm font-medium">{tmpl.nameAr}</p>
                    <p className="text-white/50 text-xs">{tmpl.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Customization */}
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">تخصيص الألوان</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/80 mb-2 block">اللون الأساسي</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={cardData.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Input
                      value={cardData.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="bg-slate-800/50 border-white/20 text-white uppercase"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 mb-2 block">اللون الثانوي</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={cardData.secondaryColor}
                      onChange={(e) => updateField("secondaryColor", e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Input
                      value={cardData.secondaryColor}
                      onChange={(e) => updateField("secondaryColor", e.target.value)}
                      className="bg-slate-800/50 border-white/20 text-white uppercase"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-28 space-y-6"
          >
            <div className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBack(!showBack)}
                  className="border-white/20 text-white hover:bg-white/10 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {showBack ? "عرض الأمام" : "عرض الخلفية"}
                </Button>
                <h2 className="text-xl font-bold text-white">معاينة البطاقة</h2>
              </div>

              {/* Card Preview Container */}
              <div className="flex justify-center">
                <div className="relative" style={{ perspective: "1000px" }}>
                  {/* Front Card */}
                  <div
                    ref={frontCardRef}
                    className={`w-[340px] h-[220px] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
                      showBack ? "opacity-0 absolute" : "opacity-100"
                    }`}
                    style={styles.frontStyle}
                    dir="rtl"
                  >
                    {/* Template: Medical */}
                    {cardData.template === "medical" && (
                      <div className="h-full p-5 flex flex-col">
                        <div className="flex items-start gap-4">
                          {cardData.logo ? (
                            <img src={cardData.logo} alt="" className="w-16 h-16 rounded-full object-cover border-4" style={{ borderColor: cardData.primaryColor }} />
                          ) : (
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: cardData.primaryColor }}>
                              {cardData.fullName?.charAt(0) || "؟"}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold" style={{ color: styles.textPrimary }}>
                              {cardData.fullName || "الاسم الكامل"}
                            </h3>
                            <p className="text-sm" style={{ color: cardData.primaryColor }}>
                              {cardData.profession || "المهنة"}
                            </p>
                            {cardData.company && (
                              <p className="text-xs" style={{ color: styles.textSecondary }}>
                                {cardData.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-auto space-y-1.5">
                          {cardData.primaryPhone && (
                            <div className="flex items-center gap-2 text-xs" style={{ color: styles.textSecondary }}>
                              <Phone className="w-3 h-3" style={{ color: cardData.primaryColor }} />
                              <span dir="ltr">{cardData.primaryPhone}</span>
                            </div>
                          )}
                          {cardData.email && (
                            <div className="flex items-center gap-2 text-xs" style={{ color: styles.textSecondary }}>
                              <Mail className="w-3 h-3" style={{ color: cardData.primaryColor }} />
                              <span dir="ltr">{cardData.email}</span>
                            </div>
                          )}
                          {cardData.website && (
                            <div className="flex items-center gap-2 text-xs" style={{ color: styles.textSecondary }}>
                              <Globe className="w-3 h-3" style={{ color: cardData.primaryColor }} />
                              <span dir="ltr">{cardData.website}</span>
                            </div>
                          )}
                          {cardData.address && (
                            <div className="flex items-center gap-2 text-xs" style={{ color: styles.textSecondary }}>
                              <MapPin className="w-3 h-3" style={{ color: cardData.primaryColor }} />
                              <span>{cardData.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Template: Modern */}
                    {cardData.template === "modern" && (
                      <div className="h-full flex">
                        <div className="w-1/3 bg-black flex items-center justify-center">
                          {cardData.logo ? (
                            <img src={cardData.logo} alt="" className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-black text-2xl font-bold">
                              {cardData.fullName?.charAt(0) || "؟"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-center">
                          <h3 className="text-lg font-bold text-black">
                            {cardData.fullName || "الاسم الكامل"}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {cardData.profession || "المهنة"}
                          </p>
                          <div className="space-y-1">
                            {cardData.primaryPhone && (
                              <p className="text-xs text-gray-500" dir="ltr">{cardData.primaryPhone}</p>
                            )}
                            {cardData.email && (
                              <p className="text-xs text-gray-500" dir="ltr">{cardData.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Template: Gradient */}
                    {cardData.template === "gradient" && (
                      <div className="h-full p-5 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
                        <div className="relative z-10 flex items-start gap-4">
                          {cardData.logo ? (
                            <img src={cardData.logo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white/30" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                              {cardData.fullName?.charAt(0) || "؟"}
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {cardData.fullName || "الاسم الكامل"}
                            </h3>
                            <p className="text-sm text-white/80">
                              {cardData.profession || "المهنة"}
                            </p>
                            {cardData.company && (
                              <p className="text-xs text-white/60">{cardData.company}</p>
                            )}
                          </div>
                        </div>
                        <div className="relative z-10 mt-auto grid grid-cols-2 gap-2">
                          {cardData.primaryPhone && (
                            <div className="flex items-center gap-1.5 text-xs text-white/80">
                              <Phone className="w-3 h-3" />
                              <span dir="ltr">{cardData.primaryPhone}</span>
                            </div>
                          )}
                          {cardData.email && (
                            <div className="flex items-center gap-1.5 text-xs text-white/80">
                              <Mail className="w-3 h-3" />
                              <span dir="ltr" className="truncate">{cardData.email}</span>
                            </div>
                          )}
                          {cardData.website && (
                            <div className="flex items-center gap-1.5 text-xs text-white/80">
                              <Globe className="w-3 h-3" />
                              <span dir="ltr">{cardData.website}</span>
                            </div>
                          )}
                          {cardData.address && (
                            <div className="flex items-center gap-1.5 text-xs text-white/80">
                              <MapPin className="w-3 h-3" />
                              <span>{cardData.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Template: Corporate */}
                    {cardData.template === "corporate" && (
                      <div className="h-full flex flex-col">
                        <div className="p-4 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          {cardData.logo ? (
                            <img src={cardData.logo} alt="" className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white font-bold">
                              {cardData.fullName?.charAt(0) || "؟"}
                            </div>
                          )}
                          {cardData.company && (
                            <span className="text-white/80 text-sm">{cardData.company}</span>
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center">
                          <h3 className="text-xl font-bold text-white">
                            {cardData.fullName || "الاسم الكامل"}
                          </h3>
                          <p className="text-sm text-white/70 mb-3">
                            {cardData.profession || "المهنة"}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
                            {cardData.primaryPhone && <span dir="ltr">{cardData.primaryPhone}</span>}
                            {cardData.email && <span dir="ltr">{cardData.email}</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Template: Creative */}
                    {cardData.template === "creative" && (
                      <div className="h-full p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 border-8 border-white/20 rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rotate-45 -translate-x-1/2 translate-y-1/2" />
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex items-center gap-3">
                            {cardData.logo ? (
                              <img src={cardData.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                                {cardData.fullName?.charAt(0) || "؟"}
                              </div>
                            )}
                            <div>
                              <h3 className="text-base font-bold text-white">
                                {cardData.fullName || "الاسم الكامل"}
                              </h3>
                              <p className="text-xs text-white/80">
                                {cardData.profession || "المهنة"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-auto space-y-1">
                            <div className="flex items-center gap-4 text-xs text-white/80">
                              {cardData.primaryPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span dir="ltr">{cardData.primaryPhone}</span>
                                </span>
                              )}
                              {cardData.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  <span dir="ltr">{cardData.email}</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/80">
                              {cardData.website && (
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  <span dir="ltr">{cardData.website}</span>
                                </span>
                              )}
                              {cardData.address && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{cardData.address}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Back Card */}
                  <div
                    ref={backCardRef}
                    className={`w-[340px] h-[220px] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
                      showBack ? "opacity-100" : "opacity-0 absolute top-0"
                    }`}
                    style={styles.frontStyle}
                    dir="rtl"
                  >
                    <div className="h-full flex flex-col items-center justify-center p-6">
                      <p className="text-sm mb-4" style={{ color: cardData.template === "medical" || cardData.template === "modern" ? styles.textSecondary : "rgba(255,255,255,0.8)" }}>
                        امسح للوصول لجميع روابطي
                      </p>
                      {qrCodeUrl && (
                        <div className="bg-white p-3 rounded-xl">
                          <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28" />
                        </div>
                      )}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">L</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: cardData.template === "medical" || cardData.template === "modern" ? styles.textSecondary : "rgba(255,255,255,0.6)" }}>
                          Link.iq
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-white/50 text-sm mt-6">
                مقاس البطاقة: 85mm × 55mm (مقاس قياسي للطباعة)
              </p>
            </div>

            {/* Download Button */}
            <Button
              onClick={downloadPDF}
              disabled={isGenerating || !cardData.fullName || !cardData.profession || !cardData.primaryPhone || !cardData.email}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg rounded-xl py-6 gap-3"
            >
              <Download className="w-6 h-6" />
              تحميل البطاقة PDF
            </Button>

            {(!cardData.fullName || !cardData.profession || !cardData.primaryPhone || !cardData.email) && (
              <p className="text-center text-yellow-400/80 text-sm">
                * يرجى تعبئة الحقول الإجبارية (الاسم، المهنة، الهاتف، البريد)
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
