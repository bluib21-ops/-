import { motion } from "framer-motion";

const themes = [
  { id: "neon-purple", name: "بنفسجي نيون", gradient: "from-purple-600 via-blue-500 to-cyan-400" },
  { id: "dark", name: "داكن", gradient: "from-gray-800 via-gray-700 to-gray-600" },
  { id: "cyan-neon", name: "سماوي نيون", gradient: "from-cyan-500 via-teal-400 to-emerald-400" },
  { id: "sunset", name: "غروب", gradient: "from-pink-500 via-orange-400 to-yellow-300" },
] as const;

interface ThemeSelectorProps {
  value: string;
  onChange: (theme: "neon-purple" | "dark" | "cyan-neon" | "sunset") => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {themes.map((theme) => (
        <motion.button
          key={theme.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(theme.id)}
          className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all ${
            value === theme.id ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <span className="text-white text-sm font-semibold text-shadow">{theme.name}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
