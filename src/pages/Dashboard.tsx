import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLinks } from "@/hooks/useLinks";
import { Header } from "@/components/Header";
import { LinkCard } from "@/components/LinkCard";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, BarChart3, Link2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { links, deleteLink } = useLinks();
  const navigate = useNavigate();

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
      document.documentElement.setAttribute("data-theme", profile.theme);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        bio,
        display_name: displayName,
      });
      toast.success("تم حفظ التغييرات");
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleThemeChange = async (theme: "neon-purple" | "dark" | "cyan-neon" | "sunset") => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      await updateProfile.mutateAsync({ theme });
      toast.success("تم تغيير الثيم");
    } catch {
      toast.error("حدث خطأ أثناء تغيير الثيم");
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink.mutateAsync(linkId);
      toast.success("تم حذف الرابط");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            مرحباً، <span className="gradient-text">{profile?.display_name || profile?.username}</span>
          </h1>
          <p className="text-muted-foreground">
            إدارة صفحتك الشخصية وروابطك
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { icon: Link2, label: "الروابط", value: links.length },
            { icon: BarChart3, label: "النقرات", value: totalClicks },
            { icon: Eye, label: "الزيارات", value: "-" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">الملف الشخصي</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الظاهر</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">النبذة التعريفية</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="input-glass resize-none"
                    placeholder="أخبر الآخرين عنك..."
                  />
                </div>
                
                <Button
                  onClick={handleSaveProfile}
                  className="w-full gradient-bg text-primary-foreground rounded-full"
                  disabled={updateProfile.isPending}
                >
                  حفظ التغييرات
                </Button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">اختر الثيم</h2>
              <ThemeSelector
                value={profile?.theme || "neon-purple"}
                onChange={handleThemeChange}
              />
            </div>

            <Button
              variant="outline"
              className="w-full rounded-full border-white/20"
              onClick={() => navigate(`/preview/${profile?.username}`)}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              معاينة الصفحة العامة
            </Button>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">الروابط</h2>
              <AddLinkDialog />
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {links.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-12 text-center"
                  >
                    <Link2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">لا توجد روابط بعد</h3>
                    <p className="text-muted-foreground">
                      ابدأ بإضافة روابطك لمشاركتها مع متابعيك
                    </p>
                  </motion.div>
                ) : (
                  links.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      isEditable
                      onDelete={() => handleDeleteLink(link.id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
