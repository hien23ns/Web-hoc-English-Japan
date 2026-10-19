// 15-Minute Mini Mock Exam Simulator & Real-time Score Predictor
class MockExamSimulator {
  constructor() {
    this.active = false;
    this.track = 'TOEIC'; // 'TOEIC' | 'JLPT'
    this.durationSec = 12 * 60; // 12 minutes for 25 questions
    this.timeLeft = this.durationSec;
    this.timer = null;
    this.currentIndex = 0;
    this.questions = [];
    this.userAnswers = {}; // { qIndex: selectedOption }
    this.onTick = null;
    this.onComplete = null;
  }

  generateExam(track = 'TOEIC') {
    this.track = track;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.timeLeft = this.durationSec;

    if (track === 'TOEIC') {
      this.questions = this.buildToeicMiniExam();
    } else {
      this.questions = this.buildJlptMiniExam();
    }

    return this.questions;
  }

  buildToeicMiniExam() {
    // 25 questions: Part 1 (2), Part 2 (5), Part 5 (10), Part 6 (4), Part 7 (4)
    const list = [];

    // Part 1
    list.push(
      { part: 'Part 1', type: 'image_audio', q: "Look at the image and select the statement that best describes what you see.", audio: "A man is organizing folders on a shelf.", options: ["A man is turning on a computer.", "A man is organizing folders on a shelf.", "A man is leaving the office.", "A man is vacuuming the carpet."], answer: 1, explanation: "Miêu tả người đàn ông đang sắp xếp tài liệu lên giá sách." },
      { part: 'Part 1', type: 'image_audio', q: "Select the best description for the conference scene.", audio: "The presentation slides are projected onto the screen.", options: ["The meeting room is completely empty.", "The presentation slides are projected onto the screen.", "Participants are standing near the door.", "The projector is being packed in a box."], answer: 1, explanation: "Miêu tả màn hình chiếu bài thuyết trình." }
    );

    // Part 2 (Blind Audio)
    window.TOEIC_DATA.part2BlindBank.forEach(item => {
      list.push({
        part: 'Part 2',
        type: 'audio_blind',
        q: item.audioQuestion,
        audio: item.audioQuestion,
        options: item.options,
        answer: item.answer,
        explanation: item.ruleVi
      });
    });
    // Add two more Part 2
    list.push(
      { part: 'Part 2', type: 'audio_blind', q: "When will the quarterly financial report be published?", audio: "When will the quarterly financial report be published?", options: ["A. In room 302.", "B. Sometime early next week.", "C. Yes, it was very informative."], answer: 1, explanation: "Hỏi 'When' -> Trả lời thời gian: 'Sometime early next week'." },
      { part: 'Part 2', type: 'audio_blind', q: "Could you help me set up the display for the trade expo?", audio: "Could you help me set up the display for the trade expo?", options: ["A. Sure, as soon as I finish this email.", "B. At the convention center.", "C. About fifty dollars."], answer: 0, explanation: "Đề nghị giúp đỡ 'Could you help...' -> Đồng ý: 'Sure, as soon as I finish this email'." }
    );

    // Part 5 (10 questions)
    window.TOEIC_DATA.grammarReflexBank.slice(0, 6).forEach(item => {
      list.push({
        part: 'Part 5',
        type: 'multiple_choice',
        q: item.question,
        options: item.options,
        answer: item.answer,
        explanation: item.explanationVi,
        trapType: item.trapType
      });
    });

    // 4 more Part 5
    list.push(
      { part: 'Part 5', type: 'multiple_choice', q: "Mr. Henderson ______ attends the annual leadership summit in London.", options: ["regularly", "regular", "regularity", "regulate"], answer: 0, explanation: "Cần trạng từ bổ nghĩa cho động từ 'attends' -> regularly." },
      { part: 'Part 5', type: 'multiple_choice', q: "The warranty remains valid ______ the product is serviced by an authorized dealer.", options: ["provided that", "in spite of", "whereas", "as well as"], answer: 0, explanation: "'Provided that' = if/với điều kiện là (liên từ nối mệnh đề)." },
      { part: 'Part 5', type: 'multiple_choice', q: "Neither the manager ______ the assistant was able to locate the missing contract file.", options: ["or", "nor", "and", "but"], answer: 1, explanation: "Cặp liên từ tương quan: Neither ... nor ... (Cả hai đều không)." },
      { part: 'Part 5', type: 'multiple_choice', q: "Our newest line of office chairs has proven remarkably ______ to everyday wear and tear.", options: ["resistant", "resist", "resistance", "resistantly"], answer: 0, explanation: "Sau be 'has proven' + adv 'remarkably' -> cần tính từ (resistant)." }
    );

    // Part 6 (4 questions)
    list.push(
      { part: 'Part 6', type: 'cloze', q: "We are pleased to inform you that your application for the account manager position has been [16] ______.", options: ["accepted", "accept", "accepting", "acceptance"], answer: 0, explanation: "Bị động sau 'has been' -> accepted." },
      { part: 'Part 6', type: 'cloze', q: "Please sign the enclosed employment contract and return it [17] ______ three business days.", options: ["within", "between", "among", "along"], answer: 0, explanation: "Within three business days: Trong vòng 3 ngày làm việc." },
      { part: 'Part 6', type: 'cloze', q: "[18] ______ our human resources team will schedule your initial orientation session.", options: ["Subsequently", "However", "Otherwise", "Although"], answer: 0, explanation: "'Subsequently' (Sau đó) đóng vai trò liên từ trạng ngữ." },
      { part: 'Part 6', type: 'cloze', q: "We look forward to [19] ______ you to our international sales division.", options: ["welcoming", "welcome", "welcomed", "welcomes"], answer: 0, explanation: "Cụm cố định: look forward to + V-ing -> welcoming." }
    );

    // Part 7 (4 questions from reading)
    const p7 = window.TOEIC_DATA.part7Passages[0];
    p7.questions.forEach((qObj, idx) => {
      list.push({
        part: 'Part 7',
        type: 'reading_comprehension',
        passageHtml: p7.passageHtml,
        q: qObj.q,
        options: qObj.options,
        answer: qObj.answer,
        clueId: qObj.clueId,
        explanation: qObj.explanationVi
      });
    });
    // Add 2 more Part 7
    list.push(
      { part: 'Part 7', type: 'reading_comprehension', passageHtml: p7.passageHtml, q: "By when must personal items be packed?", options: ["October 12", "October 31", "November 13 at 5:00 PM", "November 14"], answer: 2, explanation: "Đoạn văn ghi: 'by 5:00 PM on Thursday, November 13'." },
      { part: 'Part 7', type: 'reading_comprehension', passageHtml: p7.passageHtml, q: "In the memo, the word 'commence' is closest in meaning to:", options: ["finish", "begin", "evaluate", "cancel"], answer: 1, explanation: "Commence = begin (bắt đầu)." }
    );

    return list.slice(0, 25);
  }

  buildJlptMiniExam() {
    // 25 questions: Moji-Goi (8), Bunpou & Star ★ (7), Dokkai (5), Choukai (5)
    const list = [];

    // Moji-Goi (8 questions)
    list.push(
      { part: 'Moji-Goi', q: "あの双子の兄弟は、顔が【そっくり】だ。下線部と意味が最も近いものはどれか。", options: ["よく似ている", "少し違っている", "とても可愛い", "背が高い"], answer: 0, explanation: "そっくり = よく似ている (giống hệt nhau)." },
      { part: 'Moji-Goi', q: "来週の試合は雨天のため【延期】となった。下線部の読み方はどれか。", options: ["えんき", "えんご", "ていき", "ちゅうし"], answer: 0, explanation: "延期: えんき (duyên kỳ - hoãn lại)." },
      { part: 'Moji-Goi', q: "地震の時は【あわてて】外に飛び出さないでください。", options: ["慌てて", "焦てて", "騒てて", "急てて"], answer: 0, explanation: "あわてる: 慌てる (chữ Hoảng)." },
      { part: 'Moji-Goi', q: "何かご不明な点があれば、【遠慮】なくお尋ねください。", options: ["えんりょ", "えんき", "おんりょ", "こうりょ"], answer: 0, explanation: "遠慮: えんりょ (viễn lự - ngại ngùng, khách sáo)." },
      { part: 'Moji-Goi', q: "昨夜は疲れていたので、朝まで【ぐっすり】眠った。", options: ["深い眠りで", "少しだけ", "何度も起きて", "早く"], answer: 0, explanation: "ぐっすり眠る = ngủ say sưa một mạch tới sáng." },
      { part: 'Moji-Goi', q: "自然災害に【備えて】、水や食料を用意しておく。", options: ["そなえて", "かまえて", "たくわえて", "ととのえて"], answer: 0, explanation: "備える: そなえる (chữ Bị - phòng bị, chuẩn bị)." },
      { part: 'Moji-Goi', q: "駅前のカフェで【たまたま】高校時代の友達に会った。", options: ["偶然", "絶対に", "必ず", "時々"], answer: 0, explanation: "たまたま = 偶然 (guuzen - tình cờ, ngẫu nhiên)." },
      { part: 'Moji-Goi', q: "スマートフォンの【普及】に伴い、買い物の仕方が変わった。", options: ["ふきゅう", "ふきょう", "ふっきゅう", "ほきゅう"], answer: 0, explanation: "普及: ふきゅう (phổ cập)." }
    );

    // Bunpou & Star ★ (7 questions)
    window.JLPT_DATA.grammarReflexBank.slice(0, 5).forEach(item => {
      list.push({
        part: 'Bunpou',
        q: item.question,
        options: item.options,
        answer: item.answer,
        explanation: item.explanationVi,
        trapType: item.trapType
      });
    });

    // 2 Star ★ questions
    window.JLPT_DATA.starPuzzleBank.forEach(sp => {
      list.push({
        part: 'Star ★ Puzzle',
        type: 'star_puzzle',
        q: sp.sentenceLead,
        fragments: sp.fragments,
        options: sp.fragments.map(f => f.text),
        answer: sp.starIndex - 1,
        starAnswerText: sp.starAnswerText,
        explanation: sp.explanationVi
      });
    });

    // Dokkai (5 questions)
    const dok = window.JLPT_DATA.dokkaiPassages[0];
    list.push({
      part: 'Dokkai',
      passageHtml: dok.passageHtml,
      q: dok.questions[0].q,
      options: dok.questions[0].options,
      answer: dok.questions[0].answer,
      explanation: dok.questions[0].explanationVi
    });
    // Add 4 more Dokkai questions
    list.push(
      { part: 'Dokkai', passageHtml: dok.passageHtml, q: "都合がつかない住民は、どうすればよいですか。", options: ["前日正午までに管理事務所へ連絡する。", "作業当日に水道代を払う。", "来週の金曜日に変更する。", "何もしなくてよい。"], answer: 0, explanation: "Đoạn văn ghi: '前日正午までに管理事務所へご連絡の上、予備日への変更手続き'." },
      { part: 'Dokkai', q: "「〜に伴って」と同じ使い方の文はどれか。", options: ["時代の変化に伴って、新しい職業が生まれた。", "雨に伴って傘を買った。", "友達に伴って映画に行った。", "先生に伴って質問した。"], answer: 0, explanation: "〜に伴って: cùng với sự thay đổi thì sự việc khác thay đổi tương ứng." },
      { part: 'Dokkai', q: "「〜わけではない」の意味として最も適切なものはどれか。", options: ["絶対に〜ない", "全く〜ないわけではない（部分否定）", "〜はずがない", "〜に違いない"], answer: 1, explanation: "わけではない = phủ định một phần (không hẳn là)." },
      { part: 'Dokkai', q: "「お送りいたしました」はどのような表現か。", options: ["尊敬語", "謙譲語（自分の行為をへりくだる）", "丁寧語のみ", "命令形"], answer: 1, explanation: "お + V-masu + いたす: khiêm nhường ngữ chuẩn." }
    );

    // Choukai (5 questions)
    window.JLPT_DATA.dictationBank.forEach(d => {
      list.push({
        part: 'Choukai',
        type: 'audio_listening',
        audio: d.audioText,
        q: `[Nghe câu thoại] ${d.translationVi}`,
        options: [d.audioText, "違う内容の文 A", "違う内容の文 B", "違う内容の文 C"],
        answer: 0,
        explanation: d.tipAudio
      });
    });
    list.push(
      { part: 'Choukai', type: 'audio_listening', audio: "明日までにこの書類をチェックしておいてください。", q: "[Nghe hội thoại công sở] Người nói yêu cầu điều gì?", options: ["Kiểm tra tài liệu trước ngày mai", "In tài liệu ngay bây giờ", "Gửi bưu điện vào tuần sau", "Hủy bỏ cuộc họp"], answer: 0, explanation: "明日までにチェックしておいて = hãy kiểm tra sẵn trước ngày mai." },
      { part: 'Choukai', type: 'audio_listening', audio: "山田先生、先ほどお電話をいただいた件について伺いたいのですが。", q: "[Nghe phản xạ kính ngữ] Người nói muốn gì?", options: ["Muốn hỏi về cuộc gọi lúc nãy của thầy", "Muốn thầy gọi lại sau", "Muốn gửi quà cho thầy", "Muốn hoãn buổi học"], answer: 0, explanation: "伺いたい = muốn hỏi người trên." },
      { part: 'Choukai', type: 'audio_listening', audio: "電車が遅れたせいで、面接の時間に遅刻しちゃったんだ。", q: "[Nghe bắt ý chính] Tại sao người nói bị muộn phỏng vấn?", options: ["Do tàu điện bị trễ", "Do ngủ quên", "Do quên đường đi", "Do trời mưa bão"], answer: 0, explanation: "電車が遅れたせいで = Tại tàu điện trễ." }
    );

    return list.slice(0, 25);
  }

  startExam() {
    this.active = true;
    this.timeLeft = this.durationSec;
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.onTick) this.onTick(this.timeLeft);
      if (this.timeLeft <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  selectAnswer(qIndex, optionIndex) {
    this.userAnswers[qIndex] = optionIndex;
  }

  submitExam() {
    if (this.timer) clearInterval(this.timer);
    this.active = false;

    let correctCount = 0;
    const details = [];

    this.questions.forEach((q, idx) => {
      const chosen = this.userAnswers[idx];
      const isCorrect = (chosen !== undefined && chosen === q.answer);
      if (isCorrect) correctCount++;

      details.push({
        index: idx,
        question: q,
        userChoice: chosen,
        isCorrect
      });

      // Save mistake if wrong
      if (!isCorrect) {
        window.mistakeNotebook.addMistake({
          track: this.track,
          question: q.q,
          options: q.options,
          userChoice: chosen !== undefined ? chosen : -1,
          correctChoice: q.answer,
          trapType: q.part + ' (Mini Mock Exam)',
          ruleVi: q.explanation || '',
          explanationVi: q.explanation || ''
        });
      }
    });

    const accuracy = Math.round((correctCount / this.questions.length) * 100);
    const scoreEstimator = this.calculateEstimatedScore(correctCount, this.questions.length, this.track);

    const report = {
      track: this.track,
      totalQuestions: this.questions.length,
      correctCount,
      accuracy,
      timeSpentSec: this.durationSec - this.timeLeft,
      scoreEstimator,
      details
    };

    if (this.onComplete) this.onComplete(report);
    return report;
  }

  /**
   * Real-Time Score Estimator Algorithm (TOEIC & JLPT N3)
   */
  calculateEstimatedScore(correct, total, track) {
    const ratio = correct / total;

    if (track === 'TOEIC') {
      // TOEIC 650+ Estimator (scaled up to 990)
      // Minimum base score: 200. Max: 990. 70% accuracy ~ 650
      let listeningScaled = Math.round(100 + ratio * 380);
      let readingScaled = Math.round(90 + ratio * 360);
      let totalToeic = Math.min(990, listeningScaled + readingScaled);

      let targetPass = totalToeic >= 650;
      return {
        totalScore: totalToeic,
        maxScore: 990,
        subScores: [
          { name: 'Listening (Part 1-4)', score: listeningScaled, max: 495 },
          { name: 'Reading (Part 5-7)', score: readingScaled, max: 495 }
        ],
        targetMet: targetPass,
        verdict: targetPass ? "ĐẠT CHUẨN 650+ (Sẵn sàng thi thật!)" : `Chưa đạt 650+ (Cần bù thêm ${650 - totalToeic} điểm)`
      };
    } else {
      // JLPT N3 Estimator (scaled up to 180, pass cutoff: 95/180 and >= 19 per section)
      let mojiGoiBunpou = Math.round(ratio * 60);
      let dokkai = Math.round(ratio * 58);
      let choukai = Math.round(ratio * 60);
      let totalJlpt = mojiGoiBunpou + dokkai + choukai;

      let hasSectionFailure = (mojiGoiBunpou < 19 || dokkai < 19 || choukai < 19);
      let passed = (totalJlpt >= 95 && !hasSectionFailure);

      return {
        totalScore: totalJlpt,
        maxScore: 180,
        subScores: [
          { name: 'Kiến thức ngôn ngữ (Từ vựng/Chữ Hán/Ngữ pháp)', score: mojiGoiBunpou, max: 60, isCutoffWarning: mojiGoiBunpou < 19 },
          { name: 'Đọc hiểu (Dokkai)', score: dokkai, max: 60, isCutoffWarning: dokkai < 19 },
          { name: 'Nghe hiểu (Choukai)', score: choukai, max: 60, isCutoffWarning: choukai < 19 }
        ],
        targetMet: passed,
        verdict: passed ? "ĐỖ N3 (Vượt qua điểm chuẩn 95/180)" : (hasSectionFailure ? "TRƯỢT LIỆT KỸ NĂNG (< 19 điểm)" : "CHƯA ĐẠT ĐIỂM CHUẨN (Cần >= 95)")
      };
    }
  }

  exitExam() {
    if (this.timer) clearInterval(this.timer);
    this.active = false;
  }
}

window.mockExamSimulator = new MockExamSimulator();
