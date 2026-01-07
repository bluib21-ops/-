import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LayoutDashboard, Link2 } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/50 border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Link2 className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">Link.iq</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4 ml-2" />
                لوحة التحكم
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={() => navigate("/auth")}
              >
                دخول
              </Button>
              <Button
                className="gradient-bg text-primary-foreground rounded-full px-6"
                onClick={() => navigate("/auth?mode=signup")}
              >
                ابدأ مجاناً
              </Button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
