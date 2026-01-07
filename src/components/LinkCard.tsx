import { motion } from "framer-motion";
import { ExternalLink, Trash2, GripVertical, Edit2 } from "lucide-react";
import { Link } from "@/hooks/useLinks";
import { Button } from "@/components/ui/button";

interface LinkCardProps {
  link: Link;
  isEditable?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
}

export function LinkCard({ link, isEditable, onDelete, onEdit, onClick }: LinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="link-card group"
      onClick={onClick}
    >
      {isEditable && (
        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
      )}
      
      <span className="text-3xl">{link.icon}</span>
      
      <div className="flex-1 text-right">
        <h3 className="font-semibold text-foreground">{link.title}</h3>
        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
          {link.url.replace(/^https?:\/\//, "")}
        </p>
      </div>
      
      {isEditable ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {link.click_count} نقرة
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </motion.div>
  );
}
