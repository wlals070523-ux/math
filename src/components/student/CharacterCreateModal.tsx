import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, ArrowRight, Shield } from 'lucide-react';
import { StudentData, JobType } from '../../types';
import { DataService } from '../../services/dataService';
import { JOB_SKILLS } from '../../services/gameService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { soundEffects } from '../../utils/soundEffects';

interface CharacterCreateModalProps {
  student: StudentData;
  onComplete: (updatedStudent: StudentData) => void;
}

export const CharacterCreateModal: React.FC<CharacterCreateModalProps> = ({ student, onComplete }) => {
  const [nickname, setNickname] = useState(student.character.nickname || student.account.name || '곱셈히어로');
  const [job, setJob] = useState<JobType>(student.character.job || 'warrior');
  const [hairStyle, setHairStyle] = useState(student.character.appearance?.hairStyle || 'short_spiky');
  const [hairColor, setHairColor] = useState(student.character.appearance?.hairColor || '#4f46e5');

  const jobsList: { type: JobType; name: string; icon: string; tag: string; desc: string; color: string }[] = [
    {
      type: 'warrior',
      name: '전사',
      icon: '⚔️',
      tag: '연속 정답 & 스피드 계산',
      desc: '연속 정답을 달성하고 빠른 연산으로 폭풍처럼 성장합니다!',
      color: 'border-amber-400 bg-amber-50/70 text-amber-900',
    },
    {
      type: 'wizard',
      name: '마법사',
      icon: '🔮',
      tag: '심화·응용·추론 탐구',
      desc: '수학의 신비한 규칙을 찾고 고난도 문제를 풀어 성장합니다!',
      color: 'border-indigo-400 bg-indigo-50/70 text-indigo-900',
    },
    {
      type: 'healer',
      name: '힐러',
      icon: '🌿',
      tag: '오답 복습 & 끈기 있는 성장',
      desc: '틀린 문제를 다시 풀고 보충학습을 끈기 있게 완수하며 성장합니다!',
      color: 'border-emerald-400 bg-emerald-50/70 text-emerald-900',
    },
    {
      type: 'explorer',
      name: '탐험가',
      icon: '🏹',
      tag: '신규 유형 & 도전 과제',
      desc: '새로운 곱셈 퀘스트와 다양한 유형에 용감하게 도전하며 성장합니다!',
      color: 'border-orange-400 bg-orange-50/70 text-orange-900',
    },
  ];

  const hairColors = [
    { label: '네이비 블루', color: '#4f46e5' },
    { label: '루비 레드', color: '#ef4444' },
    { label: '에메랄드 그린', color: '#10b981' },
    { label: '골든 앰버', color: '#f59e0b' },
    { label: '미드나잇 블랙', color: '#1e293b' },
    { label: '바이올렛', color: '#8b5cf6' },
  ];

  const hairStyles = [
    { id: 'short_spiky', label: '용감한 숏컷' },
    { id: 'twin_tail', label: '발랄한 양갈래' },
    { id: 'curly', label: '단정한 둥근머리' },
  ];

  const previewCharacter = {
    ...student.character,
    nickname: nickname.trim() || '모험가',
    job,
    appearance: {
      ...student.character.appearance,
      hairStyle,
      hairColor,
    },
  };

  const handleSave = () => {
    soundEffects.playLevelUp();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    const initialSkill = JOB_SKILLS[job][0].id;
    const initialWeapon =
      job === 'warrior' ? 'wooden_sword' : job === 'wizard' ? 'novice_staff' : job === 'healer' ? 'healing_wand' : 'wooden_bow';

    const updated = DataService.updateStudentData(student.account.id, {
      character: {
        ...student.character,
        nickname: nickname.trim() || student.account.name || '모험가',
        job,
        appearance: {
          base: 'adventurer_1',
          hairStyle,
          hairColor,
          outfit: 'adventurer_tunic',
        },
        inventory: Array.from(new Set([...student.character.inventory, initialWeapon])),
        equipment: {
          ...student.character.equipment,
          weapon: initialWeapon,
        },
        skills: Array.from(new Set([...student.character.skills, initialSkill])),
      },
    });

    if (updated) {
      onComplete(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0A0A0A] rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] p-4 text-white text-center border-b border-[#222222] relative">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D860] px-3 py-1 rounded-full text-xs font-black mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 나만의 모험가 캐릭터 만들기
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">수학 모험을 시작할 캐릭터를 선택하세요!</h2>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Top Section: Avatar Live Preview + Nickname */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#121212] p-4 rounded-2xl border border-[#222222]">
            <div className="flex-shrink-0">
              <CharacterAvatar character={previewCharacter} size="lg" isAnimated={true} />
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#A1A1AA] mb-1">모험가 닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={10}
                  placeholder="예: 곱셈대마왕"
                  className="w-full px-3 py-2.5 bg-[#181818] border border-[#2E2E2E] focus:border-[#D4AF37] rounded-xl font-bold text-white text-sm outline-none transition-colors"
                />
              </div>

              {/* Hair Color Palette */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">머리 색상</label>
                <div className="flex flex-wrap gap-2">
                  {hairColors.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setHairColor(c.color);
                      }}
                      className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                        hairColor === c.color ? 'scale-125 border-white shadow-md ring-2 ring-[#D4AF37]' : 'border-[#333333]'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style Selector */}
              <div>
                <label className="block text-xs font-bold text-[#A1A1AA] mb-1.5">헤어 스타일</label>
                <div className="flex gap-2">
                  {hairStyles.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setHairStyle(h.id);
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        hairStyle === h.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow'
                          : 'bg-[#181818] text-[#A1A1AA] border-[#2A2A2A] hover:bg-[#222222]'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Selection 4 Cards */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              직업을 선택하세요 <span className="text-xs text-[#71717A] font-normal">(직업마다 고유의 성장 보너스와 스킬이 있습니다)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {jobsList.map((j) => (
                <div
                  key={j.type}
                  onClick={() => {
                    soundEffects.playClick();
                    setJob(j.type);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    job === j.type
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg ring-1 ring-[#D4AF37] scale-[1.02]'
                      : 'border-[#222222] bg-[#121212] hover:bg-[#181818] text-[#CCCCCC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{j.icon}</span>
                      <span className="font-black text-base text-white">{j.name}</span>
                    </div>
                    {job === j.type && <Check className="w-5 h-5 text-[#F6D860]" />}
                  </div>
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#1F1F1F] text-[#F6D860] border border-[#333333] mb-1">
                    {j.tag}
                  </span>
                  <p className="text-xs text-[#A1A1AA] mt-1 leading-snug">{j.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-[#111111] border-t border-[#1F1F1F] flex justify-end gap-3">
          <button
            id="btn-save-character"
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6C35C] hover:brightness-110 text-black font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>이 캐릭터로 모험 출발하기!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
