import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Lock, Trophy, Star } from 'lucide-react';
import { StudentData, MathMonster } from '../../types';
import { MATH_MONSTERS } from '../../services/gameService';
import { soundEffects } from '../../utils/soundEffects';

interface MonsterBookModalProps {
  student: StudentData;
  onClose: () => void;
}

export const MonsterBookModal: React.FC<MonsterBookModalProps> = ({ student, onClose }) => {
  const [selectedMonster, setSelectedMonster] = useState<MathMonster | null>(null);

  const collectedIds = student.character.mathMonsters || [];
  const totalCount = MATH_MONSTERS.length;
  const collectedCount = collectedIds.length;
  const completionPercent = Math.round((collectedCount / totalCount) * 100);

  const handleSelectMonster = (monster: MathMonster) => {
    soundEffects.playClick();
    setSelectedMonster(monster);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0A0A0A] rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] p-4 text-white flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">수학몬 대도감 (1~12차시)</h2>
              <p className="text-xs text-[#A1A1AA] font-normal">
                각 차시를 정복하여 12마리의 곱셈 수호 수학몬을 모두 모아보세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#181818] border border-[#333333] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-[#E0E0E0]">
              <Trophy className="w-4 h-4 text-[#D4AF37]" />
              <span>
                도감 수집률 {collectedCount}/{totalCount} ({completionPercent}%)
              </span>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-1.5 bg-[#1C1C1C] hover:bg-[#262626] rounded-xl text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Monster Grid & Selected Details */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grid (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {MATH_MONSTERS.map((monster) => {
                const isCollected = collectedIds.includes(monster.id);

                return (
                  <div
                    key={monster.id}
                    onClick={() => handleSelectMonster(monster)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none ${
                      isCollected
                        ? 'bg-[#121212] border-[#2E2E2E] hover:border-[#D4AF37] hover:shadow-md hover:scale-105'
                        : 'bg-[#0D0D0D] border-[#1C1C1C] opacity-60 hover:opacity-85'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-3xl shadow-inner mb-2 relative">
                      {isCollected ? (
                        <span>{monster.icon}</span>
                      ) : (
                        <div className="flex items-center justify-center text-[#555555]">
                          <Lock className="w-6 h-6 text-[#555555]" />
                        </div>
                      )}

                      {/* Stage Badge */}
                      <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-black px-1.5 py-0.2 rounded-md">
                        {monster.stageId}차시
                      </span>
                    </div>

                    <h4
                      className={`font-bold text-xs truncate max-w-full ${
                        isCollected ? 'text-white' : 'text-[#666666]'
                      }`}
                    >
                      {isCollected ? monster.name : '??? (미발견)'}
                    </h4>
                    <span className="text-[10px] text-[#888888] font-medium">{monster.specialty}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details (4 cols) */}
          <div className="lg:col-span-4 bg-[#121212] rounded-3xl border border-[#222222] p-5 flex flex-col justify-between">
            {selectedMonster ? (
              <div className="space-y-4 animate-fade-in text-center">
                {collectedIds.includes(selectedMonster.id) ? (
                  <>
                    <div className="w-24 h-24 rounded-3xl bg-[#181818] border border-[#D4AF37] mx-auto flex items-center justify-center text-5xl shadow-lg animate-bounce">
                      {selectedMonster.icon}
                    </div>

                    <div>
                      <span className="text-xs font-bold bg-[#D4AF37]/20 text-[#F6D860] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                        {selectedMonster.stageId}차시 수호신
                      </span>
                      <h3 className="text-xl font-black text-white mt-1.5">{selectedMonster.name}</h3>
                      <p className="text-xs font-bold text-[#D4AF37]">{selectedMonster.specialty}</p>
                    </div>

                    <div className="text-left bg-[#181818] p-3.5 rounded-2xl border border-[#262626] text-xs text-[#CCCCCC] font-normal leading-relaxed shadow-sm">
                      <div className="font-bold text-white mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> 도감 설명
                      </div>
                      {selectedMonster.description}
                    </div>
                  </>
                ) : (
                  <div className="py-12 space-y-3">
                    <div className="w-20 h-20 rounded-full bg-[#181818] border border-[#2A2A2A] mx-auto flex items-center justify-center text-[#555555]">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-[#E0E0E0]">{selectedMonster.stageId}차시 미발견 수학몬</h3>
                    <p className="text-xs text-[#888888] font-normal">
                      월드맵에서 <span className="font-bold text-[#D4AF37]">{selectedMonster.stageId}차시 퀘스트</span>를 완료하면 도감에 등록됩니다!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-[#666666] space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-[#444444]" />
                <p className="text-xs font-medium">수학몬을 클릭하여 상세 정보와 스토리를 확인하세요.</p>
              </div>
            )}

            <div className="pt-4 border-t border-[#1F1F1F] text-center">
              <span className="text-[11px] font-bold text-[#71717A]">
                12마리를 모두 수집하면 '곱셈 마스터' 칭호를 획득합니다!
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111111] border-t border-[#1F1F1F] flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#1C1C1C] hover:bg-[#262626] text-[#CCCCCC] font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
