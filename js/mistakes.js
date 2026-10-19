// Auto-Mistake Notebook (3-Strike Mastery ⚪⚪⚪ -> 🟢🟢🟢 + Ma trận Kanji & Paraphrase Map)
class MistakeNotebook {
  constructor() {
    this.storageKey = 'autopilot_mistakes_notebook_v2';
    this.mistakes = this.loadMistakes();
  }

  loadMistakes() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);

      // Pre-seed with rich mistakes demonstrating 3-Strike & Confusion Matrix
      return [
        {
          id: "seed_toeic_01",
          track: "TOEIC",
          question: "______ the severe weather conditions, the delivery trucks arrived on time.",
          options: ["Despite", "Although", "Because", "Even though"],
          userChoice: 1, // Although
          correctChoice: 0, // Despite
          trapType: "Bẫy Liên từ vs Giới từ",
          ruleVi: "Sau chỗ trống là Cụm danh từ 'the severe weather conditions' -> Cần giới từ Despite.",
          explanationVi: "Although / Even though phải đi với mệnh đề có S + V. Vì không có động từ chính nên phải dùng giới từ Despite.",
          quickTip3s: "Nhìn sau chỗ trống: KHÔNG có động từ chia thì -> Loại ngay Although/Even though.",
          paraphraseMap: [
            { original: "severe weather conditions", synonym: "extreme weather / bad weather" },
            { original: "on time", synonym: "punctually / as scheduled" }
          ],
          strikeCount: 1, // 🟢⚪⚪
          timestamp: Date.now() - 86400000,
          nextDueTime: Date.now() - 3600000,
          timesFailed: 1,
          mastered: false
        },
        {
          id: "seed_jlpt_01",
          track: "JLPT",
          question: "祖母は毎朝、近所の公園______散歩するのが日課です。",
          options: ["を", "に", "で", "へ"],
          userChoice: 2, // で
          correctChoice: 0, // を
          trapType: "Bẫy Trợ từ chuyển động (〜を散歩する)",
          ruleVi: "Khi đi dạo, băng qua không gian chuyển động phải dùng trợ từ 'を', không dùng 'で'.",
          explanationVi: "Dù diễn ra ở công viên nhưng với động từ di chuyển trong không gian (散歩する, 歩く, 走る), tiếng Nhật chuẩn bắt buộc dùng trợ từ を.",
          quickTip3s: "Động từ chuyển động xuyên qua không gian (散歩, 渡る, 飛ぶ) -> Bắt buộc chọn trợ từ を.",
          kanjiMatrix: [
            { kanji: "散", hanViet: "TÁN", meaning: "Tản bộ, phân tán", lookAlikes: ["欺 (Khi - lừa dối)", "期 (Kỳ - thời kỳ)"] },
            { kanji: "歩", hanViet: "BỘ", meaning: "Đi bộ", lookAlikes: ["止 (Chỉ - dừng)", "渉 (Thiệp - can thiệp)"] }
          ],
          strikeCount: 0, // ⚪⚪⚪
          timestamp: Date.now() - 172800000,
          nextDueTime: Date.now() - 7200000,
          timesFailed: 2,
          mastered: false
        }
      ];
    } catch (e) {
      console.warn("Error loading mistake notebook", e);
      return [];
    }
  }

  saveMistakes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.mistakes));
      window.dispatchEvent(new CustomEvent('mistakes-updated', { detail: { count: this.mistakes.length } }));
    } catch (e) {
      console.warn("Error saving mistake notebook", e);
    }
  }

  addMistake(item) {
    const existingIndex = this.mistakes.findIndex(m => m.question === item.question);
    if (existingIndex > -1) {
      const rec = this.mistakes[existingIndex];
      rec.timesFailed = (rec.timesFailed || 1) + 1;
      rec.userChoice = item.userChoice;
      rec.strikeCount = 0; // Reset 3-strike progress on failure
      rec.mastered = false;
      rec.timestamp = Date.now();
      rec.nextDueTime = Date.now() + 86400000; // review tomorrow
    } else {
      const newEntry = {
        id: item.id || 'mistake_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        track: item.track || 'TOEIC',
        question: item.question,
        options: item.options || [],
        userChoice: item.userChoice,
        correctChoice: item.correctChoice,
        trapType: item.trapType || 'Lỗi ngữ pháp',
        ruleVi: item.ruleVi || '',
        explanationVi: item.explanationVi || '',
        quickTip3s: item.quickTip3s || 'Xem xét kỹ từ khóa bổ nghĩa phía trước hoặc sau chỗ trống.',
        paraphraseMap: item.paraphraseMap || [],
        kanjiMatrix: item.kanjiMatrix || [],
        strikeCount: 0, // ⚪⚪⚪
        timestamp: Date.now(),
        nextDueTime: Date.now() + 86400000,
        timesFailed: 1,
        mastered: false
      };
      this.mistakes.unshift(newEntry);
    }
    this.saveMistakes();
  }

  /**
   * Process re-test drill result for 3-Strike Mastery
   */
  processDrillAttempt(id, isCorrect, responseTimeMs = 8000) {
    const item = this.mistakes.find(m => m.id === id);
    if (!item) return;

    if (isCorrect && responseTimeMs < 12000) {
      item.strikeCount = Math.min(3, (item.strikeCount || 0) + 1);
      if (item.strikeCount >= 3) {
        item.mastered = true; // Stamped Mastered!
        item.nextDueTime = Date.now() + 30 * 86400000;
      } else if (item.strikeCount === 1) {
        item.nextDueTime = Date.now() + 3 * 86400000; // 3 days
      } else if (item.strikeCount === 2) {
        item.nextDueTime = Date.now() + 7 * 86400000; // 7 days
      }
    } else {
      // Failed or too slow (> 12s)
      item.strikeCount = 0;
      item.mastered = false;
      item.nextDueTime = Date.now() + 86400000;
    }

    this.saveMistakes();
    return item;
  }

  markMastered(id, status = true) {
    const item = this.mistakes.find(m => m.id === id);
    if (item) {
      item.mastered = status;
      item.strikeCount = status ? 3 : 0;
      this.saveMistakes();
    }
  }

  removeMistake(id) {
    this.mistakes = this.mistakes.filter(m => m.id !== id);
    this.saveMistakes();
  }

  getFiltered(track = 'all', tag = 'all', filterStatus = 'all') {
    return this.mistakes.filter(m => {
      if (track !== 'all' && m.track !== track) return false;
      if (tag !== 'all' && m.trapType !== tag) return false;
      if (filterStatus === 'unmastered' && m.mastered) return false;
      if (filterStatus === 'mastered' && !m.mastered) return false;
      return true;
    });
  }

  getTrapDistribution(track = 'all') {
    const map = {};
    this.mistakes.forEach(m => {
      if (track === 'all' || m.track === track) {
        const key = m.trapType || 'Khác';
        map[key] = (map[key] || 0) + (m.timesFailed || 1);
      }
    });
    return map;
  }

  getTopWeakness(track = 'all') {
    const dist = this.getTrapDistribution(track);
    let topTrap = null;
    let max = -1;
    for (const [trap, count] of Object.entries(dist)) {
      if (count > max) {
        max = count;
        topTrap = trap;
      }
    }
    return topTrap;
  }

  exportData() {
    return JSON.stringify(this.mistakes, null, 2);
  }

  importData(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        this.mistakes = parsed;
        this.saveMistakes();
        return true;
      }
    } catch (e) {
      console.warn("Import failed", e);
    }
    return false;
  }

  clear() {
    this.mistakes = [];
    this.saveMistakes();
  }
}

window.mistakeNotebook = new MistakeNotebook();
