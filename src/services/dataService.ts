import { StudentAccount, StudentData, TeacherSettings, StageRecord, JobType } from '../types';
import { GasService, GasSubmissionPayload } from './gasService';

const SCHEMA_VERSION = 1;
const STORAGE_KEY_STUDENTS = 'math_rpg_students_v1';
const STORAGE_KEY_TEACHER = 'math_rpg_teacher_v1';
const STORAGE_KEY_SESSION_STUDENT = 'math_rpg_active_student_id';
const STORAGE_KEY_SESSION_TEACHER = 'math_rpg_teacher_auth';

export class DataService {
  /**
   * Safe migration helper for student records
   */
  private static migrateStudentData(raw: any): StudentData {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Invalid student data payload');
    }

    const defaultStages: Record<number, StageRecord> = {};
    for (let i = 1; i <= 12; i++) {
      defaultStages[i] = {
        stageId: i,
        completed: false,
        mastery: '기본',
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
    }

    const defaultAppearance = {
      base: 'adventurer_1',
      hairStyle: 'short_spiky',
      hairColor: '#4f46e5',
      outfit: 'adventurer_tunic',
    };

    const defaultEquipment = {
      weapon: null,
      armor: null,
      helmet: null,
      accessory: null,
      cape: null,
    };

    // Ensure account fields exist
    const account: StudentAccount = {
      id: raw.account?.id || '3-3-01',
      password: raw.account?.password || '1234',
      grade: raw.account?.grade || 3,
      classNo: raw.account?.classNo || 3,
      number: raw.account?.number || 1,
      name: raw.account?.name || '초등모험가',
      createdAt: raw.account?.createdAt || new Date().toISOString(),
      updatedAt: raw.account?.updatedAt || new Date().toISOString(),
    };

    // Ensure character fields exist
    const character = {
      nickname: raw.character?.nickname || account.name || '곱셈히어로',
      job: (raw.character?.job as JobType) || 'warrior',
      level: typeof raw.character?.level === 'number' ? raw.character.level : 1,
      exp: typeof raw.character?.exp === 'number' ? raw.character.exp : 0,
      gold: typeof raw.character?.gold === 'number' ? raw.character.gold : 100,
      appearance: { ...defaultAppearance, ...(raw.character?.appearance || {}) },
      inventory: Array.isArray(raw.character?.inventory) ? raw.character.inventory : ['wooden_sword'],
      equipment: { ...defaultEquipment, ...(raw.character?.equipment || {}) },
      skills: Array.isArray(raw.character?.skills) ? raw.character.skills : ['focus_sword'],
      mathMonsters: Array.isArray(raw.character?.mathMonsters) ? raw.character.mathMonsters : [],
      titles: Array.isArray(raw.character?.titles) ? raw.character.titles : ['수학 꿈나무'],
      selectedTitle: raw.character?.selectedTitle || '수학 꿈나무',
    };

    // Merge stages
    const stages: Record<number, StageRecord> = { ...defaultStages };
    if (raw.stages && typeof raw.stages === 'object') {
      for (let i = 1; i <= 12; i++) {
        if (raw.stages[i]) {
          stages[i] = {
            ...defaultStages[i],
            ...raw.stages[i],
            wrongQuestions: Array.isArray(raw.stages[i].wrongQuestions) ? raw.stages[i].wrongQuestions : [],
          };
        }
      }
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      account,
      character,
      stages,
      totalCorrect: typeof raw.totalCorrect === 'number' ? raw.totalCorrect : 0,
      totalWrong: typeof raw.totalWrong === 'number' ? raw.totalWrong : 0,
      totalHints: typeof raw.totalHints === 'number' ? raw.totalHints : 0,
      totalRetries: typeof raw.totalRetries === 'number' ? raw.totalRetries : 0,
      streakCount: typeof raw.streakCount === 'number' ? raw.streakCount : 0,
      lastLearningAt: raw.lastLearningAt || new Date().toISOString(),
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Internal helper to read all student data from storage
   */
  private static readStorage(): Record<string, StudentData> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (!raw) {
        // Initialize with default demo accounts if empty
        const initial = DataService.getInitialStudentData();
        DataService.writeStorage(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      const migrated: Record<string, StudentData> = {};
      for (const [id, data] of Object.entries(parsed)) {
        migrated[id] = DataService.migrateStudentData(data);
      }
      return migrated;
    } catch (e) {
      console.error('[DataService] Failed to read students storage, restoring defaults', e);
      const initial = DataService.getInitialStudentData();
      DataService.writeStorage(initial);
      return initial;
    }
  }

  /**
   * Internal helper to write all student data to storage
   */
  private static writeStorage(data: Record<string, StudentData>): void {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(data));
    } catch (e) {
      console.error('[DataService] Failed to write students storage', e);
    }
  }

  /**
   * Default initial dataset for quick first-time use
   */
  private static getInitialStudentData(): Record<string, StudentData> {
    const list: StudentAccount[] = [
      { id: '3-3-01', password: '1234', grade: 3, classNo: 3, number: 1, name: '김민준', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3-3-02', password: '1234', grade: 3, classNo: 3, number: 2, name: '이서연', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3-3-03', password: '1234', grade: 3, classNo: 3, number: 3, name: '박도윤', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3-3-04', password: '1234', grade: 3, classNo: 3, number: 4, name: '정지우', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3-3-05', password: '1234', grade: 3, classNo: 3, number: 5, name: '최하은', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    const result: Record<string, StudentData> = {};
    list.forEach((acc, idx) => {
      const jobs: JobType[] = ['warrior', 'wizard', 'healer', 'explorer', 'warrior'];
      const job = jobs[idx % jobs.length];
      const initialStudent: Partial<StudentData> = {
        account: acc,
        character: {
          nickname: acc.name,
          job,
          level: 2,
          exp: 60,
          gold: 150,
          appearance: { base: 'adventurer_1', hairStyle: 'short_spiky', hairColor: '#4f46e5', outfit: 'adventurer_tunic' },
          inventory: ['wooden_sword', 'wooden_shield', 'potion_exp'],
          equipment: { weapon: 'wooden_sword', armor: null, helmet: null, accessory: null, cape: null },
          skills: [job === 'warrior' ? 'focus_sword' : job === 'wizard' ? 'num_search' : job === 'healer' ? 'light_heal' : 'weak_point'],
          mathMonsters: ['monster_1'],
          titles: ['수학 꿈나무', '연산 입문자'],
          selectedTitle: '수학 꿈나무',
        },
      };
      result[acc.id] = DataService.migrateStudentData(initialStudent);
    });

    return result;
  }

  // ==========================================
  // Public Student Data API
  // ==========================================

  public static getStudentAccount(studentId: string): StudentAccount | null {
    const data = DataService.getStudentData(studentId);
    return data ? data.account : null;
  }

  public static getStudentData(studentId: string): StudentData | null {
    if (!studentId) return null;
    const store = DataService.readStorage();
    return store[studentId] || null;
  }

  public static saveStudentData(studentData: StudentData): void {
    if (!studentData?.account?.id) return;
    const store = DataService.readStorage();
    store[studentData.account.id] = DataService.migrateStudentData({
      ...studentData,
      updatedAt: new Date().toISOString(),
    });
    DataService.writeStorage(store);
  }

  public static updateStudentData(studentId: string, updates: Partial<StudentData>): StudentData | null {
    const current = DataService.getStudentData(studentId);
    if (!current) return null;
    const updated = DataService.migrateStudentData({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    DataService.saveStudentData(updated);
    return updated;
  }

  public static getAllStudents(): StudentData[] {
    const store = DataService.readStorage();
    return Object.values(store).sort((a, b) => (a.account.number || 0) - (b.account.number || 0));
  }

  public static saveAllStudents(students: StudentData[]): void {
    const store: Record<string, StudentData> = {};
    students.forEach((s) => {
      if (s?.account?.id) {
        store[s.account.id] = DataService.migrateStudentData(s);
      }
    });
    DataService.writeStorage(store);
  }

  public static createStudentAccount(account: StudentAccount): StudentData {
    const existing = DataService.getStudentData(account.id);
    if (existing) {
      throw new Error(`이미 존재하는 학생 아이디입니다: ${account.id}`);
    }
    const newStudentData = DataService.migrateStudentData({
      account,
      character: {
        nickname: account.name,
        job: 'warrior',
        level: 1,
        exp: 0,
        gold: 100,
        appearance: { base: 'adventurer_1', hairStyle: 'short_spiky', hairColor: '#4f46e5', outfit: 'adventurer_tunic' },
        inventory: ['wooden_sword'],
        equipment: { weapon: 'wooden_sword', armor: null, helmet: null, accessory: null, cape: null },
        skills: ['focus_sword'],
        mathMonsters: [],
        titles: ['수학 꿈나무'],
        selectedTitle: '수학 꿈나무',
      },
    });
    DataService.saveStudentData(newStudentData);
    return newStudentData;
  }

  public static updateStudentAccount(account: StudentAccount): StudentData | null {
    const current = DataService.getStudentData(account.id);
    if (!current) return null;
    current.account = { ...account, updatedAt: new Date().toISOString() };
    DataService.saveStudentData(current);
    return current;
  }

  public static deleteStudentAccount(studentId: string): boolean {
    const store = DataService.readStorage();
    if (!store[studentId]) return false;
    delete store[studentId];
    DataService.writeStorage(store);
    return true;
  }

  public static getStageProgress(studentId: string, stageId: number): StageRecord | null {
    const student = DataService.getStudentData(studentId);
    if (!student || !student.stages[stageId]) return null;
    return student.stages[stageId];
  }

  public static updateStageProgress(studentId: string, stageId: number, progress: Partial<StageRecord>): StageRecord | null {
    const student = DataService.getStudentData(studentId);
    if (!student) return null;
    const currentStage = student.stages[stageId] || {
      stageId,
      completed: false,
      mastery: '기본',
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

    student.stages[stageId] = {
      ...currentStage,
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    student.updatedAt = new Date().toISOString();
    student.lastLearningAt = new Date().toISOString();
    DataService.saveStudentData(student);
    return student.stages[stageId];
  }

  public static resetStudentLearningData(studentId: string): StudentData | null {
    const student = DataService.getStudentData(studentId);
    if (!student) return null;
    const resetStudent = DataService.migrateStudentData({
      account: student.account,
      character: {
        ...student.character,
        level: 1,
        exp: 0,
        gold: 100,
        inventory: ['wooden_sword'],
        equipment: { weapon: 'wooden_sword', armor: null, helmet: null, accessory: null, cape: null },
        mathMonsters: [],
        titles: ['수학 꿈나무'],
      },
      stages: {},
      totalCorrect: 0,
      totalWrong: 0,
      totalHints: 0,
      totalRetries: 0,
      streakCount: 0,
    });
    DataService.saveStudentData(resetStudent);
    return resetStudent;
  }

  public static resetClassLearningData(keepAccounts = true): void {
    if (!keepAccounts) {
      // Full reset to fresh initial demo
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
      DataService.readStorage(); // will recreate
      return;
    }

    const students = DataService.getAllStudents();
    students.forEach((s) => {
      DataService.resetStudentLearningData(s.account.id);
    });
  }

  // ==========================================
  // Teacher Settings & Auth API
  // ==========================================

  public static initializeData(): void {
    const store = DataService.readStorage();
    if (Object.keys(store).length < 5) {
      DataService.seedDemoData();
    }
  }

  public static verifyTeacherPassword(password: string): boolean {
    const settings = DataService.getTeacherSettings();
    // Default master password is '1234' or '0000'
    return (
      password === settings.teacherPasswordHash ||
      password === '1234' ||
      password === '0000'
    );
  }

  public static setTeacherPassword(newPassword: string): void {
    const settings = DataService.getTeacherSettings();
    settings.teacherPasswordHash = newPassword;
    DataService.saveTeacherSettings(settings);
  }

  public static createStudent(input: {
    number: number;
    name: string;
    grade?: number;
    classNo?: number;
  }): StudentData {
    const grade = input.grade || 3;
    const classNo = input.classNo || 3;
    const num = input.number;
    const id = `${grade}-${classNo}-${String(num).padStart(2, '0')}`;

    const account: StudentAccount = {
      id,
      password: '1234',
      grade,
      classNo,
      number: num,
      name: input.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return DataService.createStudentAccount(account);
  }

  public static bulkCreateStudents(
    grade: number,
    classNo: number,
    list: { number: number; name: string }[]
  ): void {
    list.forEach((item) => {
      const id = `${grade}-${classNo}-${String(item.number).padStart(2, '0')}`;
      const existing = DataService.getStudentData(id);
      if (!existing) {
        DataService.createStudent({
          grade,
          classNo,
          number: item.number,
          name: item.name,
        });
      }
    });
  }

  public static resetStudentPassword(studentId: string): void {
    const student = DataService.getStudentData(studentId);
    if (student) {
      student.account.password = '1234';
      student.account.updatedAt = new Date().toISOString();
      DataService.saveStudentData(student);
    }
  }

  public static exportAllDataJSON(): string {
    const store = DataService.readStorage();
    const teacher = DataService.getTeacherSettings();
    return JSON.stringify(
      {
        version: SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        teacher,
        students: store,
      },
      null,
      2
    );
  }

  public static importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.students && typeof parsed.students === 'object') {
        const migrated: Record<string, StudentData> = {};
        for (const [id, data] of Object.entries(parsed.students)) {
          migrated[id] = DataService.migrateStudentData(data);
        }
        DataService.writeStorage(migrated);
        if (parsed.teacher) {
          DataService.saveTeacherSettings(parsed.teacher);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public static resetToInitialSeed(): void {
    DataService.seedDemoData();
  }

  public static getTeacherSettings(): TeacherSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TEACHER);
      if (!raw) {
        const defaults: TeacherSettings = {
          teacherPasswordHash: '0000',
          schoolName: '꿈빛초등학교',
          grade: 3,
          classNo: 3,
          updatedAt: new Date().toISOString(),
        };
        DataService.saveTeacherSettings(defaults);
        return defaults;
      }
      return JSON.parse(raw);
    } catch (e) {
      return {
        teacherPasswordHash: '0000',
        schoolName: '꿈빛초등학교',
        grade: 3,
        classNo: 3,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  public static saveTeacherSettings(settings: TeacherSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }));
    } catch (e) {
      console.error('[DataService] Failed to save teacher settings', e);
    }
  }

  // ==========================================
  // Active Session Management
  // ==========================================

  public static getActiveStudentId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_SESSION_STUDENT);
    } catch {
      return null;
    }
  }

  public static setActiveStudentId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY_SESSION_STUDENT, id);
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION_STUDENT);
      }
    } catch (e) {
      console.error('[DataService] Failed to set session student ID', e);
    }
  }

  public static isTeacherLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY_SESSION_TEACHER) === 'true';
    } catch {
      return false;
    }
  }

  public static setTeacherLoggedIn(loggedIn: boolean): void {
    try {
      if (loggedIn) {
        localStorage.setItem(STORAGE_KEY_SESSION_TEACHER, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION_TEACHER);
      }
    } catch (e) {
      console.error('[DataService] Failed to set teacher auth session', e);
    }
  }

  // ==========================================
  // Demo Data Seeder (15 diversified students)
  // ==========================================

  public static seedDemoData(): StudentData[] {
    const demoNames = [
      { name: '김민준', job: 'warrior' as JobType, level: 8, exp: 420, gold: 580, type: 'advanced' },
      { name: '이서연', job: 'wizard' as JobType, level: 7, exp: 350, gold: 460, type: 'advanced' },
      { name: '박도윤', job: 'healer' as JobType, level: 5, exp: 210, gold: 290, type: 'average' },
      { name: '정지우', job: 'explorer' as JobType, level: 6, exp: 280, gold: 340, type: 'average' },
      { name: '최하은', job: 'warrior' as JobType, level: 3, exp: 90, gold: 120, type: 'supplement' },
      { name: '조유준', job: 'wizard' as JobType, level: 9, exp: 560, gold: 720, type: 'advanced' },
      { name: '윤서아', job: 'healer' as JobType, level: 4, exp: 140, gold: 180, type: 'average' },
      { name: '장시우', job: 'explorer' as JobType, level: 3, exp: 80, gold: 110, type: 'sos' },
      { name: '임예은', job: 'warrior' as JobType, level: 6, exp: 290, gold: 390, type: 'average' },
      { name: '한지호', job: 'wizard' as JobType, level: 2, exp: 40, gold: 80, type: 'sos' },
      { name: '오수아', job: 'healer' as JobType, level: 5, exp: 230, gold: 310, type: 'average' },
      { name: '서현우', job: 'explorer' as JobType, level: 8, exp: 490, gold: 640, type: 'advanced' },
      { name: '신채원', job: 'warrior' as JobType, level: 4, exp: 160, gold: 220, type: 'weak_stage_8' },
      { name: '권민재', job: 'wizard' as JobType, level: 3, exp: 110, gold: 150, type: 'supplement' },
      { name: '황지민', job: 'healer' as JobType, level: 7, exp: 380, gold: 510, type: 'advanced' },
    ];

    const store: Record<string, StudentData> = {};

    demoNames.forEach((item, idx) => {
      const num = idx + 1;
      const id = `3-3-${String(num).padStart(2, '0')}`;
      const account: StudentAccount = {
        id,
        password: '1234',
        grade: 3,
        classNo: 3,
        number: num,
        name: item.name,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const stages: Record<number, StageRecord> = {};
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalHints = 0;
      let totalRetries = 0;

      const completedStagesCount =
        item.type === 'advanced' ? 9 :
        item.type === 'average' ? 6 :
        item.type === 'weak_stage_8' ? 8 :
        item.type === 'sos' ? 2 : 4;

      for (let s = 1; s <= 12; s++) {
        const isPast = s <= completedStagesCount;
        let score = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let tryCount = 0;
        let hintCount = 0;
        let mastery: '보충' | '기본' | '심화' | '완전정복' = '기본';
        const wrongQuestions: any[] = [];

        if (isPast) {
          if (item.type === 'advanced') {
            correctCount = 15 + Math.floor(Math.random() * 5);
            wrongCount = Math.floor(Math.random() * 2);
            hintCount = Math.floor(Math.random() * 2);
            mastery = Math.random() > 0.4 ? '완전정복' : '심화';
            score = 90 + Math.floor(Math.random() * 11);
          } else if (item.type === 'average') {
            correctCount = 13 + Math.floor(Math.random() * 3);
            wrongCount = 3 + Math.floor(Math.random() * 4);
            hintCount = 2 + Math.floor(Math.random() * 3);
            mastery = '기본';
            score = 75 + Math.floor(Math.random() * 15);
          } else if (item.type === 'weak_stage_8' && s === 8) {
            correctCount = 8;
            wrongCount = 9;
            hintCount = 6;
            mastery = '보충';
            score = 47;
            wrongQuestions.push({
              problemId: `s8_p3`,
              stageId: 8,
              problem: '47 × 38',
              studentAns: '1416',
              correctAns: '1786',
              errorType: '두 자리 수 곱셈 자리 정렬 및 올림 누락',
              retryCount: 3,
              hintLevel: 3,
              createdAt: new Date().toISOString(),
            });
          } else if (item.type === 'sos') {
            correctCount = 7 + Math.floor(Math.random() * 4);
            wrongCount = 8 + Math.floor(Math.random() * 5);
            hintCount = 6 + Math.floor(Math.random() * 4);
            mastery = '보충';
            score = 50 + Math.floor(Math.random() * 15);
            wrongQuestions.push({
              problemId: `s${s}_p2`,
              stageId: s,
              problem: '35 × 4',
              studentAns: '120',
              correctAns: '140',
              errorType: '올림수 덧셈 누락',
              retryCount: 4,
              hintLevel: 3,
              createdAt: new Date().toISOString(),
            });
          } else {
            correctCount = 10 + Math.floor(Math.random() * 4);
            wrongCount = 5 + Math.floor(Math.random() * 3);
            hintCount = 3 + Math.floor(Math.random() * 3);
            mastery = '보충';
            score = 60 + Math.floor(Math.random() * 15);
          }

          tryCount = correctCount + wrongCount;
          totalCorrect += correctCount;
          totalWrong += wrongCount;
          totalHints += hintCount;
          totalRetries += wrongCount > 2 ? 3 : 1;
        }

        stages[s] = {
          stageId: s,
          completed: isPast,
          mastery,
          score,
          correctCount,
          wrongCount,
          tryCount,
          hintCount,
          basicSolved: isPast ? 10 : 0,
          advancedSolved: isPast && item.type === 'advanced' ? 5 : 0,
          challengeSolved: isPast && item.type === 'advanced' ? 2 : 0,
          applicationSolved: isPast ? 2 : 0,
          createdProblems: 0,
          wrongQuestions,
          updatedAt: new Date().toISOString(),
        };
      }

      const monsters = [];
      for (let m = 1; m <= Math.min(completedStagesCount, 12); m++) {
        monsters.push(`monster_${m}`);
      }

      const titles = ['수학 꿈나무'];
      if (item.level >= 5) titles.push('연산 마술사');
      if (item.level >= 8) titles.push('곱셈의 대가');

      const studentData: StudentData = {
        schemaVersion: SCHEMA_VERSION,
        account,
        character: {
          nickname: item.name,
          job: item.job,
          level: item.level,
          exp: item.exp,
          gold: item.gold,
          appearance: {
            base: 'adventurer_1',
            hairStyle: num % 2 === 0 ? 'twin_tail' : 'short_spiky',
            hairColor: num % 3 === 0 ? '#ef4444' : num % 3 === 1 ? '#4f46e5' : '#10b981',
            outfit: 'adventurer_tunic',
          },
          inventory: ['wooden_sword', 'wooden_shield', 'leather_armor', 'potion_exp'],
          equipment: {
            weapon: 'wooden_sword',
            armor: item.level >= 5 ? 'steel_armor' : null,
            helmet: null,
            accessory: null,
            cape: null,
          },
          skills: [
            item.job === 'warrior' ? 'focus_sword' : item.job === 'wizard' ? 'num_search' : item.job === 'healer' ? 'light_heal' : 'weak_point',
          ],
          mathMonsters: monsters,
          titles,
          selectedTitle: titles[titles.length - 1],
        },
        stages,
        totalCorrect,
        totalWrong,
        totalHints,
        totalRetries,
        streakCount: item.type === 'advanced' ? 8 : 2,
        lastLearningAt: new Date(Date.now() - Math.floor(Math.random() * 36) * 3600000).toISOString(),
        createdAt: account.createdAt,
        updatedAt: new Date().toISOString(),
      };

      store[id] = studentData;
    });

    DataService.writeStorage(store);
    return Object.values(store);
  }

  // ==========================================
  // Google Sheets (GAS) Data Integration
  // ==========================================

  /**
   * Merge external Google Sheets records into local StudentData store
   */
  public static mergeSheetRecords(sheetRecords: any[]): { updatedCount: number; newCount: number } {
    if (!Array.isArray(sheetRecords) || sheetRecords.length === 0) {
      return { updatedCount: 0, newCount: 0 };
    }

    const currentStore = DataService.readStorage();
    let updatedCount = 0;
    let newCount = 0;

    sheetRecords.forEach((rec) => {
      const studentId = rec.studentId || (rec.grade && rec.classNo && rec.number ? `${rec.grade}-${rec.classNo}-${String(rec.number).padStart(2, '0')}` : null);
      if (!studentId) return;

      const stageId = Number(rec.stageId);
      const studentName = rec.studentName || rec.name || '학생';
      const grade = Number(rec.grade) || 3;
      const classNo = Number(rec.classNo) || 3;
      const number = Number(rec.number) || 1;

      // Existing or new student
      let student = currentStore[studentId];
      if (!student) {
        student = DataService.migrateStudentData({
          account: {
            id: studentId,
            password: '1234',
            grade,
            classNo,
            number,
            name: studentName,
            createdAt: rec.timestamp || new Date().toISOString(),
            updatedAt: rec.timestamp || new Date().toISOString(),
          },
          character: {
            nickname: studentName,
            job: (rec.job as JobType) || 'warrior',
            level: Number(rec.level) || 1,
            exp: Number(rec.exp) || 0,
            gold: Number(rec.gold) || 0,
          },
        });
        currentStore[studentId] = student;
        newCount++;
      }

      // Update character fields if higher
      if (rec.level && Number(rec.level) > student.character.level) {
        student.character.level = Number(rec.level);
      }
      if (rec.exp && Number(rec.exp) > student.character.exp) {
        student.character.exp = Number(rec.exp);
      }
      if (rec.gold && Number(rec.gold) > student.character.gold) {
        student.character.gold = Number(rec.gold);
      }
      if (rec.job && rec.job !== student.character.job) {
        student.character.job = rec.job as JobType;
      }

      // If record contains stage data
      if (stageId && stageId >= 1 && stageId <= 12) {
        const wrongQs = rec.wrongQuestionsJson ? (typeof rec.wrongQuestionsJson === 'string' ? JSON.parse(rec.wrongQuestionsJson || '[]') : rec.wrongQuestionsJson) : [];
        const existingStage = student.stages[stageId];
        
        student.stages[stageId] = {
          stageId,
          completed: true,
          mastery: (rec.mastery as any) || existingStage?.mastery || '기본',
          score: Number(rec.score) || existingStage?.score || 100,
          correctCount: Number(rec.correctCount) || existingStage?.correctCount || 0,
          wrongCount: Number(rec.wrongCount) || existingStage?.wrongCount || 0,
          tryCount: Number(rec.tryCount) || existingStage?.tryCount || 0,
          hintCount: Number(rec.hintCount) || existingStage?.hintCount || 0,
          basicSolved: existingStage?.basicSolved || 10,
          advancedSolved: existingStage?.advancedSolved || 0,
          challengeSolved: existingStage?.challengeSolved || 0,
          applicationSolved: existingStage?.applicationSolved || 0,
          createdProblems: existingStage?.createdProblems || 0,
          wrongQuestions: Array.isArray(wrongQs) && wrongQs.length > 0 ? wrongQs : existingStage?.wrongQuestions || [],
          updatedAt: rec.timestamp || new Date().toISOString(),
        };

        // Recalculate totals
        let totalC = 0;
        let totalW = 0;
        let totalH = 0;
        Object.values(student.stages).forEach((s) => {
          totalC += s.correctCount || 0;
          totalW += s.wrongCount || 0;
          totalH += s.hintCount || 0;
        });
        student.totalCorrect = totalC;
        student.totalWrong = totalW;
        student.totalHints = totalH;
        student.lastLearningAt = rec.timestamp || new Date().toISOString();
        student.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });

    DataService.writeStorage(currentStore);
    return { updatedCount, newCount };
  }
}
