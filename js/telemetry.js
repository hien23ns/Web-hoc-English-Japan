// Cognitive Telemetry & Hesitation Tracker (Phễu Bắt Bài Tâm Lý & Đo Tốc Độ Phản Xạ)
class CognitiveTelemetryTracker {
  constructor() {
    this.currentQId = null;
    this.startTime = 0;
    this.optionSwitches = 0;
    this.lastOption = null;
    this.sessionLogs = [];
    this.consecutiveFastCorrect = 0;
    this.consecutiveWrong = 0;
    this.isComboStreakActive = false;
    this.onComboChange = null;
  }

  startQuestion(questionId) {
    this.currentQId = questionId;
    this.startTime = performance.now();
    this.optionSwitches = 0;
    this.lastOption = null;
  }

  recordOptionHoverOrSelect(optionIndex) {
    if (this.lastOption !== null && this.lastOption !== optionIndex) {
      this.optionSwitches++;
    }
    this.lastOption = optionIndex;
  }

  evaluateResponse(isCorrect, metadata = {}) {
    const elapsedMs = Math.round(performance.now() - this.startTime);
    const seconds = (elapsedMs / 1000).toFixed(1);

    let classification = 'NORMAL';
    let srsMultiplier = 1.0;
    let cognitiveNote = '';
    let quickTip3s = metadata.quickTip3s || "Nhìn từ khóa trước/sau chỗ trống để loại trừ ngay phương án sai trong 3 giây.";

    if (isCorrect) {
      if (elapsedMs < 8000) {
        classification = 'INSTANT_MASTERY'; // Phản xạ tuyệt đối
        srsMultiplier = 2.0; // Đẩy chu kỳ ôn xa gấp đôi
        cognitiveNote = '⚡ Phản xạ tuyệt đối (< 8s). Nắm chắc bản chất!';
        this.consecutiveFastCorrect++;
        this.consecutiveWrong = 0;
      } else if (elapsedMs >= 15000 || this.optionSwitches >= 2) {
        classification = 'SLOW_RECALL'; // Đúng nhưng phân vân / Đoán mò
        srsMultiplier = 0.5; // Xếp lịch ôn lại sớm sau 2 ngày
        cognitiveNote = `⚠️ Đúng nhưng mất tới ${seconds}s (Đoán mò/Phân vân). Cần củng cố phản xạ 3 giây!`;
        this.consecutiveFastCorrect = 0;
      } else {
        classification = 'CONFIDENT_PASS'; // Tốc độ tiêu chuẩn
        srsMultiplier = 1.2;
        cognitiveNote = `✓ Hoàn thành đúng nhịp phòng thi (${seconds}s).`;
        this.consecutiveFastCorrect++;
        this.consecutiveWrong = 0;
      }
    } else {
      classification = 'TRAP_FALL';
      srsMultiplier = 0.3;
      cognitiveNote = `✕ Mắc bẫy đề thi sau ${seconds}s. Cần khắc phục cấu trúc này!`;
      this.consecutiveWrong++;
      this.consecutiveFastCorrect = 0;
    }

    // Check Combo Streak (> 4 consecutive fast correct answers)
    const prevCombo = this.isComboStreakActive;
    if (this.consecutiveFastCorrect >= 4) {
      this.isComboStreakActive = true;
      if (!prevCombo && this.onComboChange) {
        this.onComboChange(true, this.consecutiveFastCorrect);
      }
    } else if (this.consecutiveWrong >= 2) {
      this.isComboStreakActive = false;
      if (prevCombo && this.onComboChange) {
        this.onComboChange(false, 0);
      }
    }

    const logEntry = {
      qId: this.currentQId,
      elapsedMs,
      seconds: parseFloat(seconds),
      optionSwitches: this.optionSwitches,
      isCorrect,
      classification,
      srsMultiplier,
      cognitiveNote,
      quickTip3s,
      timestamp: Date.now()
    };

    this.sessionLogs.push(logEntry);
    return logEntry;
  }

  getSessionSummary() {
    if (this.sessionLogs.length === 0) {
      return { avgResponseSec: 0, instantRate: 0, slowRecallCount: 0, comboMax: 0 };
    }

    const totalMs = this.sessionLogs.reduce((acc, l) => acc + l.elapsedMs, 0);
    const avgSec = (totalMs / this.sessionLogs.length / 1000).toFixed(1);
    const instantCount = this.sessionLogs.filter(l => l.classification === 'INSTANT_MASTERY').length;
    const slowRecallCount = this.sessionLogs.filter(l => l.classification === 'SLOW_RECALL').length;

    return {
      avgResponseSec: parseFloat(avgSec),
      instantRate: Math.round((instantCount / this.sessionLogs.length) * 100),
      slowRecallCount,
      totalQuestions: this.sessionLogs.length,
      isComboActive: this.isComboStreakActive
    };
  }

  resetSession() {
    this.sessionLogs = [];
    this.consecutiveFastCorrect = 0;
    this.consecutiveWrong = 0;
    this.isComboStreakActive = false;
  }
}

window.cognitiveTelemetry = new CognitiveTelemetryTracker();
