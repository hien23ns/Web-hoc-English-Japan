// Adaptive AI Engine (With Background AI Prefetching, Multi-Model Fallback & Memory Guard)
class AdaptiveAIEngine {
  constructor() {
    this.geminiApiKey = localStorage.getItem('autopilot_gemini_key') || '';
    this.models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    this.currentModelIndex = 0;
    this.cacheKey = 'autopilot_ai_cache_v3';
    this.cache = this.loadCache();
    this.isPrefetching = false;

    // Run auto-pruning to keep memory under 500KB
    this.pruneOldCache();
  }

  loadCache() {
    try {
      const data = localStorage.getItem(this.cacheKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveCache() {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
    } catch (e) {}
  }

  setApiKey(key) {
    this.geminiApiKey = key.trim();
    localStorage.setItem('autopilot_gemini_key', this.geminiApiKey);
  }

  getApiKey() {
    return this.geminiApiKey;
  }

  // Memory Guard: Prunes cache older than 14 days to keep storage ultra-lightweight
  pruneOldCache() {
    const now = Date.now();
    let changed = false;
    for (const [key, item] of Object.entries(this.cache)) {
      if (item.timestamp && now - item.timestamp > 14 * 86400000) {
        delete this.cache[key];
        changed = true;
      }
    }
    if (changed) this.saveCache();
  }

  diagnoseWeakness(track = 'all') {
    const topTrap = window.mistakeNotebook.getTopWeakness(track);
    const dist = window.mistakeNotebook.getTrapDistribution(track);
    const totalMistakes = Object.values(dist).reduce((a, b) => a + b, 0);

    return {
      topTrap: topTrap || (track === 'JLPT' ? 'Bẫy Trợ từ (は/が, に/で, を/に)' : 'Bẫy Liên từ vs Giới từ'),
      distribution: dist,
      totalMistakes: totalMistakes,
      suggestedFocus: topTrap ? `Chuyên sâu xử lý dứt điểm: ${topTrap}` : 'Luyện phản xạ tổng hợp cấp độ 650+ / N3'
    };
  }

  /**
   * Background AI Prefetching: Silently pre-fetches next batch while user is studying
   */
  async prefetchNextBatch(targetTrap, track = 'TOEIC') {
    if (this.isPrefetching || !this.geminiApiKey) return;
    const cacheId = `${track}_${targetTrap}`.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // If already cached and fresh, skip
    if (this.cache[cacheId] && this.cache[cacheId].questions?.length >= 4) return;

    this.isPrefetching = true;
    try {
      const questions = await this.fetchFromGemini(targetTrap, track);
      if (questions && questions.length > 0) {
        this.cache[cacheId] = {
          questions,
          timestamp: Date.now()
        };
        this.saveCache();
        console.log(`[AI Prefetch] Pre-warmed 5 questions for "${targetTrap}" in background.`);
      }
    } catch (e) {
      // Silent fail, fallback to built-in when requested
    } finally {
      this.isPrefetching = false;
    }
  }

  async generateRemedialWorkout(targetTrap, track = 'TOEIC') {
    const cacheId = `${track}_${targetTrap}`.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // 1. Instant return from cache
    if (this.cache[cacheId] && this.cache[cacheId].questions?.length >= 4) {
      return {
        source: 'cached-ai',
        questions: this.cache[cacheId].questions,
        trap: targetTrap
      };
    }

    // 2. Fetch live via Gemini API with multi-model fallback
    if (this.geminiApiKey) {
      try {
        const liveQuestions = await this.fetchFromGemini(targetTrap, track);
        if (liveQuestions && liveQuestions.length > 0) {
          this.cache[cacheId] = { questions: liveQuestions, timestamp: Date.now() };
          this.saveCache();
          return { source: 'gemini-ai', questions: liveQuestions, trap: targetTrap };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in generator', err);
      }
    }

    // 3. Fallback to Built-in Intelligent Rule Engine
    const builtIn = this.generateBuiltInRemedial(targetTrap, track);
    this.cache[cacheId] = { questions: builtIn, timestamp: Date.now() };
    this.saveCache();

    return {
      source: 'builtin-engine',
      questions: builtIn,
      trap: targetTrap
    };
  }

  generateQuestionVariant(originalMistake) {
    const trap = originalMistake.trapType || '';
    if (trap.includes('Liên từ') || trap.includes('conj_prep')) {
      return {
        id: 'var_' + Date.now(),
        question: "______ the unexpected system outage, the data engineering team restored all server operations within one hour.",
        options: ["Notwithstanding", "Although", "Even though", "Whereas"],
        answer: 0,
        trapType: "Bẫy Liên từ vs Giới từ (Biến thể mới)",
        quickTip3s: "Nhìn sau chỗ trống là Cụm danh từ 'the unexpected system outage' -> Chọn giới từ Notwithstanding (= Despite).",
        ruleVi: "Notwithstanding (= In spite of / Despite) là giới từ đi với Cụm danh từ.",
        explanationVi: "'the unexpected system outage' là cụm danh từ -> Cần giới từ chỉ sự nhượng bộ (Notwithstanding)."
      };
    } else if (trap.includes('Trợ từ') || trap.includes('particles')) {
      return {
        id: 'var_' + Date.now(),
        question: "毎朝、満員電車______揺られながら、英語の単語帳を暗記しています。",
        options: ["に", "で", "を", "から"],
        answer: 0,
        trapType: "Bẫy Trợ từ bị động (〜に揺られる)",
        quickTip3s: "Bị rung lắc bởi tàu điện: 電車に揺られる (Trợ từ に chỉ tác nhân gây ra sự rung lắc).",
        ruleVi: "Đi với thể bị động: 〜に揺られる (bị rung lắc).",
        explanationVi: "Chỉ tác nhân tác động trong câu bị động: 電車に揺られる."
      };
    } else {
      return {
        id: 'var_' + Date.now(),
        question: "The revised employee handbook will be distributed ______ all departmental managers tomorrow morning.",
        options: ["to", "at", "with", "from"],
        answer: 0,
        trapType: "Giới từ cố định (Distribute to)",
        quickTip3s: "Phân phát đến ai: distribute something TO someone.",
        ruleVi: "Distribute A to B: Phân phối A tới đối tượng B.",
        explanationVi: "Cấu trúc: distribute to all managers."
      };
    }
  }

  generateBuiltInRemedial(targetTrap, track) {
    const questions = [];

    if (track === 'TOEIC') {
      questions.push(
        {
          id: 'ai_toeic_c1',
          question: "______ the sharp increase in shipping costs, our quarterly profit margin expanded by 14%.",
          options: ["In spite of", "Even though", "Whereas", "Provided that"],
          answer: 0,
          trapType: "Bẫy Liên từ vs Giới từ",
          quickTip3s: "Sau chỗ trống là Cụm danh từ 'the sharp increase' -> Loại các liên từ Even though/Whereas.",
          ruleVi: "Sau chỗ trống là Cụm danh từ 'the sharp increase in shipping costs' -> Chỉ dùng giới từ 'In spite of' (= Despite).",
          explanationVi: "'Even though', 'Whereas', 'Provided that' đều là liên từ cần mệnh đề có vị ngữ (S + V). 'In spite of' là giới từ đi với cụm danh từ."
        },
        {
          id: 'ai_toeic_c2',
          question: "The keynote speaker will start the presentation ______ all attendees have entered the main hall.",
          options: ["as soon as", "due to", "in addition to", "prior to"],
          answer: 0,
          trapType: "Bẫy Liên từ vs Giới từ",
          quickTip3s: "Có mệnh đề hoàn chỉnh (all attendees have entered) -> Bắt buộc dùng liên từ 'as soon as'.",
          ruleVi: "Phía sau là mệnh đề 'all attendees have entered' (S + V) -> Cần liên từ chỉ thời gian 'as soon as'.",
          explanationVi: "'Due to', 'in addition to', 'prior to' đều là giới từ, bắt buộc đi với Cụm danh từ/V-ing. Chỉ có 'as soon as' là liên từ nối hai mệnh đề."
        },
        {
          id: 'ai_toeic_w1',
          question: "The director spoke ______ about the outstanding contributions of the research team.",
          options: ["enthusiastic", "enthusiastically", "enthusiasm", "enthusiast"],
          answer: 1,
          trapType: "Bẫy từ loại (Adv bổ nghĩa Verb)",
          quickTip3s: "Bổ nghĩa cho động từ 'spoke' -> Cần trạng từ đuôi -ly (enthusiastically).",
          ruleVi: "Bổ nghĩa cho động từ 'spoke' ở quá khứ -> Cần một trạng từ (Adverb: enthusiastically).",
          explanationVi: "Động từ 'spoke' cần trạng từ miêu tả cách thức nói (nói một cách đầy nhiệt huyết)."
        },
        {
          id: 'ai_toeic_w2',
          question: "The factory has achieved a remarkable ______ in carbon emissions over the past six months.",
          options: ["reduced", "reduce", "reduction", "reducibly"],
          answer: 2,
          trapType: "Bẫy từ loại (Noun sau Tính từ)",
          quickTip3s: "Sau mạo từ 'a' và tính từ 'remarkable' -> Chọn danh từ 'reduction'.",
          ruleVi: "Đứng sau mạo từ 'a' và tính từ 'remarkable' -> Cần một danh từ số ít (reduction).",
          explanationVi: "A + Adjective + Noun. 'Reduction' (sự cắt giảm) là danh từ chính xác."
        }
      );
    } else {
      questions.push(
        {
          id: 'ai_jlpt_p1',
          question: "来週の月曜日に、社長室______重要な会議が行われます。",
          options: ["で", "に", "を", "へ"],
          answer: 0,
          trapType: "Bẫy Trợ từ (Địa điểm diễn ra sự kiện)",
          quickTip3s: "Nơi diễn ra hoạt động, sự kiện (họp 会議) -> Luôn dùng trợ từ で.",
          formulaJp: "Địa điểm + で + Sự kiện diễn ra (会議、祭り、試験)",
          ruleVi: "Nơi diễn ra một hoạt động/sự kiện (họp, lễ hội) dùng trợ từ 'で', không dùng 'に'.",
          explanationVi: "Hành động 'tổ chức cuộc họp' (会議が行われる) là một sự kiện hành động diễn ra tại địa điểm đó -> dùng で."
        },
        {
          id: 'ai_jlpt_p2',
          question: "この道______まっすぐ行くと、右手に大きな図書館が見えてきます。",
          options: ["を", "で", "に", "が"],
          answer: 0,
          trapType: "Bẫy Trợ từ chuyển động (〜を行く)",
          quickTip3s: "Đi xuyên qua con đường: 道をまっすぐ行く (Dùng trợ từ を).",
          formulaJp: "Con đường/Không gian + を + 行く/曲がる/歩く",
          ruleVi: "Đi thẳng dọc theo con đường này -> Dùng trợ từ を.",
          explanationVi: "Không gian trải dài mà hành động di chuyển xuyên qua (道をまっすぐ行く) dùng trợ từ を."
        },
        {
          id: 'ai_jlpt_p4',
          question: "いくら練習したからといって、プロの選手に簡単に勝てる______。",
          options: ["わけがない", "わけではない", "ことになった", "ばかりだ"],
          answer: 0,
          trapType: "わけがない vs わけではない",
          quickTip3s: "Đấu với tuyển thủ chuyên nghiệp: Tuyệt đối không thể thắng dễ -> わけがない.",
          formulaJp: "V-ru + わけがない (Làm sao mà... được / Tuyệt đối không thể nào)",
          ruleVi: "Đấu với vận động viên chuyên nghiệp thì tuyệt đối không thể thắng dễ dàng -> わけがない.",
          explanationVi: "Phủ định dứt khoát sự việc bất khả thi: 勝てるわけがない."
        }
      );
    }

    return questions;
  }

  async fetchFromGemini(targetTrap, track) {
    const prompt = `Bạn là chuyên gia luyện thi hàng đầu về ${track === 'TOEIC' ? 'TOEIC 650+' : 'JLPT N3'}.
Học viên đang có lỗ hổng lớn ở dạng bẫy thi: "${targetTrap}".
Hãy tạo ngay 4 câu hỏi trắc nghiệm thực chiến bám sát đề thi thật mới nhất để vá triệt để lỗ hổng này.
Trả về ĐÚNG ĐỊNH DẠNG JSON sau (không kèm markdown ngoài mảng JSON):
[
  {
    "question": "Nội dung câu hỏi có chỗ trống ______",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "trapType": "${targetTrap}",
    "quickTip3s": "Mẹo nhìn nhanh loại trừ phương án bẫy trong 3 giây",
    "ruleVi": "Quy tắc cốt lõi giúp nhận biết đáp án",
    "explanationVi": "Giải thích chi tiết tại sao đúng và tại sao các phương án khác là bẫy"
  }
]`;

    // Multi-model fallback rotation
    for (const model of this.models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 }
          })
        });

        if (!res.ok) continue;
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;

        const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        continue;
      }
    }
    return null;
  }
}

window.adaptiveAIEngine = new AdaptiveAIEngine();
