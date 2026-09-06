import React, { useState } from 'react';
import { Sparkles, Shield, ArrowRight, UserCheck, KeyRound, User } from 'lucide-react';
import { DataService } from '../../services/dataService';
import { StudentData } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface StudentLoginProps {
  onLoginSuccess: (student: StudentData) => void;
  onGoToTeacherLogin: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess, onGoToTeacherLogin }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const existingStudents = DataService.getAllStudents();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!studentId.trim()) {
      setErrorMsg('학생 아이디를 입력해 주세요. (예: 3-3-01)');
      return;
    }

    setIsLoading(true);
    soundEffects.playClick();

    setTimeout(() => {
      const student = DataService.getStudentData(studentId.trim());
      if (!student) {
        setErrorMsg('등록되지 않은 학생 아이디입니다. 선생님께 확인해 주세요.');
        soundEffects.playWrong();
        setIsLoading(false);
        return;
      }

      if (student.account.password && student.account.password !== password.trim()) {
        setErrorMsg('비밀번호가 일치하지 않습니다. (초기 비밀번호: 1234)');
        soundEffects.playWrong();
        setIsLoading(false);
        return;
      }

      soundEffects.playCorrect();
      DataService.setActiveStudentId(student.account.id);
      onLoginSuccess(student);
      setIsLoading(false);
    }, 150);
  };

  const handleQuickSelect = (id: string, pwd = '1234') => {
    setStudentId(id);
    setPassword(pwd);
    const student = DataService.getStudentData(id);
    if (student) {
      soundEffects.playCorrect();
      DataService.setActiveStudentId(student.account.id);
      onLoginSuccess(student);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#132238] rounded-3xl border border-[#1E3A5F] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Top Decorative Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#818CF8]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Title Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-[#38BDF8]/40 text-white text-3xl shadow-lg mb-3">
            ⚔️
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            곱셈 RPG 수학 모험
          </h1>
          <p className="text-sm font-medium text-[#94A3B8] mt-1">
            3학년 2학기 곱셈의 세계로 떠나볼까요?
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-[#3B1219] border border-[#FB7185]/50 text-[#FB7185] text-xs sm:text-sm font-bold rounded-2xl animate-shake flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5 ml-1">
              학생 아이디 (학번)
            </label>
            <div className="relative">
              <input
                id="input-student-id"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="예: 3-3-01"
                className="w-full px-4 py-3 pl-11 bg-[#0F172A] border border-[#2D4566] focus:border-[#38BDF8] focus:bg-[#1E293B] rounded-2xl text-white font-bold outline-none transition-all placeholder:text-[#64748B]"
              />
              <User className="w-5 h-5 text-[#64748B] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5 ml-1">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="input-student-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="기본: 1234"
                className="w-full px-4 py-3 pl-11 bg-[#0F172A] border border-[#2D4566] focus:border-[#38BDF8] focus:bg-[#1E293B] rounded-2xl text-white font-bold outline-none transition-all placeholder:text-[#64748B]"
              />
              <KeyRound className="w-5 h-5 text-[#64748B] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-student-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] text-black font-extrabold text-base sm:text-lg rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>모험 시작하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Demo Student Selector */}
        <div className="mt-6 pt-5 border-t border-[#1E3A5F]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#94A3B8] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#38BDF8]" /> 빠른 체험용 학생 선택
            </span>
            <span className="text-[10px] text-[#64748B] font-medium">비번: 1234</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {existingStudents.slice(0, 6).map((s) => (
              <button
                key={s.account.id}
                type="button"
                onClick={() => handleQuickSelect(s.account.id, s.account.password || '1234')}
                className="p-2.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#2D4566] hover:border-[#38BDF8] rounded-xl text-left transition-colors text-xs font-bold text-white flex flex-col cursor-pointer"
              >
                <span className="text-[#38BDF8] truncate">{s.account.name}</span>
                <span className="text-[10px] text-[#94A3B8] font-mono">{s.account.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Entry Link */}
        <div className="mt-6 text-center">
          <button
            id="btn-goto-teacher-login-link"
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onGoToTeacherLogin();
            }}
            className="text-xs font-medium text-[#94A3B8] hover:text-[#38BDF8] underline underline-offset-4 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>선생님이신가요? 교사용 대시보드 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
};
