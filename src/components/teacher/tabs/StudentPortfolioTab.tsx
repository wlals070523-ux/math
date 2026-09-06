import React, { useState } from 'react';
import { Search, User, Award, BookOpen, AlertCircle, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { StudentData } from '../../../types';
import { DataService } from '../../../services/dataService';
import { STAGE_CONFIGS } from '../../../services/learningService';
import { CharacterAvatar } from '../../character/CharacterAvatar';
import { soundEffects } from '../../../utils/soundEffects';

interface StudentPortfolioTabProps {
  students: StudentData[];
  initialSelectedStudentId?: string;
  onStudentUpdated: () => void;
}

export const StudentPortfolioTab: React.FC<StudentPortfolioTabProps> = ({
  students,
  initialSelectedStudentId,
  onStudentUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'advanced' | 'basic' | 'supplement'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialSelectedStudentId || (students[0]?.account.id ?? '')
  );

  const [teacherNote, setTeacherNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedStudent = students.find((s) => s.account.id === selectedStudentId) || students[0];

  const handleSelectStudent = (id: string) => {
    soundEffects.playClick();
    setSelectedStudentId(id);
    const s = students.find((x) => x.account.id === id);
    setTeacherNote(s?.notes || '');
    setSaveSuccess(false);
  };

  const handleSaveNotes = () => {
    if (!selectedStudent) return;
    soundEffects.playClick();
    DataService.updateStudentData(selectedStudent.account.id, {
      notes: teacherNote,
    });
    setSaveSuccess(true);
    soundEffects.playCorrect();
    onStudentUpdated();
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const nameMatch =
      s.account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.account.number).includes(searchTerm);

    if (!nameMatch) return false;

    if (filterLevel !== 'all') {
      const totalTries = s.totalCorrect + s.totalWrong;
      const acc = totalTries > 0 ? (s.totalCorrect / totalTries) * 100 : 100;
      const completedCount = Object.values(s.stages || {}).filter((st) => (st as any)?.completed).length;

      if (filterLevel === 'advanced' && !(completedCount >= 8 && acc >= 85)) return false;
      if (filterLevel === 'supplement' && !(acc < 65 || s.totalWrong > 8)) return false;
      if (
        filterLevel === 'basic' &&
        (completedCount >= 8 && acc >= 85 || acc < 65 || s.totalWrong > 8)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column (4 cols): Student List & Search */}
      <div className="lg:col-span-4 bg-[#0A0A0A] rounded-3xl border border-[#222222] shadow-sm p-4 space-y-4 flex flex-col h-[750px]">
        <div>
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#D4AF37]" /> 학급 학생 명단 ({filteredStudents.length}명)
          </h3>

          {/* Search Input */}
          <div className="relative mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름, 번호, 아이디 검색..."
              className="w-full px-3 py-2 pl-9 bg-[#141414] border border-[#262626] rounded-xl text-xs font-medium text-white outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1">
            {(['all', 'advanced', 'basic', 'supplement'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#181818] text-[#888888] hover:bg-[#222222] border border-[#262626]'
                }`}
              >
                {lvl === 'all'
                  ? '전체'
                  : lvl === 'advanced'
                  ? '심화'
                  : lvl === 'basic'
                  ? '기본'
                  : '보충'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Student List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredStudents.map((s) => {
            const isSelected = s.account.id === selectedStudentId;
            const completedCount = Object.values(s.stages || {}).filter((st) => (st as any)?.completed).length;

            return (
              <div
                key={s.account.id}
                onClick={() => handleSelectStudent(s.account.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#181818] border-[#D4AF37] shadow-sm'
                    : 'bg-[#111111] hover:bg-[#161616] border-[#1F1F1F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                    {s.account.number}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1">
                      <span>{s.account.name}</span>
                      <span className="text-[10px] text-[#D4AF37] font-bold">Lv.{s.character.level}</span>
                    </div>
                    <div className="text-[10px] text-[#71717A]">
                      진도 {completedCount}/12차시 · 정답률 {s.totalCorrect + s.totalWrong > 0 ? Math.round((s.totalCorrect / (s.totalCorrect + s.totalWrong)) * 100) : 0}%
                    </div>
                  </div>
                </div>

                <span className="text-base">
                  {s.character.job === 'warrior'
                    ? '⚔️'
                    : s.character.job === 'wizard'
                    ? '🔮'
                    : s.character.job === 'healer'
                    ? '🌿'
                    : '🏹'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column (8 cols): Selected Student Full Portfolio */}
      {selectedStudent ? (
        <div className="lg:col-span-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-[#0A0A0A] rounded-3xl border border-[#222222] shadow-sm p-5 flex flex-col sm:flex-row items-center gap-5">
            <CharacterAvatar character={selectedStudent.character} size="lg" isAnimated={true} />

            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D860] px-2.5 py-0.5 rounded-full">
                  {selectedStudent.account.grade}학년 {selectedStudent.account.classNo}반 {selectedStudent.account.number}번
                </span>
                <span className="text-xs font-normal text-[#888888] font-mono">
                  ID: {selectedStudent.account.id}
                </span>
                <span className="text-xs font-bold bg-[#1E1E1E] text-[#D4AF37] border border-[#333333] px-2 py-0.5 rounded-full">
                  비번: {selectedStudent.account.password || '1234'}
                </span>
              </div>

              <h2 className="text-xl font-black text-white">
                {selectedStudent.account.name} 모험가{' '}
                <span className="text-sm font-normal text-[#888888]">({selectedStudent.character.nickname})</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1F1F1F] text-xs">
                <div className="bg-[#121212] p-2 rounded-xl text-center border border-[#1F1F1F]">
                  <div className="text-[10px] text-[#71717A] font-medium">레벨/EXP</div>
                  <div className="font-bold text-[#F6D860]">Lv.{selectedStudent.character.level}</div>
                </div>
                <div className="bg-[#121212] p-2 rounded-xl text-center border border-[#1F1F1F]">
                  <div className="text-[10px] text-[#71717A] font-medium">보유 골드</div>
                  <div className="font-bold text-[#D4AF37]">{selectedStudent.character.gold} G</div>
                </div>
                <div className="bg-[#121212] p-2 rounded-xl text-center border border-[#1F1F1F]">
                  <div className="text-[10px] text-[#71717A] font-medium">수집 수학몬</div>
                  <div className="font-bold text-[#34D399]">
                    {(selectedStudent.character.mathMonsters || []).length} / 12마리
                  </div>
                </div>
                <div className="bg-[#121212] p-2 rounded-xl text-center border border-[#1F1F1F]">
                  <div className="text-[10px] text-[#71717A] font-medium">누적 힌트</div>
                  <div className="font-bold text-[#FB7185]">{selectedStudent.totalHints}회</div>
                </div>
              </div>
            </div>
          </div>

          {/* 1~12 Stages Matrix Table */}
          <div className="bg-[#0A0A0A] rounded-3xl border border-[#222222] shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" /> 1~12차시 단원별 학습 현황
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {STAGE_CONFIGS.map((cfg) => {
                const rec = selectedStudent.stages[cfg.id];
                const isDone = rec && rec.completed;

                return (
                  <div
                    key={cfg.id}
                    className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      isDone
                        ? 'bg-[#121212] border-[#2A2A2A]'
                        : 'bg-[#0D0D0D] border-[#1A1A1A] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{cfg.id}차시</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isDone
                            ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                            : 'bg-[#1C1C1C] text-[#666666]'
                        }`}
                      >
                        {isDone ? rec.mastery : '미완료'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888] truncate">{cfg.areaName}</div>
                    <div className="text-[10px] text-[#71717A] font-mono">
                      정답 {rec?.correctCount || 0} / 오답 {rec?.wrongCount || 0}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Customized Guidance Notes */}
          <div className="bg-[#0A0A0A] rounded-3xl border border-[#222222] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4AF37]" /> 교사용 1:1 맞춤 지도 피드백 및 관찰 기록
              </h3>
              {saveSuccess && (
                <span className="text-xs font-bold text-[#34D399] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 저장 완료!
                </span>
              )}
            </div>

            <textarea
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              rows={3}
              placeholder="학생의 올림수 합산 습관, 칭찬할 점, 보충 지도할 사항을 기록하세요..."
              className="w-full p-3 bg-[#141414] border border-[#262626] focus:border-[#D4AF37] rounded-2xl text-xs font-normal text-white outline-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C35C] text-black font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>지도 기록 저장하기</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
