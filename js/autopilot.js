// 1-Click Daily Autopilot Workout (Hyper-Adaptive Core Engine with Dynamic Flow State & Micro 5-Min)
class AutopilotWorkout {
  constructor() {
    this.active = false;
    this.track = 'TOEIC'; // 'TOEIC' | 'JLPT' | 'DUAL'
    this.isMicro = false; // true = 5-min micro session
    this.currentStage = 1; // 1: Vocab SRS, 2: Grammar Reflex, 3: Dictation/Shadowing, 4: Debrief
    this.stageIndex = 0;

    // Stage Containers
    this.vocabItems = [];
    this.grammarItems = [];
    this.dictationItems = [];

    // Session Metrics
    this.stage1Results = [];
    this.stage2Results = [];
    this.stage3Results = [];
    this.sessionMistakes = [];

    // Timer & Telemetry
    this.timerInterval = null;
    this.timeLeft = 20;
    this.timeMax = 20;

    this.onStateChange = null;
  }

  startSession(track = 'TOEIC', isMicro = false) {
    this.track = track;
    this.isMicro = isMicro;
    this.active = true;
    this.currentStage = 1;
    this.stageIndex = 0;
    this.stage1Results = [];
    this.stage2Results = [];
    this.stage3Results = [];
    this.sessionMistakes = [];

    window.cognitiveTelemetry.resetSession();

    this.prepareSessionData();
    if (this.onStateChange) this.onStateChange(this.getState());

    // Auto pronounce first vocab item
    setTimeout(() => {
      this.playCurrentVocabAudio();
    }, 400);
  }

  prepareSessionData() {
    const vocabCount = this.isMicro ? 2 : 5;
    const grammarCount = this.isMicro ? 2 : 6;
    const dictationCount = this.isMicro ? 1 : 3;

    if (this.track === 'TOEIC') {
      this.vocabItems = window.TOEIC_DATA.vocabBank.slice(0, vocabCount);
      // Mix Part 5 and a Part 2 blind listening question
      const part2Item = window.TOEIC_DATA.part2BlindBank[0];
      const part5Items = window.TOEIC_DATA.grammarReflexBank.slice(0, grammarCount - 1);
      this.grammarItems = [
        ...part5Items,
        {
          id: part2Item.id,
          type: 'part2_blind',
          question: part2Item.audioQuestion,
          options: part2Item.options,
          answer: part2Item.answer,
          trapType: part2Item.trapType,
          ruleVi: part2Item.ruleVi,
          explanationVi: part2Item.ruleVi
        }
      ];
      this.dictationItems = window.TOEIC_DATA.dictationBank.slice(0, dictationCount);
    } else if (this.track === 'JLPT') {
      this.vocabItems = window.JLPT_DATA.vocabBank.slice(0, vocabCount);
      // Mix grammar with Star ★ puzzle
      const starItem = window.JLPT_DATA.starPuzzleBank[0];
      const grammarNormal = window.JLPT_DATA.grammarReflexBank.slice(0, grammarCount - 1);
      this.grammarItems = [
        ...grammarNormal,
        {
          id: starItem.id,
          type: 'star_puzzle',
          question: starItem.sentenceLead,
          fragments: starItem.fragments,
          options: starItem.fragments.map(f => f.text),
          answer: starItem.starIndex - 1,
          trapType: starItem.trapType,
          ruleVi: starItem.ruleVi,
          explanationVi: starItem.explanationVi
        }
      ];
      this.dictationItems = window.JLPT_DATA.dictationBank.slice(0, dictationCount);
    } else {
      // DUAL MODE
      this.vocabItems = [
        ...window.TOEIC_DATA.vocabBank.slice(0, 2).map(i => ({ ...i, lang: 'en' })),
        ...window.JLPT_DATA.vocabBank.slice(0, 2).map(i => ({ ...i, lang: 'ja' }))
      ];
      this.grammarItems = [
        ...window.TOEIC_DATA.grammarReflexBank.slice(0, 2).map(i => ({ ...i, track: 'TOEIC' })),
        ...window.JLPT_DATA.grammarReflexBank.slice(0, 2).map(i => ({ ...i, track: 'JLPT' }))
      ];
      this.dictationItems = [
        ...window.TOEIC_DATA.dictationBank.slice(0, 1).map(i => ({ ...i, lang: 'en' })),
        ...window.JLPT_DATA.dictationBank.slice(0, 1).map(i => ({ ...i, lang: 'ja' }))
      ];
    }
  }

  getState() {
    return {
      active: this.active,
      track: this.track,
      isMicro: this.isMicro,
      currentStage: this.currentStage,
      stageIndex: this.stageIndex,
      totalInCurrentStage: this.getTotalItemsForStage(),
      currentItem: this.getCurrentItem(),
      timeLeft: this.timeLeft,
      timeMax: this.timeMax,
      stage1Results: this.stage1Results,
      stage2Results: this.stage2Results,
      stage3Results: this.stage3Results,
      sessionMistakes: this.sessionMistakes,
      isComboActive: window.cognitiveTelemetry.isComboStreakActive,
      comboStreak: window.cognitiveTelemetry.consecutiveFastCorrect
    };
  }

  getTotalItemsForStage() {
    if (this.currentStage === 1) return this.vocabItems.length;
    if (this.currentStage === 2) return this.grammarItems.length;
    if (this.currentStage === 3) return this.dictationItems.length;
    return 1;
  }

  getCurrentItem() {
    if (this.currentStage === 1) return this.vocabItems[this.stageIndex] || null;
    if (this.currentStage === 2) return this.grammarItems[this.stageIndex] || null;
    if (this.currentStage === 3) return this.dictationItems[this.stageIndex] || null;
    return null;
  }

  // --- STAGE 1: VOCAB SRS ---
  playCurrentVocabAudio() {
    const item = this.getCurrentItem();
    if (!item) return;

    if (item.kanji) {
      window.speechEngine.speak(item.kanji, 'ja', 0.95);
    } else if (item.word) {
      window.speechEngine.speak(item.word, 'en', 0.95);
    }
  }

  rateVocabCard(rating) {
    const item = this.getCurrentItem();
    if (!item) return;

    window.srsSystem.processReview(item.id, rating);
    this.stage1Results.push({ id: item.id, rating });

    if (rating === 3) {
      window.soundEngine.playTone(600, 'sine', 0.1, 0.08);
    } else if (rating === 1) {
      window.soundEngine.playTone(300, 'triangle', 0.1, 0.08);
    }

    this.stageIndex++;
    if (this.stageIndex >= this.vocabItems.length) {
      this.completeStage1();
    } else {
      if (this.onStateChange) this.onStateChange(this.getState());
      setTimeout(() => this.playCurrentVocabAudio(), 300);
    }
  }

  completeStage1() {
    window.soundEngine.playLevelUp();
    this.currentStage = 2;
    this.stageIndex = 0;
    this.startGrammarTimer();
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  // --- STAGE 2: TIMED GRAMMAR REFLEX & TELEMETRY ---
  startGrammarTimer() {
    this.clearTimer();
    this.timeLeft = 20;
    this.timeMax = 20;

    const item = this.getCurrentItem();
    if (item) {
      window.cognitiveTelemetry.startQuestion(item.id);
      // If Part 2 blind audio, pronounce the question immediately!
      if (item.type === 'part2_blind') {
        window.speechEngine.speak(item.question, 'en', 1.0);
      }

      // Background AI Prefetching: silently generate next adaptive batch
      if (this.stageIndex <= 1 && window.adaptiveAIEngine) {
        const topTrap = window.mistakeNotebook.getTopWeakness(this.track) || 'Bẫy Liên từ vs Giới từ';
        window.adaptiveAIEngine.prefetchNextBatch(topTrap, this.track);
      }
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft <= 5 && this.timeLeft > 0) {
        window.soundEngine.playTick();
      }
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.handleGrammarTimeout();
      }
      if (this.onStateChange) this.onStateChange(this.getState());
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleGrammarAnswer(selectedIndex) {
    this.clearTimer();
    const item = this.getCurrentItem();
    if (!item) return;

    const isCorrect = (selectedIndex === item.answer);
    const telemetry = window.cognitiveTelemetry.evaluateResponse(isCorrect, { quickTip3s: item.quickTip3s });

    if (isCorrect) {
      if (telemetry.classification === 'INSTANT_MASTERY') {
        window.soundEngine.playCorrect();
      } else {
        window.soundEngine.playTone(523, 'sine', 0.15, 0.1);
      }
    } else {
      window.soundEngine.playWrong();
      const trackName = item.track || (item.formulaJp || item.fragments ? 'JLPT' : 'TOEIC');
      const mistakeRecord = {
        track: trackName,
        question: item.question,
        options: item.options,
        userChoice: selectedIndex,
        correctChoice: item.answer,
        trapType: item.trapType || 'Ngữ pháp',
        ruleVi: item.ruleVi || '',
        explanationVi: item.explanationVi || '',
        quickTip3s: item.quickTip3s || 'Chú ý dấu hiệu ngữ pháp loại trừ.'
      };
      window.mistakeNotebook.addMistake(mistakeRecord);
      this.sessionMistakes.push(mistakeRecord);
    }

    this.stage2Results.push({
      id: item.id,
      correct: isCorrect,
      userChoice: selectedIndex,
      correctChoice: item.answer,
      telemetry,
      item
    });

    return {
      isCorrect,
      correctAnswer: item.answer,
      explanation: item.explanationVi,
      trapType: item.trapType,
      rule: item.ruleVi || item.formulaJp,
      telemetry
    };
  }

  handleGrammarTimeout() {
    const item = this.getCurrentItem();
    if (!item) return;
    window.soundEngine.playWrong();

    const telemetry = window.cognitiveTelemetry.evaluateResponse(false, { quickTip3s: item.quickTip3s });

    const trackName = item.track || (item.formulaJp ? 'JLPT' : 'TOEIC');
    const mistakeRecord = {
      track: trackName,
      question: item.question,
      options: item.options,
      userChoice: -1,
      correctChoice: item.answer,
      trapType: (item.trapType || 'Ngữ pháp') + ' (Hết giờ 20s)',
      ruleVi: item.ruleVi || '',
      explanationVi: item.explanationVi || ''
    };
    window.mistakeNotebook.addMistake(mistakeRecord);
    this.sessionMistakes.push(mistakeRecord);

    this.stage2Results.push({
      id: item.id,
      correct: false,
      userChoice: -1,
      correctChoice: item.answer,
      telemetry,
      item
    });
  }

  nextGrammarQuestion() {
    this.stageIndex++;
    if (this.stageIndex >= this.grammarItems.length) {
      this.completeStage2();
    } else {
      this.startGrammarTimer();
      if (this.onStateChange) this.onStateChange(this.getState());
    }
  }

  completeStage2() {
    this.clearTimer();
    window.soundEngine.playLevelUp();
    this.currentStage = 3;
    this.stageIndex = 0;
    if (this.onStateChange) this.onStateChange(this.getState());
    setTimeout(() => this.playCurrentDictationAudio(), 400);
  }

  // --- STAGE 3: LISTENING, DICTATION & SHADOWING ---
  playCurrentDictationAudio(rate = 1.0) {
    const item = this.getCurrentItem();
    if (!item) return;
    const isJp = item.lang === 'ja' || !!item.audioText.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/);
    window.speechEngine.speak(item.audioText, isJp ? 'ja' : 'en', rate);
  }

  verifyDictation(userInput) {
    const item = this.getCurrentItem();
    if (!item) return;

    const cleanUser = (userInput || '').trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "");
    const cleanTarget = item.audioText.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "");

    let matchedKeywords = 0;
    item.keywords.forEach(kw => {
      if (cleanUser.includes(kw.toLowerCase())) matchedKeywords++;
    });

    const isFullPass = (cleanUser === cleanTarget) || (matchedKeywords === item.keywords.length);

    if (isFullPass) {
      window.soundEngine.playCorrect();
    } else {
      window.soundEngine.playWrong();
      const isJp = item.lang === 'ja' || !!item.audioText.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/);
      const trackName = isJp ? 'JLPT' : 'TOEIC';
      const mistakeRecord = {
        track: trackName,
        question: `[Nghe chép] ${item.translationVi}`,
        options: [item.audioText, userInput],
        userChoice: 1,
        correctChoice: 0,
        trapType: isJp ? 'Bẫy nghe từ khóa / Hội thoại văn nói' : 'Bẫy nối âm / Nuốt âm Part 1-4',
        ruleVi: item.tipAudio || '',
        explanationVi: `Văn bản gốc: "${item.audioText}". Từ khóa then chốt: ${item.keywords.join(', ')}.`
      };
      window.mistakeNotebook.addMistake(mistakeRecord);
      this.sessionMistakes.push(mistakeRecord);
    }

    this.stage3Results.push({
      id: item.id,
      correct: isFullPass,
      userInput,
      target: item.audioText
    });

    return {
      isCorrect: isFullPass,
      targetText: item.audioText,
      keywords: item.keywords,
      tip: item.tipAudio,
      translation: item.translationVi
    };
  }

  nextDictationQuestion() {
    this.stageIndex++;
    if (this.stageIndex >= this.dictationItems.length) {
      this.completeStage3();
    } else {
      if (this.onStateChange) this.onStateChange(this.getState());
      setTimeout(() => this.playCurrentDictationAudio(), 300);
    }
  }

  completeStage3() {
    window.soundEngine.playLevelUp();
    this.currentStage = 4;
    this.stageIndex = 0;
    this.saveSessionSummary();
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  // --- STAGE 4: DEBRIEF & WEAKNESS SCAN ---
  saveSessionSummary() {
    const today = new Date().toISOString().slice(0, 10);
    const lastSession = localStorage.getItem('autopilot_last_session_date');
    let streak = parseInt(localStorage.getItem('autopilot_streak') || '0', 10);

    if (lastSession !== today) {
      streak += 1;
      localStorage.setItem('autopilot_streak', streak.toString());
      localStorage.setItem('autopilot_last_session_date', today);
    }

    // Heatmap logging
    try {
      const heatmap = JSON.parse(localStorage.getItem('autopilot_activity_heatmap') || '{}');
      heatmap[today] = (heatmap[today] || 0) + 1;
      localStorage.setItem('autopilot_activity_heatmap', JSON.stringify(heatmap));
    } catch (e) {}

    const totalWordsLearned = parseInt(localStorage.getItem('autopilot_words_count') || '0', 10) + this.vocabItems.length;
    localStorage.setItem('autopilot_words_count', totalWordsLearned.toString());
  }

  getDebriefReport() {
    const totalGrammar = this.grammarItems.length;
    const correctGrammar = this.stage2Results.filter(r => r.correct).length;
    const totalDictation = this.dictationItems.length;
    const correctDictation = this.stage3Results.filter(r => r.correct).length;

    const totalScore = correctGrammar + correctDictation;
    const maxScore = totalGrammar + totalDictation;
    const accuracy = Math.round((totalScore / maxScore) * 100);

    const telemetrySummary = window.cognitiveTelemetry.getSessionSummary();

    const detectedTraps = {};
    this.sessionMistakes.forEach(m => {
      detectedTraps[m.trapType] = (detectedTraps[m.trapType] || 0) + 1;
    });

    let primaryWeakness = Object.keys(detectedTraps)[0] || null;

    return {
      accuracy,
      correctGrammar,
      totalGrammar,
      correctDictation,
      totalDictation,
      vocabMasteredCount: this.stage1Results.filter(r => r.rating === 3).length,
      vocabTotal: this.vocabItems.length,
      sessionMistakes: this.sessionMistakes,
      primaryWeakness,
      telemetrySummary,
      track: this.track
    };
  }

  exitWorkout() {
    this.clearTimer();
    this.active = false;
    window.speechEngine.stop();
    if (this.onStateChange) this.onStateChange(this.getState());
  }
}

window.autopilotWorkout = new AutopilotWorkout();
