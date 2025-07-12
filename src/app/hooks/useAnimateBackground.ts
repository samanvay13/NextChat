import { useState, useRef, useEffect } from 'react';
import { Dot } from '../types';

export const useAnimatedBackground = (isDarkMode: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const initDots = () => {
      const newDots: Dot[] = [];
      for (let i = 0; i < 50; i++) {
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        newDots.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx,
          vy,
          originalVx: vx,
          originalVy: vy,
          id: i
        });
      }
      setDots(newDots);
    };

    initDots();
    window.addEventListener('resize', initDots);
    return () => window.removeEventListener('resize', initDots);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dots.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let currentDots = [...dots];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentDots = currentDots.map(dot => {
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        const repelDistance = 120;

        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let newVx = dot.vx;
        let newVy = dot.vy;

        if (distance < repelDistance && distance > 0) {
          const repelForce = (repelDistance - distance) / repelDistance * 0.5;
          const repelX = (dx / distance) * repelForce;
          const repelY = (dy / distance) * repelForce;
          
          newVx = dot.originalVx + repelX;
          newVy = dot.originalVy + repelY;
        } else {
          newVx = dot.vx * 0.95 + dot.originalVx * 0.05;
          newVy = dot.vy * 0.95 + dot.originalVy * 0.05;
        }

        let newX = dot.x + newVx;
        let newY = dot.y + newVy;

        if (newX <= 0 || newX >= canvas.width) {
          newVx = -newVx;
          dot.originalVx = -dot.originalVx;
        }
        if (newY <= 0 || newY >= canvas.height) {
          newVy = -newVy;
          dot.originalVy = -dot.originalVy;
        }

        return {
          ...dot,
          x: Math.max(0, Math.min(canvas.width, newX)),
          y: Math.max(0, Math.min(canvas.height, newY)),
          vx: newVx,
          vy: newVy
        };
      });

      const maxDistance = 150;
      ctx.strokeStyle = isDarkMode ? 'rgba(6, 182, 212, 0.3)' : 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.shadowColor = isDarkMode ? '#06b6d4' : '#3b82f6';
      ctx.shadowBlur = 3;

      for (let i = 0; i < currentDots.length; i++) {
        for (let j = i + 1; j < currentDots.length; j++) {
          const dx = currentDots[i].x - currentDots[j].x;
          const dy = currentDots[i].y - currentDots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(currentDots[i].x, currentDots[i].y);
            ctx.lineTo(currentDots[j].x, currentDots[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = isDarkMode ? 'rgba(6, 182, 212, 0.6)' : 'rgba(59, 130, 246, 0.6)';
      ctx.shadowColor = isDarkMode ? '#06b6d4' : '#3b82f6';
      ctx.shadowBlur = 5;

      currentDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [dots.length, isDarkMode]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return canvasRef;
};