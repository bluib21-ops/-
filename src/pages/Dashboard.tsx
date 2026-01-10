import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLinks } from "@/hooks/useLinks";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Eye, 
  Settings, 
  LogOut, 
  Link2, 
  Copy, 
  QrCode, 
  FileText,
  Users,
  MousePointerClick,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { links, deleteLink } = useLinks();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setDisplayName(profile.display_name || "");
      document.documentElement.setAttribute("data-theme", profile.theme || "neon-purple");
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink.mutateAsync(linkId);
      toast.success("تم حذف الرابط");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const copyProfileLink = () => {
    const url = `${window.location.origin}/preview/${profile?.username}`;
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ الرابط");
  };

  const downloadQRCode = async () => {
    if (!profile?.username) {
      toast.error("لا يمكن إنشاء QR Code");
      return;
    }
    
    try {
      const url = `${window.location.origin}/preview/${profile.username}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${profile.username}-qrcode.png`;
      link.href = qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("تم تحميل QR Code بنجاح");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("حدث خطأ أثناء إنشاء QR Code");
    }
  };

  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);

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
      <header className="fixed top-0 right-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Link.iq</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 rounded-full px-4 gap-2"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <Settings className="w-4 h-4" />
              الإعدادات
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 rounded-full px-4 gap-2"
              onClick={() => navigate(`/preview/${profile?.username}`)}
            >
              <Eye className="w-4 h-4" />
              معاينة البروفايل
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 rounded-full px-4 gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-right"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            مرحباً، <span className="bg-gradient-to-l from-pink-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{profile?.display_name || profile?.username}!</span>
          </h1>
          <p className="text-white/70">
            إدارة روابطك وملفك الشخصي
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">إجمالي الضغطات</p>
                <p className="text-4xl font-bold text-white">{totalClicks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">عدد الروابط</p>
                <p className="text-4xl font-bold text-white">{links.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">الزوار</p>
                <p className="text-4xl font-bold text-white">0</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={copyProfileLink}
            className="bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-lg border border-white/10 text-white rounded-xl py-6 gap-3"
          >
            <Copy className="w-5 h-5" />
            نسخ الرابط
          </Button>
          <Button
            className="bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-lg border border-white/10 text-white rounded-xl py-6 gap-3"
          >
            <FileText className="w-5 h-5" />
            تحميل بطاقة PDF
          </Button>
          <Button
            onClick={downloadQRCode}
            className="bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-lg border border-white/10 text-white rounded-xl py-6 gap-3"
          >
            <QrCode className="w-5 h-5" />
            تحميل QR Code
          </Button>
        </div>

        {/* Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <AddLinkDialog />
            <h2 className="text-2xl font-bold text-white">روابطك</h2>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {links.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Link2 className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold text-white mb-2">لا توجد روابط بعد</h3>
                  <p className="text-white/50">
                    ابدأ بإضافة روابطك لمشاركتها مع متابعيك
                  </p>
                </motion.div>
              ) : (
                links.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white/50 hover:text-white hover:bg-white/10"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <span className="text-white/50 text-sm">{link.click_count} ✦</span>
                      <span className="text-white/40 text-sm truncate max-w-[200px]">{link.url}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{link.title}</span>
                      <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-white/70" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
