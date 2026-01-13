import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface BackgroundElement {
  x: string;
  y: string;
  size: string;
  color: string;
  opacity: number;
  blur: string;
}

interface ThemeVisualEffectsProps {
  backgroundElements?: {
    type: string;
    count: number;
    items: BackgroundElement[];
    animation: string;
  };
  decorativeShapes?: {
    enabled: boolean;
    type: string;
    position: string;
    count: number;
    opacity: number;
    color: string;
    size: string;
  };
  particles?: {
    enabled: boolean;
    count: number;
    type: string;
    color: string;
    opacity: number;
    speed: string;
    size: string;
  };
  glowEffects?: {
    aroundProfile: boolean;
    behindCards: boolean;
    profileGlowColor: string;
    profileGlowSize: string;
    cardGlowColor: string;
    cardGlowSize: string;
    pulseAnimation: boolean;
  };
}

// Generate random positions for particles
const generateParticlePositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));
};

// Generate decorative shapes positions
const generateShapePositions = (count: number, position: string) => {
  if (position === "corners") {
    return [
      { x: 5, y: 5 },
      { x: 95, y: 5 },
      { x: 5, y: 95 },
      { x: 95, y: 95 },
      { x: 50, y: 5 },
      { x: 50, y: 95 },
      { x: 5, y: 50 },
      { x: 95, y: 50 },
    ].slice(0, count);
  }
  return Array.from({ length: count }, () => ({
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
  }));
};

export function ThemeVisualEffects({
  backgroundElements,
  decorativeShapes,
  particles,
  glowEffects,
}: ThemeVisualEffectsProps) {
  const [particlePositions, setParticlePositions] = useState<ReturnType<typeof generateParticlePositions>>([]);
  const [shapePositions, setShapePositions] = useState<ReturnType<typeof generateShapePositions>>([]);

  useEffect(() => {
    if (particles?.enabled) {
      setParticlePositions(generateParticlePositions(particles.count || 50));
    }
    if (decorativeShapes?.enabled) {
      setShapePositions(generateShapePositions(decorativeShapes.count || 8, decorativeShapes.position || "random"));
    }
  }, [particles, decorativeShapes]);

  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case "slow-float":
        return {
          animate: {
            y: [0, -20, 0],
            x: [0, 10, 0],
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
          },
        };
      case "rotate":
        return {
          animate: {
            rotate: [0, 360],
            transition: { duration: 20, repeat: Infinity, ease: "linear" as const },
          },
        };
      case "pulse":
        return {
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
          },
        };
      case "drift":
        return {
          animate: {
            x: [0, 30, 0, -30, 0],
            y: [0, -15, 0, 15, 0],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" as const },
          },
        };
      default:
        return {};
    }
  };

  const getParticleSpeed = (speed: string) => {
    switch (speed) {
      case "slow": return 8;
      case "fast": return 2;
      default: return 4;
    }
  };

  const getShapeSize = (size: string) => {
    switch (size) {
      case "small": return 8;
      case "large": return 24;
      default: return 14;
    }
  };

  const renderShape = (type: string, size: number, color: string, opacity: number) => {
    const style = { opacity };
    
    switch (type) {
      case "triangles":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
            <polygon points="12,2 22,22 2,22" fill={color} />
          </svg>
        );
      case "circles":
        return (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              ...style,
            }}
          />
        );
      case "stars":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
            <polygon
              points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9"
              fill={color}
            />
          </svg>
        );
      case "dots":
        return (
          <div
            style={{
              width: size / 2,
              height: size / 2,
              borderRadius: "50%",
              backgroundColor: color,
              ...style,
            }}
          />
        );
      case "lines":
        return (
          <div
            style={{
              width: size * 2,
              height: 2,
              backgroundColor: color,
              transform: `rotate(${Math.random() * 180}deg)`,
              ...style,
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderParticle = (type: string, color: string, size: string) => {
    const sizeNum = parseInt(size) || 2;
    
    switch (type) {
      case "sparkles":
        return (
          <svg width={sizeNum * 3} height={sizeNum * 3} viewBox="0 0 24 24">
            <polygon
              points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10"
              fill={color}
            />
          </svg>
        );
      case "music-notes":
        return (
          <svg width={sizeNum * 4} height={sizeNum * 4} viewBox="0 0 24 24" fill={color}>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        );
      case "stars":
        return (
          <svg width={sizeNum * 3} height={sizeNum * 3} viewBox="0 0 24 24">
            <polygon
              points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9"
              fill={color}
            />
          </svg>
        );
      case "bubbles":
        return (
          <div
            style={{
              width: sizeNum * 2,
              height: sizeNum * 2,
              borderRadius: "50%",
              border: `1px solid ${color}`,
              backgroundColor: "transparent",
            }}
          />
        );
      default: // dots
        return (
          <div
            style={{
              width: sizeNum,
              height: sizeNum,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Elements */}
      {backgroundElements?.items?.map((item, index) => (
        <motion.div
          key={`bg-${index}`}
          className="absolute rounded-full"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            backgroundColor: item.color,
            opacity: item.opacity,
            filter: `blur(${item.blur})`,
            transform: "translate(-50%, -50%)",
          }}
          {...getAnimationVariants(backgroundElements.animation)}
        />
      ))}

      {/* Decorative Shapes */}
      {decorativeShapes?.enabled &&
        shapePositions.map((pos, index) => (
          <motion.div
            key={`shape-${index}`}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: decorativeShapes.opacity, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {renderShape(
              decorativeShapes.type,
              getShapeSize(decorativeShapes.size),
              decorativeShapes.color,
              1
            )}
          </motion.div>
        ))}

      {/* Particles */}
      {particles?.enabled &&
        particlePositions.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particles.opacity,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [particles.opacity, particles.opacity * 0.5, particles.opacity],
            }}
            transition={{
              duration: particle.duration * getParticleSpeed(particles.speed) / 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          >
            {renderParticle(particles.type, particles.color, particles.size)}
          </motion.div>
        ))}
    </div>
  );
}

// Profile Glow Effect Component
export function ProfileGlow({
  glowEffects,
}: {
  glowEffects?: ThemeVisualEffectsProps["glowEffects"];
}) {
  if (!glowEffects?.aroundProfile) return null;

  return (
    <motion.div
      className="absolute inset-0 rounded-full -z-10"
      style={{
        background: glowEffects.profileGlowColor,
        filter: `blur(${glowEffects.profileGlowSize})`,
        transform: "scale(1.5)",
      }}
      animate={
        glowEffects.pulseAnimation
          ? {
              scale: [1.5, 1.7, 1.5],
              opacity: [0.6, 0.8, 0.6],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Card Glow Effect Component
export function CardGlow({
  glowEffects,
}: {
  glowEffects?: ThemeVisualEffectsProps["glowEffects"];
}) {
  if (!glowEffects?.behindCards) return null;

  return (
    <div
      className="absolute inset-0 -z-10 rounded-inherit"
      style={{
        background: glowEffects.cardGlowColor,
        filter: `blur(${glowEffects.cardGlowSize})`,
        transform: "scale(1.1)",
      }}
    />
  );
}
