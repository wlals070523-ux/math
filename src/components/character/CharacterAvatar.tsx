import React from 'react';
import { CharacterData, JobType } from '../../types';
import { GAME_ITEMS } from '../../services/gameService';

interface CharacterAvatarProps {
  character?: CharacterData;
  appearance?: any;
  job?: JobType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showBadge?: boolean;
  showLevel?: boolean;
  isAnimated?: boolean;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  appearance: directAppearance,
  job: directJob,
  size = 'md',
  showBadge = true,
  showLevel = true,
  isAnimated = true,
  className = '',
}) => {
  const safeChar = character || {
    nickname: '탐험가',
    job: directJob || 'warrior',
    level: 1,
    exp: 0,
    gold: 0,
    appearance: directAppearance || {
      hairColor: '#4f46e5',
      hairStyle: 'short_spiky',
      skinTone: '#fed7aa',
      outfitColor: '#dc2626',
    },
    equipment: {},
    inventory: [],
    mathMonsters: [],
    titles: [],
  };

  const job = safeChar.job || directJob || 'warrior';
  const level = safeChar.level || 1;
  const hairColor = safeChar.appearance?.hairColor || directAppearance?.hairColor || '#4f46e5';
  const hairStyle = safeChar.appearance?.hairStyle || directAppearance?.hairStyle || 'short_spiky';

  // Equipped items
  const weaponItem = GAME_ITEMS.find((i) => i.id === safeChar.equipment?.weapon);
  const helmetItem = GAME_ITEMS.find((i) => i.id === safeChar.equipment?.helmet);
  const capeItem = GAME_ITEMS.find((i) => i.id === safeChar.equipment?.cape);
  const armorItem = GAME_ITEMS.find((i) => i.id === safeChar.equipment?.armor);
  const accessoryItem = GAME_ITEMS.find((i) => i.id === safeChar.equipment?.accessory);

  const sizeClasses: Record<string, string> = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-32 h-32 text-base',
    xl: 'w-44 h-44 text-lg',
  };
  const currentSizeClass = typeof size === 'string' && sizeClasses[size] ? sizeClasses[size] : 'w-16 h-16 text-xs';

  const jobColors: Record<JobType, { bg: string; ring: string; label: string; icon: string }> = {
    warrior: { bg: 'from-amber-100 to-red-100', ring: 'ring-amber-400', label: '전사', icon: '⚔️' },
    wizard: { bg: 'from-indigo-100 to-purple-100', ring: 'ring-indigo-400', label: '마법사', icon: '🔮' },
    healer: { bg: 'from-emerald-100 to-teal-100', ring: 'ring-emerald-400', label: '힐러', icon: '🌿' },
    explorer: { bg: 'from-orange-100 to-amber-100', ring: 'ring-orange-400', label: '탐험가', icon: '🏹' },
  };

  const currentJobStyle = jobColors[job] || jobColors.warrior;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Avatar Container */}
      <div
        className={`relative rounded-3xl bg-gradient-to-b ${currentJobStyle.bg} ring-4 ${currentJobStyle.ring} shadow-lg flex items-center justify-center overflow-visible ${currentSizeClass} transition-transform duration-300 ${
          isAnimated ? 'hover:scale-105' : ''
        }`}
      >
        {/* Animated Background Aura for High Levels */}
        {level >= 5 && (
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 opacity-40 blur-sm animate-pulse -z-10" />
        )}

        {/* Cape layer (Behind body) */}
        {capeItem && (
          <div className="absolute -top-1 -left-2 text-2xl -z-5 transform -rotate-12 animate-pulse">
            {capeItem.icon}
          </div>
        )}

        {/* SVG Character Base */}
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 drop-shadow">
          {/* Head shadow */}
          <ellipse cx="50" cy="52" rx="28" ry="26" fill="#fde047" opacity="0.2" />

          {/* Head Base (Skin Tone) */}
          <circle cx="50" cy="48" r="26" fill="#fed7aa" stroke="#f97316" strokeWidth="2.5" />

          {/* Hair Style */}
          {hairStyle === 'twin_tail' ? (
            <g fill={hairColor}>
              <path d="M 24 45 C 15 35, 10 50, 16 62 C 22 55, 24 50, 26 46 Z" />
              <path d="M 76 45 C 85 35, 90 50, 84 62 C 78 55, 76 50, 74 46 Z" />
              <path d="M 26 35 C 32 20, 68 20, 74 35 C 68 28, 32 28, 26 35 Z" />
              <path d="M 36 28 C 42 22, 58 22, 64 28 C 58 35, 42 35, 36 28 Z" />
            </g>
          ) : hairStyle === 'curly' ? (
            <g fill={hairColor}>
              <circle cx="32" cy="28" r="10" />
              <circle cx="48" cy="24" r="11" />
              <circle cx="66" cy="28" r="10" />
              <circle cx="24" cy="40" r="8" />
              <circle cx="76" cy="40" r="8" />
            </g>
          ) : (
            // Spiky adventurer hair
            <g fill={hairColor}>
              <path d="M 25 36 L 32 20 L 40 32 L 50 16 L 60 32 L 68 20 L 75 36 C 65 24, 35 24, 25 36 Z" />
              <path d="M 28 32 C 38 28, 62 28, 72 32 C 65 38, 35 38, 28 32 Z" />
            </g>
          )}

          {/* Cheeks Blush */}
          <circle cx="36" cy="54" r="4" fill="#f43f5e" opacity="0.4" />
          <circle cx="64" cy="54" r="4" fill="#f43f5e" opacity="0.4" />

          {/* Eyes (Sparkling Manga Style) */}
          <g fill="#1e293b">
            <ellipse cx="40" cy="48" rx="4" ry="5.5" />
            <ellipse cx="60" cy="48" rx="4" ry="5.5" />
            <circle cx="38.5" cy="46" r="1.5" fill="#ffffff" />
            <circle cx="58.5" cy="46" r="1.5" fill="#ffffff" />
          </g>

          {/* Happy Smile Mouth */}
          <path d="M 45 57 Q 50 63 55 57" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Glasses Accessory if equipped */}
          {accessoryItem?.id === 'cool_glasses' && (
            <g stroke="#0284c7" strokeWidth="2.5" fill="rgba(224, 242, 254, 0.3)">
              <circle cx="40" cy="48" r="8" />
              <circle cx="60" cy="48" r="8" />
              <line x1="48" y1="48" x2="52" y2="48" />
            </g>
          )}

          {/* Body Armor / Clothes */}
          <path
            d="M 30 74 C 30 68, 70 68, 70 74 L 74 95 L 26 95 Z"
            fill={armorItem ? '#64748b' : job === 'warrior' ? '#dc2626' : job === 'wizard' ? '#4f46e5' : job === 'healer' ? '#10b981' : '#f97316'}
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Tie or Scarf */}
          <polygon points="50,72 45,86 50,92 55,86" fill="#facc15" />
        </svg>

        {/* Helmet / Hat Overlay */}
        {helmetItem && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl drop-shadow-md animate-bounce">
            {helmetItem.icon}
          </div>
        )}

        {/* Weapon Equipped (Right Side) */}
        {weaponItem && (
          <div
            className={`absolute -right-2.5 -bottom-1 drop-shadow-lg transform rotate-12 transition-transform duration-300 ${
              isAnimated ? 'hover:scale-125' : ''
            }`}
            style={{ fontSize: size === 'xl' ? '2.5rem' : size === 'lg' ? '1.8rem' : '1.3rem' }}
          >
            {weaponItem.icon}
          </div>
        )}

        {/* Level Badge (Bottom Right) */}
        {showLevel && (
          <div className="absolute -bottom-2 -left-2 bg-slate-900 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border-2 border-amber-400 text-[10px] md:text-xs shadow-md">
            Lv.{level}
          </div>
        )}

        {/* Job Icon Badge (Top Right) */}
        {showBadge && (
          <div
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-200 text-xs"
            title={currentJobStyle.label}
          >
            {currentJobStyle.icon}
          </div>
        )}
      </div>

      {/* Title & Nickname Display */}
      {size !== 'sm' && (
        <div className="mt-2 text-center flex flex-col items-center">
          {safeChar.selectedTitle && (
            <span className="text-[11px] font-bold text-[#F6D860] bg-[#1E170A] border border-[#D4AF37]/40 px-2 py-0.5 rounded-md mb-0.5 shadow-sm">
              ✨ {safeChar.selectedTitle}
            </span>
          )}
          <span className="font-bold text-[#E0E0E0] tracking-tight text-sm flex items-center gap-1">
            {safeChar.nickname}
          </span>
        </div>
      )}
    </div>
  );
};
