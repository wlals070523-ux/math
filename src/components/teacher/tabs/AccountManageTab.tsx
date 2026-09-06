import React, { useState } from 'react';
import {
  Users,
  Download,
  Upload,
  UserPlus,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  Lock,
  Cloud,
  Link,
  Zap,
  Code,
  Copy,
  Check,
  RefreshCw,
  Info,
  Server,
} from 'lucide-react';
import { StudentData } from '../../../types';
import { DataService } from '../../../services/dataService';
import { AnalysisService } from '../../../services/analysisService';
import { GasService, DEFAULT_GAS_URL } from '../../../services/gasService';
import { soundEffects } from '../../../utils/soundEffects';

interface AccountManageTabProps {
  students: StudentData[];
  onStudentUpdated: () => void;
}

export const AccountManageTab: React.FC<AccountManageTabProps> = ({ students, onStudentUpdated }) => {
  // Google Apps Script Settings State
  const [gasUrl, setGasUrl] = useState<string>(GasService.getGasUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    getOk: boolean;
    postOk: boolean;
    latencyMs: number;
    message: string;
    details?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Single Add Form
  const [newNumber, setNewNumber] = useState(students.length + 1);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState(3);
  const [newClassNo, setNewClassNo] = useState(3);

  // Bulk Add Form
  const [bulkText, setBulkText] = useState('');
  const [bulkGrade, setBulkGrade] = useState(3);
  const [bulkClassNo, setBulkClassNo] = useState(3);

  // Teacher Password Change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // General Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Save GAS URL
  const handleSaveGasUrl = () => {
    soundEffects.playClick();
    GasService.setGasUrl(gasUrl);
    showToast('Google Apps Script 웹 앱 URL이 저장되었습니다.');
  };

  // Reset to default GAS URL
  const handleResetGasUrl = () => {
    soundEffects.playClick();
    setGasUrl(DEFAULT_GAS_URL);
    GasService.setGasUrl(DEFAULT_GAS_URL);
    showToast('기본 Apps Script 웹 앱 주소로 복원되었습니다.');
  };

  // Run Connection Test
  const handleTestConnection = async () => {
    soundEffects.playClick();
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await GasService.testConnection(gasUrl);
      setTestResult({
        tested: true,
        ...res,
      });

      if (res.success) {
        soundEffects.playLevelUp();
      } else {
        soundEffects.playWrong();
      }
    } catch (e: any) {
      setTestResult({
        tested: true,
        success: false,
        getOk: false,
        postOk: false,
        latencyMs: 0,
        message: '연결 중 예기치 않은 오류가 발생했습니다.',
        details: e?.message || '인터넷 연결 상태 및 URL을 확인해 주세요.',
      });
      soundEffects.playWrong();
    } finally {
      setIsTesting(false);
    }
  };

  // Copy Sample Code to Clipboard
  const handleCopyCode = () => {
    soundEffects.playClick();
    const code = GasService.getSampleGasScript();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      showToast('Google Apps Script 코드가 클립보드에 복사되었습니다.');
      setTimeout(() => setCopiedCode(false), 3000);
    });
  };

  // Add Single Student
  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    soundEffects.playClick();
    DataService.createStudent({
      number: Number(newNumber),
      name: newName.trim(),
      grade: Number(newGrade),
      classNo: Number(newClassNo),
    });

    setNewName('');
    setNewNumber((prev) => prev + 1);
    soundEffects.playCorrect();
    showToast('새 학생이 성공적으로 등록되었습니다.');
    onStudentUpdated();
  };

  // Bulk Register Students
  const handleBulkRegister = () => {
    if (!bulkText.trim()) return;
    soundEffects.playClick();

    const lines = bulkText.split('\n');
    const parsed: { number: number; name: string }[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const parts = trimmed.split(/[, \t]+/);
      if (parts.length >= 2 && !isNaN(Number(parts[0]))) {
        parsed.push({ number: Number(parts[0]), name: parts.slice(1).join(' ') });
      } else {
        parsed.push({ number: idx + 1, name: trimmed });
      }
    });

    if (parsed.length > 0) {
      DataService.bulkCreateStudents(bulkGrade, bulkClassNo, parsed);
      setBulkText('');
      soundEffects.playLevelUp();
      showToast(`${parsed.length}명의 학생이 일괄 등록되었습니다.`);
      onStudentUpdated();
    }
  };

  // Reset Student Password to 1234
  const handleResetStudentPassword = (studentId: string, name: string) => {
    if (!confirm(`${name} 학생의 비밀번호를 기본 '1234'로 초기화하시겠습니까?`)) return;
    soundEffects.playClick();
    DataService.resetStudentPassword(studentId);
    showToast(`${name} 학생의 비밀번호가 1234로 초기화되었습니다.`);
    onStudentUpdated();
  };

  // Delete Student
  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!confirm(`정말로 ${name} 학생 계정을 삭제하시겠습니까?`)) return;
    soundEffects.playClick();
    DataService.deleteStudentAccount(studentId);
    showToast(`${name} 학생 계정이 삭제되었습니다.`);
    onStudentUpdated();
  };

  // CSV Export
  const handleExportAccountsCSV = () => {
    soundEffects.playClick();
    const csvContent = AnalysisService.generateStudentAccountsCSV(students);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `곱셈RPG_학생계정목록_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('학생 계정 목록 CSV가 다운로드되었습니다.');
  };

  const handleExportLearningCSV = () => {
    soundEffects.playClick();
    const csvContent = AnalysisService.generateLearningDataCSV(students);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `곱셈RPG_1~12차시_종합학습결과_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('1~12차시 종합 학습 결과 CSV가 다운로드되었습니다.');
  };

  // JSON Backup & Restore
  const handleExportJSON = () => {
    soundEffects.playClick();
    const jsonStr = DataService.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `곱셈RPG_학급전체백업_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('학급 전체 백업 파일이 저장되었습니다.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = DataService.importDataJSON(text);
        if (res) {
          soundEffects.playLevelUp();
          showToast('백업 데이터를 성공적으로 복원했습니다.');
          onStudentUpdated();
        } else {
          soundEffects.playWrong();
          alert('올바른 백업 JSON 파일 형식이 아닙니다.');
        }
      } catch {
        alert('파일을 읽는 도중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSampleData = () => {
    if (!confirm('정말 15명의 모범 샘플 학급 데이터로 초기화하시겠습니까?')) return;
    soundEffects.playClick();
    DataService.resetToInitialSeed();
    showToast('기본 15명 샘플 학급 데이터로 재설정되었습니다.');
    onStudentUpdated();
  };

  // Change Teacher Password
  const handleChangeTeacherPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (!DataService.verifyTeacherPassword(currentPw)) {
      soundEffects.playWrong();
      setPwMsg({ text: '현재 비밀번호가 일치하지 않습니다.', isError: true });
      return;
    }

    if (newPw.length < 4) {
      soundEffects.playWrong();
      setPwMsg({ text: '새 비밀번호는 4자리 이상이어야 합니다.', isError: true });
      return;
    }

    if (newPw !== confirmPw) {
      soundEffects.playWrong();
      setPwMsg({ text: '새 비밀번호 확인이 일치하지 않습니다.', isError: true });
      return;
    }

    DataService.setTeacherPassword(newPw);
    soundEffects.playCorrect();
    setPwMsg({ text: '교사 비밀번호가 안전하게 변경되었습니다.', isError: false });
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-[#0F291E] border border-[#10B981]/50 text-[#34D399] text-xs sm:text-sm font-black rounded-2xl flex items-center gap-2 shadow-lg animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SECTION 1: Google Apps Script (GAS) & Google Sheets Integration Card */}
      <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 px-2.5 py-0.5 rounded-full">
                중앙 데이터베이스 연동
              </span>
              <span className="text-xs font-bold text-[#34D399] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                Google Sheets 실시간 동기화
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#38BDF8]" /> Google Apps Script(GAS) 웹 앱 연동 설정
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowCodeModal(true)}
            className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Code className="w-4 h-4" />
            <span>GAS 스크립트 코드 보기</span>
          </button>
        </div>

        {/* URL Input & Actions */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#94A3B8] block">
            Apps Script Web App 배포 URL (doGet / doPost 엔드포인트)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Link className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full pl-10 pr-4 py-3 bg-[#0F172A] rounded-xl border border-[#2D4566] text-xs font-mono text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveGasUrl}
                className="px-4 py-3 bg-[#1E293B] hover:bg-[#28394E] text-white font-bold text-xs rounded-xl border border-[#2D4566] transition-colors cursor-pointer"
              >
                URL 저장
              </button>

              <button
                type="button"
                onClick={handleResetGasUrl}
                className="px-3 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white font-bold text-xs rounded-xl border border-[#2D4566] transition-colors cursor-pointer"
                title="기본 URL로 복원"
              >
                기본값
              </button>

              <button
                type="button"
                disabled={isTesting}
                onClick={handleTestConnection}
                className="px-5 py-3 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] text-black font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Zap className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? '연결 테스트 중...' : '연결 테스트'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Connection Test Report Box */}
        {testResult && (
          <div
            className={`p-4 rounded-2xl border transition-all animate-scale-up space-y-2 ${
              testResult.success
                ? 'bg-[#0F291E] border-[#10B981]/50 text-white'
                : 'bg-[#2A1215] border-[#EF4444]/50 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#F87171]" />
                )}
                <span>{testResult.message}</span>
              </div>
              {testResult.latencyMs > 0 && (
                <span className="text-xs font-mono text-[#94A3B8]">
                  응답 속도: {testResult.latencyMs}ms
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold pt-1">
              <div className="bg-[#0F172A]/70 p-2 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-[#94A3B8]">GET 조회 권한:</span>
                <span className={testResult.getOk ? 'text-[#34D399]' : 'text-[#F87171]'}>
                  {testResult.getOk ? '정상 (OK)' : '실패'}
                </span>
              </div>
              <div className="bg-[#0F172A]/70 p-2 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-[#94A3B8]">POST 저장 권한:</span>
                <span className={testResult.postOk ? 'text-[#34D399]' : 'text-[#F87171]'}>
                  {testResult.postOk ? '정상 (OK)' : '실패'}
                </span>
              </div>
              <div className="bg-[#0F172A]/70 p-2 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-[#94A3B8]">CORS 처리:</span>
                <span className="text-[#38BDF8]">text/plain 포맷</span>
              </div>
              <div className="bg-[#0F172A]/70 p-2 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-[#94A3B8]">중복 방지 ID:</span>
                <span className="text-[#FBBF24]">자동 생성</span>
              </div>
            </div>

            {testResult.details && (
              <p className="text-xs text-[#CBD5E1] pt-1 leading-relaxed bg-[#0F172A]/50 p-2.5 rounded-xl border border-white/5">
                💡 <span className="font-bold">진단 안내:</span> {testResult.details}
              </p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: CSV Export & Backup Controls */}
      <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#38BDF8]" /> 엑셀(CSV) 다운로드 및 학급 데이터 백업/복원
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleExportAccountsCSV}
            className="p-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#34D399] border border-[#2D4566] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#34D399]" />
            <span>학생 계정 목록 CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportLearningCSV}
            className="p-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#FBBF24] border border-[#2D4566] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FBBF24]" />
            <span>1~12차시 결과 종합 CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="p-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#38BDF8] border border-[#2D4566] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>학급 전체 백업 (JSON)</span>
          </button>

          <label className="p-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#CBD5E1] border border-[#2D4566] rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#38BDF8]" />
            <span>백업 복원 (JSON)</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* SECTION 3: Add Single / Bulk Student Registration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Add */}
        <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#38BDF8]" /> 개별 학생 등록
          </h3>

          <form onSubmit={handleAddSingle} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-[#94A3B8]">학년</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={newGrade}
                  onChange={(e) => setNewGrade(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#94A3B8]">반</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newClassNo}
                  onChange={(e) => setNewClassNo(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#94A3B8]">번호</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newNumber}
                  onChange={(e) => setNewNumber(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#94A3B8]">학생 이름</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold focus:outline-none focus:border-[#38BDF8]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E293B] hover:bg-[#28394E] text-[#38BDF8] font-black text-xs rounded-xl border border-[#38BDF8]/40 transition-colors cursor-pointer"
            >
              학생 계정 생성 (기본 비밀번호 1234)
            </button>
          </form>
        </div>

        {/* Bulk Add */}
        <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#38BDF8]" /> 명렬표 일괄 등록
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-[#94A3B8]">학년</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={bulkGrade}
                  onChange={(e) => setBulkGrade(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#94A3B8]">반</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={bulkClassNo}
                  onChange={(e) => setBulkClassNo(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#94A3B8]">
                이름 목록 (줄바꿈 구분 또는 "1번 김민준")
              </label>
              <textarea
                rows={3}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="1번 김민준&#10;2번 이서연&#10;3번 박도윤..."
                className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-mono focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <button
              type="button"
              onClick={handleBulkRegister}
              className="w-full py-3 bg-[#1E293B] hover:bg-[#28394E] text-[#FBBF24] font-black text-xs rounded-xl border border-[#F59E0B]/40 transition-colors cursor-pointer"
            >
              명렬표 일괄 생성하기
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: Registered Student List & Management */}
      <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#38BDF8]" /> 등록 학생 계정 목록 ({students.length}명)
          </h3>

          <button
            type="button"
            onClick={handleResetSampleData}
            className="text-xs text-[#94A3B8] hover:text-[#F87171] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 15명 샘플 복원
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-[#2D4566] text-[#94A3B8] font-bold">
                <th className="py-2.5 px-3">아이디</th>
                <th className="py-2.5 px-3">번호</th>
                <th className="py-2.5 px-3">이름</th>
                <th className="py-2.5 px-3">직업</th>
                <th className="py-2.5 px-3">레벨</th>
                <th className="py-2.5 px-3">정답수</th>
                <th className="py-2.5 px-3">최근 학습일시</th>
                <th className="py-2.5 px-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D4566]/60">
              {students.map((st) => (
                <tr key={st.account.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[#38BDF8]">{st.account.id}</td>
                  <td className="py-2.5 px-3 text-white font-bold">{st.account.number}번</td>
                  <td className="py-2.5 px-3 text-white font-black">{st.account.name}</td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {st.character.job === 'warrior'
                      ? '전사'
                      : st.character.job === 'wizard'
                      ? '마법사'
                      : st.character.job === 'healer'
                      ? '힐러'
                      : '탐험가'}
                  </td>
                  <td className="py-2.5 px-3 font-black text-[#FBBF24]">Lv.{st.character.level}</td>
                  <td className="py-2.5 px-3 text-[#34D399] font-bold">{st.totalCorrect}개</td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {st.lastLearningAt ? new Date(st.lastLearningAt).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleResetStudentPassword(st.account.id, st.account.name)}
                      className="px-2.5 py-1 bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded-lg border border-[#2D4566] text-[11px] font-bold transition-colors cursor-pointer"
                      title="비밀번호 1234로 초기화"
                    >
                      PW초기화
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(st.account.id, st.account.name)}
                      className="p-1 text-[#64748B] hover:text-[#F87171] transition-colors cursor-pointer"
                      title="계정 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Teacher Security Password Change */}
      <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#38BDF8]" /> 교사 마스터 비밀번호 변경
        </h3>

        <form onSubmit={handleChangeTeacherPassword} className="max-w-md space-y-3">
          <div>
            <label className="text-xs font-bold text-[#94A3B8]">현재 비밀번호</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="현재 비밀번호 (기본 0000 또는 1234)"
              className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-[#94A3B8]">새 비밀번호</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="4자리 이상"
                className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#94A3B8]">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="다시 입력"
                className="w-full mt-1 p-2.5 bg-[#0F172A] rounded-xl border border-[#2D4566] text-white text-xs font-bold"
                required
              />
            </div>
          </div>

          {pwMsg && (
            <p className={`text-xs font-bold ${pwMsg.isError ? 'text-[#F87171]' : 'text-[#34D399]'}`}>
              {pwMsg.text}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E293B] hover:bg-[#28394E] text-white font-black text-xs rounded-xl border border-[#2D4566] transition-colors cursor-pointer"
          >
            교사 비밀번호 업데이트
          </button>
        </form>
      </div>

      {/* GAS Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#132238] rounded-3xl border border-[#2D4566] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="text-base font-black text-white">Google Apps Script 호환용 표준 코드</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? '복사 완료!' : '전체 코드 복사'}</span>
              </button>
            </div>

            <div className="p-3 bg-[#0F172A] rounded-2xl border border-[#2D4566] text-xs text-[#94A3B8] space-y-1">
              <p className="font-bold text-white">📌 구글 스프레드시트에 적용하는 방법:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                <li>구글 스프레드시트를 생성하고 상단 메뉴의 [확장 프로그램] → [Apps Script]를 클릭합니다.</li>
                <li>기존 내용을 지우고 아래의 코드를 붙여넣은 뒤 저장(Ctrl+S)합니다.</li>
                <li>우측 상단 [배포] → [새 배포] 클릭 → 유형: [웹 앱] 선택합니다.</li>
                <li>액세스 권한을 반드시 <strong>"모든 사용자(Anyone)"</strong>로 설정하고 배포합니다.</li>
                <li>생성된 웹 앱 URL을 복사하여 위 연동 설정란에 입력하면 실시간 양방향 연동이 완료됩니다.</li>
              </ol>
            </div>

            <div className="max-h-72 overflow-y-auto p-3 bg-[#0F172A] rounded-2xl border border-[#2D4566] font-mono text-[11px] text-[#CBD5E1] scrollbar-thin">
              <pre>{GasService.getSampleGasScript()}</pre>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="px-5 py-2.5 bg-[#1E293B] hover:bg-[#28394E] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
