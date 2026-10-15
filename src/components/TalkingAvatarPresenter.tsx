import React, { useState, useEffect } from 'react';
import { PresenterAvatar } from '../types/whop';
import { AI_PRESENTERS } from '../data/avatars';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface TalkingAvatarPresenterProps {
  currentPresenter: PresenterAvatar;
  isSpeaking: boolean;
  onSelectPresenter: (presenter: PresenterAvatar) => void;
  position?: 'bottom-right' | 'bottom-left' | 'standalone';
  size?: 'sm' | 'md' | 'lg';
}

export const TalkingAvatarPresenter: React.FC<TalkingAvatarPresenterProps> = ({
  currentPresenter,
  isSpeaking,
  onSelectPresenter,
  position = 'bottom-right',
  size = 'md'
}) => {
  const [mouthState, setMouthState] = useState<'open' | 'closed' | 'half'>('closed');
  const [blinkState, setBlinkState] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  // Lip-sync talking cycle when speech is active
  useEffect(() => {
    if (!isSpeaking) {
      setMouthState('closed');
      return;
    }

    const mouthCycle = ['open', 'half', 'closed', 'half', 'open', 'closed'];
    let idx = 0;

    const interval = setInterval(() => {
      idx = (idx + 1) % mouthCycle.length;
      setMouthState(mouthCycle[idx] as any);
    }, 120);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Natural eye blinking every ~4 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 140);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const dimensions =
    size === 'sm'
      ? 'w-16 h-16'
      : size === 'lg'
      ? 'w-32 h-32 md:w-40 md:h-40'
      : 'w-24 h-24 md:w-28 md:h-28';

  return (
    <div className="relative group">
      {/* Presenter Avatar Ring & Portrait */}
      <div className="relative">
        {/* Audio Reactive Glow Ring */}
        <div
          className={`absolute -inset-1 rounded-full blur-md transition-all duration-300 pointer-events-none ${
            isSpeaking
              ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 opacity-90 animate-pulse scale-105'
              : 'bg-white/10 opacity-30'
          }`}
        />

        {/* Outer Circular Container */}
        <div
          className={`relative ${dimensions} rounded-full overflow-hidden border-2 transition-all shadow-2xl bg-slate-900 ${
            isSpeaking ? 'border-orange-400 scale-[1.02]' : 'border-white/20'
          }`}
        >
          {/* Main Presenter Photo */}
          <img
            src={isSpeaking && mouthState !== 'closed' ? currentPresenter.talkingAvatarUrl : currentPresenter.avatarUrl}
            alt={currentPresenter.name}
            className={`w-full h-full object-cover transition-transform duration-200 ${
              isSpeaking ? 'scale-105' : 'scale-100'
            } ${blinkState ? 'opacity-95' : 'opacity-100'}`}
          />

          {/* Simulated Animated Lip-Sync Layer overlay for natural talking expression */}
          {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-4 rounded-full bg-rose-950/40 backdrop-blur-[0.5px] transition-all duration-100 ${
                  mouthState === 'open'
                    ? 'h-3 scale-y-125 translate-y-3'
                    : mouthState === 'half'
                    ? 'h-1.5 scale-y-100 translate-y-3'
                    : 'h-0.5 scale-y-50 translate-y-3'
                }`}
              />
            </div>
          )}

          {/* Soundwave indicator on speaking */}
          {isSpeaking && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-black/80 px-2 py-0.5 rounded-full border border-orange-500/40">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
              <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
            </div>
          )}
        </div>

        {/* Presenter Name Badge */}
        <div className="mt-1.5 text-center">
          <div className="inline-flex items-center gap-1 bg-black/80 border border-white/10 px-2.5 py-0.5 rounded-full shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold text-white truncate max-w-[120px]">
              {currentPresenter.name}
            </span>
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
