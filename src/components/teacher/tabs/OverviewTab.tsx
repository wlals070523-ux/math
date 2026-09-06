import React from 'react';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BookOpen,
  PieChart,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { StudentData } from '../../../types';
import { AnalysisService } from '../../../services/analysisService';

interface OverviewTabProps {
  students: StudentData[];
  onSelectStage?: (stageId: number) => void;
  onSelectStudent?: (studentId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  students,
  onSelectStage,
  onSelectStudent,
}) => {
  const summary = AnalysisService.getClassSummary(students);
  const weakTop3 = AnalysisService.getWeakStagesTop3(students);
  const errorBreakdown = AnalysisService.getErrorTypeBreakdown(students);
  const sosList = AnalysisService.getSOSStudents(students);

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0A0A0A] p-4 rounded-3xl border border-[#222222] shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#60A5FA]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#71717A]">참여 학생 / 전체</div>
            <div className="text-xl font-black text-white">
              {summary.activeStudents}명 <span className="text-xs text-[#71717A] font-medium">/ {summary.totalStudents}명</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-4 rounded-3xl border border-[#222222] shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#34D399]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#71717A]">학급 평균 진도율</div>
            <div className="text-xl font-black text-[#34D399]">{summary.avgProgressPercent}%</div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-4 rounded-3xl border border-[#222222] shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#D4AF37]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#71717A]">학급 평균 정답률</div>
            <div className="text-xl font-black text-[#F6D860]">{summary.avgAccuracyPercent}%</div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-4 rounded-3xl border border-[#222222] shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#F59E0B]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#71717A]">평균 레벨 / 골드</div>
            <div className="text-xl font-black text-[#D4AF37]">
              Lv.{summary.avgLevel} <span className="text-xs text-[#71717A] font-normal">({summary.avgGold}G)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Level Distribution + Job Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level Distribution 3-tier */}
        <div className="bg-[#0A0A0A] p-5 rounded-3xl border border-[#222222] shadow-sm">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#D4AF37]" /> 학급 곱셈 성취도 3단계 분포
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#121212] p-3 rounded-2xl border border-[#262626]">
              <div className="text-xs font-bold text-[#C084FC]">심화 정복</div>
              <div className="text-xl font-black text-white mt-1">{summary.levelDistribution.advanced}명</div>
              <div className="text-[10px] text-[#A1A1AA] font-normal">정답률 85% 이상</div>
            </div>

            <div className="bg-[#121212] p-3 rounded-2xl border border-[#262626]">
              <div className="text-xs font-bold text-[#60A5FA]">기본 안착</div>
              <div className="text-xl font-black text-white mt-1">{summary.levelDistribution.basic}명</div>
              <div className="text-[10px] text-[#A1A1AA] font-normal">원활한 차시 진행</div>
            </div>

            <div className="bg-[#121212] p-3 rounded-2xl border border-[#262626]">
              <div className="text-xs font-bold text-[#FB7185]">보충 지원</div>
              <div className="text-xl font-black text-white mt-1">{summary.levelDistribution.supplement}명</div>
              <div className="text-[10px] text-[#A1A1AA] font-normal">집중 처방 필요</div>
            </div>
          </div>
        </div>

        {/* Job Distribution */}
        <div className="bg-[#0A0A0A] p-5 rounded-3xl border border-[#222222] shadow-sm">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> 학급 RPG 직업 선택 현황
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#121212] p-2.5 rounded-2xl border border-[#262626]">
              <div className="text-xl">⚔️</div>
              <div className="text-xs font-bold text-[#F6D860]">전사</div>
              <div className="font-bold text-white mt-0.5">{summary.jobDistribution.warrior}명</div>
            </div>

            <div className="bg-[#121212] p-2.5 rounded-2xl border border-[#262626]">
              <div className="text-xl">🔮</div>
              <div className="text-xs font-bold text-[#C084FC]">마법사</div>
              <div className="font-bold text-white mt-0.5">{summary.jobDistribution.wizard}명</div>
            </div>

            <div className="bg-[#121212] p-2.5 rounded-2xl border border-[#262626]">
              <div className="text-xl">🌿</div>
              <div className="text-xs font-bold text-[#34D399]">힐러</div>
              <div className="font-bold text-white mt-0.5">{summary.jobDistribution.healer}명</div>
            </div>

            <div className="bg-[#121212] p-2.5 rounded-2xl border border-[#262626]">
              <div className="text-xl">🏹</div>
              <div className="text-xs font-bold text-[#FB923C]">탐험가</div>
              <div className="font-bold text-white mt-0.5">{summary.jobDistribution.explorer}명</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Weak Stages & Pedagogical Recommendations */}
      <div className="bg-[#0A0A0A] p-5 rounded-3xl border border-[#222222] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#FB7185]" /> 학급 취약 차시 Top 3 및 맞춤 지도 처방
          </h3>
          <span className="text-xs text-[#71717A] font-medium">오답률 기준 자동 분석</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weakTop3.map((st, idx) => (
            <div
              key={st.stageId}
              onClick={() => onSelectStage && onSelectStage(st.stageId)}
              className="p-4 rounded-2xl border border-[#3A181C] bg-[#170C0D] hover:bg-[#201012] cursor-pointer transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-[#E11D48] text-white px-2 py-0.5 rounded-md">
                  취약 {idx + 1}위: {st.stageId}차시
                </span>
                <span className="text-xs font-bold text-[#FB7185]">오답률 {st.wrongRate}%</span>
              </div>

              <h4 className="font-bold text-white text-sm">{st.stageTitle}</h4>

              <div className="text-xs text-[#A1A1AA] bg-[#120809] p-2.5 rounded-xl border border-[#2D1216]">
                <span className="font-bold text-[#FB7185]">주요 오류:</span> {st.mainErrorType}
              </div>

              <div className="text-xs text-[#D4AF37] bg-[#1C1608] p-2.5 rounded-xl border border-[#3D3012]">
                <span className="font-bold text-[#F6D860]">💡 지도 처방:</span> {st.teachingSuggestion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Error Type Breakdown */}
      <div className="bg-[#0A0A0A] p-5 rounded-3xl border border-[#222222] shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" /> 학급 주요 오류 유형 집계 및 지도 가이드
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {errorBreakdown.map((err) => (
            <div key={err.type} className="p-3.5 bg-[#121212] rounded-2xl border border-[#222222] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{err.name}</span>
                <span className="text-xs font-bold text-[#FB7185] bg-[#FB7185]/15 px-2 py-0.5 rounded-md border border-[#FB7185]/30">
                  {err.count}건
                </span>
              </div>
              <p className="text-[11px] text-[#71717A]">{err.description}</p>
              <div className="text-[11px] font-medium text-[#E0E0E0] bg-[#181818] p-2 rounded-xl border border-[#2A2A2A]">
                👉 {err.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
