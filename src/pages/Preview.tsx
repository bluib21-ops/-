import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicProfile } from "@/hooks/useProfile";
import { usePublicLinks } from "@/hooks/useLinks";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Link2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlobItem {
  x: string;
  y: string;
  size: string;
  color: string;
}

interface CustomTheme {
  name: string;
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
    headingWeight?: string;
    body: string;
    bodyWeight?: string;
  };
  layout: {
    cardRadius: string;
    cardSpacing?: string;
    cardStyle?: string;
  };
  effects: {
    cardShadow: string;
    backdropBlur: string;
    glassEffect?: boolean;
    profileGlow?: {
      enabled: boolean;
      color: string;
      size: string;
    };
    backgroundBlobs?: {
      enabled: boolean;
      count: number;
      blobs: BlobItem[];
    };
    animations?: {
      blobsMove: boolean;
      profilePulse: boolean;
      cardHover: string;
    };
  };
}

// Background Blobs Component
const BackgroundBlobs = ({ blobs, animate }: { blobs: BlobItem[]; animate: boolean }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            background: blob.color,
            filter: "blur(80px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={animate ? {
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          } : {}}
          transition={{
            duration: 15 + index * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Preview() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = usePublicProfile(username || "");
  const { data: links = [], isLoading: linksLoading } = usePublicLinks(profile?.user_id || "");
  
  // Load custom AI theme from localStorage
  const customTheme = useMemo<CustomTheme | null>(() => {
    try {
      const saved = localStorage.getItem("custom-ai-theme");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse custom theme:", e);
    }
    return null;
  }, []);

  useEffect(() => {
    if (profile?.theme) {
      document.documentElement.setAttribute("data-theme", profile.theme);
    }
    
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [profile?.theme]);

  const handleLinkClick = async (link: { id: string; url: string }) => {
    try {
      await supabase
        .from("links")
        .update({ click_count: (links.find(l => l.id === link.id)?.click_count || 0) + 1 })
        .eq("id", link.id);
    } catch (e) {
      console.error("Failed to track click:", e);
    }
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  if (profileLoading || linksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  // Demo profile for showcase
  if (username === "demo") {
    const demoLinks = [
      { id: "1", title: "تويتر", url: "https://twitter.com", icon: "📱", click_count: 245 },
      { id: "2", title: "انستغرام", url: "https://instagram.com", icon: "📸", click_count: 189 },
      { id: "3", title: "يوتيوب", url: "https://youtube.com", icon: "🎥", click_count: 312 },
      { id: "4", title: "لينكدإن", url: "https://linkedin.com", icon: "💼", click_count: 87 },
    ];

    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 rounded-full gradient-bg mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <h1 className="text-2xl font-bold">أحمد محمد</h1>
            <p className="text-muted-foreground">@demo</p>
            <p className="text-muted-foreground mt-2">مطور ويب ومحب للتقنية 🚀</p>
          </motion.div>

          <div className="space-y-4">
            {demoLinks.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="link-card"
                onClick={() => window.open(link.url, "_blank")}
              >
                <span className="text-3xl">{link.icon}</span>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold">{link.title}</h3>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Link2 className="w-4 h-4" />
              <span>أنشئ صفحتك مع Link.iq</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Link2 className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground mb-6">المستخدم "{username}" غير موجود</p>
        <button onClick={() => navigate("/")} className="text-primary hover:underline">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  // Extract theme effects
  const hasBlobs = customTheme?.effects?.backgroundBlobs?.enabled && customTheme.effects.backgroundBlobs.blobs?.length > 0;
  const hasProfileGlow = customTheme?.effects?.profileGlow?.enabled;
  const hasAnimations = customTheme?.effects?.animations?.blobsMove;

  // Generate inline styles from custom theme
  const containerStyle = customTheme ? {
    background: customTheme.colors.background,
    minHeight: '100vh',
    position: 'relative' as const,
  } : {};

  const textStyle = customTheme ? {
    color: customTheme.colors.text,
    fontFamily: customTheme.fonts.heading,
    fontWeight: customTheme.fonts.headingWeight || '700',
  } : {};

  const secondaryTextStyle = customTheme ? {
    color: customTheme.colors.textSecondary,
    fontFamily: customTheme.fonts.body,
    fontWeight: customTheme.fonts.bodyWeight || '400',
  } : {};

  const cardStyle = customTheme ? {
    backgroundColor: customTheme.colors.cardBg,
    borderColor: customTheme.colors.cardBorder,
    borderWidth: '1px',
    borderStyle: 'solid' as const,
    borderRadius: customTheme.layout.cardRadius,
    boxShadow: customTheme.effects.cardShadow,
    backdropFilter: `blur(${customTheme.effects.backdropBlur})`,
    WebkitBackdropFilter: `blur(${customTheme.effects.backdropBlur})`,
  } : {};

  const profileGlowStyle = hasProfileGlow && customTheme?.effects?.profileGlow ? {
    boxShadow: `0 0 ${customTheme.effects.profileGlow.size} ${customTheme.effects.profileGlow.color}`,
  } : {};

  const avatarBorderStyle = customTheme ? {
    borderColor: customTheme.colors.primary,
    borderWidth: '4px',
    ...profileGlowStyle,
  } : {};

  return (
    <div 
      className={customTheme ? "py-12 px-6" : "min-h-screen py-12 px-6"}
      style={containerStyle}
    >
      {/* Background Blobs */}
      {hasBlobs && customTheme?.effects?.backgroundBlobs?.blobs && (
        <BackgroundBlobs 
          blobs={customTheme.effects.backgroundBlobs.blobs} 
          animate={hasAnimations || false}
        />
      )}

      <div className="max-w-lg mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {profile.avatar_url ? (
            <motion.img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              style={avatarBorderStyle}
              animate={hasProfileGlow && customTheme?.effects?.animations?.profilePulse ? {
                boxShadow: [
                  `0 0 ${customTheme?.effects?.profileGlow?.size || '30px'} ${customTheme?.effects?.profileGlow?.color || 'rgba(96,165,250,0.5)'}`,
                  `0 0 ${parseInt(customTheme?.effects?.profileGlow?.size || '30') * 1.5}px ${customTheme?.effects?.profileGlow?.color || 'rgba(96,165,250,0.5)'}`,
                  `0 0 ${customTheme?.effects?.profileGlow?.size || '30px'} ${customTheme?.effects?.profileGlow?.color || 'rgba(96,165,250,0.5)'}`,
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <motion.div 
              className={customTheme ? "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" : "w-24 h-24 rounded-full gradient-bg mx-auto mb-4 flex items-center justify-center"}
              style={customTheme ? { 
                backgroundColor: customTheme.colors.primary,
                ...profileGlowStyle,
              } : {}}
              animate={hasProfileGlow && customTheme?.effects?.animations?.profilePulse ? {
                boxShadow: [
                  `0 0 ${customTheme?.effects?.profileGlow?.size || '30px'} ${customTheme?.effects?.profileGlow?.color || 'rgba(96,165,250,0.5)'}`,
                  `0 0 ${parseInt(customTheme?.effects?.profileGlow?.size || '30') * 1.5}px ${customTheme?.effects?.profileGlow?.color || 'rgba(96,165,250,0.5)'}`,
                  `0 0 ${customTheme?.effects?.profileGlow?.size || '30px'} ${customTheme?.effects?.profileGlow?.color || 'rgba(96,165,250,0.5)'}`,
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-4xl" style={customTheme ? { color: '#fff' } : {}}>
                {(profile.display_name || profile.username)[0]?.toUpperCase()}
              </span>
            </motion.div>
          )}
          <h1 className="text-2xl font-bold" style={textStyle}>
            {profile.display_name || profile.username}
          </h1>
          <p style={secondaryTextStyle} className={customTheme ? "" : "text-muted-foreground"}>
            @{profile.username}
          </p>
          {profile.bio && (
            <p style={secondaryTextStyle} className={customTheme ? "mt-2" : "text-muted-foreground mt-2"}>
              {profile.bio}
            </p>
          )}
        </motion.div>

        {/* Music Player */}
        {profile.theme_song_url && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <MusicPlayer songUrl={profile.theme_song_url} />
          </motion.div>
        )}

        <div className="space-y-4" style={{ gap: customTheme?.layout?.cardSpacing || '12px' }}>
          {links.length === 0 ? (
            <div 
              className={customTheme ? "p-8 text-center" : "glass-card p-8 text-center"}
              style={cardStyle}
            >
              <p style={secondaryTextStyle} className={customTheme ? "" : "text-muted-foreground"}>
                لا توجد روابط بعد
              </p>
            </div>
          ) : (
            links.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={customTheme?.effects?.animations?.cardHover ? {
                  transform: customTheme.effects.animations.cardHover,
                  boxShadow: customTheme.effects.cardShadow,
                } : { scale: 1.02 }}
                className={customTheme ? "flex items-center gap-4 p-4 cursor-pointer transition-all" : "link-card"}
                style={cardStyle}
                onClick={() => handleLinkClick(link)}
              >
                <span className="text-3xl">{link.icon}</span>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold" style={textStyle}>{link.title}</h3>
                </div>
                <ExternalLink 
                  className="w-5 h-5" 
                  style={secondaryTextStyle}
                />
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate("/")}
            className={customTheme ? "inline-flex items-center gap-2 transition-colors hover:opacity-80" : "inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"}
            style={secondaryTextStyle}
          >
            <Link2 className="w-4 h-4" />
            <span>أنشئ صفحتك مع Link.iq</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}