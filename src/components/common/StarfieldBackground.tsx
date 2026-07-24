/**
 * HOLLYWOOD RISING - Starfield Particle Background
 * Renders moving luxury gold & purple stars for the Main Menu and Hollywood views.
 */

import React, { useEffect, useRef } from 'react';

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const starCount = 80;
    const stars: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
    }[] = [];

    const colors = ['#FFCC33', '#9955FF', '#5599FF', '#FFFFFF', '#FF8C00'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedY: (Math.random() * 0.4 + 0.1) * -1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Radial background glow
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      bgGrad.addColorStop(0, '#0d0d26');
      bgGrad.addColorStop(0.5, '#050510');
      bgGrad.addColorStop(1, '#020208');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        star.y += star.speedY;
        star.opacity += Math.sin(Date.now() * star.pulseSpeed) * 0.01;

        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.opacity));
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size * 3;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
