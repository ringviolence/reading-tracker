'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { BadgeDefinition, TIER_COLORS } from '@/lib/badges';

interface BadgeCelebrationProps {
  badge: BadgeDefinition;
  onClose: () => void;
}

export default function BadgeCelebration({ badge, onClose }: BadgeCelebrationProps) {
  const colors = TIER_COLORS[badge.tier];

  const fireConfetti = useCallback(() => {
    const tierColors: Record<string, string[]> = {
      bronze: ['#f59e0b', '#d97706', '#b45309'],
      silver: ['#9ca3af', '#6b7280', '#4b5563'],
      gold: ['#fbbf24', '#f59e0b', '#d97706'],
      diamond: ['#a855f7', '#9333ea', '#7c3aed'],
    };
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: tierColors[badge.tier] });
  }, [badge.tier]);

  useEffect(() => {
    fireConfetti();
    const t = setTimeout(fireConfetti, 500);
    return () => clearTimeout(t);
  }, [fireConfetti]);

  const tierEmoji = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎' }[badge.tier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center transform animate-bounce-in ${colors.border} border-4`}>
        <div className="text-6xl mb-4">{tierEmoji}</div>
        <h2 className="text-2xl font-bold text-ink mb-2">Badge Earned!</h2>
        <div className={`inline-block px-4 py-2 rounded-full mb-4 ${colors.bg} ${colors.text}`}>
          <span className="font-semibold capitalize">{badge.tier}</span>
        </div>
        <h3 className={`text-xl font-bold mb-1 ${colors.text}`}>{badge.icon} {badge.name}</h3>
        <p className="text-gray-600 mb-6">{badge.description}</p>
        <p className="text-sm text-gray-400 mb-6">+{badge.xpGranted} XP</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors"
        >
          Awesome!
        </button>
      </div>

      <style jsx global>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}
