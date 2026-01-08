import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Instagram, Youtube, Twitter, Globe, Mail, Phone, MessageCircle, Music, X } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { toast } from "sonner";

const iconOptions = [
  { icon: Instagram, name: "instagram" },
  { icon: Youtube, name: "youtube" },
  { icon: Twitter, name: "twitter" },
  { icon: Globe, name: "globe" },
  { icon: Mail, name: "mail" },
  { icon: Phone, name: "phone" },
  { icon: MessageCircle, name: "message" },
  { icon: Music, name: "music" },
];

export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("globe");
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
      await addLink.mutateAsync({ title: title.trim(), url: formattedUrl, icon: selectedIcon });
      toast.success("تمت إضافة الرابط بنجاح!");
      setTitle("");
      setUrl("");
      setSelectedIcon("globe");
      setOpen(false);
    } catch {
      toast.error("حدث خطأ أثناء إضافة الرابط");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-l from-cyan-500 to-emerald-500 hover:opacity-90 text-white rounded-xl px-6 py-6 text-base gap-2">
          <Plus className="w-5 h-5" />
          إضافة رابط
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 sm:max-w-md" dir="rtl">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl text-white text-right">إضافة رابط جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 text-right">عنوان الرابط</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: Instagram"
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/50 bg-slate-800/50 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-all text-right"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 text-right">رابط URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-slate-800/50 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3 text-right">اختر أيقونة</label>
            <div className="flex flex-wrap gap-2 justify-end">
              {iconOptions.map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIcon(name)}
                  className={`p-3 rounded-xl transition-all ${
                    selectedIcon === name
                      ? "bg-white/20 ring-2 ring-white/50"
                      : "bg-slate-800/50 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-white hover:bg-white/10 rounded-xl py-6"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-gradient-to-l from-purple-500 via-pink-500 to-cyan-400 hover:opacity-90 text-white rounded-xl py-6 font-semibold"
              disabled={addLink.isPending}
            >
              {addLink.isPending ? "جاري الإضافة..." : "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
