import { useEffect, useRef } from 'react';

interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<Circle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize circles
    circlesRef.current = [
      { x: 200, y: 150, radius: 300, color: 'rgba(139,92,246,0.15)', vx: 0.1, vy: 0.05 },
      { x: 1100, y: 100, radius: 350, color: 'rgba(236,72,153,0.12)', vx: -0.08, vy: 0.06 },
      { x: 150, y: 500, radius: 280, color: 'rgba(59,130,246,0.18)', vx: 0.12, vy: -0.04 },
      { x: 1200, y: 600, radius: 320, color: 'rgba(139,92,246,0.1)', vx: -0.1, vy: 0.08 },
      { x: 600, y: 800, radius: 400, color: 'rgba(236,72,153,0.15)', vx: 0.05, vy: -0.07 },
    ];

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update circles with blur
      ctx.filter = 'blur(80px)';
      circlesRef.current.forEach((circle) => {
        // Update position
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Bounce off edges
        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;

        // Draw circle
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset filter for particles
      ctx.filter = 'none';

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        // Update position (move upward)
        particle.y -= particle.speed;

        // Reset particle if it goes off screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
