import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';
import { DataService } from '../../services/dataService';
import { soundEffects } from '../../utils/soundEffects';

interface TeacherLoginProps {
  onLoginSuccess: () => void;
  onBackToStudent: () => void;
}

export const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLoginSuccess, onBackToStudent }) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('선생님 비밀번호를 입력해 주세요.');
      return;
    }

    soundEffects.playClick();

    if (DataService.verifyTeacherPassword(password.trim())) {
      soundEffects.playCorrect();
      onLoginSuccess();
    } else {
      soundEffects.playWrong();
      setErrorMsg('비밀번호가 일치하지 않습니다. (초기 비밀번호: 1234)');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#132238] rounded-3xl border border-[#1E3A5F] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-[#38BDF8]/40 text-white text-3xl shadow-lg mb-3">
            <Shield className="w-8 h-8 text-[#38BDF8]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">교사 통합 대시보드</h1>
          <p className="text-xs font-medium text-[#94A3B8] mt-1">
            초등 3학년 2학기 1단원 곱셈 학급 학습 관리 시스템
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-[#3B1219] border border-[#FB7185]/50 text-[#FB7185] text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5 ml-1">
              교사 인증 비밀번호
            </label>
            <div className="relative">
              <input
                id="input-teacher-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="기본 비밀번호: 1234"
                className="w-full px-4 py-3 pl-11 bg-[#0F172A] border border-[#2D4566] focus:border-[#38BDF8] focus:bg-[#1E293B] rounded-2xl text-white font-bold outline-none transition-all placeholder:text-[#64748B]"
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-[#64748B] absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1.5 ml-1">
              * 처음 접속 시 초기 비밀번호는 <span className="font-bold text-[#38BDF8]">1234</span> 입니다.
            </p>
          </div>

          {/* Login Submit */}
          <button
            id="btn-teacher-submit-login"
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] hover:from-[#0EA5E9] hover:to-[#38BDF8] text-slate-950 font-extrabold text-base rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Shield className="w-5 h-5 text-slate-950" />
            <span>대시보드 접속하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Return to Student Mode */}
        <div className="mt-6 pt-5 border-t border-[#1E3A5F] text-center">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onBackToStudent();
            }}
            className="text-xs font-bold text-[#94A3B8] hover:text-[#38BDF8] flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>학생 화면으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
