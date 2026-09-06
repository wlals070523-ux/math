import React, { useState, useEffect } from 'react';
import { DataService } from './services/dataService';
import { StudentData } from './types';
import { Header } from './components/common/Header';
import { StudentLogin } from './components/student/StudentLogin';
import { CharacterCreateModal } from './components/student/CharacterCreateModal';
import { WorldMap } from './components/student/WorldMap';
import { LearningStage } from './components/student/LearningStage';
import { ShopModal } from './components/student/ShopModal';
import { MonsterBookModal } from './components/student/MonsterBookModal';
import { ProfileModal } from './components/student/ProfileModal';
import { TeacherLogin } from './components/teacher/TeacherLogin';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';

type AppView = 'student_login' | 'student_world' | 'student_stage' | 'teacher_login' | 'teacher_dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('student_login');
  const [activeStudent, setActiveStudent] = useState<StudentData | null>(null);
  const [currentStageId, setCurrentStageId] = useState<number>(1);

  // Modals
  const [showCharacterCreate, setShowCharacterCreate] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showMonsters, setShowMonsters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Initialize Data Layer on Load
  useEffect(() => {
    DataService.initializeData();
    const storedStudentId = DataService.getActiveStudentId();
    if (storedStudentId) {
      const student = DataService.getStudentData(storedStudentId);
      if (student) {
        setActiveStudent(student);
        setCurrentView('student_world');
      }
    }
  }, []);

  // Login Handlers
  const handleStudentLoginSuccess = (student: StudentData) => {
    setActiveStudent(student);
    // Check if new or default appearance
    if (!student?.character?.job || !student?.character?.nickname) {
      setShowCharacterCreate(true);
    }
    setCurrentView('student_world');
  };

  const handleStudentLogout = () => {
    DataService.setActiveStudentId(null);
    setActiveStudent(null);
    setCurrentView('student_login');
  };

  const handleSelectStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setCurrentView('student_stage');
  };

  const handleStudentUpdated = (updated: StudentData) => {
    setActiveStudent(updated);
  };

  const isTeacherView = currentView === 'teacher_dashboard' || currentView === 'teacher_login';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-[#131E3A] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#38BDF8] selection:text-black">
      {/* Universal Top Header */}
      <Header
        student={activeStudent}
        isTeacher={currentView === 'teacher_dashboard'}
        onOpenShop={() => setShowShop(true)}
        onOpenMonsters={() => setShowMonsters(true)}
        onOpenProfile={() => setShowProfile(true)}
        onLogoutStudent={handleStudentLogout}
        onSwitchToTeacher={() => setCurrentView('teacher_login')}
        onSwitchToStudent={() => {
          if (activeStudent) {
            setCurrentView('student_world');
          } else {
            setCurrentView('student_login');
          }
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-10">
        {currentView === 'student_login' && (
          <StudentLogin
            onLoginSuccess={handleStudentLoginSuccess}
            onGoToTeacherLogin={() => setCurrentView('teacher_login')}
          />
        )}

        {currentView === 'student_world' && activeStudent && (
          <WorldMap student={activeStudent} onSelectStage={handleSelectStage} />
        )}

        {currentView === 'student_stage' && activeStudent && (
          <LearningStage
            stageId={currentStageId}
            student={activeStudent}
            onBackToMap={() => setCurrentView('student_world')}
            onStudentUpdated={handleStudentUpdated}
          />
        )}

        {currentView === 'teacher_login' && (
          <TeacherLogin
            onLoginSuccess={() => setCurrentView('teacher_dashboard')}
            onBackToStudent={() => {
              if (activeStudent) {
                setCurrentView('student_world');
              } else {
                setCurrentView('student_login');
              }
            }}
          />
        )}

        {currentView === 'teacher_dashboard' && (
          <TeacherDashboard
            onBackToStudent={() => {
              if (activeStudent) {
                setCurrentView('student_world');
              } else {
                setCurrentView('student_login');
              }
            }}
          />
        )}
      </main>

      {/* Modals */}
      {showCharacterCreate && activeStudent && (
        <CharacterCreateModal
          student={activeStudent}
          onComplete={(updated) => {
            setActiveStudent(updated);
            setShowCharacterCreate(false);
          }}
        />
      )}

      {showShop && activeStudent && (
        <ShopModal
          student={activeStudent}
          onClose={() => setShowShop(false)}
          onStudentUpdated={handleStudentUpdated}
        />
      )}

      {showMonsters && activeStudent && (
        <MonsterBookModal
          student={activeStudent}
          onClose={() => setShowMonsters(false)}
        />
      )}

      {showProfile && activeStudent && (
        <ProfileModal
          student={activeStudent}
          onClose={() => setShowProfile(false)}
          onStudentUpdated={handleStudentUpdated}
          onStartReviewStage={(stageId) => {
            setCurrentStageId(stageId);
            setCurrentView('student_stage');
          }}
        />
      )}

      {/* Subtle Footer */}
      <footer className="text-center py-4 text-xs font-medium text-[#71717A] border-t border-[#1F1F1F]">
        초등학교 3학년 2학기 1단원 곱셈 교육과정 맞춤형 RPG 수학 모험 & 교사용 통합 대시보드
      </footer>
    </div>
  );
}
