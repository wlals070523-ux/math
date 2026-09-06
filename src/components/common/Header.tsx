import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Sparkles, ShoppingBag, BookOpen, LogOut, Award, User, RefreshCw } from 'lucide-react';
import { StudentData } from '../../types';
import { GameService } from '../../services/gameService';
import { soundEffects } from '../../utils/soundEffects';

interface HeaderProps {
  student: StudentData | null;
  isTeacher: boolean;
  onOpenShop?: () => void;
  onOpenMonsters?: () => void;
  onOpenProfile?: () => void;
  onLogoutStudent?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToStudent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  isTeacher,
  onOpenShop,
  onOpenMonsters,
  onOpenProfile,
  onLogoutStudent,
  onSwitchToTeacher,
  onSwitchToStudent,
}) => {
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());

  const handleToggleMute = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundEffects.playClick();
  };

  const expRequired = student ? GameService.getRequiredExp(student.character.level) : 100;
  const expPercent = student ? Math.min(100, Math.round((student.character.exp / expRequired) * 100)) : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#1E293B] shadow-lg px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: App Logo & World Info */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              soundEffects.playClick();
              if (onSwitchToStudent) onSwitchToStudent();
            }}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] font-extrabold text-xl shadow-md group-hover:border-[#38BDF8] group-hover:scale-105 transition-all">
              ✕
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-lg text-white tracking-tight font-sans">
                  곱셈 RPG 수학 모험
                </span>
                <span className="text-[11px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
                  초등 3-2 1단원
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] hidden sm:block">1~12차시 맞춤형 RPG 연산 퀘스트</p>
            </div>
          </div>
        </div>

        {/* Center/Right: Student Stats or Teacher Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {student && !isTeacher ? (
            <>
              {/* EXP Progress Bar Pill */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="hidden md:flex flex-col w-36 lg:w-44 bg-[#1E293B] border border-[#334155] rounded-xl px-2.5 py-1 cursor-pointer hover:border-[#60A5FA] transition-colors shadow-inner"
                title="클릭하여 모험가 프로필 확인"
              >
                <div className="flex justify-between text-[11px] font-bold text-[#E2E8F0]">
                  <span className="text-[#38BDF8]">Lv.{student.character.level} EXP</span>
                  <span>{student.character.exp} / {expRequired}</span>
                </div>
                <div className="w-full bg-[#0F172A] h-1.5 rounded-full overflow-hidden mt-0.5 border border-[#334155]">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full transition-all duration-500"
                    style={{ width: `${expPercent}%` }}
                  />
                </div>
              </div>

              {/* Gold Pill */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  if (onOpenShop) onOpenShop();
                }}
                className="flex items-center gap-1.5 bg-[#1E293B] border border-[#F59E0B]/40 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#283548] transition-all shadow-sm active:scale-95"
                title="상점 열기"
              >
                <span className="text-base">🪙</span>
                <span className="font-extrabold text-sm text-[#FBBF24]">{student.character.gold} G</span>
              </div>

              {/* Shop Button */}
              <button
                id="btn-open-shop"
                onClick={() => {
                  soundEffects.playClick();
                  if (onOpenShop) onOpenShop();
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] text-black font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span className="hidden sm:inline">상점</span>
              </button>

              {/* Monster Book Button */}
              <button
                id="btn-open-monsters"
                onClick={() => {
                  soundEffects.playClick();
                  if (onOpenMonsters) onOpenMonsters();
                }}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#283548] text-[#34D399] border border-[#10B981]/40 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">도감 ({student.character.mathMonsters?.length || 0}/12)</span>
              </button>

              {/* Profile Avatar Trigger */}
              <button
                id="btn-open-profile"
                onClick={() => {
                  soundEffects.playClick();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#283548] border border-[#334155] px-3 py-1.5 rounded-xl font-bold text-xs text-[#E2E8F0] transition-colors cursor-pointer"
                title="내 정보"
              >
                <User className="w-4 h-4 text-[#38BDF8]" />
                <span className="hidden md:inline">{student.character.nickname}</span>
              </button>

              {/* Student Logout */}
              <button
                id="btn-student-logout"
                onClick={() => {
                  soundEffects.playClick();
                  if (onLogoutStudent) onLogoutStudent();
                }}
                className="p-2 text-[#94A3B8] hover:text-[#FB7185] hover:bg-[#1E293B] rounded-xl transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : isTeacher ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#1E293B] border border-[#334155] text-[#38BDF8] font-bold text-xs px-2.5 py-1 rounded-xl">
                <Shield className="w-3.5 h-3.5 text-[#FBBF24]" /> 교사 통합 대시보드
              </span>
              <button
                id="btn-return-student-mode"
                onClick={() => {
                  soundEffects.playClick();
                  if (onSwitchToStudent) onSwitchToStudent();
                }}
                className="flex items-center gap-1 bg-[#1E293B] hover:bg-[#283548] border border-[#38BDF8]/50 text-[#38BDF8] font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>학생 화면 보기</span>
              </button>
            </div>
          ) : (
            <button
              id="btn-goto-teacher-login"
              onClick={() => {
                soundEffects.playClick();
                if (onSwitchToTeacher) onSwitchToTeacher();
              }}
              className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#283548] border border-[#38BDF8]/40 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#38BDF8]" />
              <span>선생님 로그인</span>
            </button>
          )}

          {/* Sound Mute / Unmute Button */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-[#1E293B] text-[#64748B] border-[#334155]'
                : 'bg-[#1E293B] text-[#38BDF8] border-[#38BDF8]/40 shadow-sm'
            }`}
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
