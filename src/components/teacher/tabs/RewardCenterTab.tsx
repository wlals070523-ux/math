import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Award, Sparkles, Coins, Users, CheckCircle2, Shield } from 'lucide-react';
import { StudentData } from '../../../types';
import { GameService, GAME_ITEMS } from '../../../services/gameService';
import { soundEffects } from '../../../utils/soundEffects';

interface RewardCenterTabProps {
  students: StudentData[];
  onStudentUpdated: () => void;
}

export const RewardCenterTab: React.FC<RewardCenterTabProps> = ({ students, onStudentUpdated }) => {
  const [targetType, setTargetType] = useState<'individual' | 'all'>('individual');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.account.id || '');
  const [selectedTitle, setSelectedTitle] = useState<string>('선생님의 자랑');
  const [bonusGold, setBonusGold] = useState<number>(100);
  const [selectedItemId, setSelectedItemId] = useState<string>('legend_shield');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const titles = [
    '선생님의 자랑',
    '오늘의 곱셈왕',
    '불굴의 노력왕',
    '성실의 아이콘',
    '구구단 마스터',
    '친절한 수학 멘토',
  ];

  const rareItems = GAME_ITEMS.filter((i) => i.isRare || i.price >= 300);

  const handleGrantReward = () => {
    soundEffects.playLevelUp();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}

    if (targetType === 'all') {
      students.forEach((s) => {
        GameService.grantTeacherReward(s.account.id, {
          title: selectedTitle,
          bonusGold,
          specialItemId: selectedItemId || undefined,
        });
      });
      setSuccessToast(`학급 전체(${students.length}명)에게 보상(골드 +${bonusGold}G, 칭호: ${selectedTitle})을 일괄 지급했습니다!`);
    } else {
      const s = students.find((x) => x.account.id === selectedStudentId);
      if (s) {
        GameService.grantTeacherReward(selectedStudentId, {
          title: selectedTitle,
          bonusGold,
          specialItemId: selectedItemId || undefined,
        });
        setSuccessToast(`${s.account.name} 학생에게 보상(골드 +${bonusGold}G, 칭호: ${selectedTitle})을 지급했습니다!`);
      }
    }

    onStudentUpdated();
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1E170A] via-[#2A1F0D] to-[#1E170A] border border-[#3D2C10] rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F6D860] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> RPG 보상 & 칭찬 센터
          </div>
          <h2 className="text-xl font-black text-white">선생님의 특별 칭호 · 골드 · 희귀 장비 선물</h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5 font-normal">
            학생들의 동기부여와 참여도를 높이기 위해 즉시 보상을 선물하세요!
          </p>
        </div>

        <div className="text-3xl">🎁</div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-[#0C1B14] border border-[#10B981]/40 rounded-2xl text-[#34D399] text-sm font-bold flex items-center gap-2 animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-[#0A0A0A] rounded-3xl border border-[#222222] shadow-sm p-6 space-y-6">
        {/* Step 1: Select Target */}
        <div>
          <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
            1. 보상 대상 선택
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setTargetType('individual');
              }}
              className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                targetType === 'individual'
                  ? 'bg-[#181818] border-[#D4AF37] text-[#F6D860] shadow-sm'
                  : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-[#CCCCCC]'
              }`}
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>개별 학생 지정</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setTargetType('all');
              }}
              className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                targetType === 'all'
                  ? 'bg-[#181818] border-[#D4AF37] text-[#F6D860] shadow-sm'
                  : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-[#CCCCCC]'
              }`}
            >
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>학급 전체 ({students.length}명 일괄 수여)</span>
            </button>
          </div>

          {targetType === 'individual' && (
            <div className="mt-3">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-3 bg-[#141414] border border-[#262626] rounded-2xl font-bold text-xs text-white outline-none focus:border-[#D4AF37]"
              >
                {students.map((s) => (
                  <option key={s.account.id} value={s.account.id}>
                    {s.account.number}번 {s.account.name} (Lv.{s.character.level}, {s.character.job})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step 2: Select Special Title */}
        <div>
          <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
            2. 특별 칭호 선택
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {titles.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedTitle(t);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedTitle === t
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow'
                    : 'bg-[#141414] hover:bg-[#1A1A1A] border-[#262626] text-[#CCCCCC]'
                }`}
              >
                ✨ {t}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Bonus Gold & Rare Item */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
              3. 보너스 골드 지급
            </label>
            <div className="flex gap-2">
              {[50, 100, 200, 500].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setBonusGold(g);
                  }}
                  className={`flex-1 py-2.5 rounded-xl border font-mono text-xs font-bold transition-colors cursor-pointer ${
                    bonusGold === g
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow'
                      : 'bg-[#141414] border-[#262626] text-[#CCCCCC] hover:bg-[#1A1A1A]'
                  }`}
                >
                  +{g} G
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
              4. 특별 희귀 장비 선물 (선택)
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full p-2.5 bg-[#141414] border border-[#262626] rounded-xl font-bold text-xs text-white outline-none focus:border-[#D4AF37]"
            >
              <option value="">(장비 선물 안함)</option>
              {rareItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.icon} {item.name} ({item.description})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Grant */}
        <div className="pt-4 border-t border-[#1F1F1F] flex justify-end">
          <button
            id="btn-grant-reward"
            type="button"
            onClick={handleGrantReward}
            className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F6D860] hover:from-[#E6C35C] hover:to-[#FBE08A] text-black font-black text-sm sm:text-base rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Gift className="w-5 h-5" />
            <span>선물 및 칭호 즉시 수여하기!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
