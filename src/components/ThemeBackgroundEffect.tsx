import { useEffect, useRef } from 'react';

interface ThemeBackgroundEffectProps {
  type: string;
  css?: string;
  html?: string;
}

export function ThemeBackgroundEffect({ type, css, html }: ThemeBackgroundEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // إضافة CSS للـ document
    if (css) {
      const styleId = 'theme-background-effect-style';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      
      styleEl.textContent = css;
      
      return () => {
        styleEl?.remove();
      };
    }
  }, [css]);
  
  // تأثيرات مدمجة للأنواع الشائعة
  const getBuiltInEffect = () => {
    switch (type) {
      case 'rain':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                style={{
                  left: `${Math.random() * 100}%`,
                  height: `${Math.random() * 20 + 10}px`,
                  animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: 'rain-fall linear infinite',
                }}
              />
            ))}
            <style>{`
              @keyframes rain-fall {
                0% { transform: translateY(-100vh); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
              }
            `}</style>
          </div>
        );
        
      case 'stars':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }
            `}</style>
          </div>
        );
        
      case 'snow':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/80"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  animation: `snow-fall ${Math.random() * 5 + 5}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes snow-fall {
                0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
              }
            `}</style>
          </div>
        );
        
      case 'bubbles':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/30 bg-white/5"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '-50px',
                  width: `${Math.random() * 40 + 20}px`,
                  height: `${Math.random() * 40 + 20}px`,
                  animation: `bubble-rise ${Math.random() * 8 + 8}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes bubble-rise {
                0% { transform: translateY(0) scale(0); opacity: 0; }
                10% { opacity: 0.5; transform: translateY(0) scale(1); }
                90% { opacity: 0.5; }
                100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
              }
            `}</style>
          </div>
        );
        
      case 'fireflies':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-yellow-300"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 4}px`,
                  height: `${Math.random() * 6 + 4}px`,
                  boxShadow: '0 0 10px 2px rgba(253, 224, 71, 0.8)',
                  animation: `firefly ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes firefly {
                0%, 100% { 
                  transform: translate(0, 0); 
                  opacity: 0;
                }
                10%, 90% { opacity: 1; }
                25% { transform: translate(50px, -30px); }
                50% { transform: translate(-30px, -60px); opacity: 0.5; }
                75% { transform: translate(40px, -90px); }
              }
            `}</style>
          </div>
        );
        
      case 'particles':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes float {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                25% { transform: translate(20px, -20px) scale(1.1); opacity: 0.8; }
                50% { transform: translate(-10px, -40px) scale(0.9); opacity: 0.5; }
                75% { transform: translate(15px, -20px) scale(1.05); opacity: 0.7; }
              }
            `}</style>
          </div>
        );
        
      case 'blobs':
        return (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full blur-3xl opacity-30"
                style={{
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                  width: `${Math.random() * 300 + 200}px`,
                  height: `${Math.random() * 300 + 200}px`,
                  background: `hsl(${Math.random() * 60 + 200}, 70%, 50%)`,
                  animation: `blob-move ${Math.random() * 20 + 20}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes blob-move {
                0%, 100% { transform: translate(0, 0) scale(1); }
                25% { transform: translate(50px, -50px) scale(1.1); }
                50% { transform: translate(-30px, 30px) scale(0.95); }
                75% { transform: translate(20px, 20px) scale(1.05); }
              }
            `}</style>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // إذا كان هناك HTML مخصص، استخدمه
  if (html) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  
  // استخدم التأثير المدمج
  return getBuiltInEffect();
}
