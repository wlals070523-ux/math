import { StudentData, StageRecord } from '../types';

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbyem856aYnHheIp2-TReNz_T8OXNk5uGb7kOoqEFE7Qfy7ErsN3F50SSXiEB1ljLiHWZA/exec';
const STORAGE_KEY_GAS_URL = 'math_rpg_gas_url';
const STORAGE_KEY_SYNC_QUEUE = 'math_rpg_gas_sync_queue';
const STORAGE_KEY_LAST_SYNC = 'math_rpg_gas_last_sync_time';

export interface GasSubmissionPayload {
  submissionId: string;
  timestamp: string;
  action: 'submitStageResult' | 'syncStudent' | 'syncAllStudents' | 'ping';
  studentId: string;
  studentName: string;
  grade: number;
  classNo: number;
  number: number;
  stageId: number;
  stageTitle?: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  tryCount: number;
  hintCount: number;
  mastery: string;
  level: number;
  exp: number;
  gold: number;
  job: string;
  collectedMonstersCount: number;
  wrongQuestionsJson?: string;
  extraDetails?: Record<string, any>;
}

export interface GasResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export class GasService {
  /**
   * Get configured Google Apps Script Web App URL
   */
  public static getGasUrl(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GAS_URL);
      return stored && stored.trim() ? stored.trim() : DEFAULT_GAS_URL;
    } catch {
      return DEFAULT_GAS_URL;
    }
  }

  /**
   * Save user configured Google Apps Script URL
   */
  public static setGasUrl(url: string): void {
    try {
      if (!url || !url.trim()) {
        localStorage.setItem(STORAGE_KEY_GAS_URL, DEFAULT_GAS_URL);
      } else {
        localStorage.setItem(STORAGE_KEY_GAS_URL, url.trim());
      }
    } catch (e) {
      console.error('[GasService] Failed to save GAS URL', e);
    }
  }

  /**
   * Get last sync timestamp string
   */
  public static getLastSyncTime(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_LAST_SYNC);
    } catch {
      return null;
    }
  }

  public static setLastSyncTime(): void {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toISOString());
    } catch {}
  }

  /**
   * Unique submission ID generator to prevent duplicate records
   */
  public static generateSubmissionId(studentId: string, stageId: number): string {
    const timeStr = Date.now().toString(36);
    const randStr = Math.random().toString(36).substring(2, 6);
    return `SUB_${studentId}_S${stageId}_${timeStr}_${randStr}`;
  }

  /**
   * Convert student stage record into standardized GAS payload
   */
  public static formatStagePayload(
    student: StudentData,
    stageId: number,
    stageRecord: Partial<StageRecord>,
    stageTitle?: string
  ): GasSubmissionPayload {
    const acc = student.account;
    const char = student.character;
    const submissionId = GasService.generateSubmissionId(acc.id, stageId);

    return {
      submissionId,
      timestamp: new Date().toISOString(),
      action: 'submitStageResult',
      studentId: acc.id,
      studentName: acc.name,
      grade: acc.grade || 3,
      classNo: acc.classNo || 3,
      number: acc.number || 1,
      stageId,
      stageTitle: stageTitle || `${stageId}차시 곱셈`,
      score: stageRecord.score ?? 100,
      correctCount: stageRecord.correctCount ?? 0,
      wrongCount: stageRecord.wrongCount ?? 0,
      tryCount: stageRecord.tryCount ?? 0,
      hintCount: stageRecord.hintCount ?? 0,
      mastery: stageRecord.mastery ?? '기본',
      level: char.level || 1,
      exp: char.exp || 0,
      gold: char.gold || 0,
      job: char.job || 'warrior',
      collectedMonstersCount: char.mathMonsters?.length || 0,
      wrongQuestionsJson: JSON.stringify(stageRecord.wrongQuestions || []),
      extraDetails: {
        streakCount: student.streakCount,
        totalCorrect: student.totalCorrect,
        totalWrong: student.totalWrong,
        characterNickname: char.nickname,
      },
    };
  }

  /**
   * POST data to Google Apps Script Web App
   * Uses text/plain payload to bypass CORS Preflight issues in Apps Script endpoints
   */
  public static async submitData(payload: GasSubmissionPayload): Promise<GasResponse> {
    const url = GasService.getGasUrl();
    if (!url) {
      return { success: false, error: 'Apps Script 웹 앱 URL이 설정되지 않았습니다.' };
    }

    try {
      // POST with text/plain body
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (HTTP ${response.status})`);
      }

      const text = await response.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Some Apps Script instances redirect or return simple string
        parsed = { success: true, message: text || '저장되었습니다.' };
      }

      GasService.setLastSyncTime();
      return {
        success: parsed.success !== false,
        message: parsed.message || '데이터가 Google Sheets에 성공적으로 저장되었습니다.',
        data: parsed.data,
      };
    } catch (err: any) {
      console.warn('[GasService] POST request error, saving to retry queue:', err);
      // Fallback: save to sync queue for later sync
      GasService.enqueueOfflinePayload(payload);
      return {
        success: false,
        error: err?.message || '네트워크 연결이 불안정하여 로컬에 안전하게 저장되었습니다.',
      };
    }
  }

  /**
   * GET data from Google Apps Script Web App
   */
  public static async fetchSheetData(): Promise<GasResponse<any>> {
    const url = GasService.getGasUrl();
    if (!url) {
      return { success: false, error: 'Apps Script URL이 비어 있습니다.' };
    }

    try {
      const fetchUrl = `${url}?action=getAllRecords&t=${Date.now()}`;
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`데이터 조회 실패 (HTTP ${response.status})`);
      }

      const resText = await response.text();
      let resJson: any;
      try {
        resJson = JSON.parse(resText);
      } catch {
        resJson = { success: false, error: '올바른 JSON 데이터 응답이 아닙니다.' };
      }

      if (resJson && resJson.success !== false) {
        GasService.setLastSyncTime();
        return {
          success: true,
          data: resJson.data || resJson.records || resJson,
          message: 'Google Sheets 데이터를 성공적으로 불러왔습니다.',
        };
      }

      return {
        success: false,
        error: resJson.error || '시트 데이터를 가져오지 못했습니다.',
      };
    } catch (err: any) {
      console.error('[GasService] GET request error:', err);
      return {
        success: false,
        error: err?.message || 'Google Apps Script 연결에 실패했습니다. 인터넷 또는 배포 설정을 확인해 주세요.',
      };
    }
  }

  /**
   * Test Connection to Google Apps Script
   */
  public static async testConnection(customUrl?: string): Promise<{
    success: boolean;
    getOk: boolean;
    postOk: boolean;
    latencyMs: number;
    message: string;
    details?: string;
  }> {
    const targetUrl = customUrl?.trim() || GasService.getGasUrl();
    const startTime = Date.now();

    let getOk = false;
    let postOk = false;
    let errorDetail = '';

    // 1. Test GET
    try {
      const getRes = await fetch(`${targetUrl}?action=ping&t=${Date.now()}`, {
        method: 'GET',
      });
      if (getRes.ok) {
        getOk = true;
      }
    } catch (e: any) {
      errorDetail += `GET 테스트 실패: ${e?.message || '연결 거부'}; `;
    }

    // 2. Test POST
    try {
      const testPayload = {
        action: 'ping',
        submissionId: `PING_${Date.now()}`,
        timestamp: new Date().toISOString(),
        test: true,
      };
      const postRes = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(testPayload),
      });
      if (postRes.ok) {
        postOk = true;
      }
    } catch (e: any) {
      errorDetail += `POST 테스트 실패: ${e?.message || '연결 오류'}; `;
    }

    const latencyMs = Date.now() - startTime;

    if (getOk || postOk) {
      return {
        success: true,
        getOk,
        postOk,
        latencyMs,
        message: 'Google Apps Script와 정상적으로 연결되었습니다.',
      };
    }

    return {
      success: false,
      getOk: false,
      postOk: false,
      latencyMs,
      message: 'Apps Script 연결에 실패했습니다.',
      details: errorDetail || '웹 앱 배포 권한이 [모든 사용자(Anyone)]로 설정되었는지 확인해 주세요.',
    };
  }

  /**
   * Offline Sync Queue Management
   */
  private static enqueueOfflinePayload(payload: GasSubmissionPayload): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
      const list: GasSubmissionPayload[] = raw ? JSON.parse(raw) : [];
      list.push(payload);
      localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(list));
    } catch {}
  }

  public static getOfflineQueueCount(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.length : 0;
    } catch {
      return 0;
    }
  }

  public static async flushOfflineQueue(): Promise<{ synced: number; failed: number }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
      if (!raw) return { synced: 0, failed: 0 };
      const list: GasSubmissionPayload[] = JSON.parse(raw);
      if (!list.length) return { synced: 0, failed: 0 };

      let synced = 0;
      let failed = 0;
      const remaining: GasSubmissionPayload[] = [];

      for (const item of list) {
        const res = await GasService.submitData(item);
        if (res.success) {
          synced++;
        } else {
          failed++;
          remaining.push(item);
        }
      }

      localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(remaining));
      return { synced, failed };
    } catch {
      return { synced: 0, failed: 0 };
    }
  }

  /**
   * Copy-paste ready Google Apps Script Sample Code
   */
  public static getSampleGasScript(): string {
    return `/**
 * 초등 3학년 2학기 1단원 곱셈 RPG - Google Apps Script 연동 스크립트
 * 구글 스프레드시트의 [확장 프로그램] > [Apps Script] 에 붙여넣고 [배포] > [새 배포] 진행
 * (중요: 액세스 권한은 "모든 사용자(Anyone)"로 선택)
 */

function doPost(e) {
  try {
    var sheet = getOrCreateSheet("학습기록");
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // Ping 테스트 처리
    if (data.action === "ping" || data.test === true) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "PONG_OK",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 중복 제출 검사 (submissionId 기준)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && data.submissionId) {
      var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < idValues.length; i++) {
        if (idValues[i][0] === data.submissionId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: "이미 저장된 제출 기록입니다 (중복 무시).",
            duplicate: true
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 데이터 행 추가
    var row = [
      data.submissionId || ("SUB_" + new Date().getTime()),
      Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
      data.studentId || "",
      data.studentName || "",
      data.grade || 3,
      data.classNo || 3,
      data.number || "",
      data.stageId || "",
      data.stageTitle || (data.stageId + "차시"),
      data.score !== undefined ? data.score : "",
      data.correctCount !== undefined ? data.correctCount : 0,
      data.wrongCount !== undefined ? data.wrongCount : 0,
      data.tryCount !== undefined ? data.tryCount : 0,
      data.hintCount !== undefined ? data.hintCount : 0,
      data.mastery || "기본",
      data.level || 1,
      data.exp || 0,
      data.gold || 0,
      data.job || "warrior",
      data.collectedMonstersCount || 0,
      data.wrongQuestionsJson || "[]"
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "성공적으로 스프레드시트에 저장되었습니다.",
      submissionId: data.submissionId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet("학습기록");
    var lastRow = sheet.getLastRow();
    
    // Ping 테스트
    if (e && e.parameter && e.parameter.action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "PONG_OK"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: [],
        message: "저장된 기록이 없습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var range = sheet.getRange(2, 1, lastRow - 1, 21);
    var values = range.getValues();
    var records = [];

    for (var i = 0; i < values.length; i++) {
      var r = values[i];
      records.push({
        submissionId: r[0],
        timestamp: r[1],
        studentId: r[2],
        studentName: r[3],
        grade: r[4],
        classNo: r[5],
        number: r[6],
        stageId: r[7],
        stageTitle: r[8],
        score: r[9],
        correctCount: r[10],
        wrongCount: r[11],
        tryCount: r[12],
        hintCount: r[13],
        mastery: r[14],
        level: r[15],
        exp: r[16],
        gold: r[17],
        job: r[18],
        collectedMonstersCount: r[19],
        wrongQuestionsJson: r[20]
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: records,
      count: records.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      "제출ID", "제출일시", "학생ID", "이름", "학년", "반", "번호",
      "차시번호", "차시명", "점수", "정답수", "오답수", "총시도",
      "힌트사용수", "도달도", "레벨", "경험치", "보유골드", "직업",
      "수집몬스터수", "오답세부내역(JSON)"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setBackground("#1E293B").setFontColor("#38BDF8").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}
`;
  }
}
