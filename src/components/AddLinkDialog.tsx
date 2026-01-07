import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { toast } from "sonner";

const emojiOptions = ["🔗", "🌐", "📱", "💼", "🎵", "📸", "🎥", "📧", "💬", "🛒", "📝", "🎮"];

export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("🔗");
  const { addLink } = useLinks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      await addLink.mutateAsync({ title: title.trim(), url: formattedUrl, icon });
      toast.success("تمت إضافة الرابط بنجاح!");
      setTitle("");
      setUrl("");
      setIcon("🔗");
      setOpen(false);
    } catch {
      toast.error("حدث خطأ أثناء إضافة الرابط");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-bg text-primary-foreground rounded-full px-8 py-6 text-lg">
          <Plus className="w-5 h-5 ml-2" />
          إضافة رابط جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">إضافة رابط جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">اختر أيقونة</label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    icon === emoji
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "hover:bg-white/10"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">عنوان الرابط</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: حسابي على تويتر"
              className="input-glass"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">رابط URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="input-glass"
              dir="ltr"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full gradient-bg text-primary-foreground rounded-full py-6"
            disabled={addLink.isPending}
          >
            {addLink.isPending ? "جاري الإضافة..." : "إضافة الرابط"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
