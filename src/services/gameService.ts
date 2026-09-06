import { GameItem, SkillInfo, MathMonster, JobType, StudentData, CharacterData } from '../types';
import { DataService } from './dataService';

export const GAME_ITEMS: GameItem[] = [
  // Warrior Items
  { id: 'wooden_sword', name: '나무검', category: 'weapon', jobRequired: 'warrior', price: 0, icon: '⚔️', color: 'text-amber-600', description: '모험을 시작하는 전사의 기본 목검' },
  { id: 'steel_sword', name: '강철검', category: 'weapon', jobRequired: 'warrior', price: 150, icon: '🗡️', color: 'text-slate-400', description: '단단하게 벼려진 강철 검. 계산 집중력 상승' },
  { id: 'golden_sword', name: '황금검', category: 'weapon', jobRequired: 'warrior', price: 400, icon: '✨', color: 'text-amber-400', description: '눈부신 황금빛 대검. 연속 정답 시 눈부신 이펙트' },
  { id: 'wooden_shield', name: '나무 방패', category: 'armor', jobRequired: 'warrior', price: 80, icon: '🛡️', color: 'text-amber-700', description: '나무로 엮은 가벼운 방패' },
  { id: 'steel_armor', name: '강철 갑옷', category: 'armor', jobRequired: 'warrior', price: 300, icon: '🦺', color: 'text-slate-500', description: '단단한 강철 판금 갑옷' },

  // Wizard Items
  { id: 'novice_staff', name: '초보 지팡이', category: 'weapon', jobRequired: 'wizard', price: 0, icon: '🪄', color: 'text-purple-400', description: '마법의 기운이 깃든 기본 지팡이' },
  { id: 'starlight_staff', name: '별빛 지팡이', category: 'weapon', jobRequired: 'wizard', price: 200, icon: '🔮', color: 'text-indigo-400', description: '밤하늘의 별빛을 담은 신비로운 마법봉' },
  { id: 'magic_tome', name: '마법책', category: 'accessory', jobRequired: 'wizard', price: 120, icon: '📖', color: 'text-blue-500', description: '신비한 곱셈 공식이 적혀 있는 마도서' },
  { id: 'wizard_hat', name: '마법 모자', category: 'helmet', jobRequired: 'wizard', price: 180, icon: '🧙‍♂️', color: 'text-violet-500', description: '지혜로운 마법사의 뾰족모자' },
  { id: 'starlight_robe', name: '별빛 로브', category: 'armor', jobRequired: 'wizard', price: 320, icon: '👘', color: 'text-indigo-600', description: '별자리 무늬가 수놓인 고급 로브' },

  // Healer Items
  { id: 'healing_wand', name: '회복 지팡이', category: 'weapon', jobRequired: 'healer', price: 0, icon: '🌿', color: 'text-emerald-400', description: '따스한 생명의 기운을 머금은 지팡이' },
  { id: 'light_orb', name: '빛의 구슬', category: 'accessory', jobRequired: 'healer', price: 160, icon: '🌕', color: 'text-yellow-300', description: '마음을 편안하게 해주는 따뜻한 빛의 구슬' },
  { id: 'angel_cape', name: '회복의 망토', category: 'cape', jobRequired: 'healer', price: 240, icon: '🪽', color: 'text-teal-400', description: '오답 복습 시 용기를 주는 날개 망토' },
  { id: 'holy_crown', name: '빛의 관', category: 'helmet', jobRequired: 'healer', price: 280, icon: '👑', color: 'text-amber-300', description: '성스러운 기운의 아름다운 왕관' },

  // Explorer Items
  { id: 'wooden_bow', name: '나무 활', category: 'weapon', jobRequired: 'explorer', price: 0, icon: '🏹', color: 'text-orange-600', description: '빠르고 정확하게 조준하는 탐험가 활' },
  { id: 'silver_bow', name: '은빛 활', category: 'weapon', jobRequired: 'explorer', price: 220, icon: '⚡', color: 'text-cyan-400', description: '빛처럼 빠른 연산을 도와주는 은빛 활' },
  { id: 'telescope', name: '탐험 망원경', category: 'accessory', jobRequired: 'explorer', price: 150, icon: '🔭', color: 'text-blue-400', description: '숨겨진 수의 규칙을 꿰뚫어보는 망원경' },
  { id: 'explorer_hat', name: '탐험 모자', category: 'helmet', jobRequired: 'explorer', price: 180, icon: '🤠', color: 'text-amber-800', description: '미지의 수학 세계를 누비는 챙모자' },

  // Common & Cosmetics
  { id: 'pet_slime', name: '아기 슬라임 펫', category: 'pet', jobRequired: 'all', price: 250, icon: '🟢', color: 'text-emerald-500', description: '문제를 풀 때 곁에서 통통 뛰며 응원하는 펫' },
  { id: 'pet_dragon', name: '꼬마 드래곤 펫', category: 'pet', jobRequired: 'all', price: 500, icon: '🐲', color: 'text-red-500', description: '멋진 불꽃 이펙트로 축하해주는 전설의 드래곤' },
  { id: 'cool_glasses', name: '수학 박사 안경', category: 'accessory', jobRequired: 'all', price: 100, icon: '👓', color: 'text-sky-500', description: '지적인 분위기를 풍기는 동글 안경' },
  { id: 'adventure_bag', name: '모험가 배낭', category: 'cape', jobRequired: 'all', price: 120, icon: '🎒', color: 'text-amber-700', description: '각종 수학 필기도구가 가득 든 가방' },
  { id: 'party_hat', name: '축하 고깔모자', category: 'helmet', jobRequired: 'all', price: 90, icon: '🎉', color: 'text-pink-500', description: '알록달록 파티 분위기 모자' },

  // Rare Unlockables (Not directly bought with normal gold, unlocked via achievement/teacher)
  { id: 'legend_golden_sword', name: '황금 계산검', category: 'weapon', jobRequired: 'warrior', price: 9999, isRare: true, icon: '🌟', color: 'text-yellow-400', description: '차시 완전정복 및 마스터 달성 전사에게 수여되는 전설의 검', unlockCondition: '12차시 마스터 또는 교사 특별 수여' },
  { id: 'legend_star_staff', name: '별빛 마법봉', category: 'weapon', jobRequired: 'wizard', price: 9999, isRare: true, icon: '🌠', color: 'text-purple-300', description: '심화·추론 문제를 완벽히 정복한 마법사의 비전', unlockCondition: '심화 문제 20개 해결' },
  { id: 'legend_rainbow_shield', name: '무지개 방패', category: 'armor', jobRequired: 'healer', price: 9999, isRare: true, icon: '🌈', color: 'text-pink-400', description: '모든 오답을 끈기 있게 수정한 힐러의 영광', unlockCondition: '오답 수정 15회 달성' },
  { id: 'legend_explorer_crown', name: '수학 탐험가 왕관', category: 'helmet', jobRequired: 'explorer', price: 9999, isRare: true, icon: '👑', color: 'text-amber-400', description: '모든 월드맵 지역을 탐험한 최고 모험가의 왕관', unlockCondition: '월드맵 12차시 정복' },
  { id: 'legend_tome_supreme', name: '전설의 문제책', category: 'accessory', jobRequired: 'all', price: 9999, isRare: true, icon: '📜', color: 'text-rose-400', description: '자신만의 곱셈 문제를 멋지게 만든 학생을 위한 보물', unlockCondition: '문제 만들기 모드 성공' },
];

export const JOB_SKILLS: Record<JobType, SkillInfo[]> = {
  warrior: [
    { id: 'focus_sword', name: '집중의 검', job: 'warrior', unlockLevel: 1, icon: '⚔️', description: '문제의 핵심 숫자와 자릿값을 선명하게 강조합니다.', effectType: 'highlight_key_number', cooldownProblems: 2 },
    { id: 'calc_shield', name: '계산 방패', job: 'warrior', unlockLevel: 3, icon: '🛡️', description: '오답 입력 시 점수 차감 없이 1회 재도전 기회를 제공합니다.', effectType: 'retry_shield', cooldownProblems: 4 },
    { id: 'combo_slash', name: '연속 베기', job: 'warrior', unlockLevel: 6, icon: '⚡', description: '연속 정답 시 획득 EXP와 Gold가 2배로 증가합니다.', effectType: 'streak_bonus', cooldownProblems: 3 },
  ],
  wizard: [
    { id: 'num_search', name: '숫자 탐색', job: 'wizard', unlockLevel: 1, icon: '🔍', description: '문장제나 복잡한 식의 중요한 단서와 계산 순서를 표시합니다.', effectType: 'highlight_key_number', cooldownProblems: 2 },
    { id: 'mult_circle', name: '곱셈 마법진', job: 'wizard', unlockLevel: 3, icon: '🔮', description: '세로셈 격자 가이드와 올림수 기록칸을 자동으로 정렬합니다.', effectType: 'vertical_align_assist', cooldownProblems: 3 },
    { id: 'calc_accel', name: '계산 가속', job: 'wizard', unlockLevel: 6, icon: '✨', description: '심화 및 추론 문제 해결 시 EXP 보너스 +50%를 부여합니다.', effectType: 'streak_bonus', cooldownProblems: 4 },
  ],
  healer: [
    { id: 'light_heal', name: '회복의 빛', job: 'healer', unlockLevel: 1, icon: '🌿', description: '어려운 문제의 수 모형 시각화 힌트를 즉시 펼쳐 보여줍니다.', effectType: 'easy_similar_problem', cooldownProblems: 2 },
    { id: 'retry_boost', name: '다시 도전', job: 'healer', unlockLevel: 3, icon: '💖', description: '오답 복습 및 보충학습 해결 시 추가 EXP와 골드를 지급합니다.', effectType: 'streak_bonus', cooldownProblems: 3 },
    { id: 'focus_recovery', name: '집중 회복', job: 'healer', unlockLevel: 6, icon: '🕊️', description: '실수를 겪어도 차분하게 다시 계산할 수 있도록 격자 가이드를 제공합니다.', effectType: 'vertical_align_assist', cooldownProblems: 3 },
  ],
  explorer: [
    { id: 'weak_point', name: '약점 탐색', job: 'explorer', unlockLevel: 1, icon: '🎯', description: '자주 헷갈리는 올림수 및 자릿값 오류 팁을 미리 안내합니다.', effectType: 'weakness_hint', cooldownProblems: 2 },
    { id: 'problem_track', name: '문제 추적', job: 'explorer', unlockLevel: 3, icon: '🗺️', description: '단계별 부분곱 계산 경로를 순서대로 하나씩 안내합니다.', effectType: 'vertical_align_assist', cooldownProblems: 3 },
    { id: 'explorer_eye', name: '도전자의 눈', job: 'explorer', unlockLevel: 6, icon: '🔭', description: '도전 문제 및 스피드 퀴즈 해결 시 특별 보상을 획득합니다.', effectType: 'streak_bonus', cooldownProblems: 3 },
  ],
};

export const MATH_MONSTERS: MathMonster[] = [
  { id: 'monster_1', stageId: 1, name: '곱셈 씨앗몬', element: 'earth', icon: '🌱', description: '묶어 세기와 곱셈구구의 힘으로 쑥쑥 자라는 귀여운 씨앗 정령', lore: '몇십과 몇의 기본 규칙을 사랑합니다.', bonusText: '기본 계산 EXP +5%' },
  { id: 'monster_2', stageId: 2, name: '척척 계산몬', element: 'light', icon: '🤖', description: '세 자리 수 곱셈을 자릿값대로 차근차근 나누어 계산하는 로봇', lore: '올림이 없는 평화로운 계산을 좋아해요.', bonusText: '세로셈 안정성 증가' },
  { id: 'monster_3', stageId: 3, name: '올림 불꽃몬', element: 'fire', icon: '🔥', description: '일의 자리에서 십의 자리로 퐁퐁 뛰어오르는 불꽃 꼬마', lore: '일의 자리 올림수를 머리 위에 쏙 얹어줍니다.', bonusText: '올림수 힌트 강화' },
  { id: 'monster_4', stageId: 4, name: '올림 폭풍몬', element: 'wind', icon: '🌪️', description: '십의 자리와 백의 자리를 넘나드는 강력한 회오리 정령', lore: '연속 올림수도 바람처럼 깔끔하게 정리합니다.', bonusText: '연속 올림 방어' },
  { id: 'monster_5', stageId: 5, name: '십의자리몬', element: 'electric', icon: '⚡', description: '0의 규칙성을 마스터하고 10배, 100배 파워를 뿜는 번개몬', lore: '몇십×몇십의 끝자리 0을 한 방에 정복!', bonusText: '0의 규칙 연산 보너스' },
  { id: 'monster_6', stageId: 6, name: '곱셈 기사몬', element: 'earth', icon: '🛡️', description: '부분곱 모형을 방패로 삼아 빈틈없이 전진하는 용맹한 기사', lore: '한 자리 수와 두 자리 수의 만남을 수호합니다.', bonusText: '수 모형 시각화 지원' },
  { id: 'monster_7', stageId: 7, name: '두자리 배틀몬', element: 'fire', icon: '🥊', description: '두 자리 수 곱셈의 격자를 완벽하게 맞추는 격투가 몬스터', lore: '첫 번째 부분곱과 두 번째 부분곱의 자리를 정확히 잡아요.', bonusText: '세로셈 자리 정렬 도우미' },
  { id: 'monster_8', stageId: 8, name: '곱셈 드래곤', element: 'dark', icon: '🐉', description: '화산 깊은 곳에서 여러 번의 올림수를 자유자재로 다루는 드래곤', lore: '가장 강력한 연속 올림 불꽃을 다룹니다.', bonusText: '고난도 곱셈 EXP +10%' },
  { id: 'monster_9', stageId: 9, name: '어림 탐험몬', element: 'wind', icon: '🧭', description: '전망대 위에서 곱의 크기를 한눈에 어림해보는 지혜로운 부엉이', lore: '몇백에 가까울지 똑똑하게 예측해요.', bonusText: '어림 판별 정확도 증가' },
  { id: 'monster_10', stageId: 10, name: '해결사몬', element: 'magic', icon: '🧙‍♀️', description: '숫자 카드 퍼즐과 신비한 곱셈 법칙을 풀어내는 명탐정', lore: '가장 큰 곱, 가장 작은 곱을 척척 찾아냅니다.', bonusText: '사고력 퍼즐 힌트' },
  { id: 'monster_11', stageId: 11, name: '스피드몬', element: 'electric', icon: '🐆', description: '빛보다 빠른 속도로 연산 경기장을 질주하는 스피드 치타', lore: '빠르고 정확한 곱셈구구의 달인!', bonusText: '스피드 퀴즈 골드 2배' },
  { id: 'monster_12', stageId: 12, name: '곱셈 마스터몬', element: 'light', icon: '👑', description: '1단원 곱셈의 모든 마법을 터득한 전설의 대천사 수호자', lore: '3학년 2학기 곱셈 마스터 승급을 축복합니다!', bonusText: '최종 마스터 특수 이펙트' },
];

export class GameService {
  /**
   * Required EXP for next level
   */
  public static getRequiredExp(level: number): number {
    return level * 80;
  }

  /**
   * Level up title definitions
   */
  public static getTitleForLevel(level: number): string {
    if (level >= 30) return '전설의 수학 모험가';
    if (level >= 20) return '곱셈 대마스터';
    if (level >= 15) return '수학 영웅';
    if (level >= 10) return '전문 모험가';
    if (level >= 5) return '숙련 모험가';
    return '초보 모험가';
  }

  /**
   * Calculate EXP & Gold reward for answering a question
   */
  public static calculateReward(params: {
    questionType: string;
    isCorrect: boolean;
    streak: number;
    job: JobType;
    solvedCountInStage: number;
    isRetry?: boolean;
    isBoss?: boolean;
  }): { exp: number; gold: number; isLevelUp: boolean; newLevel: number; message: string } {
    if (!params.isCorrect) {
      return { exp: 0, gold: 0, isLevelUp: false, newLevel: 0, message: '' };
    }

    let baseExp = 10;
    let baseGold = 5;

    // Type adjustments
    if (params.questionType === 'advanced') {
      baseExp = 18;
      baseGold = 15;
    } else if (params.questionType === 'challenge' || params.questionType === 'speed') {
      baseExp = 25;
      baseGold = 20;
    } else if (params.questionType === 'problem_making') {
      baseExp = 35;
      baseGold = 30;
    }

    if (params.isBoss) {
      baseExp += 50;
      baseGold += 40;
    }

    // Job bonuses
    if (params.job === 'warrior' && params.streak >= 3) {
      baseExp += 5;
      baseGold += 5;
    } else if (params.job === 'wizard' && (params.questionType === 'advanced' || params.questionType === 'challenge')) {
      baseExp += 6;
      baseGold += 4;
    } else if (params.job === 'healer' && params.isRetry) {
      baseExp += 8;
      baseGold += 6;
    } else if (params.job === 'explorer' && params.questionType === 'challenge') {
      baseExp += 7;
      baseGold += 7;
    }

    // Streak bonus
    const streakBonus = Math.min(Math.floor(params.streak / 2) * 3, 15);
    const finalExp = baseExp + streakBonus;
    const finalGold = baseGold + streakBonus;

    // Diminishing returns for infinite spamming beyond 25 problems in single run
    const dimFactor = params.solvedCountInStage > 25 ? 0.5 : 1.0;
    const roundedExp = Math.max(1, Math.round(finalExp * dimFactor));
    const roundedGold = Math.max(1, Math.round(finalGold * dimFactor));

    return {
      exp: roundedExp,
      gold: roundedGold,
      isLevelUp: false,
      newLevel: 0,
      message: `+${roundedExp} EXP, +${roundedGold} Gold 획득!`,
    };
  }

  /**
   * Apply exp & gold to student and evaluate level up
   */
  public static applyRewards(studentId: string, expGain: number, goldGain: number): {
    student: StudentData;
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    newSkillsUnlocked: SkillInfo[];
  } {
    const student = DataService.getStudentData(studentId);
    if (!student) throw new Error('Student not found');

    const oldLevel = student.character.level;
    let newLevel = oldLevel;
    let currentExp = student.character.exp + expGain;
    const currentGold = student.character.gold + goldGain;

    // Level up calculation
    let req = GameService.getRequiredExp(newLevel);
    let leveledUp = false;

    while (currentExp >= req) {
      currentExp -= req;
      newLevel += 1;
      leveledUp = true;
      req = GameService.getRequiredExp(newLevel);
    }

    const newSkillsUnlocked: SkillInfo[] = [];

    if (leveledUp) {
      const title = GameService.getTitleForLevel(newLevel);
      if (!student.character.titles.includes(title)) {
        student.character.titles.push(title);
      }
      student.character.selectedTitle = title;

      // Check skill unlock
      const jobSkills = JOB_SKILLS[student.character.job] || [];
      jobSkills.forEach((skill) => {
        if (newLevel >= skill.unlockLevel && !student.character.skills.includes(skill.id)) {
          student.character.skills.push(skill.id);
          newSkillsUnlocked.push(skill);
        }
      });
    }

    student.character.level = newLevel;
    student.character.exp = currentExp;
    student.character.gold = currentGold;

    DataService.saveStudentData(student);

    return {
      student,
      leveledUp,
      oldLevel,
      newLevel,
      newSkillsUnlocked,
    };
  }

  /**
   * Complete a stage, grant Monster and Stage Completion rewards
   */
  public static completeStageReward(studentId: string, stageId: number): {
    monster: MathMonster | null;
    bonusExp: number;
    bonusGold: number;
  } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { monster: null, bonusExp: 0, bonusGold: 0 };

    const monsterId = `monster_${stageId}`;
    let monster: MathMonster | null = null;

    if (!student.character.mathMonsters.includes(monsterId)) {
      student.character.mathMonsters.push(monsterId);
      monster = MATH_MONSTERS.find((m) => m.id === monsterId) || null;
    }

    const bonusExp = 80;
    const bonusGold = 50;

    GameService.applyRewards(studentId, bonusExp, bonusGold);

    return {
      monster,
      bonusExp,
      bonusGold,
    };
  }

  /**
   * Buy item from shop with Gold deduction and inventory append
   */
  public static buyItem(studentId: string, itemId: string): { success: boolean; message: string; student?: StudentData } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { success: false, message: '학생 정보를 찾을 수 없습니다.' };

    const item = GAME_ITEMS.find((i) => i.id === itemId);
    if (!item) return { success: false, message: '존재하지 않는 아이템입니다.' };

    if (student.character.inventory.includes(itemId)) {
      return { success: false, message: '이미 소유하고 있는 아이템입니다.' };
    }

    if (item.jobRequired && item.jobRequired !== 'all' && item.jobRequired !== student.character.job) {
      return { success: false, message: `이 아이템은 ${item.jobRequired === 'warrior' ? '전사' : item.jobRequired === 'wizard' ? '마법사' : item.jobRequired === 'healer' ? '힐러' : '탐험가'} 전용입니다.` };
    }

    if (item.isRare) {
      return { success: false, message: '희귀 아이템은 특별 업적이나 선생님의 보상으로만 획득할 수 있습니다.' };
    }

    if (student.character.gold < item.price) {
      return { success: false, message: `Gold가 부족합니다! (필요: ${item.price} G, 보유: ${student.character.gold} G)` };
    }

    // Deduct gold & add to inventory
    student.character.gold -= item.price;
    student.character.inventory.push(itemId);
    DataService.saveStudentData(student);

    return { success: true, message: `[${item.name}] 구매 완료! 인벤토리에 추가되었습니다.`, student };
  }

  /**
   * Equip or unequip item
   */
  public static toggleEquipItem(studentId: string, itemId: string): { success: boolean; message: string; student?: StudentData } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { success: false, message: '학생 정보를 찾을 수 없습니다.' };

    const item = GAME_ITEMS.find((i) => i.id === itemId);
    if (!item) return { success: false, message: '아이템을 찾을 수 없습니다.' };

    if (!student.character.inventory.includes(itemId)) {
      return { success: false, message: '보유하지 않은 아이템입니다.' };
    }

    const cat = item.category;
    const currentEquipped = (student.character.equipment as any)[cat];

    if (currentEquipped === itemId) {
      // Unequip
      (student.character.equipment as any)[cat] = null;
      DataService.saveStudentData(student);
      return { success: true, message: `[${item.name}] 장착을 해제했습니다.`, student };
    } else {
      // Equip
      (student.character.equipment as any)[cat] = itemId;
      DataService.saveStudentData(student);
      return { success: true, message: `[${item.name}] 장착 완료!`, student };
    }
  }

  /**
   * Teacher Immediate Reward
   */
  public static grantTeacherReward(
    studentId: string,
    rewardTypeOrOptions:
      | 'sticker'
      | 'exp50'
      | 'gold50'
      | 'special_item'
      | 'special_title'
      | { title?: string; bonusGold?: number; specialItemId?: string; bonusExp?: number },
    customPayload?: string
  ): { success: boolean; message: string; student?: StudentData } {
    const student = DataService.getStudentData(studentId);
    if (!student) return { success: false, message: '학생을 찾을 수 없습니다.' };

    if (typeof rewardTypeOrOptions === 'object') {
      const { title, bonusGold = 100, specialItemId, bonusExp = 50 } = rewardTypeOrOptions;
      if (title && !student.character.titles.includes(title)) {
        student.character.titles.push(title);
        student.character.selectedTitle = title;
      }
      if (bonusGold > 0) {
        student.character.gold += bonusGold;
      }
      if (specialItemId && !student.character.inventory.includes(specialItemId)) {
        student.character.inventory.push(specialItemId);
      }
      if (bonusExp > 0) {
        student.character.exp += bonusExp;
      }
      DataService.saveStudentData(student);
      return {
        success: true,
        message: `선생님의 특별 보상이 성공적으로 지급되었습니다!`,
        student,
      };
    }

    const rewardType = rewardTypeOrOptions;

    if (rewardType === 'sticker') {
      const stickerTitle = customPayload || '선생님의 참 잘했어요 스티커';
      if (!student.character.titles.includes(stickerTitle)) {
        student.character.titles.push(stickerTitle);
      }
      student.character.gold += 30;
      student.character.exp += 30;
      DataService.saveStudentData(student);
      return { success: true, message: `칭찬 스티커와 보너스 30 EXP/Gold가 지급되었습니다!`, student };
    }

    if (rewardType === 'exp50') {
      const res = GameService.applyRewards(studentId, 50, 0);
      return { success: true, message: `+50 EXP가 즉시 지급되었습니다!`, student: res.student };
    }

    if (rewardType === 'gold50') {
      student.character.gold += 50;
      DataService.saveStudentData(student);
      return { success: true, message: `+50 Gold가 즉시 지급되었습니다!`, student };
    }

    if (rewardType === 'special_item') {
      const itemId = customPayload || 'legend_tome_supreme';
      if (!student.character.inventory.includes(itemId)) {
        student.character.inventory.push(itemId);
      }
      DataService.saveStudentData(student);
      return { success: true, message: `특별 아이템이 인벤토리에 지급되었습니다!`, student };
    }

    if (rewardType === 'special_title') {
      const title = customPayload || '곱셈의 전설';
      if (!student.character.titles.includes(title)) {
        student.character.titles.push(title);
      }
      student.character.selectedTitle = title;
      DataService.saveStudentData(student);
      return { success: true, message: `특별 칭호 [${title}]가 수여되었습니다!`, student };
    }

    return { success: false, message: '지원되지 않는 보상 유형입니다.' };
  }
}
