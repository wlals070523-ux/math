import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  AlertTriangle,
  Gift,
  Settings,
  Shield,
  ArrowLeft,
  RefreshCw,
  Cloud,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { StudentData, TeacherTabType } from '../../types';
import { DataService } from '../../services/dataService';
import { GasService } from '../../services/gasService';
import { OverviewTab } from './tabs/OverviewTab';
import { StageAnalyticsTab } from './tabs/StageAnalyticsTab';
import { StudentPortfolioTab } from './tabs/StudentPortfolioTab';
import { SOSDiagnosticTab } from './tabs/SOSDiagnosticTab';
import { RewardCenterTab } from './tabs/RewardCenterTab';
import { AccountManageTab } from './tabs/AccountManageTab';
import { soundEffects } from '../../utils/soundEffects';

interface TeacherDashboardProps {
  onBackToStudent: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToStudent }) => {
  const [activeTab, setActiveTab] = useState<TeacherTabType>('overview');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedStageForAnalytics, setSelectedStageForAnalytics] = useState<number>(1);
  const [selectedStudentForPortfolio, setSelectedStudentForPortfolio] = useState<string>('');

  // Google Sheets (GAS) Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(GasService.getLastSyncTime());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(false);

  // Local student data refresh
  const refreshLocalData = useCallback(() => {
    const list = DataService.getAllStudents();
    setStudents(list);
  }, []);

  // Fetch & Sync with Google Sheets
  const syncWithGoogleSheets = useCallback(async (showToast = true) => {
    setIsSyncing(true);
    if (showToast) {
      setSyncMessage('Google Sheets에서 최신 데이터를 불러오는 중...');
    }

    try {
      // 1. Flush any pending offline queue first
      await GasService.flushOfflineQueue();

      // 2. Fetch all records from Sheets
      const res = await GasService.fetchSheetData();
      if (res.success && res.data) {
        const records = Array.isArray(res.data) ? res.data : [];
        if (records.length > 0) {
          DataService.mergeSheetRecords(records);
        }
        setSyncStatus('success');
        setSyncMessage(`Google Sheets와 동기화 완료 (${records.length}건 확인)`);
      } else {
        setSyncStatus('failed');
        setSyncMessage(res.error || '시트 데이터를 가져오지 못했습니다. 로컬 데이터로 표시합니다.');
      }
    } catch {
      setSyncStatus('failed');
      setSyncMessage('스프레드시트 통신 오류가 발생하여 로컬 캐시 데이터를 유지합니다.');
    } finally {
      setIsSyncing(false);
      setLastSyncTime(new Date().toISOString());
      refreshLocalData();
      setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
    }
  }, [refreshLocalData]);

  // Initial load
  useEffect(() => {
    refreshLocalData();
    syncWithGoogleSheets(false);
  }, [refreshLocalData, syncWithGoogleSheets]);

  // Auto Refresh Interval (every 45 seconds if enabled)
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      syncWithGoogleSheets(false);
    }, 45000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, syncWithGoogleSheets]);

  const tabs: { id: TeacherTabType; name: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', name: '학급 종합 현황', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'stages', name: '1~12차시별 분석', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'students', name: '학생별 상세 포트폴리오', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'sos', name: 'SOS 긴급 처방실', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'rewards', name: 'RPG 보상·칭찬 센터', icon: <Gift className="w-4 h-4" /> },
    { id: 'accounts', name: '계정 및 데이터 관리', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleTabChange = (tabId: TeacherTabType) => {
    soundEffects.playClick();
    setActiveTab(tabId);
  };

  const handleSelectStageFromOverview = (stageId: number) => {
    setSelectedStageForAnalytics(stageId);
    setActiveTab('stages');
  };

  const handleSelectStudentFromOverview = (studentId: string) => {
    setSelectedStudentForPortfolio(studentId);
    setActiveTab('students');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Teacher Header Navigation */}
      <div className="bg-[#132238] rounded-3xl border border-[#2D4566] shadow-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] px-2.5 py-0.5 rounded-md">
                3학년 3반 곱셈 단원
              </span>
              <span className="text-xs text-[#94A3B8] font-bold">등록 학생: {students.length}명</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              교사용 통합 맞춤형 대시보드
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              autoRefreshEnabled
                ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                : 'bg-[#0F172A] border-[#2D4566] text-[#94A3B8] hover:text-white'
            }`}
            title="45초마다 Google Sheets 자동 갱신"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>자동 새로고침 {autoRefreshEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sync Sheets Button */}
          <button
            type="button"
            disabled={isSyncing}
            onClick={() => {
              soundEffects.playClick();
              syncWithGoogleSheets(true);
            }}
            className="p-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl border border-[#2D4566] transition-colors text-xs font-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Google Sheets 실시간 동기화"
          >
            <RefreshCw className={`w-4 h-4 text-[#38BDF8] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '시트 동기화 중...' : '시트 새로고침'}</span>
          </button>

          {/* Back to Student */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onBackToStudent();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] text-black rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>학생 모험 화면으로</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Sync Notification Banner */}
      {syncStatus !== 'idle' && (
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all animate-scale-up ${
            syncStatus === 'success'
              ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
              : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 text-[#34D399]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#F87171]" />
            )}
            <span>{syncMessage}</span>
          </div>
          {lastSyncTime && (
            <span className="text-[11px] text-[#94A3B8]">
              최근 확인: {new Date(lastSyncTime).toLocaleTimeString('ko-KR')}
            </span>
          )}
        </div>
      )}

      {/* 6 Top Tabs Pill Bar */}
      <div className="bg-[#132238] p-1.5 rounded-2xl border border-[#2D4566] flex gap-1.5 overflow-x-auto scrollbar-thin shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/50 shadow-md scale-[1.02]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#0F172A]'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab View Router */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <OverviewTab
            students={students}
            onSelectStage={handleSelectStageFromOverview}
            onSelectStudent={handleSelectStudentFromOverview}
          />
        )}

        {activeTab === 'stages' && (
          <StageAnalyticsTab
            students={students}
            initialSelectedStage={selectedStageForAnalytics}
            onSelectStudent={handleSelectStudentFromOverview}
          />
        )}

        {activeTab === 'students' && (
          <StudentPortfolioTab
            students={students}
            initialSelectedStudentId={selectedStudentForPortfolio}
            onStudentUpdated={refreshLocalData}
          />
        )}

        {activeTab === 'sos' && (
          <SOSDiagnosticTab students={students} onStudentUpdated={refreshLocalData} />
        )}

        {activeTab === 'rewards' && (
          <RewardCenterTab students={students} onStudentUpdated={refreshLocalData} />
        )}

        {activeTab === 'accounts' && (
          <AccountManageTab students={students} onStudentUpdated={refreshLocalData} />
        )}
      </div>
    </div>
  );
};
