import { Question, StageConfig, QuestionType } from '../types';

export const STAGE_CONFIGS: StageConfig[] = [
  {
    id: 1,
    title: '1차시: 단원 도입 및 몇십×몇',
    subtitle: '곱셈구구 복습과 묶어 세기',
    areaName: '시작의 마을',
    description: '20×3, 40×2처럼 몇십에 몇을 곱하는 원리와 묶어 세기를 복습합니다.',
    monsterName: '곱셈 씨앗몬',
    badgeIcon: '🌱',
    bgGradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 2,
    title: '2차시: (세 자리 수)×(한 자리 수) (올림 없음)',
    subtitle: '수 모형 분해 및 기본 자릿값 계산',
    areaName: '계산 평원',
    description: '213×3처럼 각 자리의 수를 곱하여 자릿값대로 더하는 원리를 배웁니다.',
    monsterName: '척척 계산몬',
    badgeIcon: '🤖',
    bgGradient: 'from-sky-500 to-blue-700',
    requiredPrevStage: 1,
  },
  {
    id: 3,
    title: '3차시: (세 자리 수)×(한 자리 수) (일의 자리 올림)',
    subtitle: '일의 자리 십 모형 변환 및 올림수 처리',
    areaName: '올림 숲',
    description: '124×3처럼 일의 자리 곱이 10 이상일 때 십의 자리로 올리는 방법을 익힙니다.',
    monsterName: '올림 불꽃몬',
    badgeIcon: '🔥',
    bgGradient: 'from-amber-500 to-orange-700',
    requiredPrevStage: 2,
  },
  {
    id: 4,
    title: '4차시: (세 자리 수)×(한 자리 수) (십·백의 자리 올림)',
    subtitle: '연속 올림 및 0이 포함된 자릿값 정렬',
    areaName: '올림 산맥',
    description: '358×4처럼 십의 자리와 백의 자리에서 연속으로 올림이 일어나는 곱셈을 정복합니다.',
    monsterName: '올림 폭풍몬',
    badgeIcon: '🌪️',
    bgGradient: 'from-cyan-600 to-indigo-800',
    requiredPrevStage: 3,
  },
  {
    id: 5,
    title: '5차시: (몇십)×(몇십), (몇십몇)×(몇십)',
    subtitle: '0의 규칙성 및 자릿값 확장 원리',
    areaName: '십의자리 사막',
    description: '30×40 = 1200처럼 0의 개수와 10배, 100배 확장의 규칙을 탐구합니다.',
    monsterName: '십의자리몬',
    badgeIcon: '⚡',
    bgGradient: 'from-yellow-500 to-amber-700',
    requiredPrevStage: 4,
  },
  {
    id: 6,
    title: '6차시: (두 자리 수)×(두 자리 수) (올림 없음)',
    subtitle: '부분곱(모형 분할) 덧셈 원리',
    areaName: '곱셈 계곡',
    description: '23×12를 23×2와 23×10으로 나누어 계산하는 부분곱의 원리를 배웁니다.',
    monsterName: '곱셈 기사몬',
    badgeIcon: '🛡️',
    bgGradient: 'from-lime-500 to-emerald-700',
    requiredPrevStage: 5,
  },
  {
    id: 7,
    title: '7차시: (두 자리 수)×(두 자리 수) (올림 1회)',
    subtitle: '세로셈 격자 및 올림 표기법',
    areaName: '두자리 성채',
    description: '34×26처럼 올림이 있는 두 자리 수 곱셈의 세로셈 정렬과 정확한 계산을 연습합니다.',
    monsterName: '두자리 배틀몬',
    badgeIcon: '🥊',
    bgGradient: 'from-rose-500 to-red-700',
    requiredPrevStage: 6,
  },
  {
    id: 8,
    title: '8차시: (두 자리 수)×(두 자리 수) (올림 여러 번)',
    subtitle: '연속 올림수 관리 및 단계별 부분곱 합산',
    areaName: '곱셈 화산',
    description: '57×48처럼 여러 번 올림이 생기는 고난도 두 자리 수 곱셈을 마스터합니다.',
    monsterName: '곱셈 드래곤',
    badgeIcon: '🐉',
    bgGradient: 'from-red-600 to-purple-900',
    requiredPrevStage: 7,
  },
  {
    id: 9,
    title: '9차시: 곱셈의 어림 & 실생활 문장제',
    subtitle: '놀이공원, 과수원, 선물 포장 등 실생활 문해력',
    areaName: '어림 전망대',
    description: '실생활 문제 상황을 읽고 곱셈식을 세우며, 백의 자리로 어림해보는 감각을 기릅니다.',
    monsterName: '어림 탐험몬',
    badgeIcon: '🧭',
    bgGradient: 'from-teal-500 to-blue-800',
    requiredPrevStage: 8,
  },
  {
    id: 10,
    title: '10차시: 곱셈 규칙 찾기 & 숫자 카드 퍼즐',
    subtitle: '가장 큰/작은 곱 만들기 및 추론형 사고력',
    areaName: '해결의 미궁',
    description: '숫자 카드를 배열하여 가장 큰 곱을 만드는 전략적 수학 추론 문제를 해결합니다.',
    monsterName: '해결사몬',
    badgeIcon: '🧙‍♀️',
    bgGradient: 'from-violet-600 to-purple-800',
    requiredPrevStage: 9,
  },
  {
    id: 11,
    title: '11차시: 스피드 연산 & 어림셈 챌린지',
    subtitle: '신속 정확한 퀵 연산 및 순발력 대결',
    areaName: '스피드 경기장',
    description: '제한 시간 내에 정확하게 계산하고 곱의 범위를 판별하는 스피드 대결입니다.',
    monsterName: '스피드몬',
    badgeIcon: '🐆',
    bgGradient: 'from-amber-400 to-red-600',
    requiredPrevStage: 10,
  },
  {
    id: 12,
    title: '12차시: 단원 마무리 마스터 종합 평가',
    subtitle: '1~11차시 총정리 및 마스터 최종 승급',
    areaName: '곱셈 마왕성',
    description: '1단원 곱셈의 모든 유형을 종합 평가하여 최종 곱셈 마스터로 승급합니다!',
    monsterName: '곱셈 마스터몬',
    badgeIcon: '👑',
    bgGradient: 'from-indigo-600 to-pink-600',
    requiredPrevStage: 11,
  },
];

export class LearningService {
  /**
   * 15 static questions per stage pool (180 questions total base)
   */
  private static readonly STAGE_QUESTION_BANK: Record<number, Question[]> = {
    1: [
      { id: '1_1', stageId: 1, type: 'basic', questionText: '20 × 3 = ?', multiplicand: 20, multiplier: 3, correctAnswer: 60, hint1: '2 × 3에 0을 하나 붙여보세요.', hint2: '20이 3개면 20 + 20 + 20입니다.', hint3: '2 × 3 = 6이므로 20 × 3 = 60입니다.' },
      { id: '1_2', stageId: 1, type: 'basic', questionText: '30 × 4 = ?', multiplicand: 30, multiplier: 4, correctAnswer: 120, hint1: '3 × 4를 먼저 계산해보세요.', hint2: '3 × 4 = 12의 뒤에 0을 1개 붙입니다.', hint3: '30을 4번 더하면 120이 됩니다.' },
      { id: '1_3', stageId: 1, type: 'basic', questionText: '50 × 6 = ?', multiplicand: 50, multiplier: 6, correctAnswer: 300, hint1: '5 × 6 = 30입니다. 뒤에 0을 붙이면?', hint2: '50이 6개면 50 × 6 = 300입니다.', hint3: '5 × 6 = 30 뒤에 0을 붙여 300이 됩니다.' },
      { id: '1_4', stageId: 1, type: 'basic', questionText: '40 × 5 = ?', multiplicand: 40, multiplier: 5, correctAnswer: 200, hint1: '4 × 5의 결과에 0을 붙여보세요.', hint2: '4 × 5 = 20이므로 뒤에 0을 붙이면 200입니다.', hint3: '40이 5묶음이면 200입니다.' },
      { id: '1_5', stageId: 1, type: 'basic', questionText: '70 × 3 = ?', multiplicand: 70, multiplier: 3, correctAnswer: 210, hint1: '7 × 3 = 21을 이용해보세요.', hint2: '70이 3개면 210입니다.', hint3: '70 × 3 = 210입니다.' },
      { id: '1_6', stageId: 1, type: 'basic', questionText: '80 × 4 = ?', multiplicand: 80, multiplier: 4, correctAnswer: 320, hint1: '8 × 4 = 32입니다.', hint2: '80의 4배는 320입니다.', hint3: '80 × 4 = 320입니다.' },
      { id: '1_7', stageId: 1, type: 'basic', questionText: '60 × 7 = ?', multiplicand: 60, multiplier: 7, correctAnswer: 420, hint1: '6 × 7 = 42입니다.', hint2: '60이 7개면 420입니다.', hint3: '60 × 7 = 420입니다.' },
      { id: '1_8', stageId: 1, type: 'basic', questionText: '90 × 2 = ?', multiplicand: 90, multiplier: 2, correctAnswer: 180, hint1: '9 × 2 = 18에 0을 붙여보세요.', hint2: '90 + 90 = 180입니다.', hint3: '90 × 2 = 180입니다.' },
      { id: '1_9', stageId: 1, type: 'application', isWordProblem: true, questionText: '사탕이 한 봉지에 30개씩 들어있습니다. 5봉지에 든 사탕은 모두 몇 개일까요?', multiplicand: 30, multiplier: 5, correctAnswer: 150, hint1: '30개씩 5묶음이므로 30 × 5 식을 세워보세요.', hint2: '3 × 5 = 15이므로 뒤에 0을 붙입니다.', hint3: '30 × 5 = 150개입니다.' },
      { id: '1_10', stageId: 1, type: 'application', isWordProblem: true, questionText: '연필 한 타(12자루)가 아니라 색연필 세트 40자루씩 3상자가 있습니다. 색연필은 모두 몇 자루인가요?', multiplicand: 40, multiplier: 3, correctAnswer: 120, hint1: '40 × 3을 계산해보세요.', hint2: '4 × 3 = 12에 0을 하나 붙입니다.', hint3: '40 × 3 = 120자루입니다.' },
      { id: '1_11', stageId: 1, type: 'advanced', questionText: '□ 안에 알맞은 수는? □ × 6 = 240', multiplicand: 40, multiplier: 6, correctAnswer: 40, hint1: '□ × 6 = 24이 되는 수를 먼저 찾고 0을 붙여보세요.', hint2: '4 × 6 = 24이므로 40 × 6 = 240입니다.', hint3: '정답은 40입니다.' },
      { id: '1_12', stageId: 1, type: 'advanced', questionText: '70 × □ = 560에서 □에 들어갈 수는?', multiplicand: 70, multiplier: 8, correctAnswer: 8, hint1: '7의 몇 배가 56인지 구구단을 떠올려보세요.', hint2: '7 × 8 = 56입니다.', hint3: '70 × 8 = 560이므로 정답은 8입니다.' },
      { id: '1_13', stageId: 1, type: 'challenge', questionText: '50 × 8의 값은 40 × 9의 값보다 얼마나 더 큰가요?', multiplicand: 50, multiplier: 8, correctAnswer: 40, hint1: '50 × 8과 40 × 9를 각각 먼저 계산해보세요.', hint2: '50 × 8 = 400이고, 40 × 9 = 360입니다. 두 수의 차는?', hint3: '400 - 360 = 40입니다.' },
      { id: '1_14', stageId: 1, type: 'speed', questionText: '80 × 5 = ?', multiplicand: 80, multiplier: 5, correctAnswer: 400, hint1: '8 × 5 = 40에 0을 1개 더 붙입니다.', hint2: '80 × 5 = 400입니다.', hint3: '400입니다.' },
      { id: '1_15', stageId: 1, type: 'problem_making', questionText: '한 상자에 90개씩 든 구슬이 4상자 있습니다. 총 구슬의 수는?', multiplicand: 90, multiplier: 4, correctAnswer: 360, hint1: '90 × 4를 계산하세요.', hint2: '9 × 4 = 36이므로 360입니다.', hint3: '360개입니다.' },
    ],
    2: [
      { id: '2_1', stageId: 2, type: 'basic', questionText: '123 × 2 = ?', multiplicand: 123, multiplier: 2, correctAnswer: 246, hint1: '백의 자리 100×2, 십의 자리 20×2, 일의 자리 3×2를 각각 구해 더하세요.', hint2: '200 + 40 + 6 = 246입니다.', hint3: '123 × 2 = 246입니다.' },
      { id: '2_2', stageId: 2, type: 'basic', questionText: '213 × 3 = ?', multiplicand: 213, multiplier: 3, correctAnswer: 639, hint1: '3×3=9, 10×3=30, 200×3=600입니다.', hint2: '600 + 30 + 9 = 639입니다.', hint3: '213 × 3 = 639입니다.' },
      { id: '2_3', stageId: 2, type: 'basic', questionText: '324 × 2 = ?', multiplicand: 324, multiplier: 2, correctAnswer: 648, hint1: '일의 자리부터: 4×2=8, 2×2=4, 3×2=6입니다.', hint2: '각 자리 계산 결과를 차례대로 쓰면 648입니다.', hint3: '324 × 2 = 648입니다.' },
      { id: '2_4', stageId: 2, type: 'basic', questionText: '412 × 2 = ?', multiplicand: 412, multiplier: 2, correctAnswer: 824, hint1: '400×2=800, 10×2=20, 2×2=4입니다.', hint2: '800 + 20 + 4 = 824입니다.', hint3: '824입니다.' },
      { id: '2_5', stageId: 2, type: 'basic', questionText: '231 × 3 = ?', multiplicand: 231, multiplier: 3, correctAnswer: 693, hint1: '1×3=3, 3×3=9, 2×3=6입니다.', hint2: '백의 자리 6, 십의 자리 9, 일의 자리 3입니다.', hint3: '693입니다.' },
      { id: '2_6', stageId: 2, type: 'basic', questionText: '111 × 7 = ?', multiplicand: 111, multiplier: 7, correctAnswer: 777, hint1: '각 자리가 모두 1이므로 7을 곱하면 777이 됩니다.', hint2: '100×7 + 10×7 + 1×7 = 777입니다.', hint3: '777입니다.' },
      { id: '2_7', stageId: 2, type: 'basic', questionText: '312 × 3 = ?', multiplicand: 312, multiplier: 3, correctAnswer: 936, hint1: '2×3=6, 1×3=3, 3×3=9입니다.', hint2: '936이 됩니다.', hint3: '936입니다.' },
      { id: '2_8', stageId: 2, type: 'basic', questionText: '224 × 2 = ?', multiplicand: 224, multiplier: 2, correctAnswer: 448, hint1: '4×2=8, 2×2=4, 2×2=4입니다.', hint2: '448입니다.', hint3: '448입니다.' },
      { id: '2_9', stageId: 2, type: 'application', isWordProblem: true, questionText: '마을 도서관에 1개 층마다 책이 232권씩 꽂혀 있습니다. 3개 층에 있는 책은 모두 몇 권일까요?', multiplicand: 232, multiplier: 3, correctAnswer: 696, hint1: '232 × 3 식을 세워보세요.', hint2: '200×3 + 30×3 + 2×3 = 600 + 90 + 6입니다.', hint3: '696권입니다.' },
      { id: '2_10', stageId: 2, type: 'application', isWordProblem: true, questionText: '한 상자에 사과가 142개씩 들어있습니다. 2상자에 든 사과는 모두 몇 개인가요?', multiplicand: 142, multiplier: 2, correctAnswer: 284, hint1: '142 × 2를 계산하세요.', hint2: '100×2 + 40×2 + 2×2 = 284입니다.', hint3: '284개입니다.' },
      { id: '2_11', stageId: 2, type: 'advanced', questionText: '2□3 × 2 = 486일 때, □ 안에 알맞은 숫자는?', multiplicand: 243, multiplier: 2, correctAnswer: 4, hint1: '십의 자리 곱: □ × 2 = 8이 되는 수를 찾아보세요.', hint2: '4 × 2 = 8이므로 □는 4입니다.', hint3: '정답은 4입니다.' },
      { id: '2_12', stageId: 2, type: 'advanced', questionText: '132 × 3의 값과 221 × 2의 합은 얼마일까요?', multiplicand: 132, multiplier: 3, correctAnswer: 838, hint1: '132 × 3 = 396이고, 221 × 2 = 442입니다.', hint2: '396 + 442를 더해보세요.', hint3: '838입니다.' },
      { id: '2_13', stageId: 2, type: 'challenge', questionText: '세 자리 수 314에 어떤 한 자리 수를 곱했더니 628이 되었습니다. 곱한 수는?', multiplicand: 314, multiplier: 2, correctAnswer: 2, hint1: '314 × □ = 628입니다. 일의 자리 4 × □ = 8이 되는 수를 생각해보세요.', hint2: '314를 2배 하면 628이 됩니다.', hint3: '정답은 2입니다.' },
      { id: '2_14', stageId: 2, type: 'speed', questionText: '333 × 3 = ?', multiplicand: 333, multiplier: 3, correctAnswer: 999, hint1: '각 자리에 3을 곱하면 999입니다.', hint2: '999입니다.', hint3: '999입니다.' },
      { id: '2_15', stageId: 2, type: 'problem_making', questionText: '한 묶음에 121개씩 4묶음이 있습니다. 전체 개수는?', multiplicand: 121, multiplier: 4, correctAnswer: 484, hint1: '121 × 4를 계산하세요.', hint2: '100×4 + 20×4 + 1×4 = 484입니다.', hint3: '484개입니다.' },
    ],
    3: [
      { id: '3_1', stageId: 3, type: 'basic', questionText: '124 × 3 = ?', multiplicand: 124, multiplier: 3, correctAnswer: 372, hint1: '일의 자리 4×3=12이므로 2를 쓰고 십의 자리에 1을 올립니다.', hint2: '십의 자리 2×3=6에 올림수 1을 더해 7이 되고, 백의 자리는 1×3=3입니다.', hint3: '372입니다.' },
      { id: '3_2', stageId: 3, type: 'basic', questionText: '215 × 3 = ?', multiplicand: 215, multiplier: 3, correctAnswer: 645, hint1: '일의 자리: 5×3=15 (1 올림, 5 작성)', hint2: '십의 자리: 1×3=3 + 올림수 1 = 4, 백의 자리: 2×3=6', hint3: '645입니다.' },
      { id: '3_3', stageId: 3, type: 'basic', questionText: '316 × 2 = ?', multiplicand: 316, multiplier: 2, correctAnswer: 632, hint1: '6×2=12 (1 올림, 2 적기)', hint2: '십의 자리: 1×2+1=3, 백의 자리: 3×2=6', hint3: '632입니다.' },
      { id: '3_4', stageId: 3, type: 'basic', questionText: '118 × 4 = ?', multiplicand: 118, multiplier: 4, correctAnswer: 472, hint1: '8×4=32이므로 3을 십의 자리에 올립니다.', hint2: '십의 자리: 1×4+3=7, 백의 자리: 1×4=4', hint3: '472입니다.' },
      { id: '3_5', stageId: 3, type: 'basic', questionText: '237 × 2 = ?', multiplicand: 237, multiplier: 2, correctAnswer: 474, hint1: '7×2=14 (1 올림)', hint2: '3×2+1=7, 2×2=4', hint3: '474입니다.' },
      { id: '3_6', stageId: 3, type: 'basic', questionText: '145 × 2 = ?', multiplicand: 145, multiplier: 2, correctAnswer: 290, hint1: '5×2=10 (1 올림, 0 적기)', hint2: '4×2+1=9, 1×2=2', hint3: '290입니다.' },
      { id: '3_7', stageId: 3, type: 'basic', questionText: '419 × 2 = ?', multiplicand: 419, multiplier: 2, correctAnswer: 838, hint1: '9×2=18 (1 올림)', hint2: '1×2+1=3, 4×2=8', hint3: '838입니다.' },
      { id: '3_8', stageId: 3, type: 'basic', questionText: '126 × 3 = ?', multiplicand: 126, multiplier: 3, correctAnswer: 378, hint1: '6×3=18 (1 올림)', hint2: '2×3+1=7, 1×3=3', hint3: '378입니다.' },
      { id: '3_9', stageId: 3, type: 'application', isWordProblem: true, questionText: '꽃가게에 장미가 117송이씩 꽂힌 꽃바구니가 3개 있습니다. 장미는 모두 몇 송이일까요?', multiplicand: 117, multiplier: 3, correctAnswer: 351, hint1: '117 × 3 식을 세우세요.', hint2: '7×3=21 (2 올림), 1×3+2=5, 1×3=3', hint3: '351송이입니다.' },
      { id: '3_10', stageId: 3, type: 'application', isWordProblem: true, questionText: '체육관에 탁구공이 218개씩 4상자 있습니다. 탁구공은 총 몇 개인가요?', multiplicand: 218, multiplier: 4, correctAnswer: 872, hint1: '218 × 4를 계산합니다.', hint2: '8×4=32(3 올림), 1×4+3=7, 2×4=8', hint3: '872개입니다.' },
      { id: '3_11', stageId: 3, type: 'advanced', questionText: '12□ × 4 = 508일 때, □ 안에 들어갈 일의 자리 숫자는?', multiplicand: 127, multiplier: 4, correctAnswer: 7, hint1: '□ × 4의 일의 자리가 8이 되는 수 (2 또는 7)를 대입해보세요.', hint2: '122×4=488이고, 127×4=508입니다.', hint3: '정답은 7입니다.' },
      { id: '3_12', stageId: 3, type: 'advanced', questionText: '216 × 3과 135 × 2의 차는 얼마인가요?', multiplicand: 216, multiplier: 3, correctAnswer: 378, hint1: '216 × 3 = 648이고, 135 × 2 = 270입니다.', hint2: '648 - 270을 계산해보세요.', hint3: '378입니다.' },
      { id: '3_13', stageId: 3, type: 'challenge', questionText: '138 × 3의 계산 결과에서 각 자리 숫자의 합(백+십+일)은 얼마일까요?', multiplicand: 138, multiplier: 3, correctAnswer: 9, hint1: '먼저 138 × 3 = 414를 구하세요.', hint2: '4 + 1 + 4 = 9입니다.', hint3: '정답은 9입니다.' },
      { id: '3_14', stageId: 3, type: 'speed', questionText: '115 × 4 = ?', multiplicand: 115, multiplier: 4, correctAnswer: 460, hint1: '5×4=20(2 올림), 1×4+2=6, 1×4=4', hint2: '460입니다.', hint3: '460입니다.' },
      { id: '3_15', stageId: 3, type: 'problem_making', questionText: '어린이 316명이 3권씩 책을 읽었습니다. 읽은 책의 총 권수는?', multiplicand: 316, multiplier: 3, correctAnswer: 948, hint1: '316 × 3을 계산하세요.', hint2: '6×3=18(1올림), 1×3+1=4, 3×3=9', hint3: '948권입니다.' },
    ],
    4: [
      { id: '4_1', stageId: 4, type: 'basic', questionText: '243 × 4 = ?', multiplicand: 243, multiplier: 4, correctAnswer: 972, hint1: '일의 자리: 3×4=12(1올림), 십의 자리: 4×4+1=17(1올림), 백의 자리: 2×4+1=9', hint2: '차례대로 972가 됩니다.', hint3: '972입니다.' },
      { id: '4_2', stageId: 4, type: 'basic', questionText: '358 × 3 = ?', multiplicand: 358, multiplier: 3, correctAnswer: 1074, hint1: '8×3=24(2올림), 5×3+2=17(1올림), 3×3+1=10', hint2: '1074입니다.', hint3: '1074입니다.' },
      { id: '4_3', stageId: 4, type: 'basic', questionText: '476 × 2 = ?', multiplicand: 476, multiplier: 2, correctAnswer: 952, hint1: '6×2=12(1올림), 7×2+1=15(1올림), 4×2+1=9', hint2: '952입니다.', hint3: '952입니다.' },
      { id: '4_4', stageId: 4, type: 'basic', questionText: '185 × 5 = ?', multiplicand: 185, multiplier: 5, correctAnswer: 925, hint1: '5×5=25(2올림), 8×5+2=42(4올림), 1×5+4=9', hint2: '925입니다.', hint3: '925입니다.' },
      { id: '4_5', stageId: 4, type: 'basic', questionText: '509 × 3 = ?', multiplicand: 509, multiplier: 3, correctAnswer: 1527, hint1: '9×3=27(2올림), 0×3+2=2, 5×3=15', hint2: '1527입니다.', hint3: '1527입니다.' },
      { id: '4_6', stageId: 4, type: 'basic', questionText: '267 × 4 = ?', multiplicand: 267, multiplier: 4, correctAnswer: 1068, hint1: '7×4=28(2올림), 6×4+2=26(2올림), 2×4+2=10', hint2: '1068입니다.', hint3: '1068입니다.' },
      { id: '4_7', stageId: 4, type: 'basic', questionText: '384 × 3 = ?', multiplicand: 384, multiplier: 3, correctAnswer: 1152, hint1: '4×3=12(1올림), 8×3+1=25(2올림), 3×3+2=11', hint2: '1152입니다.', hint3: '1152입니다.' },
      { id: '4_8', stageId: 4, type: 'basic', questionText: '645 × 2 = ?', multiplicand: 645, multiplier: 2, correctAnswer: 1290, hint1: '5×2=10(1올림), 4×2+1=9, 6×2=12', hint2: '1290입니다.', hint3: '1290입니다.' },
      { id: '4_9', stageId: 4, type: 'application', isWordProblem: true, questionText: '과수원에서 하루에 사과를 275개씩 수확합니다. 4일 동안 수확한 사과는 모두 몇 개인가요?', multiplicand: 275, multiplier: 4, correctAnswer: 1100, hint1: '275 × 4 식을 세우세요.', hint2: '5×4=20, 7×4+2=30, 2×4+3=11', hint3: '1100개입니다.' },
      { id: '4_10', stageId: 4, type: 'application', isWordProblem: true, questionText: '선물 상자 한 개를 포장하는 데 리본 360cm가 필요합니다. 5개를 포장하려면 몇 cm가 필요할까요?', multiplicand: 360, multiplier: 5, correctAnswer: 1800, hint1: '360 × 5를 계산하세요.', hint2: '0×5=0, 6×5=30(3올림), 3×5+3=18', hint3: '1800cm입니다.' },
      { id: '4_11', stageId: 4, type: 'advanced', questionText: '487 × 3 = 1461입니다. 그렇다면 487 × 4는 얼마일까요?', multiplicand: 487, multiplier: 4, correctAnswer: 1948, hint1: '1461에 487을 한 번 더 더하거나 487×4를 직접 계산하세요.', hint2: '487 × 4 = 1948입니다.', hint3: '1948입니다.' },
      { id: '4_12', stageId: 4, type: 'advanced', questionText: '375 × □ = 1500일 때, □에 들어갈 수는?', multiplicand: 375, multiplier: 4, correctAnswer: 4, hint1: '375를 2배하면 750, 4배하면 1500입니다.', hint2: '□는 4입니다.', hint3: '4입니다.' },
      { id: '4_13', stageId: 4, type: 'challenge', questionText: '세 자리 수 (4, 8, 2)와 한 자리 수 3으로 곱셈식을 만들 때, 가장 큰 곱은 얼마일까요? (482×3, 842×3 등 비교)', multiplicand: 842, multiplier: 3, correctAnswer: 2526, hint1: '가장 큰 수를 만들기 위해 백의 자리에 가장 큰 숫자 8을 놓아 842 × 3을 계산합니다.', hint2: '842 × 3 = 2526입니다.', hint3: '2526입니다.' },
      { id: '4_14', stageId: 4, type: 'speed', questionText: '450 × 4 = ?', multiplicand: 450, multiplier: 4, correctAnswer: 1800, hint1: '45 × 4 = 180 뒤에 0을 붙입니다.', hint2: '1800입니다.', hint3: '1800입니다.' },
      { id: '4_15', stageId: 4, type: 'problem_making', questionText: '한 세트에 285원인 사탕을 5세트 샀습니다. 낸 돈은 얼마일까요?', multiplicand: 285, multiplier: 5, correctAnswer: 1425, hint1: '285 × 5를 계산합니다.', hint2: '5×5=25, 8×5+2=42, 2×5+4=14', hint3: '1425원입니다.' },
    ],
    5: [
      { id: '5_1', stageId: 5, type: 'basic', questionText: '30 × 40 = ?', multiplicand: 30, multiplier: 40, correctAnswer: 1200, hint1: '3 × 4 = 12 뒤에 0을 2개 붙입니다.', hint2: '12 뒤에 00을 붙여 1200입니다.', hint3: '1200입니다.' },
      { id: '5_2', stageId: 5, type: 'basic', questionText: '50 × 60 = ?', multiplicand: 50, multiplier: 60, correctAnswer: 3000, hint1: '5 × 6 = 30 뒤에 0을 2개 더 붙여야 합니다.', hint2: '30 뒤에 00을 붙이면 3000입니다.', hint3: '3000입니다.' },
      { id: '5_3', stageId: 5, type: 'basic', questionText: '24 × 20 = ?', multiplicand: 24, multiplier: 20, correctAnswer: 480, hint1: '24 × 2 = 48을 먼저 구하고 뒤에 0을 1개 붙입니다.', hint2: '48 뒤에 0을 붙여 480입니다.', hint3: '480입니다.' },
      { id: '5_4', stageId: 5, type: 'basic', questionText: '35 × 30 = ?', multiplicand: 35, multiplier: 30, correctAnswer: 1050, hint1: '35 × 3 = 105에 0을 1개 붙입니다.', hint2: '1050입니다.', hint3: '1050입니다.' },
      { id: '5_5', stageId: 5, type: 'basic', questionText: '70 × 80 = ?', multiplicand: 70, multiplier: 80, correctAnswer: 5600, hint1: '7 × 8 = 56에 0을 2개 붙입니다.', hint2: '5600입니다.', hint3: '5600입니다.' },
      { id: '5_6', stageId: 5, type: 'basic', questionText: '42 × 40 = ?', multiplicand: 42, multiplier: 40, correctAnswer: 1680, hint1: '42 × 4 = 168 뒤에 0을 1개 붙입니다.', hint2: '1680입니다.', hint3: '1680입니다.' },
      { id: '5_7', stageId: 5, type: 'basic', questionText: '80 × 90 = ?', multiplicand: 80, multiplier: 90, correctAnswer: 7200, hint1: '8 × 9 = 72에 00을 붙입니다.', hint2: '7200입니다.', hint3: '7200입니다.' },
      { id: '5_8', stageId: 5, type: 'basic', questionText: '63 × 30 = ?', multiplicand: 63, multiplier: 30, correctAnswer: 1890, hint1: '63 × 3 = 189에 0을 1개 붙입니다.', hint2: '1890입니다.', hint3: '1890입니다.' },
      { id: '5_9', stageId: 5, type: 'application', isWordProblem: true, questionText: '놀이공원 입장료가 1인당 40코인입니다. 50명이 입장하면 필요한 코인은 모두 얼마일까요?', multiplicand: 40, multiplier: 50, correctAnswer: 2000, hint1: '40 × 50 식을 세우세요.', hint2: '4 × 5 = 20 뒤에 0을 2개 붙입니다.', hint3: '2000코인입니다.' },
      { id: '5_10', stageId: 5, type: 'application', isWordProblem: true, questionText: '한 줄에 25명씩 40줄로 운동장에 서 있습니다. 학생은 모두 몇 명인가요?', multiplicand: 25, multiplier: 40, correctAnswer: 1000, hint1: '25 × 40을 계산합니다.', hint2: '25 × 4 = 100에 0을 붙이면 1000입니다.', hint3: '1000명입니다.' },
      { id: '5_11', stageId: 5, type: 'advanced', questionText: '□0 × 60 = 4200에서 □ 안에 들어갈 수는?', multiplicand: 70, multiplier: 60, correctAnswer: 7, hint1: '□ × 6 = 42가 되는 숫자를 찾아보세요.', hint2: '7 × 6 = 42이므로 □는 7입니다.', hint3: '7입니다.' },
      { id: '5_12', stageId: 5, type: 'advanced', questionText: '40 × 50의 값과 20 × 90의 값의 합은 얼마인가요?', multiplicand: 40, multiplier: 50, correctAnswer: 3800, hint1: '40 × 50 = 2000이고, 20 × 90 = 1800입니다.', hint2: '2000 + 1800 = 3800입니다.', hint3: '3800입니다.' },
      { id: '5_13', stageId: 5, type: 'challenge', questionText: '50 × 80은 40 × 50의 몇 배일까요?', multiplicand: 50, multiplier: 80, correctAnswer: 2, hint1: '50 × 80 = 4000이고, 40 × 50 = 2000입니다.', hint2: '4000 ÷ 2000 = 2배입니다.', hint3: '2배입니다.' },
      { id: '5_14', stageId: 5, type: 'speed', questionText: '90 × 40 = ?', multiplicand: 90, multiplier: 40, correctAnswer: 3600, hint1: '9 × 4 = 36 뒤에 00', hint2: '3600입니다.', hint3: '3600입니다.' },
      { id: '5_15', stageId: 5, type: 'problem_making', questionText: '한 상자에 45개씩 20상자가 들어있습니다. 총 개수는?', multiplicand: 45, multiplier: 20, correctAnswer: 900, hint1: '45 × 20을 계산하세요.', hint2: '45 × 2 = 90 뒤에 0을 붙이면 900입니다.', hint3: '900개입니다.' },
    ],
    6: [
      { id: '6_1', stageId: 6, type: 'basic', questionText: '23 × 12 = ?', multiplicand: 23, multiplier: 12, correctAnswer: 276, hint1: '23 × 2 = 46과 23 × 10 = 230을 더합니다.', hint2: '46 + 230 = 276입니다.', hint3: '276입니다.' },
      { id: '6_2', stageId: 6, type: 'basic', questionText: '31 × 23 = ?', multiplicand: 31, multiplier: 23, correctAnswer: 713, hint1: '31 × 3 = 93, 31 × 20 = 620입니다.', hint2: '93 + 620 = 713입니다.', hint3: '713입니다.' },
      { id: '6_3', stageId: 6, type: 'basic', questionText: '42 × 21 = ?', multiplicand: 42, multiplier: 21, correctAnswer: 882, hint1: '42 × 1 = 42, 42 × 20 = 840입니다.', hint2: '42 + 840 = 882입니다.', hint3: '882입니다.' },
      { id: '6_4', stageId: 6, type: 'basic', questionText: '14 × 22 = ?', multiplicand: 14, multiplier: 22, correctAnswer: 308, hint1: '14 × 2 = 28, 14 × 20 = 280입니다.', hint2: '28 + 280 = 308입니다.', hint3: '308입니다.' },
      { id: '6_5', stageId: 6, type: 'basic', questionText: '21 × 32 = ?', multiplicand: 21, multiplier: 32, correctAnswer: 672, hint1: '21 × 2 = 42, 21 × 30 = 630입니다.', hint2: '42 + 630 = 672입니다.', hint3: '672입니다.' },
      { id: '6_6', stageId: 6, type: 'basic', questionText: '33 × 31 = ?', multiplicand: 33, multiplier: 31, correctAnswer: 1023, hint1: '33 × 1 = 33, 33 × 30 = 990입니다.', hint2: '33 + 990 = 1023입니다.', hint3: '1023입니다.' },
      { id: '6_7', stageId: 6, type: 'basic', questionText: '52 × 11 = ?', multiplicand: 52, multiplier: 11, correctAnswer: 572, hint1: '52 × 1 = 52, 52 × 10 = 520입니다.', hint2: '52 + 520 = 572입니다.', hint3: '572입니다.' },
      { id: '6_8', stageId: 6, type: 'basic', questionText: '24 × 12 = ?', multiplicand: 24, multiplier: 12, correctAnswer: 288, hint1: '24 × 2 = 48, 24 × 10 = 240입니다.', hint2: '48 + 240 = 288입니다.', hint3: '288입니다.' },
      { id: '6_9', stageId: 6, type: 'application', isWordProblem: true, questionText: '체육 시간에 22명씩 13모둠이 줄을 섰습니다. 전체 학생 수는 몇 명일까요?', multiplicand: 22, multiplier: 13, correctAnswer: 286, hint1: '22 × 13 식을 세우세요.', hint2: '22 × 3 = 66, 22 × 10 = 220을 더하면 286입니다.', hint3: '286명입니다.' },
      { id: '6_10', stageId: 6, type: 'application', isWordProblem: true, questionText: '책꽂이 한 칸에 책 32권씩 21칸에 꽂혀 있습니다. 책은 총 몇 권인가요?', multiplicand: 32, multiplier: 21, correctAnswer: 672, hint1: '32 × 21을 계산합니다.', hint2: '32 + 640 = 672입니다.', hint3: '672권입니다.' },
      { id: '6_11', stageId: 6, type: 'advanced', questionText: '23 × 13 = 299입니다. 그렇다면 23 × 14는 얼마일까요?', multiplicand: 23, multiplier: 14, correctAnswer: 322, hint1: '299에 23을 한 번 더 더하면 됩니다.', hint2: '299 + 23 = 322입니다.', hint3: '322입니다.' },
      { id: '6_12', stageId: 6, type: 'advanced', questionText: '12 × □ = 276일 때, □ 안에 들어갈 두 자리 수는?', multiplicand: 12, multiplier: 23, correctAnswer: 23, hint1: '12 × 20 = 240이고 남은 수는 36입니다. 12 × 3 = 36이므로 20 + 3 = 23입니다.', hint2: '정답은 23입니다.', hint3: '23입니다.' },
      { id: '6_13', stageId: 6, type: 'challenge', questionText: '31 × 22의 계산 결과와 21 × 32의 계산 결과의 차는 얼마일까요?', multiplicand: 31, multiplier: 22, correctAnswer: 10, hint1: '31 × 22 = 682, 21 × 32 = 672입니다.', hint2: '682 - 672 = 10입니다.', hint3: '10입니다.' },
      { id: '6_14', stageId: 6, type: 'speed', questionText: '13 × 13 = ?', multiplicand: 13, multiplier: 13, correctAnswer: 169, hint1: '13 × 3 = 39, 13 × 10 = 130', hint2: '169입니다.', hint3: '169입니다.' },
      { id: '6_15', stageId: 6, type: 'problem_making', questionText: '한 반에 24명씩 12개 반이 있습니다. 전교생 수는?', multiplicand: 24, multiplier: 12, correctAnswer: 288, hint1: '24 × 12를 계산하세요.', hint2: '48 + 240 = 288입니다.', hint3: '288명입니다.' },
    ],
    7: [
      { id: '7_1', stageId: 7, type: 'basic', questionText: '34 × 26 = ?', multiplicand: 34, multiplier: 26, correctAnswer: 884, hint1: '34 × 6 = 204이고, 34 × 20 = 680입니다.', hint2: '204 + 680 = 884입니다.', hint3: '884입니다.' },
      { id: '7_2', stageId: 7, type: 'basic', questionText: '45 × 17 = ?', multiplicand: 45, multiplier: 17, correctAnswer: 765, hint1: '45 × 7 = 315, 45 × 10 = 450입니다.', hint2: '315 + 450 = 765입니다.', hint3: '765입니다.' },
      { id: '7_3', stageId: 7, type: 'basic', questionText: '28 × 32 = ?', multiplicand: 28, multiplier: 32, correctAnswer: 896, hint1: '28 × 2 = 56, 28 × 30 = 840입니다.', hint2: '56 + 840 = 896입니다.', hint3: '896입니다.' },
      { id: '7_4', stageId: 7, type: 'basic', questionText: '53 × 24 = ?', multiplicand: 53, multiplier: 24, correctAnswer: 1272, hint1: '53 × 4 = 212, 53 × 20 = 1060입니다.', hint2: '212 + 1060 = 1272입니다.', hint3: '1272입니다.' },
      { id: '7_5', stageId: 7, type: 'basic', questionText: '36 × 15 = ?', multiplicand: 36, multiplier: 15, correctAnswer: 540, hint1: '36 × 5 = 180, 36 × 10 = 360입니다.', hint2: '180 + 360 = 540입니다.', hint3: '540입니다.' },
      { id: '7_6', stageId: 7, type: 'basic', questionText: '62 × 27 = ?', multiplicand: 62, multiplier: 27, correctAnswer: 1674, hint1: '62 × 7 = 434, 62 × 20 = 1240입니다.', hint2: '434 + 1240 = 1674입니다.', hint3: '1674입니다.' },
      { id: '7_7', stageId: 7, type: 'basic', questionText: '47 × 18 = ?', multiplicand: 47, multiplier: 18, correctAnswer: 846, hint1: '47 × 8 = 376, 47 × 10 = 470입니다.', hint2: '376 + 470 = 846입니다.', hint3: '846입니다.' },
      { id: '7_8', stageId: 7, type: 'basic', questionText: '25 × 36 = ?', multiplicand: 25, multiplier: 36, correctAnswer: 900, hint1: '25 × 6 = 150, 25 × 30 = 750입니다.', hint2: '150 + 750 = 900입니다.', hint3: '900입니다.' },
      { id: '7_9', stageId: 9, type: 'application', isWordProblem: true, questionText: '과수원에서 귤을 한 상자에 38개씩 담았습니다. 25상자에 담긴 귤은 총 몇 개일까요?', multiplicand: 38, multiplier: 25, correctAnswer: 950, hint1: '38 × 25 식을 세우세요.', hint2: '38 × 5 = 190, 38 × 20 = 760을 더하면 950입니다.', hint3: '950개입니다.' },
      { id: '7_10', stageId: 7, type: 'application', isWordProblem: true, questionText: '영화관 한 관에 좌석이 46석씩 18개 열이 있습니다. 총 좌석 수는?', multiplicand: 46, multiplier: 18, correctAnswer: 828, hint1: '46 × 18을 계산합니다.', hint2: '46 × 8 = 368, 46 × 10 = 460을 더합니다.', hint3: '828석입니다.' },
      { id: '7_11', stageId: 7, type: 'advanced', questionText: '35 × 24 = 840입니다. 그렇다면 35 × 25는 얼마일까요?', multiplicand: 35, multiplier: 25, correctAnswer: 875, hint1: '840에 35를 더해보세요.', hint2: '840 + 35 = 875입니다.', hint3: '875입니다.' },
      { id: '7_12', stageId: 7, type: 'advanced', questionText: '28 × □ = 700일 때, □에 들어갈 두 자리 수는?', multiplicand: 28, multiplier: 25, correctAnswer: 25, hint1: '28 × 20 = 560이고 남은 140은 28 × 5입니다. 따라서 20+5 = 25입니다.', hint2: '25입니다.', hint3: '25입니다.' },
      { id: '7_13', stageId: 7, type: 'challenge', questionText: '두 자리 수 48과 16의 곱에서 백의 자리 숫자는 무엇일까요?', multiplicand: 48, multiplier: 16, correctAnswer: 7, hint1: '먼저 48 × 16 = 768을 구하세요.', hint2: '768의 백의 자리 숫자는 7입니다.', hint3: '7입니다.' },
      { id: '7_14', stageId: 7, type: 'speed', questionText: '25 × 24 = ?', multiplicand: 25, multiplier: 24, correctAnswer: 600, hint1: '25 × 4 = 100, 25 × 20 = 500', hint2: '600입니다.', hint3: '600입니다.' },
      { id: '7_15', stageId: 7, type: 'problem_making', questionText: '한 봉지에 34개씩 든 과자가 18봉지 있습니다. 과자는 모두 몇 개일까요?', multiplicand: 34, multiplier: 18, correctAnswer: 612, hint1: '34 × 18을 계산하세요.', hint2: '34 × 8 = 272, 34 × 10 = 340을 더하면 612입니다.', hint3: '612개입니다.' },
    ],
    8: [
      { id: '8_1', stageId: 8, type: 'basic', questionText: '57 × 48 = ?', multiplicand: 57, multiplier: 48, correctAnswer: 2736, hint1: '57 × 8 = 456이고, 57 × 40 = 2280입니다.', hint2: '456 + 2280 = 2736입니다.', hint3: '2736입니다.' },
      { id: '8_2', stageId: 8, type: 'basic', questionText: '68 × 39 = ?', multiplicand: 68, multiplier: 39, correctAnswer: 2652, hint1: '68 × 9 = 612, 68 × 30 = 2040입니다.', hint2: '612 + 2040 = 2652입니다.', hint3: '2652입니다.' },
      { id: '8_3', stageId: 8, type: 'basic', questionText: '74 × 56 = ?', multiplicand: 74, multiplier: 56, correctAnswer: 4144, hint1: '74 × 6 = 444, 74 × 50 = 3700입니다.', hint2: '444 + 3700 = 4144입니다.', hint3: '4144입니다.' },
      { id: '8_4', stageId: 8, type: 'basic', questionText: '86 × 47 = ?', multiplicand: 86, multiplier: 47, correctAnswer: 4042, hint1: '86 × 7 = 602, 86 × 40 = 3440입니다.', hint2: '602 + 3440 = 4042입니다.', hint3: '4042입니다.' },
      { id: '8_5', stageId: 8, type: 'basic', questionText: '49 × 78 = ?', multiplicand: 49, multiplier: 78, correctAnswer: 3822, hint1: '49 × 8 = 392, 49 × 70 = 3430입니다.', hint2: '392 + 3430 = 3822입니다.', hint3: '3822입니다.' },
      { id: '8_6', stageId: 8, type: 'basic', questionText: '93 × 65 = ?', multiplicand: 93, multiplier: 65, correctAnswer: 6045, hint1: '93 × 5 = 465, 93 × 60 = 5580입니다.', hint2: '465 + 5580 = 6045입니다.', hint3: '6045입니다.' },
      { id: '8_7', stageId: 8, type: 'basic', questionText: '77 × 88 = ?', multiplicand: 77, multiplier: 88, correctAnswer: 6776, hint1: '77 × 8 = 616, 77 × 80 = 6160입니다.', hint2: '616 + 6160 = 6776입니다.', hint3: '6776입니다.' },
      { id: '8_8', stageId: 8, type: 'basic', questionText: '58 × 69 = ?', multiplicand: 58, multiplier: 69, correctAnswer: 4002, hint1: '58 × 9 = 522, 58 × 60 = 3480입니다.', hint2: '522 + 3480 = 4002입니다.', hint3: '4002입니다.' },
      { id: '8_9', stageId: 8, type: 'application', isWordProblem: true, questionText: '비행기에 탑승객이 68명씩 45개 구역에 꽉 차 있습니다. 총 탑승객은 몇 명일까요?', multiplicand: 68, multiplier: 45, correctAnswer: 3060, hint1: '68 × 45 식을 세우세요.', hint2: '68 × 5 = 340, 68 × 40 = 2720을 합산합니다.', hint3: '3060명입니다.' },
      { id: '8_10', stageId: 8, type: 'application', isWordProblem: true, questionText: '공장에서 한 시간에 부품 85개씩 36시간 동안 기계를 가동했습니다. 생산된 부품은 총 몇 개일까요?', multiplicand: 85, multiplier: 36, correctAnswer: 3060, hint1: '85 × 36을 계산합니다.', hint2: '85 × 6 = 510, 85 × 30 = 2550을 더하면 3060입니다.', hint3: '3060개입니다.' },
      { id: '8_11', stageId: 8, type: 'advanced', questionText: '두 자리 수 64 × 58 = 3712입니다. 64 × 59의 값은?', multiplicand: 64, multiplier: 59, correctAnswer: 3776, hint1: '3712에 64를 더하세요.', hint2: '3712 + 64 = 3776입니다.', hint3: '3776입니다.' },
      { id: '8_12', stageId: 8, type: 'advanced', questionText: '75 × □ = 3600일 때, □에 들어갈 두 자리 수는?', multiplicand: 75, multiplier: 48, correctAnswer: 48, hint1: '75 × 4 = 300이므로 75 × 40 = 3000, 남은 600은 75 × 8입니다.', hint2: '40 + 8 = 48입니다.', hint3: '48입니다.' },
      { id: '8_13', stageId: 8, type: 'challenge', questionText: '89 × 97의 계산 결과에서 천의 자리 숫자는 무엇일까요?', multiplicand: 89, multiplier: 97, correctAnswer: 8, hint1: '89 × 97 = 8633입니다.', hint2: '8633의 천의 자리 숫자는 8입니다.', hint3: '8입니다.' },
      { id: '8_14', stageId: 8, type: 'speed', questionText: '99 × 45 = ?', multiplicand: 99, multiplier: 45, correctAnswer: 4455, hint1: '100 × 45 = 4500에서 45를 빼보세요.', hint2: '4500 - 45 = 4455입니다.', hint3: '4455입니다.' },
      { id: '8_15', stageId: 8, type: 'problem_making', questionText: '한 상자에 사탕 76개씩 55상자가 있습니다. 총 사탕 수는?', multiplicand: 76, multiplier: 55, correctAnswer: 4180, hint1: '76 × 55를 계산하세요.', hint2: '76 × 5 = 380, 76 × 50 = 3800의 합은 4180입니다.', hint3: '4180개입니다.' },
    ],
    9: [
      { id: '9_1', stageId: 9, type: 'basic', questionText: '48 × 21을 어림하면 약 몇백에 가장 가까울까요? (예: 50 × 20으로 어림)', multiplicand: 48, multiplier: 21, correctAnswer: 1000, choices: [800, 1000, 1200, 1500], hint1: '48은 약 50, 21은 약 20으로 어림해보세요.', hint2: '50 × 20 = 1000입니다.', hint3: '1000입니다.' },
      { id: '9_2', stageId: 9, type: 'basic', questionText: '29 × 32의 실제 곱은 얼마일까요?', multiplicand: 29, multiplier: 32, correctAnswer: 928, hint1: '29 × 2 = 58, 29 × 30 = 870을 더하세요.', hint2: '58 + 870 = 928입니다.', hint3: '928입니다.' },
      { id: '9_3', stageId: 9, type: 'basic', questionText: '62 × 49를 어림하면 약 얼마일까요? (60 × 50)', multiplicand: 62, multiplier: 49, correctAnswer: 3000, choices: [2400, 3000, 3500, 4000], hint1: '60 × 50을 계산해보세요.', hint2: '6 × 5 = 30에 00을 붙입니다.', hint3: '3000입니다.' },
      { id: '9_4', stageId: 9, type: 'basic', questionText: '71 × 38의 실제 계산 결과는?', multiplicand: 71, multiplier: 38, correctAnswer: 2698, hint1: '71 × 8 = 568, 71 × 30 = 2130입니다.', hint2: '568 + 2130 = 2698입니다.', hint3: '2698입니다.' },
      { id: '9_5', stageId: 9, type: 'application', isWordProblem: true, questionText: '놀이공원 열차에 한 줄당 19명씩 22줄이 있습니다. 열차에 탄 사람은 약 몇백 명쯤일까요? (20 × 20으로 어림)', multiplicand: 19, multiplier: 22, correctAnswer: 400, choices: [200, 300, 400, 500], hint1: '19는 약 20명, 22는 약 20줄로 생각해보세요.', hint2: '20 × 20 = 400입니다.', hint3: '400명입니다.' },
      { id: '9_6', stageId: 9, type: 'application', isWordProblem: true, questionText: '도서관에 책 39권씩 51상자가 도착했습니다. 실제로 도착한 책은 총 몇 권일까요?', multiplicand: 39, multiplier: 51, correctAnswer: 1989, hint1: '39 × 51을 계산하세요.', hint2: '39 × 1 = 39, 39 × 50 = 1950입니다.', hint3: '1989권입니다.' },
      { id: '9_7', stageId: 9, type: 'basic', questionText: '88 × 19를 90 × 20으로 어림한 값은?', multiplicand: 88, multiplier: 19, correctAnswer: 1800, hint1: '90 × 20을 계산하세요.', hint2: '9 × 2 = 18에 00을 붙이면 1800입니다.', hint3: '1800입니다.' },
      { id: '9_8', stageId: 9, type: 'basic', questionText: '52 × 39의 실제 곱은 얼마일까요?', multiplicand: 52, multiplier: 39, correctAnswer: 2028, hint1: '52 × 9 = 468, 52 × 30 = 1560입니다.', hint2: '468 + 1560 = 2028입니다.', hint3: '2028입니다.' },
      { id: '9_9', stageId: 9, type: 'application', isWordProblem: true, questionText: '선물 세트 1개 가격이 480원입니다. 6세트를 사려면 얼마가 필요할까요?', multiplicand: 480, multiplier: 6, correctAnswer: 2880, hint1: '480 × 6을 계산하세요.', hint2: '48 × 6 = 288 뒤에 0을 붙이면 2880입니다.', hint3: '2880원입니다.' },
      { id: '9_10', stageId: 9, type: 'application', isWordProblem: true, questionText: '운동장 한 바퀴가 195m입니다. 8바퀴를 돌면 총 몇 m를 달린 것일까요?', multiplicand: 195, multiplier: 8, correctAnswer: 1560, hint1: '195 × 8을 계산하세요.', hint2: '200 × 8 = 1600에서 5 × 8 = 40을 빼도 됩니다.', hint3: '1560m입니다.' },
      { id: '9_11', stageId: 9, type: 'advanced', questionText: '다음 중 곱이 2000보다 큰 것은 무엇일까요? ① 38×49  ② 29×51  ③ 19×82  ④ 41×39 (정답 번호가 아니라 38×49의 실제 곱 1862 등을 비교하여 가장 큰 곱의 값을 구하세요: 38×49=1862, 48×52=2496)', multiplicand: 48, multiplier: 52, correctAnswer: 2496, hint1: '48 × 52를 계산해보세요.', hint2: '48 × 2 = 96, 48 × 50 = 2400이므로 2496입니다.', hint3: '2496입니다.' },
      { id: '9_12', stageId: 9, type: 'advanced', questionText: '68 × 31의 계산 결과는 2100보다 얼마나 더 큰가요?', multiplicand: 68, multiplier: 31, correctAnswer: 8, hint1: '68 × 31 = 2108입니다.', hint2: '2108 - 2100 = 8입니다.', hint3: '8입니다.' },
      { id: '9_13', stageId: 9, type: 'challenge', questionText: '어떤 수를 50으로 어림하여 30을 곱했더니 1500이 되었습니다. 실제 식이 49 × 31이었다면 실제 값과 어림값의 차는?', multiplicand: 49, multiplier: 31, correctAnswer: 19, hint1: '49 × 31 = 1519이고, 어림값은 1500입니다.', hint2: '1519 - 1500 = 19입니다.', hint3: '19입니다.' },
      { id: '9_14', stageId: 9, type: 'speed', questionText: '30 × 70 = ?', multiplicand: 30, multiplier: 70, correctAnswer: 2100, hint1: '3 × 7 = 21 뒤에 00', hint2: '2100입니다.', hint3: '2100입니다.' },
      { id: '9_15', stageId: 9, type: 'problem_making', questionText: '한 바구니에 감 28개씩 32바구니가 있습니다. 총 감의 수는?', multiplicand: 28, multiplier: 32, correctAnswer: 896, hint1: '28 × 32를 계산하세요.', hint2: '56 + 840 = 896입니다.', hint3: '896개입니다.' },
    ],
    10: [
      { id: '10_1', stageId: 10, type: 'basic', questionText: '숫자 카드 4, 7, 2가 있습니다. 이 중 두 장으로 가장 큰 두 자리 수(74)를 만들고 남은 수(2)를 곱하면?', multiplicand: 74, multiplier: 2, correctAnswer: 148, hint1: '74 × 2를 계산하세요.', hint2: '70 × 2 = 140, 4 × 2 = 8이므로 148입니다.', hint3: '148입니다.' },
      { id: '10_2', stageId: 10, type: 'basic', questionText: '숫자 카드 3, 5, 8로 (두 자리 수)×(한 자리 수)를 만들 때, 가장 큰 곱은 83 × 5 = 415와 53 × 8 = 424 중 무엇일까요? 가장 큰 곱의 값을 구하세요.', multiplicand: 53, multiplier: 8, correctAnswer: 424, hint1: '83 × 5 = 415, 53 × 8 = 424를 비교해보세요.', hint2: '가장 큰 곱은 424입니다.', hint3: '424입니다.' },
      { id: '10_3', stageId: 10, type: 'basic', questionText: '숫자 카드 1, 6, 9로 가장 작은 (두 자리 수)×(한 자리 수) 식을 만들려고 합니다. 69 × 1 = 69와 19 × 6 = 114 중 가장 작은 곱은?', multiplicand: 69, multiplier: 1, correctAnswer: 69, hint1: '가장 작은 곱은 1을 한 자리 수로 곱할 때 69 × 1 = 69입니다.', hint2: '69입니다.', hint3: '69입니다.' },
      { id: '10_4', stageId: 10, type: 'basic', questionText: '4 × 6 = 24, 40 × 6 = 240, 40 × 60 = 2400입니다. 그렇다면 400 × 60 = ?', multiplicand: 400, multiplier: 60, correctAnswer: 24000, hint1: '4 × 6 = 24 뒤에 0을 3개(00 + 0) 붙입니다.', hint2: '24000입니다.', hint3: '24000입니다.' },
      { id: '10_5', stageId: 10, type: 'application', questionText: '다음 계산에서 ㉠과 ㉡의 합은?  45 × 12 = 45 × ㉠ + 45 × ㉡ (단, ㉠은 십의 자리 수, ㉡은 일의 자리 수)', multiplicand: 45, multiplier: 12, correctAnswer: 12, hint1: '12는 10과 2로 나누어지므로 ㉠=10, ㉡=2입니다.', hint2: '10 + 2 = 12입니다.', hint3: '12입니다.' },
      { id: '10_6', stageId: 10, type: 'application', questionText: '어떤 두 자리 수에 10을 곱했더니 450이 되었습니다. 이 수에 20을 곱하면 얼마일까요?', multiplicand: 45, multiplier: 20, correctAnswer: 900, hint1: '어떤 수는 450 ÷ 10 = 45입니다.', hint2: '45 × 20 = 900입니다.', hint3: '900입니다.' },
      { id: '10_7', stageId: 10, type: 'advanced', questionText: '숫자 카드 2, 4, 6, 8 중 4장을 모두 사용하여 (두 자리 수)×(두 자리 수)를 만들 때, 가장 큰 곱을 만드는 식은 82 × 64 또는 84 × 62입니다. 84 × 62의 곱은 얼마일까요?', multiplicand: 84, multiplier: 62, correctAnswer: 5208, hint1: '84 × 62를 계산합니다.', hint2: '84 × 2 = 168, 84 × 60 = 5040을 더하면 5208입니다.', hint3: '5208입니다.' },
      { id: '10_8', stageId: 10, type: 'advanced', questionText: '규칙을 찾아 빈칸에 알맞은 수를 구하세요: 12×11=132, 23×11=253, 34×11=374, 45×11=?', multiplicand: 45, multiplier: 11, correctAnswer: 495, hint1: '4와 5 사이에 (4+5=9)가 들어가는 규칙입니다.', hint2: '495입니다.', hint3: '495입니다.' },
      { id: '10_9', stageId: 10, type: 'advanced', questionText: '37 × 3 = 111, 37 × 6 = 222, 37 × 9 = 333입니다. 그렇다면 37 × 18은 얼마일까요?', multiplicand: 37, multiplier: 18, correctAnswer: 666, hint1: '18은 3의 6배이므로 111의 6배가 됩니다.', hint2: '666입니다.', hint3: '666입니다.' },
      { id: '10_10', stageId: 10, type: 'challenge', questionText: '숫자 카드 3, 5, 7로 만들 수 있는 세 자리 수 중 가장 큰 수(753)와 가장 작은 수(357)에 각각 2를 곱했을 때, 두 곱의 차는 얼마일까요?', multiplicand: 396, multiplier: 2, correctAnswer: 792, hint1: '753 × 2 = 1506이고, 357 × 2 = 714입니다.', hint2: '1506 - 714 = 792입니다.', hint3: '792입니다.' },
      { id: '10_11', stageId: 10, type: 'challenge', questionText: '□ 안에 알맞은 한 자리 숫자는?  24□ × 3 = 735', multiplicand: 245, multiplier: 3, correctAnswer: 5, hint1: '□ × 3의 일의 자리가 5가 되는 숫자는 5뿐입니다.', hint2: '245 × 3 = 735가 맞습니다.', hint3: '5입니다.' },
      { id: '10_12', stageId: 10, type: 'challenge', questionText: '□3 × 4 = 172일 때, □에 들어갈 숫자는?', multiplicand: 43, multiplier: 4, correctAnswer: 4, hint1: '십의 자리 곱: □ × 4에 올림수 1을 더해 17이 되려면 □ × 4 = 16이어야 합니다.', hint2: '4 × 4 = 16이므로 □는 4입니다.', hint3: '4입니다.' },
      { id: '10_13', stageId: 10, type: 'speed', questionText: '55 × 11 = ?', multiplicand: 55, multiplier: 11, correctAnswer: 605, hint1: '55 + 550 = 605입니다.', hint2: '605입니다.', hint3: '605입니다.' },
      { id: '10_14', stageId: 10, type: 'speed', questionText: '25 × 8 = ?', multiplicand: 25, multiplier: 8, correctAnswer: 200, hint1: '25 × 4 = 100의 2배', hint2: '200입니다.', hint3: '200입니다.' },
      { id: '10_15', stageId: 10, type: 'problem_making', questionText: '36 × 15 = 540입니다. 36 × 16은 540보다 36 큰 수입니다. 이 값은?', multiplicand: 36, multiplier: 16, correctAnswer: 576, hint1: '540 + 36을 계산하세요.', hint2: '576입니다.', hint3: '576입니다.' },
    ],
    11: [
      { id: '11_1', stageId: 11, type: 'speed', questionText: '50 × 4 = ?', multiplicand: 50, multiplier: 4, correctAnswer: 200, hint1: '5 × 4 = 20 뒤에 0', hint2: '200입니다.', hint3: '200입니다.' },
      { id: '11_2', stageId: 11, type: 'speed', questionText: '120 × 3 = ?', multiplicand: 120, multiplier: 3, correctAnswer: 360, hint1: '12 × 3 = 36 뒤에 0', hint2: '360입니다.', hint3: '360입니다.' },
      { id: '11_3', stageId: 11, type: 'speed', questionText: '40 × 70 = ?', multiplicand: 40, multiplier: 70, correctAnswer: 2800, hint1: '4 × 7 = 28 뒤에 00', hint2: '2800입니다.', hint3: '2800입니다.' },
      { id: '11_4', stageId: 11, type: 'speed', questionText: '25 × 4 = ?', multiplicand: 25, multiplier: 4, correctAnswer: 100, hint1: '25의 4배는 100', hint2: '100입니다.', hint3: '100입니다.' },
      { id: '11_5', stageId: 11, type: 'speed', questionText: '300 × 5 = ?', multiplicand: 300, multiplier: 5, correctAnswer: 1500, hint1: '3 × 5 = 15 뒤에 00', hint2: '1500입니다.', hint3: '1500입니다.' },
      { id: '11_6', stageId: 11, type: 'speed', questionText: '210 × 4 = ?', multiplicand: 210, multiplier: 4, correctAnswer: 840, hint1: '21 × 4 = 84 뒤에 0', hint2: '840입니다.', hint3: '840입니다.' },
      { id: '11_7', stageId: 11, type: 'speed', questionText: '15 × 6 = ?', multiplicand: 15, multiplier: 6, correctAnswer: 90, hint1: '10 × 6 + 5 × 6 = 60 + 30', hint2: '90입니다.', hint3: '90입니다.' },
      { id: '11_8', stageId: 11, type: 'speed', questionText: '60 × 60 = ?', multiplicand: 60, multiplier: 60, correctAnswer: 3600, hint1: '6 × 6 = 36 뒤에 00', hint2: '3600입니다.', hint3: '3600입니다.' },
      { id: '11_9', stageId: 11, type: 'speed', questionText: '110 × 8 = ?', multiplicand: 110, multiplier: 8, correctAnswer: 880, hint1: '11 × 8 = 88 뒤에 0', hint2: '880입니다.', hint3: '880입니다.' },
      { id: '11_10', stageId: 11, type: 'speed', questionText: '35 × 2 = ?', multiplicand: 35, multiplier: 2, correctAnswer: 70, hint1: '35 + 35 = 70', hint2: '70입니다.', hint3: '70입니다.' },
      { id: '11_11', stageId: 11, type: 'challenge', questionText: '45 × 18의 빠른 계산: 45 × 2 = 90에 9를 곱하면? (45 × 18 = 45 × 2 × 9)', multiplicand: 45, multiplier: 18, correctAnswer: 810, hint1: '90 × 9 = 810입니다.', hint2: '810입니다.', hint3: '810입니다.' },
      { id: '11_12', stageId: 11, type: 'challenge', questionText: '80 × 50 - 50 × 40 = ?', multiplicand: 50, multiplier: 40, correctAnswer: 2000, hint1: '4000 - 2000 = 2000입니다.', hint2: '2000입니다.', hint3: '2000입니다.' },
      { id: '11_13', stageId: 11, type: 'challenge', questionText: '125 × 8 = ? (125는 1000을 8로 나눈 수)', multiplicand: 125, multiplier: 8, correctAnswer: 1000, hint1: '125 × 8 = 1000입니다.', hint2: '1000입니다.', hint3: '1000입니다.' },
      { id: '11_14', stageId: 11, type: 'speed', questionText: '90 × 90 = ?', multiplicand: 90, multiplier: 90, correctAnswer: 8100, hint1: '9 × 9 = 81 뒤에 00', hint2: '8100입니다.', hint3: '8100입니다.' },
      { id: '11_15', stageId: 11, type: 'speed', questionText: '48 × 10 = ?', multiplicand: 48, multiplier: 10, correctAnswer: 480, hint1: '48 뒤에 0을 하나 붙입니다.', hint2: '480입니다.', hint3: '480입니다.' },
    ],
    12: [
      { id: '12_1', stageId: 12, type: 'basic', questionText: '[종합] 40 × 8 = ?', multiplicand: 40, multiplier: 8, correctAnswer: 320, hint1: '4 × 8 = 32 뒤에 0', hint2: '320입니다.', hint3: '320입니다.' },
      { id: '12_2', stageId: 12, type: 'basic', questionText: '[종합] 231 × 3 = ?', multiplicand: 231, multiplier: 3, correctAnswer: 693, hint1: '1×3=3, 3×3=9, 2×3=6', hint2: '693입니다.', hint3: '693입니다.' },
      { id: '12_3', stageId: 12, type: 'basic', questionText: '[종합] 146 × 4 = ?', multiplicand: 146, multiplier: 4, correctAnswer: 584, hint1: '6×4=24(2올림), 4×4+2=18(1올림), 1×4+1=5', hint2: '584입니다.', hint3: '584입니다.' },
      { id: '12_4', stageId: 12, type: 'basic', questionText: '[종합] 378 × 5 = ?', multiplicand: 378, multiplier: 5, correctAnswer: 1890, hint1: '8×5=40, 7×5+4=39, 3×5+3=18', hint2: '1890입니다.', hint3: '1890입니다.' },
      { id: '12_5', stageId: 12, type: 'basic', questionText: '[종합] 60 × 70 = ?', multiplicand: 60, multiplier: 70, correctAnswer: 4200, hint1: '6 × 7 = 42 뒤에 00', hint2: '4200입니다.', hint3: '4200입니다.' },
      { id: '12_6', stageId: 12, type: 'basic', questionText: '[종합] 32 × 13 = ?', multiplicand: 32, multiplier: 13, correctAnswer: 416, hint1: '32 × 3 = 96, 32 × 10 = 320을 더합니다.', hint2: '416입니다.', hint3: '416입니다.' },
      { id: '12_7', stageId: 12, type: 'basic', questionText: '[종합] 47 × 28 = ?', multiplicand: 47, multiplier: 28, correctAnswer: 1316, hint1: '47 × 8 = 376, 47 × 20 = 940의 합', hint2: '1316입니다.', hint3: '1316입니다.' },
      { id: '12_8', stageId: 12, type: 'basic', questionText: '[종합] 86 × 74 = ?', multiplicand: 86, multiplier: 74, correctAnswer: 6364, hint1: '86 × 4 = 344, 86 × 70 = 6020의 합', hint2: '6364입니다.', hint3: '6364입니다.' },
      { id: '12_9', stageId: 12, type: 'application', isWordProblem: true, questionText: '[종합 문장제] 한 상자에 딸기 28개씩 45상자가 있습니다. 딸기는 모두 몇 개일까요?', multiplicand: 28, multiplier: 45, correctAnswer: 1260, hint1: '28 × 45 식을 세우세요.', hint2: '28 × 5 = 140, 28 × 40 = 1120의 합', hint3: '1260개입니다.' },
      { id: '12_10', stageId: 12, type: 'application', isWordProblem: true, questionText: '[어림 종합] 59 × 41을 어림한 값(60 × 40)과 실제 계산 결과(2419)의 차는?', multiplicand: 59, multiplier: 41, correctAnswer: 19, hint1: '60 × 40 = 2400이고, 실제 계산은 2419입니다.', hint2: '2419 - 2400 = 19입니다.', hint3: '19입니다.' },
      { id: '12_11', stageId: 12, type: 'advanced', questionText: '[퍼즐] 숫자 카드 3, 5, 8로 가장 큰 (두 자리 수)×(한 자리 수)를 만들었을 때의 곱은? (53 × 8 = 424)', multiplicand: 53, multiplier: 8, correctAnswer: 424, hint1: '53 × 8 = 424입니다.', hint2: '424입니다.', hint3: '424입니다.' },
      { id: '12_12', stageId: 12, type: 'advanced', questionText: '[종합 추론] 345 × □ = 1380일 때, □ 안에 들어갈 수는?', multiplicand: 345, multiplier: 4, correctAnswer: 4, hint1: '345 × 4 = 1380입니다.', hint2: '4입니다.', hint3: '4입니다.' },
      { id: '12_13', stageId: 12, type: 'challenge', questionText: '[보스 문제] 98 × 89 = ?', multiplicand: 98, multiplier: 89, correctAnswer: 8722, hint1: '98 × 9 = 882, 98 × 80 = 7840을 더합니다.', hint2: '882 + 7840 = 8722입니다.', hint3: '8722입니다.' },
      { id: '12_14', stageId: 12, type: 'challenge', questionText: '[보스 문제] 세 자리 수 487 × 6의 계산 결과는?', multiplicand: 487, multiplier: 6, correctAnswer: 2922, hint1: '7×6=42, 8×6+4=52, 4×6+5=29', hint2: '2922입니다.', hint3: '2922입니다.' },
      { id: '12_15', stageId: 12, type: 'problem_making', questionText: '[마스터 인증] 125 × 24 = ?', multiplicand: 125, multiplier: 24, correctAnswer: 3000, hint1: '125 × 4 = 500, 125 × 20 = 2500을 합산합니다.', hint2: '500 + 2500 = 3000입니다.', hint3: '3000입니다.' },
    ],
  };

  /**
   * Get static questions for stage (first 15)
   */
  public static getStageQuestions(stageId: number): Question[] {
    const list = LearningService.STAGE_QUESTION_BANK[stageId] || [];
    return [...list];
  }

  /**
   * Rule-based infinite question generator
   */
  public static generateDynamicQuestion(stageId: number, indexNumber: number, type: QuestionType = 'basic'): Question {
    let multiplicand = 20;
    let multiplier = 3;
    let text = '';
    let isWordProblem = false;
    const id = `dynamic_s${stageId}_${indexNumber}_${Date.now()}`;

    switch (stageId) {
      case 1: { // (몇십) × (몇)
        const tens = (Math.floor(Math.random() * 8) + 2) * 10; // 20 ~ 90
        const ones = Math.floor(Math.random() * 8) + 2; // 2 ~ 9
        multiplicand = tens;
        multiplier = ones;
        text = `${tens} × ${ones} = ?`;
        break;
      }
      case 2: { // (세 자리 수) × (한 자리 수) 올림 없음
        const h = Math.floor(Math.random() * 3) + 1; // 1~3
        const t = Math.floor(Math.random() * 3) + 1; // 1~3
        const o = Math.floor(Math.random() * 3) + 1; // 1~3
        const m = 2; // 올림 방지
        multiplicand = h * 100 + t * 10 + o;
        multiplier = m;
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 3: { // (세 자리 수) × (한 자리 수) 일의 자리 올림
        const h = Math.floor(Math.random() * 3) + 1;
        const t = Math.floor(Math.random() * 3) + 1;
        const o = Math.floor(Math.random() * 4) + 6; // 6~9
        const m = Math.floor(Math.random() * 2) + 2; // 2~3
        multiplicand = h * 100 + t * 10 + o;
        multiplier = m;
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 4: { // (세 자리 수) × (한 자리 수) 십/백의 자리 연속 올림
        const num = Math.floor(Math.random() * 400) + 250;
        const m = Math.floor(Math.random() * 4) + 3;
        multiplicand = num;
        multiplier = m;
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 5: { // (몇십) × (몇십), (몇십몇) × (몇십)
        if (Math.random() > 0.5) {
          multiplicand = (Math.floor(Math.random() * 8) + 2) * 10;
          multiplier = (Math.floor(Math.random() * 8) + 2) * 10;
        } else {
          multiplicand = Math.floor(Math.random() * 70) + 15;
          multiplier = (Math.floor(Math.random() * 8) + 2) * 10;
        }
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 6: { // (두 자리 수) × (두 자리 수) 올림 없음
        const t1 = Math.floor(Math.random() * 3) + 2;
        const o1 = Math.floor(Math.random() * 3) + 1;
        const t2 = 1;
        const o2 = Math.floor(Math.random() * 3) + 1;
        multiplicand = t1 * 10 + o1;
        multiplier = t2 * 10 + o2;
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 7: { // (두 자리 수) × (두 자리 수) 올림 1~2회
        multiplicand = Math.floor(Math.random() * 40) + 25;
        multiplier = Math.floor(Math.random() * 20) + 15;
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 8: { // (두 자리 수) × (두 자리 수) 연속 올림
        multiplicand = Math.floor(Math.random() * 45) + 50;
        multiplier = Math.floor(Math.random() * 45) + 45;
        text = `${multiplicand} × ${multiplier} = ?`;
        break;
      }
      case 9: { // 실생활 문장제 & 어림
        isWordProblem = true;
        multiplicand = Math.floor(Math.random() * 40) + 25;
        multiplier = Math.floor(Math.random() * 30) + 15;
        const items = ['선물 상자', '사과 상자', '도서관 책', '체육관 공', '과수원 감'];
        const chosenItem = items[Math.floor(Math.random() * items.length)];
        text = `한 묶음에 ${chosenItem} ${multiplicand}개씩 ${multiplier}묶음이 있습니다. 모두 몇 개일까요?`;
        break;
      }
      case 10: { // 규칙 및 퍼즐
        multiplicand = (Math.floor(Math.random() * 40) + 30);
        multiplier = (Math.floor(Math.random() * 5) + 3);
        text = `어떤 수에 ${multiplier}를 곱했더니 ${multiplicand * multiplier}가 되었습니다. 어떤 수는?`;
        break;
      }
      case 11: { // 스피드 연산
        multiplicand = (Math.floor(Math.random() * 8) + 2) * 10;
        multiplier = (Math.floor(Math.random() * 8) + 2) * 10;
        text = `[스피드] ${multiplicand} × ${multiplier} = ?`;
        break;
      }
      default: { // 12차시 종합
        multiplicand = Math.floor(Math.random() * 60) + 35;
        multiplier = Math.floor(Math.random() * 45) + 25;
        text = `[마스터 도전] ${multiplicand} × ${multiplier} = ?`;
        break;
      }
    }

    const correctAnswer = multiplicand * multiplier;
    return {
      id,
      stageId,
      type,
      questionText: text,
      multiplicand,
      multiplier,
      correctAnswer,
      isWordProblem,
      hint1: '일의 자리 계산부터 차근차근 확인해 보세요.',
      hint2: `자릿값을 분해하여 ${multiplicand} × ${(multiplier % 10)}과 ${multiplicand} × ${Math.floor(multiplier / 10) * 10}의 합으로 나누어 생각해보세요.`,
      hint3: `정확한 부분곱을 계산한 뒤 올림수를 잊지 말고 더해보세요!`,
    };
  }

  /**
   * Diagnose error type from student wrong answer
   */
  public static diagnoseErrorType(question: Question, studentAnsNum: number): string {
    const correct = question.correctAnswer;
    const m1 = question.multiplicand;
    const m2 = question.multiplier;

    // 1. 구구단 기본 오류 (일의 자리 곱 오류)
    if (studentAnsNum % 10 !== correct % 10) {
      return '일의 자리 곱셈구구 계산 오류';
    }

    // 2. 0의 개수/자릿값 규칙 누락 (e.g. 30×40=120 or 12000)
    if (m1 % 10 === 0 && m2 % 10 === 0) {
      if (studentAnsNum === (m1 / 10) * (m2 / 10) * 10 || studentAnsNum === correct / 10) {
        return '0의 개수 및 자릿값 누락 오류';
      }
      if (studentAnsNum === correct * 10) {
        return '자릿수 과다(0 추가) 오류';
      }
    }

    // 3. 올림수 덧셈 누락 (세로셈 올림수 안 더함)
    if (Math.abs(correct - studentAnsNum) <= 40 && Math.abs(correct - studentAnsNum) % 10 === 0) {
      return '올림수 덧셈 누락 오류';
    }

    // 4. 두 자리 수 곱셈에서 십의 자리 곱 자리 정렬 누락 (예: 23×12에서 23×10을 230이 아니라 23으로 더함)
    const onesPart = m1 * (m2 % 10);
    const tensPartRaw = m1 * Math.floor(m2 / 10);
    if (studentAnsNum === onesPart + tensPartRaw) {
      return '두 자리 수 곱셈 자리 정렬(0 생략) 오류';
    }

    // 5. 어림/추론 오류
    if (question.type === 'challenge' || question.stageId === 9 || question.stageId === 10) {
      return '어림 및 문제 조건 추론 오류';
    }

    return '중간 부분곱 합산 및 자릿값 오류';
  }

  /**
   * Supplementary Problem Generator for SOS students
   */
  public static getSupplementarySteps(stageId: number, baseQuestion: Question): {
    step1_visual: string;
    step2_easyProblem: Question;
    step3_guidedProblem: Question;
  } {
    const easyMult = 2;
    const easyBase = Math.min(baseQuestion.multiplicand, 30);
    return {
      step1_visual: `${baseQuestion.multiplicand} × ${baseQuestion.multiplier}은 ${baseQuestion.multiplicand}을 ${baseQuestion.multiplier}번 더한 것과 같습니다. 수 모형으로 묶어 세어보세요!`,
      step2_easyProblem: {
        id: `supp_easy_${Date.now()}`,
        stageId,
        type: 'basic',
        questionText: `[보충 1단계] 기초 연습: ${easyBase} × ${easyMult} = ?`,
        multiplicand: easyBase,
        multiplier: easyMult,
        correctAnswer: easyBase * easyMult,
        hint1: '몇십과 몇으로 나누어 더해보세요.',
        hint2: `${easyBase} + ${easyBase}를 계산해보세요.`,
        hint3: `${easyBase * easyMult}입니다.`,
      },
      step3_guidedProblem: {
        id: `supp_guide_${Date.now()}`,
        stageId,
        type: 'basic',
        questionText: `[보충 2단계] ${baseQuestion.multiplicand} × ${baseQuestion.multiplier}의 부분곱을 차근차근 구해봅시다!`,
        multiplicand: baseQuestion.multiplicand,
        multiplier: baseQuestion.multiplier,
        correctAnswer: baseQuestion.correctAnswer,
        hint1: `먼저 ${baseQuestion.multiplicand} × ${baseQuestion.multiplier % 10}을 계산하세요.`,
        hint2: `다음으로 ${baseQuestion.multiplicand} × ${Math.floor(baseQuestion.multiplier / 10) * 10}을 구한 뒤 둘을 더합니다.`,
        hint3: `정답은 ${baseQuestion.correctAnswer}입니다.`,
      },
    };
  }
}
