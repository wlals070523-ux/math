import React, { useState } from 'react';
import { Lock, CheckCircle2, Star, Sparkles, BookOpen, Play } from 'lucide-react';
import { StudentData, StageRecord } from '../../types';
import { STAGE_CONFIGS } from '../../services/learningService';
import { MATH_MONSTERS } from '../../services/gameService';
import { soundEffects } from '../../utils/soundEffects';

interface WorldMapProps {
  student: StudentData;
  onSelectStage: (stageId: number) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ student, onSelectStage }) => {
  const [selectedStagePreview, setSelectedStagePreview] = useState<number | null>(null);

  const getStageStatus = (stageId: number): 'locked' | 'available' | 'completed' | 'mastered' => {
    const rec = student.stages[stageId];
    if (rec && rec.completed) {
      if (rec.mastery === '완전정복' || rec.mastery === '심화') {
        return 'mastered';
      }
      return 'completed';
    }

    if (stageId === 1) return 'available';
    const prevRec = student.stages[stageId - 1];
    if (prevRec && prevRec.completed) {
      return 'available';
    }

    return 'locked';
  };

  const handleStageCardClick = (stageId: number) => {
    const status = getStageStatus(stageId);
    if (status === 'locked') {
      soundEffects.playWrong();
      return;
    }
    soundEffects.playClick();
    setSelectedStagePreview(stageId);
  };

  const handleStartQuest = (stageId: number) => {
    soundEffects.playLevelUp();
    setSelectedStagePreview(null);
    onSelectStage(stageId);
  };

  const previewConfig = STAGE_CONFIGS.find((c) => c.id === selectedStagePreview);
  const previewMonster = previewConfig ? MATH_MONSTERS.find((m) => m.stageId === previewConfig.id) : null;
  const previewRecord: StageRecord | undefined = selectedStagePreview ? student.stages[selectedStagePreview] : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Quest Header */}
      <div className="bg-gradient-to-r from-[#132238] via-[#1E293B] to-[#132238] border border-[#2D4566] rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-64 h-64 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-3 py-1 rounded-full text-xs font-bold text-[#38BDF8] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" /> 월드맵 퀘스트 탐험
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              1~12차시 곱셈 대륙 월드맵
            </h1>
            <p className="text-sm font-medium text-[#94A3B8] mt-1 max-w-xl">
              시작의 마을부터 곱셈 마왕성까지! 각 지역의 곱셈 몬스터를 물리치고 도감을 완성해 보세요.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0F172A] p-3.5 rounded-2xl border border-[#2D4566]">
            <div className="text-center px-2">
              <div className="text-xs font-bold text-[#94A3B8]">완료 차시</div>
              <div className="text-xl font-black text-[#FBBF24]">
                {Object.values(student.stages || {}).filter((s) => (s as any)?.completed).length} / 12
              </div>
            </div>
            <div className="h-8 w-px bg-[#2D4566]" />
            <div className="text-center px-2">
              <div className="text-xs font-bold text-[#94A3B8]">수학몬 도감</div>
              <div className="text-xl font-black text-[#34D399]">
                {student.character.mathMonsters?.length || 0} / 12
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World Map Grid (12 Stages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STAGE_CONFIGS.map((cfg) => {
          const status = getStageStatus(cfg.id);
          const monster = MATH_MONSTERS.find((m) => m.stageId === cfg.id);

          return (
            <div
              key={cfg.id}
              onClick={() => handleStageCardClick(cfg.id)}
              className={`relative rounded-3xl p-5 border transition-all duration-300 overflow-hidden flex flex-col justify-between select-none ${
                status === 'locked'
                  ? 'bg-[#0F172A]/80 border-[#1E293B] text-[#64748B] cursor-not-allowed opacity-60'
                  : status === 'mastered'
                  ? 'bg-[#1E293B] border-[#F59E0B]/50 shadow-lg hover:border-[#FBBF24] hover:-translate-y-1 cursor-pointer ring-1 ring-[#F59E0B]/20'
                  : status === 'completed'
                  ? 'bg-[#1E293B] border-[#10B981]/50 shadow-md hover:border-[#34D399] hover:-translate-y-1 cursor-pointer'
                  : 'bg-[#1E3A5F] border-[#38BDF8] shadow-lg hover:border-[#60A5FA] hover:-translate-y-1 cursor-pointer ring-1 ring-[#38BDF8]/60 animate-navy-glow'
              }`}
            >
              {/* Header Badges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                      status === 'locked'
                        ? 'bg-[#0F172A] text-[#64748B] border-[#1E293B]'
                        : status === 'mastered'
                        ? 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/50'
                        : status === 'completed'
                        ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40'
                        : 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/50'
                    }`}
                  >
                    {cfg.id}차시 · {cfg.areaName}
                  </span>

                  {/* Status Icon */}
                  <div>
                    {status === 'locked' && <Lock className="w-4 h-4 text-[#64748B]" />}
                    {status === 'available' && (
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#38BDF8]"></span>
                      </span>
                    )}
                    {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#34D399]" />}
                    {status === 'mastered' && (
                      <div className="flex items-center gap-0.5 text-[#FBBF24]">
                        <Star className="w-4 h-4 fill-[#FBBF24]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage Title */}
                <h3
                  className={`font-black text-base sm:text-lg tracking-tight line-clamp-1 ${
                    status === 'locked' ? 'text-[#64748B]' : 'text-white'
                  }`}
                >
                  {cfg.title.split(':')[1]?.trim() || cfg.title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-medium line-clamp-2 mt-1">
                  {cfg.subtitle}
                </p>
              </div>

              {/* Monster & Action Area */}
              <div className="mt-4 pt-3 border-t border-[#2D4566] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl filter drop-shadow-sm">{cfg.badgeIcon}</span>
                  <div>
                    <div className="text-[11px] font-bold text-[#94A3B8]">수호 수학몬</div>
                    <div className="text-xs font-bold text-white">{monster?.name || '수학몬'}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    status === 'locked'
                      ? 'bg-[#0F172A] text-[#64748B]'
                      : status === 'mastered'
                      ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-black shadow-sm'
                      : status === 'completed'
                      ? 'bg-[#10B981] hover:bg-[#34D399] text-black shadow-sm'
                      : 'bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] hover:from-[#0EA5E9] hover:to-[#38BDF8] text-slate-950 shadow-md'
                  }`}
                >
                  {status === 'locked' ? '잠김' : status === 'mastered' ? '재도전' : status === 'completed' ? '복습하기' : '도전하기'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Detail / Start Modal */}
      {selectedStagePreview && previewConfig && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#132238] rounded-3xl border border-[#2D4566] shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 text-white bg-gradient-to-r from-[#1E293B] to-[#132238] border-b border-[#2D4566]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2.5 py-1 rounded-full">
                  {previewConfig.areaName}
                </span>
                <span className="text-2xl">{previewConfig.badgeIcon}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{previewConfig.title}</h2>
              <p className="text-xs text-[#94A3B8] font-medium mt-0.5">{previewConfig.subtitle}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#2D4566]">
                <h4 className="text-xs font-bold text-[#94A3B8] mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" /> 학습 목표 및 퀘스트
                </h4>
                <p className="text-sm font-bold text-[#E2E8F0] leading-relaxed">
                  {previewConfig.description}
                </p>
              </div>

              {/* Monster Reward Preview */}
              {previewMonster && (
                <div className="flex items-center gap-3 bg-[#1E293B] p-3.5 rounded-2xl border border-[#F59E0B]/30">
                  <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center text-3xl shadow-inner border border-[#F59E0B]/20">
                    {previewMonster.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-[#FBBF24]">차시 완료 시 획득 수학몬</div>
                    <div className="font-black text-white text-sm">{previewMonster.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{previewMonster.description}</div>
                  </div>
                </div>
              )}

              {/* Previous History if any */}
              {previewRecord && previewRecord.completed && (
                <div className="flex justify-between items-center p-3 bg-[#064E3B]/30 rounded-2xl border border-[#10B981]/40 text-xs font-bold text-[#34D399]">
                  <span>이전 학습 기록</span>
                  <span>
                    정답 {previewRecord.correctCount} / 오답 {previewRecord.wrongCount} (도달: {previewRecord.mastery})
                  </span>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 bg-[#0F172A] border-t border-[#2D4566] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStagePreview(null)}
                className="px-4 py-2.5 bg-[#1E293B] hover:bg-[#283548] text-[#CBD5E1] font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                id="btn-start-stage-quest"
                type="button"
                onClick={() => handleStartQuest(selectedStagePreview)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] text-black font-extrabold text-sm sm:text-base rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>퀘스트 시작하기!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
