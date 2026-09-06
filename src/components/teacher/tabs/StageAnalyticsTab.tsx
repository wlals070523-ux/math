import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, HelpCircle, RotateCcw, Sparkles, User, AlertCircle } from 'lucide-react';
import { StudentData } from '../../../types';
import { AnalysisService } from '../../../services/analysisService';
import { STAGE_CONFIGS, LearningService } from '../../../services/learningService';
import { soundEffects } from '../../../utils/soundEffects';

interface StageAnalyticsTabProps {
  students: StudentData[];
  initialSelectedStage?: number;
  onSelectStudent?: (studentId: string) => void;
}

export const StageAnalyticsTab: React.FC<StageAnalyticsTabProps> = ({
  students,
  initialSelectedStage = 1,
  onSelectStudent,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<number>(initialSelectedStage);

  const stageList = AnalysisService.getStageAnalysisList(students);
  const selectedConfig = STAGE_CONFIGS.find((c) => c.id === selectedStageId) || STAGE_CONFIGS[0];
  const stageQuestions = LearningService.getStageQuestions(selectedStageId);

  // Student list performance for selected stage
  const studentRows = students.map((s) => {
    const rec = s.stages[selectedStageId];
    const totalTries = rec ? rec.correctCount + rec.wrongCount : 0;
    const acc = totalTries > 0 ? Math.round((rec.correctCount / totalTries) * 100) : 0;

    return {
      student: s,
      record: rec,
      completed: rec?.completed || false,
      accuracy: acc,
      correctCount: rec?.correctCount || 0,
      wrongCount: rec?.wrongCount || 0,
      hintCount: rec?.hintCount || 0,
      mastery: rec?.mastery || '미진행',
      wrongQuestions: rec?.wrongQuestions || [],
    };
  });

  return (
    <div className="space-y-6">
      {/* 1~12 Stages Global Matrix Table */}
      <div className="bg-[#0A0A0A] rounded-3xl border border-[#222222] shadow-sm p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" /> 1~12차시 교육과정 성취도 분석표
            </h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              차시를 클릭하면 하단에서 학생별 세부 풀이 현황 및 문항을 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] text-[#888888] font-bold uppercase border-b border-[#222222]">
              <tr>
                <th className="py-3 px-3">차시</th>
                <th className="py-3 px-3">단원 핵심 개념</th>
                <th className="py-3 px-3 text-center">완료 학생</th>
                <th className="py-3 px-3 text-center">평균 정답률</th>
                <th className="py-3 px-3 text-center">오답률</th>
                <th className="py-3 px-3 text-center">평균 힌트</th>
                <th className="py-3 px-3 text-center">보충 학생</th>
                <th className="py-3 px-3 text-center">선택</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A] font-medium text-[#CCCCCC]">
              {stageList.map((st) => {
                const isSelected = st.stageId === selectedStageId;
                return (
                  <tr
                    key={st.stageId}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedStageId(st.stageId);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#181818] font-bold text-white' : 'hover:bg-[#121212]'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-[#F6D860]">{st.stageId}차시</td>
                    <td className="py-3 px-3 font-bold text-white">{st.stageTitle}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-white">{st.completedCount}</span>
                      <span className="text-[#666666]">/{students.length}명</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#34D399]">
                      {st.avgAccuracy}%
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#FB7185]">
                      {st.avgWrongRate}%
                    </td>
                    <td className="py-3 px-3 text-center text-[#888888]">{st.avgHints}회</td>
                    <td className="py-3 px-3 text-center">
                      {st.supplementCount > 0 ? (
                        <span className="bg-[#2A1215] text-[#FB7185] border border-[#FB7185]/30 font-bold px-2 py-0.5 rounded-full">
                          {st.supplementCount}명
                        </span>
                      ) : (
                        <span className="text-[#555555]">0명</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#D4AF37] text-black' : 'bg-[#181818] text-[#888888] border border-[#262626]'
                        }`}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="bg-[#0A0A0A] rounded-3xl border border-[#2A2A2A] shadow-md p-5 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1F1F1F] pb-4">
          <div>
            <span className="text-xs font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D860] px-2.5 py-1 rounded-lg">
              {selectedConfig.id}차시 · {selectedConfig.areaName}
            </span>
            <h3 className="text-lg font-bold text-white mt-1.5">{selectedConfig.title}</h3>
            <p className="text-xs text-[#71717A] font-normal">{selectedConfig.description}</p>
          </div>
        </div>

        {/* 2 Subsections: Student Table & Questions Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left (7 cols): Student Breakdown for this stage */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-bold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#D4AF37]" /> 학생별 {selectedStageId}차시 풀이 성취도
            </h4>

            <div className="border border-[#222222] rounded-2xl overflow-hidden max-h-80 overflow-y-auto bg-[#0D0D0D]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141414] text-[#888888] font-bold border-b border-[#222222] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">번호/이름</th>
                    <th className="py-2.5 px-2 text-center">상태</th>
                    <th className="py-2.5 px-2 text-center">정답/오답</th>
                    <th className="py-2.5 px-2 text-center">정답률</th>
                    <th className="py-2.5 px-2 text-center">도달 수준</th>
                    <th className="py-2.5 px-3 text-right">포트폴리오</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A] font-medium text-[#CCCCCC]">
                  {studentRows.map((row) => (
                    <tr key={row.student.account.id} className="hover:bg-[#141414]">
                      <td className="py-2.5 px-3 font-bold text-white">
                        {row.student.account.number}번 {row.student.account.name}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {row.completed ? (
                          <span className="text-[#34D399] font-bold bg-[#10B981]/15 px-1.5 py-0.5 rounded text-[10px] border border-[#10B981]/30">
                            완료
                          </span>
                        ) : (
                          <span className="text-[#555555] text-[10px]">미완료</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[#34D399] font-bold">{row.correctCount}</span> /{' '}
                        <span className="text-[#FB7185] font-bold">{row.wrongCount}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-[#F6D860]">{row.accuracy}%</td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            row.mastery === '심화' || row.mastery === '완전정복'
                              ? 'bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/40'
                              : row.mastery === '보충'
                              ? 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40'
                              : 'bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/40'
                          }`}
                        >
                          {row.mastery}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectStudent && onSelectStudent(row.student.account.id)}
                          className="text-[11px] font-bold text-[#D4AF37] hover:text-[#F6D860] underline cursor-pointer"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right (5 cols): Stage Static Questions Pool Preview */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedStageId}차시 수록 문제 (15문항)
            </h4>

            <div className="border border-[#222222] rounded-2xl p-3 bg-[#0D0D0D] max-h-80 overflow-y-auto space-y-2">
              {stageQuestions.map((q, idx) => (
                <div key={q.id} className="p-2.5 bg-[#141414] rounded-xl border border-[#222222] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#D4AF37]">Q{idx + 1}.</span>
                    <span className="font-bold text-[#34D399] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30 text-[10px]">
                      정답: {q.correctAnswer}
                    </span>
                  </div>
                  <p className="font-bold text-white">{q.questionText}</p>
                  <div className="text-[10px] text-[#71717A]">
                    💡 힌트: {q.hint1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
