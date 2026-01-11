import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Music, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MusicUploaderProps {
  currentSongUrl: string | null;
  onUpload: (url: string | null) => void;
}

export function MusicUploader({ currentSongUrl, onUpload }: MusicUploaderProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateAudioDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        if (audio.duration > 30) {
          toast.error("الأغنية يجب أن لا تتجاوز 30 ثانية");
          resolve(false);
        } else {
          resolve(true);
        }
      };
      audio.onerror = () => {
        toast.error("خطأ في قراءة الملف");
        resolve(false);
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast.error("الرجاء اختيار ملف صوتي");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الملف يجب أن لا يتجاوز 5 ميجابايت");
      return;
    }

    // Validate duration
    const isValidDuration = await validateAudioDuration(file);
    if (!isValidDuration) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const fileName = `${user.id}/theme-song-${Date.now()}.mp3`;
      
      const { data, error } = await supabase.storage
        .from("theme-songs")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);

      if (error) {
        // If bucket doesn't exist, create it via URL
        console.error("Upload error:", error);
        toast.error("حدث خطأ أثناء الرفع. تأكد من إنشاء bucket 'theme-songs'");
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("theme-songs")
        .getPublicUrl(data.path);

      setUploadProgress(100);
      onUpload(urlData.publicUrl);
      toast.success("تم رفع الأغنية بنجاح!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء الرفع");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onUpload(null);
    toast.success("تم إزالة الأغنية");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-right">
          <h3 className="text-xl font-bold text-white mb-1">أغنيتي المفضلة 🎵</h3>
          <p className="text-white/60 text-sm">ارفع أغنية قصيرة (30 ثانية كحد أقصى)</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentSongUrl ? (
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-white">تم رفع الأغنية</span>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl py-6 gap-3"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>جاري الرفع... {uploadProgress}%</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>اختر ملف MP3</span>
            </>
          )}
        </Button>
      )}

      <div className="mt-3 flex items-center gap-2 text-white/40 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>الحد الأقصى: 30 ثانية، 5 ميجابايت</span>
      </div>
    </motion.div>
  );
}