import { StudentData, ClassSummary, StageAnalysis, WeakStageAnalysis, ErrorTypeCount, SOSStudent } from '../types';
import { STAGE_CONFIGS } from './learningService';

export class AnalysisService {
  /**
   * Calculate High-Level Class Summary
   */
  public static getClassSummary(students: StudentData[]): ClassSummary {
    const total = students.length;
    if (total === 0) {
      return {
        totalStudents: 0,
        activeStudents: 0,
        avgProgressPercent: 0,
        avgAccuracyPercent: 0,
        avgExp: 0,
        avgGold: 0,
        avgLevel: 1,
        levelDistribution: { supplement: 0, basic: 0, advanced: 0 },
        jobDistribution: { warrior: 0, wizard: 0, healer: 0, explorer: 0 },
        totalMonstersCollected: 0,
      };
    }

    let activeCount = 0;
    let totalCompletedStages = 0;
    let sumCorrect = 0;
    let sumWrong = 0;
    let sumExp = 0;
    let sumGold = 0;
    let sumLevel = 0;
    let totalMonsters = 0;

    const levelDist = { supplement: 0, basic: 0, advanced: 0 };
    const jobDist = { warrior: 0, wizard: 0, healer: 0, explorer: 0 };

    students.forEach((s) => {
      if (s.character?.job && (jobDist as any)[s.character.job] !== undefined) {
        jobDist[s.character.job] += 1;
      }

      sumExp += s.character?.exp || 0;
      sumGold += s.character?.gold || 0;
      sumLevel += s.character?.level || 1;
      totalMonsters += (s.character?.mathMonsters || []).length;

      let completedInThisStudent = 0;
      let studentCorrect = 0;
      let studentWrong = 0;

      for (let st = 1; st <= 12; st++) {
        const record = s.stages[st];
        if (record) {
          if (record.completed) completedInThisStudent += 1;
          studentCorrect += record.correctCount;
          studentWrong += record.wrongCount;
        }
      }

      totalCompletedStages += completedInThisStudent;
      sumCorrect += studentCorrect;
      sumWrong += studentWrong;

      const totalTries = studentCorrect + studentWrong;
      if (totalTries > 0 || completedInThisStudent > 0) {
        activeCount += 1;
      }

      const acc = totalTries > 0 ? (studentCorrect / totalTries) * 100 : 0;
      if (completedInThisStudent >= 8 && acc >= 85) {
        levelDist.advanced += 1;
      } else if (acc < 65 || (s.totalWrong > 8 && s.totalHints > 6)) {
        levelDist.supplement += 1;
      } else {
        levelDist.basic += 1;
      }
    });

    const totalPossibleStages = total * 12;
    const avgProgress = totalPossibleStages > 0 ? Math.round((totalCompletedStages / totalPossibleStages) * 100) : 0;
    const totalAnswers = sumCorrect + sumWrong;
    const avgAccuracy = totalAnswers > 0 ? Math.round((sumCorrect / totalAnswers) * 100) : 0;

    return {
      totalStudents: total,
      activeStudents: activeCount,
      avgProgressPercent: avgProgress,
      avgAccuracyPercent: avgAccuracy,
      avgExp: Math.round(sumExp / total),
      avgGold: Math.round(sumGold / total),
      avgLevel: Math.max(1, Math.round((sumLevel / total) * 10) / 10),
      levelDistribution: levelDist,
      jobDistribution: jobDist,
      totalMonstersCollected: totalMonsters,
    };
  }

  /**
   * Analyze all 1~12 Stages
   */
  public static getStageAnalysisList(students: StudentData[]): StageAnalysis[] {
    const list: StageAnalysis[] = [];
    const totalStudents = students.length || 1;

    for (let st = 1; st <= 12; st++) {
      const cfg = STAGE_CONFIGS.find((c) => c.id === st);
      let completedCount = 0;
      let sumCorrect = 0;
      let sumWrong = 0;
      let sumRetries = 0;
      let sumHints = 0;
      let supplementCount = 0;
      let advancedCount = 0;

      students.forEach((s) => {
        const record = s.stages[st];
        if (record) {
          if (record.completed) completedCount += 1;
          sumCorrect += record.correctCount;
          sumWrong += record.wrongCount;
          sumRetries += record.tryCount > record.correctCount ? record.tryCount - record.correctCount : 0;
          sumHints += record.hintCount;

          const totalTries = record.correctCount + record.wrongCount;
          const acc = totalTries > 0 ? (record.correctCount / totalTries) * 100 : 0;

          if (record.mastery === '심화' || record.mastery === '완전정복' || (record.completed && acc >= 85)) {
            advancedCount += 1;
          } else if (record.mastery === '보충' || (record.wrongCount >= 3 && acc < 65)) {
            supplementCount += 1;
          }
        }
      });

      const totalTries = sumCorrect + sumWrong;
      const avgAccuracy = totalTries > 0 ? Math.round((sumCorrect / totalTries) * 100) : 0;
      const avgWrongRate = totalTries > 0 ? Math.round((sumWrong / totalTries) * 100) : 0;
      const avgRetries = Math.round((sumRetries / totalStudents) * 10) / 10;
      const avgHints = Math.round((sumHints / totalStudents) * 10) / 10;

      list.push({
        stageId: st,
        stageTitle: cfg ? cfg.title : `${st}차시`,
        completedCount,
        avgAccuracy,
        avgWrongRate,
        avgRetries,
        avgHints,
        supplementCount,
        advancedCount,
      });
    }

    return list;
  }

  /**
   * Find Top 3 Weakest Stages with Rule-Based Teaching Prescriptions
   */
  public static getWeakStagesTop3(students: StudentData[]): WeakStageAnalysis[] {
    const analysis = AnalysisService.getStageAnalysisList(students);
    const sorted = [...analysis].sort((a, b) => b.avgWrongRate - a.avgWrongRate);

    const top3 = sorted.slice(0, 3);
    const suggestions: Record<number, { error: string; advice: string }> = {
      1: { error: '몇십에 0 붙이는 규칙 헷갈림', advice: '수 모형 10개 묶음 세기와 0의 개수 규칙을 바둑알이나 묶음 교구로 시각화해 지도하세요.' },
      2: { error: '자릿값 분해 및 부분 덧셈 실수', advice: '백의 자리, 십의 자리, 일의 자리를 색깔별 세로선으로 칸을 나누어 적도록 지도하세요.' },
      3: { error: '일의 자리 올림수를 십의 자리 곱에 미합산', advice: '일의 자리에서 올라간 올림수를 십의 자리 숫자 머리 위에 빨간색 작게 적어두고 동그라미 치게 하세요.' },
      4: { error: '연속 올림 과정에서 자릿값 혼동', advice: '단계별 부분곱을 풀어서 쓴 뒤 마지막에 더하는 긴 세로셈 방식으로 올림 과정을 단계화하세요.' },
      5: { error: '0의 개수 누락 및 자릿값 축소', advice: '몇십×몇십은 0이 2개(100배), 몇십몇×몇십은 0이 1개 붙는 10배/100배 규칙 판을 활용하세요.' },
      6: { error: '두 자리 수 부분곱(10의 자리 곱) 자리 밀림', advice: '십의 자리와 곱할 때는 일의 자리 끝에 0을 먼저 적고 시작하는 습관을 형성시켜 주세요.' },
      7: { error: '첫 번째 줄과 두 번째 줄 올림수 섞임', advice: '첫 번째 올림수와 두 번째 올림수를 지우개로 지우거나 위아래 줄을 구분해 쓰도록 안내하세요.' },
      8: { error: '연속 올림 및 복합 자릿값 합산 착오', advice: '세로셈 격자 모눈종이를 활용해 자리별 줄 맞춤을 엄격히 지도하고 유사 기본 문제를 반복 훈련하세요.' },
      9: { error: '문맥 파악 및 어림 기준 수 설정 착오', advice: '문장에서 핵심 숫자에 밑줄을 긋고, 가장 가까운 몇십으로 어림한 후 비교하는 과정을 지도하세요.' },
      10: { error: '숫자 카드 조합 및 큰 곱/작은 곱 원리 미숙', advice: '높은 자리에 가장 큰 숫자를 놓아야 곱이 커진다는 원리를 다양한 카드 실물 게임으로 체득시키세요.' },
      11: { error: '시간 압박에 따른 구구단 단순 실수', advice: '타이머 없이 정확한 구구단 인출을 먼저 다진 후 점진적으로 속도를 높이도록 유도하세요.' },
      12: { error: '단원 복합 유형 혼란', advice: '1~11차시 중 본인이 가장 자주 틀린 특정 차시를 집중 복습할 수 있도록 맞춤 지도를 제공하세요.' },
    };

    return top3.map((st) => {
      const info = suggestions[st.stageId] || {
        error: '자릿값 및 부분곱 계산 착오',
        advice: '단계별 세로셈 풀이와 시각 수 모형 교구를 통해 기본 개념을 재점검하세요.',
      };
      return {
        stageId: st.stageId,
        stageTitle: st.stageTitle,
        wrongRate: st.avgWrongRate,
        studentCount: st.supplementCount,
        mainErrorType: info.error,
        teachingSuggestion: info.advice,
      };
    });
  }

  /**
   * Global Error Type Analysis
   */
  public static getErrorTypeBreakdown(students: StudentData[]): ErrorTypeCount[] {
    const errorCounts: Record<string, number> = {
      '올림수 덧셈 누락 오류': 0,
      '두 자리 수 곱셈 자리 정렬(0 생략) 오류': 0,
      '일의 자리 곱셈구구 계산 오류': 0,
      '0의 개수 및 자릿값 누락 오류': 0,
      '중간 부분곱 합산 및 자릿값 오류': 0,
      '어림 및 문제 조건 추론 오류': 0,
    };

    students.forEach((s) => {
      for (let st = 1; st <= 12; st++) {
        const record = s.stages[st];
        if (record && record.wrongQuestions) {
          record.wrongQuestions.forEach((wq) => {
            const err = wq.errorType || '중간 부분곱 합산 및 자릿값 오류';
            if (errorCounts[err] !== undefined) {
              errorCounts[err] += 1;
            } else {
              errorCounts['중간 부분곱 합산 및 자릿값 오류'] += 1;
            }
          });
        }
      }
    });

    const meta: Record<string, { desc: string; rec: string }> = {
      '올림수 덧셈 누락 오류': { desc: '곱을 계산한 뒤 머릿속 올림수를 잊고 그냥 적는 오류', rec: '올림수를 숫자의 윗자리에 작게 직접 연필로 적어두는 습관을 기르게 합니다.' },
      '두 자리 수 곱셈 자리 정렬(0 생략) 오류': { desc: '십의 자리를 곱할 때 일의 자리에 0을 쓰지 않고 당겨 적어 더하는 오류', rec: '두 번째 줄을 적기 전 일의 자리에 네모칸(0)을 먼저 채우고 시작하도록 지도합니다.' },
      '일의 자리 곱셈구구 계산 오류': { desc: '기본 2~9단 곱셈구구 계산 과정에서의 단순 실수', rec: '기초 구구단 플래시카드 및 11차시 스피드 퀴즈로 구구단 즉각 인출을 훈련합니다.' },
      '0의 개수 및 자릿값 누락 오류': { desc: '몇십×몇십에서 0의 개수를 하나 빼먹거나 더 붙이는 오류', rec: '0을 제외한 숫자끼리 먼저 곱하고, 두 수의 0의 개수를 세어 그대로 붙이는 0의 규칙을 연습합니다.' },
      '중간 부분곱 합산 및 자릿값 오류': { desc: '각 부분곱 계산 후 마지막 자릿수 덧셈에서 발생하는 올림 오류', rec: '격자 줄 맞춤 연습과 두 자리 덧셈 기초 연산을 보강합니다.' },
      '어림 및 문제 조건 추론 오류': { desc: '문장제의 조건을 잘못 파악하거나 어림셈 기준 설정을 잘못하는 오류', rec: '문제에서 구하려는 것과 주어진 조건에 각각 색깔 펜으로 표시하는 문해력 지도를 합니다.' },
    };

    return Object.entries(errorCounts)
      .map(([type, count]) => ({
        type,
        name: type,
        count,
        description: meta[type]?.desc || '자릿값 및 연산 과정 오류',
        recommendation: meta[type]?.rec || '기초 단계부터 차근차근 점검하도록 지도합니다.',
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * SOS Students Filter Algorithm
   */
  public static getSOSStudents(students: StudentData[]): SOSStudent[] {
    const summary = AnalysisService.getClassSummary(students);
    const avgAcc = summary.avgAccuracyPercent || 75;

    const sosList: SOSStudent[] = [];

    students.forEach((s) => {
      const reasons: string[] = [];
      let highSeverity = false;
      const recentErrors: string[] = [];
      let problematicStage = 0;

      // 1. Total tries and accuracy
      const totalTries = s.totalCorrect + s.totalWrong;
      const acc = totalTries > 0 ? (s.totalCorrect / totalTries) * 100 : 100;

      if (totalTries >= 5 && acc < avgAcc - 20) {
        reasons.push(`학급 평균 정답률(${avgAcc}%)보다 현저히 낮음 (${Math.round(acc)}%)`);
        highSeverity = true;
      }

      // 2. Repetitive hints
      if (s.totalHints >= 10 || (totalTries > 0 && s.totalHints / totalTries > 0.4)) {
        reasons.push(`문제당 힌트 의존도 높음 (누적 힌트 ${s.totalHints}회)`);
      }

      // 3. Repetitive retries
      if (s.totalRetries >= 6) {
        reasons.push(`동일 문제 반복 재도전 다수 발생 (누적 재도전 ${s.totalRetries}회)`);
      }

      // 4. Stuck in supplement stage
      for (let st = 1; st <= 12; st++) {
        const record = s.stages[st];
        if (record) {
          if (record.mastery === '보충' && record.wrongCount >= 3) {
            problematicStage = st;
            reasons.push(`${st}차시 보충 단계에 머무름 (오답 ${record.wrongCount}회)`);
          }
          if (record.wrongQuestions && record.wrongQuestions.length > 0) {
            record.wrongQuestions.forEach((wq) => {
              if (wq.errorType && !recentErrors.includes(wq.errorType)) {
                recentErrors.push(wq.errorType);
              }
            });
          }
        }
      }

      if (reasons.length > 0) {
        sosList.push({
          student: s,
          reasons,
          severity: highSeverity || reasons.length >= 3 ? 'high' : 'medium',
          problematicStageId: problematicStage > 0 ? problematicStage : undefined,
          recentErrorTypes: recentErrors.slice(0, 3),
        });
      }
    });

    return sosList.sort((a, b) => (b.severity === 'high' ? 1 : 0) - (a.severity === 'high' ? 1 : 0));
  }

  /**
   * Export Student Accounts CSV with UTF-8 BOM
   */
  public static generateStudentAccountsCSV(students: StudentData[]): string {
    const BOM = '\uFEFF';
    const header = '번호,이름,학생 아이디,비밀번호,학년,반,등록일시\n';
    const rows = students
      .map((s) => {
        const a = s.account;
        return `${a.number},"${a.name}","${a.id}","${a.password}",${a.grade},${a.classNo},"${new Date(a.createdAt).toLocaleDateString('ko-KR')}"`;
      })
      .join('\n');

    return BOM + header + rows;
  }

  /**
   * Export Full Learning Progress CSV with UTF-8 BOM
   */
  public static generateLearningDataCSV(students: StudentData[]): string {
    const BOM = '\uFEFF';
    let header = '번호,이름,아이디,직업,레벨,EXP,Gold,전체정답수,전체오답수,전체정답률,힌트사용수,수집수학몬수';
    for (let st = 1; st <= 12; st++) {
      header += `,${st}차시완료,${st}차시정답률,${st}차시수준`;
    }
    header += '\n';

    const rows = students
      .map((s) => {
        const a = s.account;
        const c = s.character;
        const totalTries = s.totalCorrect + s.totalWrong;
        const acc = totalTries > 0 ? Math.round((s.totalCorrect / totalTries) * 100) : 0;
        const jobName = c.job === 'warrior' ? '전사' : c.job === 'wizard' ? '마법사' : c.job === 'healer' ? '힐러' : '탐험가';

        let row = `${a.number},"${a.name}","${a.id}","${jobName}",${c.level},${c.exp},${c.gold},${s.totalCorrect},${s.totalWrong},${acc}%,${s.totalHints},${(c.mathMonsters || []).length}`;

        for (let st = 1; st <= 12; st++) {
          const rec = s.stages[st];
          if (rec) {
            const stTries = rec.correctCount + rec.wrongCount;
            const stAcc = stTries > 0 ? Math.round((rec.correctCount / stTries) * 100) : 0;
            row += `,${rec.completed ? '완료' : '진행중'},${stAcc}%,${rec.mastery}`;
          } else {
            row += ',미진행,0%,기본';
          }
        }
        return row;
      })
      .join('\n');

    return BOM + header + rows;
  }
}
