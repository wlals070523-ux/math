import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  HelpCircle,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Flame,
  Wand2,
  Shield,
  Clock,
  CloudUpload,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Question, StudentData, JobType, StageRecord, SkillInfo } from '../../types';
import { STAGE_CONFIGS, LearningService } from '../../services/learningService';
import { GameService, JOB_SKILLS, MATH_MONSTERS } from '../../services/gameService';
import { DataService } from '../../services/dataService';
import { GasService } from '../../services/gasService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { Scratchpad } from './Scratchpad';
import { soundEffects } from '../../utils/soundEffects';

interface LearningStageProps {
  stageId: number;
  student: StudentData;
  onBackToMap: () => void;
  onStudentUpdated: (student: StudentData) => void;
}

export const LearningStage: React.FC<LearningStageProps> = ({
  stageId,
  student,
  onBackToMap,
  onStudentUpdated,
}) => {
  const stageConfig = STAGE_CONFIGS.find((c) => c.id === stageId) || STAGE_CONFIGS[0];

  // Question bank initialization
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [correctInRun, setCorrectInRun] = useState(0);
  const [wrongInRun, setWrongInRun] = useState(0);
  const [stageCompletedModal, setStageCompletedModal] = useState(false);
  const [earnedReward, setEarnedReward] = useState<{ exp: number; gold: number; monsterName?: string } | null>(null);

  // Google Sheets (GAS) Sync Status
  const [gasStatus, setGasStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [gasMsg, setGasMsg] = useState<string>('');
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<any>(null);

  // Hint & Error Tracking per question
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [activeHintLevel, setActiveHintLevel] = useState(0);
  const [showVerticalHelper, setShowVerticalHelper] = useState(false);
  const [supplementaryMode, setSupplementaryMode] = useState<null | { step: number; data: any }>(null);

  // Job Skill usage state
  const [activeSkillEffect, setActiveSkillEffect] = useState<string | null>(null);
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});

  // Speed Quiz Timer (Stage 11)
  const isSpeedStage = stageId === 11;
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    // Load static 15 questions for stage
    const initialPool = LearningService.getStageQuestions(stageId);
    setQuestions(initialPool);
    setCurrentIndex(0);
    setUserAnswer('');
    setWrongAttempts(0);
    setActiveHintLevel(0);
    setStreak(0);
    setGasStatus('idle');
  }, [stageId]);

  // Timer for Speed stage
  useEffect(() => {
    if (!isSpeedStage || stageCompletedModal) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSpeedStage, stageCompletedModal]);

  const currentQuestion = questions[currentIndex] || LearningService.generateDynamicQuestion(stageId, currentIndex + 1);

  // Keypad Handlers
  const handleKeypadPress = (val: string) => {
    soundEffects.playClick();
    if (userAnswer.length < 8) {
      setUserAnswer((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    soundEffects.playClick();
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundEffects.playClick();
    setUserAnswer('');
  };

  // Skill Trigger
  const handleUseSkill = (skill: SkillInfo) => {
    if ((skillCooldowns[skill.id] || 0) > 0) return;
    soundEffects.playSkill();
    setActiveSkillEffect(skill.effectType);

    // Set cooldown
    setSkillCooldowns((prev) => ({ ...prev, [skill.id]: skill.cooldownProblems }));

    if (skill.effectType === 'vertical_align_assist') {
      setShowVerticalHelper(true);
    } else if (skill.effectType === 'easy_similar_problem') {
      const supp = LearningService.getSupplementarySteps(stageId, currentQuestion);
      setSupplementaryMode({ step: 1, data: supp });
    }
  };

  const moveToNextQuestion = () => {
    setCurrentIndex((prev) => prev + 1);
    setUserAnswer('');
    setWrongAttempts(0);
    setActiveHintLevel(0);
    setShowVerticalHelper(false);
    setSupplementaryMode(null);
  };

  // Asynchronously submit data to Google Sheets via GAS
  const syncWithGoogleSheets = async (updatedStudent: StudentData, stageProgress: Partial<StageRecord>) => {
    setGasStatus('saving');
    setGasMsg('데이터를 Google Sheets에 저장하는 중입니다...');

    const payload = GasService.formatStagePayload(
      updatedStudent,
      stageId,
      stageProgress,
      stageConfig.title
    );
    setLastSubmittedPayload(payload);

    try {
      const res = await GasService.submitData(payload);
      if (res.success) {
        setGasStatus('saved');
        setGasMsg(res.message || '데이터가 정상적으로 저장되었습니다.');
      } else {
        setGasStatus('failed');
        setGasMsg(res.error || '저장에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch {
      setGasStatus('failed');
      setGasMsg('네트워크 오류가 발생했습니다. 로컬에 안전하게 보관되었습니다.');
    }
  };

  // Retry sending to Google Sheets
  const handleRetryGasSync = async () => {
    if (!lastSubmittedPayload) return;
    setGasStatus('saving');
    setGasMsg('Google Sheets로 재전송 중입니다...');
    const res = await GasService.submitData(lastSubmittedPayload);
    if (res.success) {
      setGasStatus('saved');
      setGasMsg('성공적으로 저장되었습니다.');
    } else {
      setGasStatus('failed');
      setGasMsg('저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // Answer Evaluation
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const numAnswer = parseInt(userAnswer.trim(), 10);
    const isCorrect = numAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      // Correct!
      soundEffects.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectInRun((prev) => prev + 1);
      setSolvedCount((prev) => prev + 1);

      // Reward Calculation
      const reward = GameService.calculateReward({
        questionType: currentQuestion.type,
        isCorrect: true,
        streak: newStreak,
        job: student.character.job,
        solvedCountInStage: solvedCount + 1,
        isRetry: wrongAttempts > 0,
        isBoss: currentQuestion.type === 'challenge' || currentIndex === 14,
      });

      const applyRes = GameService.applyRewards(student.account.id, reward.exp, reward.gold);
      if (applyRes.leveledUp) {
        soundEffects.playLevelUp();
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
        } catch {}
      }

      // Update student data state
      onStudentUpdated(applyRes.student);

      // Cooldown tick
      const nextCooldowns: Record<string, number> = {};
      Object.entries(skillCooldowns).forEach(([k, v]) => {
        const val = Number(v);
        if (val > 1) nextCooldowns[k] = val - 1;
      });
      setSkillCooldowns(nextCooldowns);
      setActiveSkillEffect(null);
      setShowVerticalHelper(false);
      setSupplementaryMode(null);

      // Check if Stage 15 base questions finished
      if (currentIndex === 14 && !stageCompletedModal) {
        // Complete stage
        const compRes = GameService.completeStageReward(student.account.id, stageId);
        const stageProgress: Partial<StageRecord> = {
          completed: true,
          score: Math.round(((correctInRun + 1) / (solvedCount + 1)) * 100),
          correctCount: correctInRun + 1,
          wrongCount: wrongInRun,
          tryCount: solvedCount + 1,
          hintCount: activeHintLevel,
          mastery: wrongInRun === 0 ? '완전정복' : correctInRun >= 12 ? '심화' : '기본',
        };
        const updatedRec = DataService.updateStageProgress(student.account.id, stageId, stageProgress);
        const updatedStudent = DataService.getStudentData(student.account.id);

        if (updatedStudent) {
          onStudentUpdated(updatedStudent);
          // Sync with Google Sheets
          syncWithGoogleSheets(updatedStudent, stageProgress);
        }

        setEarnedReward({
          exp: compRes.bonusExp + reward.exp,
          gold: compRes.bonusGold + reward.gold,
          monsterName: compRes.monster?.name,
        });
        setStageCompletedModal(true);

        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
      } else {
        // Next question
        moveToNextQuestion();
      }
    } else {
      // Wrong Answer!
      soundEffects.playWrong();
      setStreak(0);
      setWrongInRun((prev) => prev + 1);
      setSolvedCount((prev) => prev + 1);
      const nextWrongCount = wrongAttempts + 1;
      setWrongAttempts(nextWrongCount);
      setActiveHintLevel(Math.min(3, nextWrongCount));

      // Diagnose Error Type
      const errorType = LearningService.diagnoseErrorType(currentQuestion, numAnswer);

      // Save wrong question record to student stage record
      const currentStageRec = student.stages[stageId] || {
        stageId,
        completed: false,
        mastery: '보충',
        score: 0,
        correctCount: 0,
        wrongCount: 0,
        tryCount: 0,
        hintCount: 0,
        basicSolved: 0,
        advancedSolved: 0,
        challengeSolved: 0,
        applicationSolved: 0,
        createdProblems: 0,
        wrongQuestions: [],
        updatedAt: new Date().toISOString(),
      };

      currentStageRec.wrongCount += 1;
      currentStageRec.tryCount += 1;
      currentStageRec.wrongQuestions.push({
        problemId: currentQuestion.id,
        stageId,
        problem: currentQuestion.questionText,
        studentAns: String(numAnswer),
        correctAns: String(currentQuestion.correctAnswer),
        errorType,
        retryCount: nextWrongCount,
        hintLevel: Math.min(3, nextWrongCount),
        createdAt: new Date().toISOString(),
      });

      DataService.updateStageProgress(student.account.id, stageId, currentStageRec);
      const updatedStudent = DataService.getStudentData(student.account.id);
      if (updatedStudent) {
        onStudentUpdated(updatedStudent);
      }
    }
  };

  const userSkills = JOB_SKILLS[student.character.job] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Header Bar */}
      <div className="bg-[#132238] rounded-3xl border border-[#2D4566] p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onBackToMap();
            }}
            className="p-2.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#2D4566] text-[#94A3B8] hover:text-white rounded-2xl transition-all cursor-pointer"
            title="월드맵으로 이동"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] px-2.5 py-0.5 rounded-full">
                {stageConfig.id}차시 · {stageConfig.areaName}
              </span>
              {isSpeedStage && (
                <span className="text-xs font-extrabold bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#F87171] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {timeLeft}초
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
              {stageConfig.title}
            </h1>
          </div>
        </div>

        {/* Progress and Streaks */}
        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F59E0B]/15 border border-[#F59E0B]/30 rounded-xl text-xs font-black text-[#FBBF24] animate-pulse">
              <Flame className="w-4 h-4 fill-[#FBBF24]" />
              <span>{streak}연속 정답!</span>
            </div>
          )}

          <div className="text-right">
            <div className="text-xs font-bold text-[#94A3B8]">진행 문항</div>
            <div className="text-base font-black text-white">
              <span className="text-[#38BDF8]">{Math.min(currentIndex + 1, 15)}</span> / 15
            </div>
          </div>
        </div>
      </div>

      {/* Main Quest Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Character & Active Skills */}
        <div className="lg:col-span-4 space-y-4">
          {/* Character Mini Card */}
          <div className="bg-[#132238] rounded-3xl border border-[#2D4566] p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border border-[#2D4566] flex items-center justify-center p-1 shadow-inner">
                <CharacterAvatar character={student.character} size="sm" showBadge={false} showLevel={false} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40">
                    Lv.{student.character.level}
                  </span>
                  <span className="text-sm font-black text-white truncate">{student.character.nickname}</span>
                </div>
                <div className="text-xs text-[#94A3B8] font-bold mt-1">
                  {student.character.job === 'warrior' ? '⚔️ 열정의 전사' : student.character.job === 'wizard' ? '🔮 지혜의 마법사' : student.character.job === 'healer' ? '🌿 조화의 힐러' : '🏹 직관의 탐험가'}
                </div>
              </div>
            </div>

            {/* EXP / Gold */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
              <div className="bg-[#0F172A] p-2 rounded-xl border border-[#2D4566]">
                <div className="text-[#94A3B8]">경험치 (EXP)</div>
                <div className="text-sm font-black text-[#38BDF8]">{student.character.exp} / {student.character.level * 100}</div>
              </div>
              <div className="bg-[#0F172A] p-2 rounded-xl border border-[#2D4566]">
                <div className="text-[#94A3B8]">보유 골드</div>
                <div className="text-sm font-black text-[#FBBF24]">🪙 {student.character.gold} G</div>
              </div>
            </div>

            {/* Job Skills Action List */}
            <div className="space-y-2 pt-2 border-t border-[#2D4566]">
              <div className="text-xs font-bold text-[#94A3B8] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#FBBF24]" /> 직업 전용 스킬
              </div>
              <div className="space-y-1.5">
                {userSkills.map((skill) => {
                  const cd = skillCooldowns[skill.id] || 0;
                  const isLocked = student.character.level < skill.unlockLevel;

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      disabled={cd > 0 || isLocked}
                      onClick={() => handleUseSkill(skill)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-[#0F172A] border-[#1E293B] opacity-50 cursor-not-allowed text-[#64748B]'
                          : cd > 0
                          ? 'bg-[#0F172A] border-[#2D4566] text-[#94A3B8]'
                          : 'bg-[#1E293B] hover:bg-[#27384E] border-[#38BDF8]/40 hover:border-[#38BDF8] text-white shadow-sm active:scale-98'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{skill.icon}</span>
                        <div>
                          <div className="text-xs font-black text-white">{skill.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{skill.description}</div>
                        </div>
                      </div>
                      <div>
                        {isLocked ? (
                          <span className="text-[10px] text-[#64748B]">Lv.{skill.unlockLevel}</span>
                        ) : cd > 0 ? (
                          <span className="text-xs font-black text-[#F59E0B]">쿨다운 {cd}</span>
                        ) : (
                          <span className="text-[11px] font-black text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-lg border border-[#38BDF8]/30">
                            사용
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hint Card if wrong attempt */}
          {activeHintLevel > 0 && (
            <div className="bg-[#1E293B] rounded-3xl border border-[#F59E0B]/50 p-4 shadow-lg animate-scale-up space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#FBBF24]">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> 맞춤형 힌트 (단계 {activeHintLevel}/3)
                </span>
                <span className="text-[10px] text-[#94A3B8]">차분하게 생각해보세요</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {activeHintLevel === 1 && currentQuestion.hint1}
                {activeHintLevel === 2 && currentQuestion.hint2}
                {activeHintLevel >= 3 && currentQuestion.hint3}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Problem Canvas & Keypad */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Math Question Card */}
          <div className="bg-[#132238] rounded-3xl border border-[#2D4566] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Question Badge & Title */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
                {currentQuestion.type === 'challenge'
                  ? '👑 보스 도전 문항'
                  : currentQuestion.type === 'application'
                  ? '🌟 실생활 응용 문항'
                  : currentQuestion.type === 'advanced'
                  ? '⚡ 심화 연산'
                  : '📘 기본 개념'}
              </span>
              <span className="text-xs font-bold text-[#94A3B8]">문항 {currentIndex + 1} / 15</span>
            </div>

            {/* Problem Text */}
            <div className="text-center py-6 sm:py-8">
              <div className="text-2xl sm:text-4xl font-black text-white tracking-wide leading-snug">
                {currentQuestion.questionText}
              </div>

              {/* Vertical Helper if activated */}
              {showVerticalHelper && (
                <div className="mt-4 inline-block bg-[#0F172A] p-4 rounded-2xl border border-[#38BDF8]/40 text-left font-mono">
                  <div className="text-xs text-[#38BDF8] font-bold mb-1 text-center">세로셈 자릿값 도우미</div>
                  <div className="text-right text-xl font-black tracking-widest text-white">
                    <div>{currentQuestion.multiplicand}</div>
                    <div>× {currentQuestion.multiplier}</div>
                    <div className="border-t-2 border-[#38BDF8] my-1" />
                    <div className="text-[#FBBF24]">?</div>
                  </div>
                </div>
              )}
            </div>

            {/* User Answer Display */}
            <div className="max-w-xs mx-auto mb-6">
              <div className="h-14 bg-[#0F172A] rounded-2xl border-2 border-[#38BDF8] flex items-center justify-center text-2xl sm:text-3xl font-black text-white tracking-widest shadow-inner">
                {userAnswer || <span className="text-[#475569] font-normal text-lg">답을 입력하세요</span>}
              </div>
            </div>

            {/* Digital Keypad */}
            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(String(num))}
                  className="h-14 bg-[#1E293B] hover:bg-[#28394E] active:scale-95 border border-[#2D4566] rounded-2xl text-xl font-black text-white shadow-md transition-all flex items-center justify-center cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-14 bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 border border-[#2D4566] rounded-2xl text-sm font-extrabold text-[#94A3B8] transition-all flex items-center justify-center cursor-pointer"
              >
                지우기
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-14 bg-[#1E293B] hover:bg-[#28394E] active:scale-95 border border-[#2D4566] rounded-2xl text-xl font-black text-white shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 border border-[#2D4566] rounded-2xl text-lg font-black text-[#F87171] transition-all flex items-center justify-center cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Big Submit Button */}
            <div className="max-w-xs mx-auto mt-4">
              <button
                id="btn-submit-answer"
                type="button"
                onClick={handleSubmitAnswer}
                className="w-full py-4 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] active:scale-95 text-black font-extrabold text-lg sm:text-xl rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-6 h-6 text-black" />
                <span>정답 확인하기!</span>
              </button>
            </div>
          </div>

          {/* Scratchpad */}
          <Scratchpad />
        </div>
      </div>

      {/* Stage Completion Master Modal */}
      {stageCompletedModal && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#132238] rounded-3xl border border-[#2D4566] shadow-2xl overflow-hidden animate-scale-up text-center p-6 space-y-4">
            <div className="w-20 h-20 bg-[#0F172A] border border-[#F59E0B]/40 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner animate-bounce">
              🏆
            </div>

            <div>
              <span className="text-xs font-extrabold text-[#FBBF24] bg-[#F59E0B]/20 px-3 py-1 rounded-full border border-[#F59E0B]/40">
                차시 정복 축하!
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                {stageConfig.title} 완료!
              </h2>
              <p className="text-xs font-medium text-[#94A3B8] mt-1">
                대단해요! {stageConfig.areaName}의 모든 곱셈 퀘스트를 성공적으로 해결했습니다.
              </p>
            </div>

            {/* Rewards Card */}
            {earnedReward && (
              <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#2D4566] space-y-2 text-sm font-extrabold text-[#FBBF24]">
                <div className="flex justify-around items-center">
                  <span className="flex items-center gap-1 text-[#38BDF8]">✨ +{earnedReward.exp} EXP</span>
                  <span className="flex items-center gap-1 text-[#FBBF24]">🪙 +{earnedReward.gold} Gold</span>
                </div>
                {earnedReward.monsterName && (
                  <div className="pt-2 border-t border-[#2D4566] text-xs font-black text-[#34D399] flex items-center justify-center gap-1">
                    <span>수학몬 획득:</span>
                    <span className="bg-[#10B981]/20 px-2 py-0.5 rounded-lg border border-[#10B981]/40 text-[#34D399]">
                      {earnedReward.monsterName}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Google Sheets Sync Indicator Banner */}
            <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#2D4566] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                {gasStatus === 'saving' && (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#38BDF8] animate-spin" />
                    <span className="font-bold text-[#38BDF8]">{gasMsg}</span>
                  </>
                )}
                {gasStatus === 'saved' && (
                  <>
                    <Check className="w-4 h-4 text-[#34D399]" />
                    <span className="font-bold text-[#34D399]">{gasMsg}</span>
                  </>
                )}
                {gasStatus === 'failed' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#FB7185]" />
                    <span className="font-bold text-[#FB7185]">{gasMsg}</span>
                  </>
                )}
                {gasStatus === 'idle' && (
                  <span className="text-[#94A3B8]">클라우드 저장 준비 완료</span>
                )}
              </div>

              {gasStatus === 'failed' && (
                <button
                  type="button"
                  onClick={handleRetryGasSync}
                  className="px-2.5 py-1 bg-[#1E293B] hover:bg-[#27384E] text-[#38BDF8] font-bold rounded-lg border border-[#38BDF8]/40 transition-colors cursor-pointer"
                >
                  재시도
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setStageCompletedModal(false);
                  onBackToMap();
                }}
                className="flex-1 py-3 bg-[#1E293B] hover:bg-[#283548] text-[#CBD5E1] font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                월드맵으로 가기
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playLevelUp();
                  setStageCompletedModal(false);
                  moveToNextQuestion();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] text-black font-extrabold text-sm rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                무한 심화 도전! 🔥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
