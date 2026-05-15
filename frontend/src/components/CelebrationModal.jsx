import React, { useEffect } from 'react';
import { Award, Star, X } from 'lucide-react';

export default function CelebrationModal({ type, title, subtitle, onClose }) {
  useEffect(() => {
    // Simple confetti effect using CSS particles
    const createConfetti = () => {
      const colors = ['#7c3aed', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '-10px';
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        particle.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 5000);
      }
    };
    createConfetti();
  }, []);

  return (
    <div className="celebration-overlay">
      <div className="celebration-card card animate-pop">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        <div className="celebration-icon">
          {type === 'tier' ? <Award size={64} className="text-gold" /> : <Star size={64} className="text-primary-light" />}
        </div>
        <h2 className="celebration-title">{title}</h2>
        <p className="celebration-subtitle">{subtitle}</p>
        <div className="celebration-badge">
          {type === 'tier' ? 'NEW TIER UNLOCKED' : 'NEW BADGE EARNED'}
        </div>
        <button className="btn btn-primary mt-3" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Awesome!
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .celebration-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 15, 26, 0.9);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; animation: fadeIn 0.3s ease;
        }
        .celebration-card {
          max-width: 400px; width: 90%; text-align: center;
          padding: 3rem 2rem; position: relative;
          background: linear-gradient(135deg, var(--card), var(--bg3));
          border: 2px solid var(--primary-light);
        }
        .celebration-icon { margin-bottom: 1.5rem; animation: bounce 2s infinite; }
        .celebration-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .celebration-subtitle { color: var(--text-muted); margin-bottom: 1.5rem; }
        .celebration-badge {
          display: inline-block; padding: 0.5rem 1rem;
          background: var(--primary-glow); color: var(--primary-light);
          border-radius: 999px; font-size: 0.75rem; font-weight: 800;
          letter-spacing: 0.1em;
        }
        .close-btn {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; padding: 0.5rem;
        }
        .confetti-particle {
          position: fixed; width: 10px; height: 10px;
          z-index: 10000; pointer-events: none;
        }
        @keyframes confetti-fall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}} />
    </div>
  );
}
