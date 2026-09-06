import React, { useState } from 'react';
import { X, Award, Shield, User, Star, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import { StudentData } from '../../types';
import { DataService } from '../../services/dataService';
import { STAGE_CONFIGS } from '../../services/learningService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { soundEffects } from '../../utils/soundEffects';

interface ProfileModalProps {
  student: StudentData;
  onClose: () => void;
  onStudentUpdated: (student: StudentData) => void;
  onStartReviewStage?: (stageId: number) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  student,
  onClose,
  onStudentUpdated,
  onStartReviewStage,
}) => {
  const [selectedTitle, setSelectedTitle] = useState(student.character.selectedTitle || '곱셈 새싹');

  const titles = [
    { title: '곱셈 새싹', req: '모험 시작 시 기본 지급' },
    { title: '구구단 달인', req: '1~2차시 완료' },
    { title: '올림의 지배자', req: '3~4차시 완료' },
    { title: '자릿값 마술사', req: '5~8차시 완료' },
    { title: '어림의 현자', req: '9~10차시 완료' },
    { title: '광속의 연산왕', req: '11차시 완료' },
    { title: '곱셈 마스터', req: '12차시 정복' },
  ];

  const handleSelectTitle = (t: string) => {
    soundEffects.playClick();
    setSelectedTitle(t);
    const updated = DataService.updateStudentData(student.account.id, {
      character: {
        ...student.character,
        selectedTitle: t,
      },
    });
    if (updated) {
      onStudentUpdated(updated);
    }
  };

  const completedStagesCount = Object.values(student.stages || {}).filter((s) => (s as any)?.completed).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0A0A0A] rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] p-4 text-white flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-2xl shadow-inner">
              👑
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">모험가 프로필 & 업적</h2>
              <p className="text-xs text-[#A1A1AA] font-medium">
                {student.account.grade}학년 {student.account.classNo}반 {student.account.number}번 {student.account.name} 모험가
              </p>
            </div>
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Section: Avatar Card & Stats */}
          <div className="bg-[#121212] rounded-3xl p-5 border border-[#222222] flex flex-col sm:flex-row items-center gap-6">
            <CharacterAvatar character={student.character} size="lg" isAnimated={true} />

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-center">
                <div className="text-[11px] font-bold text-[#71717A]">모험가 레벨</div>
                <div className="text-xl font-black text-[#F6D860]">Lv.{student.character.level}</div>
              </div>

              <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-center">
                <div className="text-[11px] font-bold text-[#71717A]">누적 골드</div>
                <div className="text-xl font-black text-[#D4AF37]">{student.character.gold} G</div>
              </div>

              <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-center">
                <div className="text-[11px] font-bold text-[#71717A]">완료 차시</div>
                <div className="text-xl font-black text-[#34D399]">{completedStagesCount} / 12</div>
              </div>

              <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-center">
                <div className="text-[11px] font-bold text-[#71717A]">정답률</div>
                <div className="text-xl font-black text-[#60A5FA]">
                  {student.totalCorrect + student.totalWrong > 0
                    ? Math.round((student.totalCorrect / (student.totalCorrect + student.totalWrong)) * 100)
                    : 100}
                  %
                </div>
              </div>

              <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-center">
                <div className="text-[11px] font-bold text-[#71717A]">오답 복습</div>
                <div className="text-xl font-black text-[#FB7185]">{student.totalWrong}문항</div>
              </div>

              <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-center">
                <div className="text-[11px] font-bold text-[#71717A]">수학몬 수집</div>
                <div className="text-xl font-black text-[#C084FC]">
                  {student.character.mathMonsters?.length || 0}마리
                </div>
              </div>
            </div>
          </div>

          {/* Titles / Badges Collection */}
          <div>
            <h3 className="text-sm font-black text-white mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D4AF37]" /> 모험가 칭호 설정
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {titles.map((t) => {
                const isSelected = selectedTitle === t.title;
                return (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => handleSelectTitle(t.title)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37]/20 text-[#F6D860] border-[#D4AF37] shadow-md scale-105'
                        : 'bg-[#121212] hover:bg-[#1A1A1A] border-[#222222] text-[#CCCCCC]'
                    }`}
                  >
                    <div className="font-extrabold text-xs">✨ {t.title}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-[#D4AF37]' : 'text-[#71717A]'}`}>
                      {t.req}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1~12 Stages Records Overview */}
          <div>
            <h3 className="text-sm font-black text-white mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#60A5FA]" /> 1~12차시 학습 기록 및 복습
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
              {STAGE_CONFIGS.map((cfg) => {
                const rec = student.stages[cfg.id];
                const isDone = rec && rec.completed;

                return (
                  <div
                    key={cfg.id}
                    className="p-3 bg-[#121212] rounded-2xl border border-[#222222] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cfg.badgeIcon}</span>
                      <div>
                        <div className="font-extrabold text-white truncate max-w-[140px]">
                          {cfg.id}차시 · {cfg.areaName}
                        </div>
                        <div className="text-[10px] text-[#71717A]">
                          {isDone ? `정답 ${rec.correctCount} / 오답 ${rec.wrongCount}` : '미완료'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isDone ? (
                        <span className="font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-md border border-[#10B981]/30 text-[10px]">
                          {rec.mastery || '완료'}
                        </span>
                      ) : (
                        <span className="text-[#555555] text-[10px]">진행전</span>
                      )}

                      {isDone && onStartReviewStage && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            onClose();
                            onStartReviewStage(cfg.id);
                          }}
                          className="p-1 bg-[#181818] hover:bg-[#222222] text-[#60A5FA] rounded-lg border border-[#333333] transition-colors cursor-pointer"
                          title="다시 풀기"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
