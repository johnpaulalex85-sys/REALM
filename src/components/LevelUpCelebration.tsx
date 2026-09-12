import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, Star, ArrowRight } from 'lucide-react';
import { soundFx } from '../sound';

interface LevelUpCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  isOpen,
  onClose,
  newLevel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    soundFx.playLevelUp();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle simulation
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const colors = ['#f59e0b', '#fbbf24', '#a855f7', '#c084fc', '#38bdf8', '#34d399'];
    const particles: Particle[] = [];

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          aliveCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gravity
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1f0a35] via-[#120724] to-[#070311] border-2 border-amber-400/80 p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.5)] animate-in fade-in zoom-in duration-300">
        {/* Glow halo */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        {/* Crest */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-300 p-1 shadow-[0_0_30px_rgba(251,191,36,0.8)] border border-amber-200 flex items-center justify-center animate-bounce">
          <Star className="w-10 h-10 text-amber-950 fill-amber-950" />
        </div>

        <p className="text-xs font-black tracking-[0.3em] text-amber-300 uppercase mt-5">
          ✦ AWAKENING OF POWER ✦
        </p>

        <h2 className="font-cinzel text-4xl font-black text-white tracking-widest mt-1 drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]">
          LEVEL UP!
        </h2>

        <div className="my-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-950/80 border border-amber-400/60 shadow-lg">
          <span className="text-sm font-semibold text-slate-300">New Rank:</span>
          <span className="text-xl font-black text-amber-300 font-cinzel">
            Level {newLevel}
          </span>
        </div>

        <p className="text-xs text-purple-200/90 leading-relaxed max-w-xs mx-auto">
          Your willpower compounds. New stat thresholds and heroic trials have unlocked across the Realm.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Claim Glory</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
