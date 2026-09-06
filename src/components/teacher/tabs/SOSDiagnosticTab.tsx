import React, { useState } from 'react';
import {
  AlertTriangle,
  HeartHandshake,
  FileText,
  Sparkles,
  Gift,
  CheckCircle2,
  HelpCircle,
  X,
  Printer,
} from 'lucide-react';
import { StudentData, Question } from '../../../types';
import { AnalysisService } from '../../../services/analysisService';
import { LearningService } from '../../../services/learningService';
import { GameService } from '../../../services/gameService';
import { DataService } from '../../../services/dataService';
import { soundEffects } from '../../../utils/soundEffects';

interface SOSDiagnosticTabProps {
  students: StudentData[];
  onStudentUpdated: () => void;
}

export const SOSDiagnosticTab: React.FC<SOSDiagnosticTabProps> = ({ students, onStudentUpdated }) => {
  const sosList = AnalysisService.getSOSStudents(students);

  // Modal for generated supplementary worksheet
  const [worksheetModal, setWorksheetModal] = useState<{
    student: StudentData;
    stageId: number;
    questions: Question[];
  } | null>(null);

  const [rewardMsg, setRewardMsg] = useState<{ text: string; id: string } | null>(null);

  const handleGenerateWorksheet = (student: StudentData, stageId = 1) => {
    soundEffects.playClick();
    const qs: Question[] = [];
    for (let i = 1; i <= 6; i++) {
      qs.push(LearningService.generateDynamicQuestion(stageId, i, 'basic'));
    }
    setWorksheetModal({
      student,
      stageId,
      questions: qs,
    });
  };

  const handleSendEncouragement = (student: StudentData) => {
    soundEffects.playLevelUp();
    GameService.grantTeacherReward(student.account.id, {
      title: '불굴의 노력왕',
      bonusGold: 100,
    });
    setRewardMsg({
      id: student.account.id,
      text: `${student.account.name} 학생에게 응원 100골드와 '불굴의 노력왕' 칭호를 보냈습니다!`,
    });
    onStudentUpdated();
    setTimeout(() => setRewardMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1E1114] via-[#2A161A] to-[#1E1114] border border-[#3D1A20] rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 bg-[#FB7185]/20 border border-[#FB7185]/40 px-3 py-1 rounded-full text-xs font-bold text-[#FB7185] mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FB7185]" /> 긴급 기초학력 SOS 처방실
          </div>
          <h2 className="text-xl font-black text-white">학습 부진 및 오답 반복 학생 집중 지원</h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5 font-normal">
            오답 3회 이상 발생, 힌트 과다 사용, 보충 단계 정체 학생을 자동으로 감지합니다.
          </p>
        </div>

        <div className="text-right bg-[#140B0D] px-4 py-2 rounded-2xl border border-[#3D1A20]">
          <div className="text-xs text-[#FB7185] font-bold">지원 대상 학생</div>
          <div className="text-2xl font-black text-white">{sosList.length}명</div>
        </div>
      </div>

      {/* SOS Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sosList.length === 0 ? (
          <div className="col-span-2 bg-[#0A0A0A] rounded-3xl p-10 text-center border border-[#222222]">
            <CheckCircle2 className="w-12 h-12 text-[#34D399] mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">현재 SOS 지원 대상 학생이 없습니다!</h3>
            <p className="text-xs text-[#71717A] mt-1 font-normal">모든 학생들이 순조롭게 곱셈 퀘스트를 진행 중입니다.</p>
          </div>
        ) : (
          sosList.map((item) => {
            const { student, reasons, severity, problematicStageId, recentErrorTypes } = item;
            const targetStage = problematicStageId || 1;

            return (
              <div
                key={student.account.id}
                className={`p-5 rounded-3xl border transition-all bg-[#0A0A0A] shadow-sm space-y-3 ${
                  severity === 'high' ? 'border-[#E11D48]/50 ring-1 ring-[#E11D48]/30' : 'border-[#D4AF37]/50'
                }`}
              >
                {/* Top Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#262626] text-white font-bold text-xs flex items-center justify-center">
                      {student.account.number}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1">
                        <span>{student.account.name}</span>
                        <span className="text-[10px] text-[#71717A] font-mono">({student.account.id})</span>
                      </h4>
                      <span className="text-[10px] font-bold text-[#D4AF37]">
                        Lv.{student.character.level} {student.character.job}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      severity === 'high'
                        ? 'bg-[#E11D48]/20 text-[#FB7185] border border-[#E11D48]/40'
                        : 'bg-[#D4AF37]/20 text-[#F6D860] border border-[#D4AF37]/40'
                    }`}
                  >
                    {severity === 'high' ? '🚨 긴급 집중 지원' : '⚠️ 관심 지원'}
                  </span>
                </div>

                {/* Detected Reasons */}
                <div className="bg-[#140B0D] p-3 rounded-2xl border border-[#2D1216] space-y-1 text-xs text-[#FB7185] font-medium">
                  <div className="text-[11px] font-bold text-[#FB7185]">감지된 학습 애로 요인:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#E0E0E0]">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Error Types */}
                {recentErrorTypes.length > 0 && (
                  <div className="text-xs text-[#A1A1AA]">
                    <span className="font-bold text-white">주요 오답 유형: </span>
                    <span className="text-[#D4AF37] font-bold">{recentErrorTypes.join(', ')}</span>
                  </div>
                )}

                {/* Notification toast if sent */}
                {rewardMsg && rewardMsg.id === student.account.id && (
                  <div className="p-2 bg-[#0C1B14] border border-[#10B981]/40 rounded-xl text-xs font-bold text-[#34D399]">
                    {rewardMsg.text}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendEncouragement(student)}
                    className="flex-1 py-2 bg-[#181818] hover:bg-[#222222] text-[#F6D860] border border-[#D4AF37]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>응원 골드·칭호 수여</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateWorksheet(student, targetStage)}
                    className="flex-1 py-2 bg-[#D4AF37] hover:bg-[#E6C35C] text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>맞춤 보충 문제지 생성</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Generated Worksheet Print Modal */}
      {worksheetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0A0A0A] rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto p-6 space-y-4 animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
              <div>
                <span className="text-xs font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D860] px-2 py-0.5 rounded">
                  {worksheetModal.stageId}차시 맞춤 보충 학습지
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {worksheetModal.student.account.grade}학년 {worksheetModal.student.account.classNo}반 {worksheetModal.student.account.number}번 {worksheetModal.student.account.name} 학생용
                </h3>
              </div>
              <button
                onClick={() => setWorksheetModal(null)}
                className="p-1.5 bg-[#181818] hover:bg-[#222222] rounded-xl text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Printable Paper Style */}
            <div className="space-y-4 p-4 bg-[#0D0D0D] border border-[#222222] rounded-2xl max-h-96 overflow-y-auto">
              {worksheetModal.questions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-[#141414] rounded-xl border border-[#222222] text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#888888]">
                    <span>[문제 {idx + 1}]</span>
                    <span className="text-[#34D399] font-mono">정답: {q.correctAnswer}</span>
                  </div>
                  <p className="font-bold text-sm text-white">{q.questionText}</p>
                  <div className="text-[11px] text-[#A1A1AA] bg-[#181818] p-1.5 rounded-lg border border-[#262626]">
                    💡 시각 힌트: {q.hint2}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-[#71717A] font-normal">
                * 화면에서 보거나 인쇄하여 학생 1:1 개별 지도에 활용하세요.
              </span>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E6C35C] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>인쇄하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
