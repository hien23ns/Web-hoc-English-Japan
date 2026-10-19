// Main Application Logic & UI Coordinator (Hyper-Adaptive Exam Engine)
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentTrack: 'TOEIC', // 'TOEIC' | 'JLPT' | 'DUAL'
    activeTab: 'autopilot',
    currentPhaseFilter: 'all',
    currentVocabFilter: 'all',
    currentVocabSearch: '',
    dictationSpeed: 1.0,
    currentRemedialSession: null,
    isZenMode: false
  };

  // Register PWA Service Worker (Always check for updates)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(reg => {
      reg.update().catch(() => {});
    }).catch(err => {
      console.warn("Service worker registration failed", err);
    });
  }

  // DOM Elements
  const trackButtons = document.querySelectorAll('.track-btn');
  const navTabButtons = document.querySelectorAll('.nav-tab-btn');
  const viewSections = document.querySelectorAll('.view-section');
  const muteBtn = document.getElementById('mute-toggle-btn');
  const whiteNoiseBtn = document.getElementById('white-noise-btn');
  const zenModeBtn = document.getElementById('zen-mode-btn');
  const zenExitFloatingBtn = document.getElementById('zen-exit-floating-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const saveApiKeyBtn = document.getElementById('save-api-key-btn');
  const geminiKeyInput = document.getElementById('gemini-api-key');
  const btnBackupData = document.getElementById('btn-backup-data');
  const btnRestoreData = document.getElementById('btn-restore-data');
  const restoreFileInput = document.getElementById('restore-file-input');

  // Stats Elements
  const streakCountEl = document.getElementById('streak-count');
  const wordsLearnedEl = document.getElementById('stat-words-learned');
  const grammarAccuracyEl = document.getElementById('stat-grammar-acc');
  const weaknessesCountEl = document.getElementById('stat-weaknesses-count');
  const predictedScoreBadge = document.getElementById('predicted-score-badge');

  // Hero Autopilot Elements
  const btnStartHeroAutopilot = document.getElementById('btn-start-hero-autopilot');
  const btnStartMicroAutopilot = document.getElementById('btn-start-micro-autopilot');
  const workoutOverlay = document.getElementById('workout-overlay');
  const btnCloseWorkout = document.getElementById('close-workout-btn');
  const workoutBody = document.getElementById('workout-body');
  const stageDots = document.querySelectorAll('.stage-dot');
  const currentStageBadge = document.getElementById('current-stage-badge');

  // Syllabus Container
  const syllabusGrid = document.getElementById('syllabus-grid');
  const phaseFilterBtns = document.querySelectorAll('.phase-filter-btn');

  // Mistake Notebook Elements
  const mistakeListEl = document.getElementById('mistake-list');
  const mistakeTrackFilter = document.getElementById('mistake-track-filter');
  const mistakeTagFilter = document.getElementById('mistake-tag-filter');
  const mistakeStatusFilter = document.getElementById('mistake-status-filter');
  const btnExportMistakes = document.getElementById('btn-export-mistakes');

  // AI Tab Elements
  const btnAiGenerateNow = document.getElementById('btn-ai-generate-now');
  const weaknessCardsContainer = document.getElementById('weakness-cards-container');
  const remedialModal = document.getElementById('remedial-modal');
  const closeRemedialBtn = document.getElementById('close-remedial-btn');
  const remedialModalBody = document.getElementById('remedial-modal-body');

  // Hands-Free Podcast Player Elements
  const podcastPlayerWidget = document.getElementById('podcast-player-widget');
  const btnPodcastToggle = document.getElementById('btn-podcast-toggle');
  const btnPodcastPlayPause = document.getElementById('btn-podcast-play-pause');
  const btnPodcastNext = document.getElementById('btn-podcast-next');
  const btnPodcastPrev = document.getElementById('btn-podcast-prev');
  const podcastTrackTitle = document.getElementById('podcast-track-title');
  const podcastStepBadge = document.getElementById('podcast-step-badge');
  const podcastDisc = document.getElementById('podcast-disc');

  // Mock Exam Elements
  const btnStartMockExam = document.getElementById('btn-start-mock-exam');
  const mockExamContainer = document.getElementById('mock-exam-container');
  const mockExamPrelaunch = document.getElementById('mock-exam-prelaunch');
  const mockTimerEl = document.getElementById('mock-timer-display');
  const mockQNavPills = document.getElementById('mock-q-nav-pills');
  const mockQArea = document.getElementById('mock-q-area');
  const btnSubmitMock = document.getElementById('btn-submit-mock');
  const mockScoreResultBox = document.getElementById('mock-score-result-box');

  // Heatmap Element
  const heatmapGridEl = document.getElementById('heatmap-grid');

  // ----------------------------------------------------
  // INITIALIZATION
  // ----------------------------------------------------
  function initApp() {
    updateStatsDisplay();
    renderSyllabus();
    renderMistakes();
    renderAIWeaknesses();
    renderVocabVault();
    renderHeatmap();
    setupEventListeners();
    setupAutopilotListener();
    setupGlobalKeyboardShortcuts();
    setupPodcastListener();

    if (geminiKeyInput) {
      geminiKeyInput.value = window.adaptiveAIEngine.getApiKey();
    }

    // Telemetry combo change listener
    window.cognitiveTelemetry.onComboChange = (isActive, streak) => {
      document.body.classList.toggle('combo-streak-active', isActive);
      if (isActive) {
        window.soundEngine.playComboStreak();
      }
    };
  }

  // ----------------------------------------------------
  // STATS & METRICS DISPLAY
  // ----------------------------------------------------
  function updateStatsDisplay() {
    const streak = localStorage.getItem('autopilot_streak') || '3';
    if (streakCountEl) streakCountEl.textContent = `${streak} Ngày`;

    const words = localStorage.getItem('autopilot_words_count') || '64';
    if (wordsLearnedEl) wordsLearnedEl.textContent = words;

    const unmasteredMistakes = window.mistakeNotebook.getFiltered(state.currentTrack, 'all', 'unmastered');
    if (weaknessesCountEl) weaknessesCountEl.textContent = `${unmasteredMistakes.length} Dạng bẫy`;

    if (grammarAccuracyEl) grammarAccuracyEl.textContent = '86%';

    // Predict real-time score based on track and unmastered mistakes
    if (predictedScoreBadge) {
      if (state.currentTrack === 'TOEIC') {
        const est = 640 + Math.max(0, 100 - unmasteredMistakes.length * 20);
        predictedScoreBadge.innerHTML = `Dự kiến: <strong style="color: #60a5fa;">${Math.min(990, est)}/990</strong>`;
      } else if (state.currentTrack === 'JLPT') {
        const est = 110 + Math.max(0, 30 - unmasteredMistakes.length * 8);
        predictedScoreBadge.innerHTML = `Dự kiến: <strong style="color: #fb7185;">${Math.min(180, est)}/180 (ĐỖ)</strong>`;
      } else {
        predictedScoreBadge.innerHTML = `Dự kiến: <strong style="color: #fbbf24;">680+ & 115+</strong>`;
      }
    }
  }

  // ----------------------------------------------------
  // 60-DAY DILIGENCE HEATMAP RENDERER (GITHUB STYLE)
  // ----------------------------------------------------
  function renderHeatmap() {
    if (!heatmapGridEl) return;
    heatmapGridEl.innerHTML = '';

    const heatmapData = JSON.parse(localStorage.getItem('autopilot_activity_heatmap') || '{}');
    const today = new Date();

    // Render 60 days backwards
    for (let i = 59; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const count = heatmapData[dateKey] || (i === 0 ? 1 : (i % 3 === 0 ? 2 : (i % 7 === 0 ? 3 : 0)));

      let levelClass = '';
      if (count >= 3) levelClass = 'level-4';
      else if (count === 2) levelClass = 'level-3';
      else if (count === 1) levelClass = 'level-2';

      const cell = document.createElement('div');
      cell.className = `heatmap-cell ${levelClass}`;
      cell.title = `${dateKey}: ${count} buổi học hoàn thành`;
      heatmapGridEl.appendChild(cell);
    }
  }

  // ----------------------------------------------------
  // TRACK SWITCHING (TOEIC / JLPT / DUAL)
  // ----------------------------------------------------
  function setTrack(track) {
    state.currentTrack = track;
    trackButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.track === track);
    });

    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroPill = document.getElementById('hero-pill-track');

    if (track === 'TOEIC') {
      heroTitle.textContent = "1-Click TOEIC 650+ Daily Workout";
      heroDesc.textContent = "Tự động hóa 100%: 5 từ vựng hợp đồng/nhân sự -> Phản xạ Part 5 bấm giờ 20s -> Nghe chép Part 1-4 & Shadowing -> Báo cáo điểm yếu.";
      heroPill.textContent = "🇬🇧 TOEIC 650+ ZERO-EFFORT";
      heroPill.className = "hero-pill-tag badge-toeic";
    } else if (track === 'JLPT') {
      heroTitle.textContent = "1-Click JLPT N3 Daily Workout";
      heroDesc.textContent = "Tự động hóa 100%: 5 Kanji & Ma trận chữ giống nhau -> Phản xạ Dấu sao ★ & Trợ từ -> Nghe chép hội thoại N3 -> Vá lỗ hổng kính ngữ.";
      heroPill.textContent = "🇯🇵 JLPT N3 ZERO-EFFORT";
      heroPill.className = "hero-pill-tag badge-jlpt";
    } else {
      heroTitle.textContent = "1-Click Dual Combo: TOEIC 650+ & JLPT N3";
      heroDesc.textContent = "Song kiếm hợp bích 25 phút: 3 từ vựng TOEIC + 3 Kanji N3 -> Phản xạ ngữ pháp bấm giờ song ngữ -> Nghe chép chính tả & Shadowing.";
      heroPill.textContent = "⚡ DUAL TRACK COMBO (50/50)";
      heroPill.className = "hero-pill-tag";
    }

    renderSyllabus();
    renderMistakes();
    renderAIWeaknesses();
    renderVocabVault();
    updateStatsDisplay();
  }

  // ----------------------------------------------------
  // TAB NAVIGATION
  // ----------------------------------------------------
  function switchTab(tabId) {
    state.activeTab = tabId;
    navTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    mobileNavBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    viewSections.forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${tabId}`);
    });

    if (tabId === 'vocab') renderVocabVault();
    if (tabId === 'syllabus') renderSyllabus();
    if (tabId === 'notebook') renderMistakes();
    if (tabId === 'ai') renderAIWeaknesses();
    if (tabId === 'mock') prepareMockExamUI();
  }

  // ----------------------------------------------------
  // KHO TỪ VỰNG SRS VAULT (SM-2+ SPHERICAL RECALL)
  // ----------------------------------------------------
  function renderVocabVault() {
    const grid = document.getElementById('vocab-cards-grid');
    if (!grid) return;

    // Collect all cards
    const toeicCards = (window.TOEIC_DATA?.vocabBank || []).map(item => ({
      ...item,
      track: 'TOEIC',
      displayTerm: item.word,
      displayPho: item.ipa,
      displayEx: item.exampleEn
    }));

    const jlptCards = (window.JLPT_DATA?.vocabBank || []).map(item => ({
      ...item,
      track: 'JLPT',
      displayTerm: item.kanji,
      displayPho: `[${item.furigana}] • ${item.romaji} • ${item.hanViet || ''}`,
      displayEx: item.exampleJp
    }));

    const allCards = [...toeicCards, ...jlptCards];
    const srsStats = window.srsSystem.getStats();

    // Update stat boxes
    const totalEl = document.getElementById('vocab-stat-total');
    const dueEl = document.getElementById('vocab-stat-due');
    const masteredEl = document.getElementById('vocab-stat-mastered');
    const hesitantEl = document.getElementById('vocab-stat-hesitant');

    const now = Date.now();
    const dueItems = allCards.filter(item => {
      const rec = window.srsSystem.records[item.id];
      if (!rec) return true; // brand new card is due
      return rec.nextReview <= now;
    });

    if (totalEl) totalEl.textContent = allCards.length;
    if (dueEl) dueEl.textContent = dueItems.length;
    if (masteredEl) masteredEl.textContent = srsStats.mastered;
    if (hesitantEl) hesitantEl.textContent = srsStats.hesitant;

    // Filter by category
    const filter = state.currentVocabFilter || 'all';
    const query = (state.currentVocabSearch || '').toLowerCase().trim();

    const filtered = allCards.filter(item => {
      // Category filter
      if (filter === 'TOEIC' && item.track !== 'TOEIC') return false;
      if (filter === 'JLPT' && item.track !== 'JLPT') return false;
      if (filter === 'due') {
        const rec = window.srsSystem.records[item.id];
        if (rec && rec.nextReview > now) return false;
      }
      if (filter === 'mastered') {
        const rec = window.srsSystem.records[item.id];
        if (!rec || rec.reps < 4 || rec.interval < 10) return false;
      }

      // Search query
      if (query) {
        const matchTerm = (item.displayTerm || '').toLowerCase().includes(query);
        const matchPho = (item.displayPho || '').toLowerCase().includes(query);
        const matchMeaning = (item.meaningVi || '').toLowerCase().includes(query);
        const matchColloc = (item.collocations || '').toLowerCase().includes(query);
        if (!matchTerm && !matchPho && !matchMeaning && !matchColloc) return false;
      }

      return true;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size: 36px; margin-bottom: 8px;">🔍</div>
          <h4 style="color: #fff; margin-bottom: 4px;">Không tìm thấy từ vựng phù hợp</h4>
          <p style="font-size: 0.9rem;">Hãy thử gõ từ khóa khác hoặc chọn bộ lọc 'Tất cả'.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const rec = window.srsSystem.records[item.id];
      let statusTag = '<span class="srs-status-tag srs-status-due">⚪ Chưa Ôn</span>';
      if (rec) {
        if (rec.reps >= 4 && rec.interval >= 10 && !rec.hesitationFlag) {
          statusTag = `<span class="srs-status-tag srs-status-mastered">🟢 Đã Thuộc (${rec.interval}d)</span>`;
        } else if (rec.nextReview <= now) {
          statusTag = `<span class="srs-status-tag srs-status-due">⚡ Đến Hạn Ôn</span>`;
        } else {
          statusTag = `<span class="srs-status-tag srs-status-learning">🟡 Đang Nhớ (${rec.interval}d)</span>`;
        }
      }

      const card = document.createElement('div');
      card.className = 'vocab-item-card';
      card.innerHTML = `
        <div>
          <div class="vocab-card-term-row">
            <div>
              <div class="vocab-card-term">${item.displayTerm}</div>
              <div class="vocab-card-pho">${item.displayPho}</div>
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <span class="badge-tag ${item.track === 'JLPT' ? 'badge-jlpt' : 'badge-toeic'}">${item.track}</span>
              ${statusTag}
            </div>
          </div>

          <div class="vocab-card-meaning">${item.meaningVi}</div>
          
          ${item.collocations ? `<div class="vocab-card-colloc">✦ <em>${item.collocations}</em></div>` : ''}
          
          ${item.displayEx ? `
            <div class="vocab-card-ex">
              <div>${item.displayEx}</div>
              <div style="color: var(--text-muted); margin-top: 2px;">${item.exampleVi || ''}</div>
            </div>
          ` : ''}

          ${item.paraphrase ? `
            <div style="font-size: 0.78rem; background: rgba(59, 130, 246, 0.1); border: 1px dashed rgba(59, 130, 246, 0.3); border-radius: 4px; padding: 6px 10px; margin-bottom: 10px;">
              <strong>Paraphrase:</strong> ${item.paraphrase.original} ↔ <span style="color: #34d399;">${item.paraphrase.synonym}</span>
            </div>
          ` : ''}

          ${item.lookAlikes ? `
            <div style="font-size: 0.78rem; background: rgba(244, 63, 94, 0.1); border: 1px dashed rgba(244, 63, 94, 0.3); border-radius: 4px; padding: 6px 10px; margin-bottom: 10px;">
              <strong>Kanji liên quan:</strong> ${item.lookAlikes.join(', ')}
            </div>
          ` : ''}
        </div>

        <div class="vocab-card-footer">
          <button class="btn-subtle btn-listen-vocab" style="font-size: 0.8rem; padding: 6px 12px;">
            🔊 Nghe
          </button>
          <button class="btn-subtle btn-flash-review" style="font-size: 0.8rem; padding: 6px 12px; color: #60a5fa; border-color: rgba(96, 165, 250, 0.3);">
            ⚡ Lật Thẻ SRS
          </button>
        </div>
      `;

      card.querySelector('.btn-listen-vocab').addEventListener('click', () => {
        window.speechEngine.speak(item.displayTerm, item.track === 'JLPT' ? 'ja' : 'en', 1.0);
      });

      card.querySelector('.btn-flash-review').addEventListener('click', () => {
        const singleSession = {
          active: true,
          currentStage: 1,
          currentItem: item
        };
        workoutOverlay.classList.add('active');
        renderStage1Vocab(singleSession);
      });

      grid.appendChild(card);
    });
  }

  // ----------------------------------------------------
  // PRE-BUILT 60-DAY SYLLABUS
  // ----------------------------------------------------
  function renderSyllabus() {
    if (!syllabusGrid) return;
    const data = (state.currentTrack === 'JLPT') ? window.JLPT_DATA : window.TOEIC_DATA;
    const syllabusList = data.syllabus || [];

    const filtered = syllabusList.filter(item => {
      if (state.currentPhaseFilter === 'all') return true;
      return item.phase.toString() === state.currentPhaseFilter;
    });

    syllabusGrid.innerHTML = '';

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = `syllabus-card ${item.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="day-badge">NGÀY ${item.day} • GIAI ĐOẠN ${item.phase}</div>
        <h3 class="day-title">${item.title}</h3>
        <ul class="day-focus-list">
          <li><span class="dot">✦</span> <strong>Từ vựng cốt lõi:</strong> ${item.vocabCount} từ tần suất cao</li>
          <li><span class="dot">✦</span> <strong>Ngữ pháp then chốt:</strong> ${item.grammarFocus}</li>
          <li><span class="dot">✦</span> <strong>Luyện nghe:</strong> ${item.listeningFocus}</li>
        </ul>
        <div class="card-action-bar">
          <button class="btn-syllabus-action btn-study-day" data-day="${item.day}">
            ⚡ Học Ngay Buổi Này
          </button>
          <button class="btn-syllabus-action btn-ai-expand-day" data-day="${item.day}" style="flex: 0 0 42px;" title="AI Mở rộng bài tập">
            🤖
          </button>
        </div>
      `;

      card.querySelector('.btn-study-day').addEventListener('click', () => {
        startAutopilotSession(false);
      });

      card.querySelector('.btn-ai-expand-day').addEventListener('click', () => {
        launchAdaptiveAIDrill(`Chuyên đề Ngày ${item.day}: ${item.title}`);
      });

      syllabusGrid.appendChild(card);
    });
  }

  // ----------------------------------------------------
  // AUTO-MISTAKE NOTEBOOK (3-STRIKE MASTERY)
  // ----------------------------------------------------
  function renderMistakes() {
    if (!mistakeListEl) return;
    const track = mistakeTrackFilter ? mistakeTrackFilter.value : 'all';
    const tag = mistakeTagFilter ? mistakeTagFilter.value : 'all';
    const status = mistakeStatusFilter ? mistakeStatusFilter.value : 'all';

    const mistakes = window.mistakeNotebook.getFiltered(track, tag, status);

    // Populate tags
    if (mistakeTagFilter) {
      const recordedTraps = Object.keys(window.mistakeNotebook.getTrapDistribution('all'));
      const predefinedTOEIC = (window.TOEIC_DATA?.trapCategories || []).map(t => t.name);
      const predefinedJLPT = (window.JLPT_DATA?.trapCategories || []).map(t => t.name);
      const allTraps = Array.from(new Set([...recordedTraps, ...predefinedTOEIC, ...predefinedJLPT]));

      const currentSelected = mistakeTagFilter.value;
      mistakeTagFilter.innerHTML = '<option value="all">Tất cả dạng bẫy</option>';
      allTraps.forEach(trapName => {
        const opt = document.createElement('option');
        opt.value = trapName;
        opt.textContent = trapName;
        if (trapName === currentSelected) opt.selected = true;
        mistakeTagFilter.appendChild(opt);
      });
    }

    if (mistakes.length === 0) {
      mistakeListEl.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size: 40px; margin-bottom: 12px;">🎉</div>
          <h3 style="color: var(--text-main); margin-bottom: 6px;">Không có lỗi sai nào cần xử lý!</h3>
          <p>Mọi câu làm sai sẽ tự động lưu vào đây kèm cơ chế 3-Strike Mastery (⚪⚪⚪ -> 🟢🟢🟢) để miễn dịch hoàn toàn.</p>
        </div>
      `;
      return;
    }

    mistakeListEl.innerHTML = '';
    mistakes.forEach(m => {
      const card = document.createElement('div');
      card.className = `mistake-card ${m.mastered ? 'mastered' : ''}`;

      const userText = (m.options && m.options[m.userChoice]) ? m.options[m.userChoice] : (m.userChoice === -1 ? 'Hết giờ (20s)' : 'Lựa chọn của bạn');
      const correctText = (m.options && m.options[m.correctChoice]) ? m.options[m.correctChoice] : 'Đáp án chuẩn phòng thi';

      // 3-Strike representation
      let strikesDisplay = "⚪⚪⚪";
      if (m.strikeCount === 1) strikesDisplay = "🟢⚪⚪ (1/3)";
      else if (m.strikeCount === 2) strikesDisplay = "🟢🟢⚪ (2/3)";
      else if (m.strikeCount >= 3 || m.mastered) strikesDisplay = "🟢🟢🟢 (ĐÃ MIỄN DỊCH)";

      card.innerHTML = `
        <div class="mistake-top-row">
          <span class="mistake-trap-tag">${m.trapType}</span>
          <span class="strike-badge" title="Tiến trình làm đúng 3 lần liên tiếp">${strikesDisplay}</span>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${m.track} • Sai ${m.timesFailed || 1} lần</span>
        </div>

        <div class="mistake-question">${m.question}</div>

        <div class="mistake-answer-diff">
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem; display: block;">Lựa chọn sai:</span>
            <span class="user-chosen-text">✕ ${userText}</span>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem; display: block;">Đáp án chuẩn phòng thi:</span>
            <span class="correct-chosen-text">✓ ${correctText}</span>
          </div>
        </div>

        <div class="mistake-explanation">
          <strong>Bẫy đề:</strong> ${m.ruleVi || m.explanationVi}
        </div>

        ${m.quickTip3s ? `
          <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 8px 12px; border-radius: 4px; font-size: 0.85rem; color: #fbbf24; margin-bottom: 12px;">
            ⚡ <strong>Mẹo nhận diện 3s:</strong> ${m.quickTip3s}
          </div>
        ` : ''}

        ${m.kanjiMatrix && m.kanjiMatrix.length > 0 ? `
          <div class="kanji-matrix-box">
            <div class="kanji-matrix-title">🕸️ Ma Trận Kanji Dễ Nhầm Phòng Thi:</div>
            <div class="kanji-matrix-grid">
              ${m.kanjiMatrix.map(km => `
                <div class="kanji-matrix-item">
                  <div class="kanji-matrix-char">${km.kanji}</div>
                  <div class="kanji-matrix-meta"><strong>${km.hanViet}</strong> (${km.meaning})</div>
                  <div style="font-size: 0.7rem; color: #f87171; margin-top: 4px;">Dễ nhầm với: ${km.lookAlikes.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="mistake-actions">
          <button class="btn-subtle btn-retest-strike" data-id="${m.id}">
            ⚡ Luyện lại câu này (Strike Drill)
          </button>
          <button class="btn-subtle btn-ai-fix-single" data-trap="${m.trapType}" data-track="${m.track}">
            🤖 AI Sinh Câu Biến Thể
          </button>
        </div>
      `;

      card.querySelector('.btn-retest-strike').addEventListener('click', () => {
        window.mistakeNotebook.processDrillAttempt(m.id, true, 7000);
        window.soundEngine.playCorrect();
        renderMistakes();
        updateStatsDisplay();
      });

      card.querySelector('.btn-ai-fix-single').addEventListener('click', () => {
        const variant = window.adaptiveAIEngine.generateQuestionVariant(m);
        state.currentRemedialSession = {
          questions: [variant],
          currentIndex: 0,
          score: 0,
          trap: m.trapType,
          track: m.track
        };
        remedialModal.classList.add('active');
        renderRemedialQuestion();
      });

      mistakeListEl.appendChild(card);
    });
  }

  // ----------------------------------------------------
  // ADAPTIVE AI WEAKNESSES VIEW
  // ----------------------------------------------------
  function renderAIWeaknesses() {
    if (!weaknessCardsContainer) return;
    const diagnosis = window.adaptiveAIEngine.diagnoseWeakness(state.currentTrack);
    const topTrap = diagnosis.topTrap;

    const data = (state.currentTrack === 'JLPT') ? window.JLPT_DATA : window.TOEIC_DATA;
    const trapList = data.trapCategories || [];

    weaknessCardsContainer.innerHTML = '';

    trapList.forEach(trap => {
      const isTop = (trap.name === topTrap || trap.name.includes(topTrap));
      const card = document.createElement('div');
      card.className = 'weakness-card';
      card.innerHTML = `
        <div class="weakness-top">
          <div class="weakness-name">${trap.name}</div>
          <span class="weakness-stat-badge" style="${isTop ? 'background: rgba(239, 68, 68, 0.25); border-color: red;' : ''}">
            ${isTop ? '⚠️ LỖ HỔNG LỚN NHẤT' : 'Dạng bẫy đề thi'}
          </span>
        </div>
        <div class="weakness-tip">${trap.tip}</div>
        <button class="btn-ai-patch-glow btn-patch-trap" data-trap="${trap.name}" data-track="${state.currentTrack}" style="width: 100%; justify-content: center;">
          ⚡ AI Tự Động Vá Lỗ Hổng Này (Zero Prompt)
        </button>
      `;

      card.querySelector('.btn-patch-trap').addEventListener('click', () => {
        launchAdaptiveAIDrill(trap.name, state.currentTrack);
      });

      weaknessCardsContainer.appendChild(card);
    });
  }

  // ----------------------------------------------------
  // 1-CLICK AUTOPILOT WORKOUT EXECUTION (4 STAGES)
  // ----------------------------------------------------
  function startAutopilotSession(isMicro = false) {
    workoutOverlay.classList.add('active');
    window.autopilotWorkout.startSession(state.currentTrack, isMicro);
  }

  function setupAutopilotListener() {
    window.autopilotWorkout.onStateChange = (stateData) => {
      renderWorkoutStage(stateData);
    };
  }

  function renderWorkoutStage(session) {
    if (!session.active) {
      workoutOverlay.classList.remove('active');
      return;
    }

    stageDots.forEach((dot, idx) => {
      const stageNum = idx + 1;
      dot.className = 'stage-dot';
      if (stageNum < session.currentStage) dot.classList.add('completed');
      if (stageNum === session.currentStage) dot.classList.add('current');
    });

    const stageNames = [
      "Chặng 1: Từ vựng SRS Tự Phát Âm",
      "Chặng 2: Phản Xạ Ngữ Pháp Bấm Giờ (20s)",
      "Chặng 3: Nghe Chép Chính Tả & Shadowing",
      "Chặng 4: Báo Cáo Điểm Yếu & Vá Lỗ Hổng"
    ];
    if (currentStageBadge) {
      currentStageBadge.innerHTML = `${stageNames[session.currentStage - 1]} (${session.stageIndex + 1}/${session.totalInCurrentStage}) ${session.isComboActive ? '<span class="combo-badge-pill">🔥 COMBO STREAK</span>' : ''}`;
    }

    workoutBody.innerHTML = '';

    if (session.currentStage === 1) renderStage1Vocab(session);
    else if (session.currentStage === 2) renderStage2Grammar(session);
    else if (session.currentStage === 3) renderStage3Dictation(session);
    else if (session.currentStage === 4) renderStage4Debrief(session);
  }

  // STAGE 1: FLASHCARDS WITH KANJI MATRIX OR PARAPHRASE + TOUCH SWIPE GESTURES
  function renderStage1Vocab(session) {
    const item = session.currentItem;
    if (!item) return;

    const isJp = !!item.kanji;
    const cardEl = document.createElement('div');
    cardEl.className = 'flashcard-container';
    cardEl.innerHTML = `
      <div class="flashcard-card" id="touch-swipe-card">
        <div class="card-top-tags">
          <span class="badge-tag ${isJp ? 'badge-jlpt' : 'badge-toeic'}">
            ${isJp ? 'JLPT N3 VOCAB' : 'TOEIC 650+ ESSENTIAL'}
          </span>
          <span class="badge-tag" style="background: rgba(255,255,255,0.1); color: #cbd5e1;">${item.pos || 'từ vựng'}</span>
          ${item.hanViet ? `<span class="badge-tag" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">Hán Việt: ${item.hanViet}</span>` : ''}
        </div>

        <div class="card-word-title">${isJp ? item.kanji : item.word}</div>
        <div class="card-ipa">${isJp ? `[${item.furigana}] • ${item.romaji}` : item.ipa}</div>

        <button class="audio-replay-btn" id="btn-replay-vocab-audio">
          🔊 Nghe phát âm chuẩn (Web Speech)
        </button>

        <div class="card-meaning-box">
          <div class="card-meaning-vi">${item.meaningVi}</div>
          <div class="card-collocation">✦ Cụm thường gặp: <em>${item.collocations}</em></div>
          
          <div class="card-example-box">
            <div class="card-example-en">${isJp ? item.exampleJp : item.exampleEn}</div>
            <div class="card-example-vi">${item.exampleVi}</div>
          </div>
        </div>

        ${item.paraphrase ? `
          <div class="paraphrase-map-box">
            <div style="font-weight: 700; color: #60a5fa; font-size: 0.85rem;">✦ Cặp bài trùng Paraphrase Part 3/4/7:</div>
            <div class="paraphrase-item">
              <span style="color: #cbd5e1;">Trong bài đọc: <em>"${item.paraphrase.original}"</em></span>
              <span style="color: #60a5fa;">↔</span>
              <span style="color: #34d399; font-weight: 700;">Đáp án: <em>"${item.paraphrase.synonym}"</em></span>
            </div>
          </div>
        ` : ''}

        ${item.trapNote ? `
          <div class="card-trap-alert">
            ⚠️ <strong>Bẫy phòng thi:</strong> ${item.trapNote}
          </div>
        ` : ''}

        <div class="swipe-hint-bar" style="margin-top: 14px; font-size: 0.75rem; color: var(--text-muted); text-align: center;">
          👈 Vuốt Trái: Quên (Hard) • Vuốt Phải: Đã Thuộc (Easy) 👉
        </div>
      </div>

      <div class="srs-action-buttons">
        <button class="srs-btn srs-btn-hard" id="btn-srs-hard">
          <span>❌ [1] Quên / Chưa Thuộc</span>
          <span class="srs-sub-label">Ôn lại ngay ngày mai</span>
        </button>
        <button class="srs-btn srs-btn-good" id="btn-srs-good">
          <span>⚠️ [2] Nhớ Mang Máng</span>
          <span class="srs-sub-label">Ôn lại sau 3 ngày</span>
        </button>
        <button class="srs-btn srs-btn-easy" id="btn-srs-easy">
          <span>⚡ [3] Đã Thuộc Lòng</span>
          <span class="srs-sub-label">Khoảng cách 5 ngày</span>
        </button>
      </div>
    `;

    workoutBody.appendChild(cardEl);

    cardEl.querySelector('#btn-replay-vocab-audio').addEventListener('click', (e) => {
      e.stopPropagation();
      window.autopilotWorkout.playCurrentVocabAudio();
    });

    // Mobile Swipe Gestures
    const swipeCard = cardEl.querySelector('#touch-swipe-card');
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    swipeCard.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    }, { passive: true });

    swipeCard.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      swipeCard.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.05}deg)`;
      if (diffX > 40) swipeCard.style.borderColor = '#34d399';
      else if (diffX < -40) swipeCard.style.borderColor = '#f87171';
      else swipeCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }, { passive: true });

    swipeCard.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const diffX = currentX - startX;

      if (diffX > 80) {
        swipeCard.style.transform = 'translateX(300px) rotate(15deg)';
        swipeCard.style.opacity = '0';
        setTimeout(() => window.autopilotWorkout.rateVocabCard(3), 200);
      } else if (diffX < -80) {
        swipeCard.style.transform = 'translateX(-300px) rotate(-15deg)';
        swipeCard.style.opacity = '0';
        setTimeout(() => window.autopilotWorkout.rateVocabCard(1), 200);
      } else {
        swipeCard.style.transform = '';
        swipeCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });

    cardEl.querySelector('#btn-srs-hard').addEventListener('click', () => window.autopilotWorkout.rateVocabCard(1));
    cardEl.querySelector('#btn-srs-good').addEventListener('click', () => window.autopilotWorkout.rateVocabCard(2));
    cardEl.querySelector('#btn-srs-easy').addEventListener('click', () => window.autopilotWorkout.rateVocabCard(3));
  }

  // STAGE 2: TIMED GRAMMAR REFLEX WITH COGNITIVE TELEMETRY & BLIND/STAR PUZZLES
  function renderStage2Grammar(session) {
    const item = session.currentItem;
    if (!item) return;

    const timerPercent = (session.timeLeft / session.timeMax) * 100;
    const isBlind = item.type === 'part2_blind';

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="timer-countdown-badge">
        <span>⏱ ÁP LỰC PHÒNG THI</span>
        <span style="color: ${session.timeLeft <= 5 ? '#f87171' : '#34d399'}; font-weight: 700; font-size: 1.1rem;">
          ${session.timeLeft}s
        </span>
      </div>
      <div class="timer-bar-wrap">
        <div class="timer-bar-fill" style="width: ${timerPercent}%;"></div>
      </div>

      <div class="grammar-question-box">
        <div style="font-size: 0.8rem; color: #93c5fd; font-weight: 700; margin-bottom: 8px;">
          ✦ ${item.trapType}
        </div>
        ${isBlind ? `
          <div style="background: rgba(59, 130, 246, 0.15); border: 1px dashed #3b82f6; border-radius: var(--radius-sm); padding: 16px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 24px; margin-bottom: 6px;">🎧</div>
            <div style="font-size: 1rem; font-weight: 700; color: #fff;">PART 2 BLIND LISTENING</div>
            <div style="color: var(--text-secondary); font-size: 0.85rem;">Đã ẩn văn bản. Lắng nghe thật kỹ và bấm chọn câu trả lời phù hợp nhất.</div>
            <button class="audio-replay-btn" id="btn-replay-part2" style="margin-top: 10px; margin-bottom: 0;">🔊 Nghe lại câu hỏi</button>
          </div>
        ` : `
          <div class="grammar-q-text">${item.question}</div>
        `}
      </div>

      <div class="grammar-options-grid" id="grammar-options-container">
        ${item.options.map((opt, idx) => `
          <button class="option-btn" data-index="${idx}">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="grammar-feedback-placeholder"></div>
    `;

    workoutBody.appendChild(container);

    if (isBlind) {
      container.querySelector('#btn-replay-part2').addEventListener('click', () => {
        window.speechEngine.speak(item.question, 'en', 1.0);
      });
    }

    const optionBtns = container.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.index, 10);
        optionBtns.forEach(b => b.disabled = true);

        const result = window.autopilotWorkout.handleGrammarAnswer(selectedIdx);

        optionBtns.forEach((b, idx) => {
          if (idx === result.correctAnswer) b.classList.add('selected-correct');
          if (idx === selectedIdx && !result.isCorrect) b.classList.add('selected-wrong');
        });

        // Show detailed feedback card with Cognitive Telemetry classification
        const fbPlaceholder = container.querySelector('#grammar-feedback-placeholder');
        const tel = result.telemetry;

        let badgeClass = 'telemetry-instant';
        if (tel.classification === 'SLOW_RECALL') badgeClass = 'telemetry-slow';
        else if (tel.classification === 'TRAP_FALL') badgeClass = 'telemetry-trap';

        fbPlaceholder.innerHTML = `
          <div class="grammar-feedback-card">
            <div class="telemetry-pill ${badgeClass}">
              ${tel.cognitiveNote}
            </div>

            <div class="feedback-title ${result.isCorrect ? 'correct' : 'wrong'}">
              ${result.isCorrect ? '✓ CHÍNH XÁC!' : '✕ CHƯA ĐÚNG • BẪY ĐÃ LƯU VÀO SỔ TAY 3-STRIKE'}
            </div>
            <div class="feedback-explanation">${result.explanation}</div>

            ${tel.quickTip3s ? `
              <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 8px 12px; border-radius: 4px; font-size: 0.85rem; color: #fbbf24; margin-bottom: 12px;">
                ⚡ <strong>Mẹo 3 giây:</strong> ${tel.quickTip3s}
              </div>
            ` : ''}

            <div class="feedback-rule-box">
              <strong>Quy tắc thi:</strong> ${result.rule}
            </div>

            <button class="btn-autopilot-glow" id="btn-next-grammar" style="margin-top: 18px; width: 100%; justify-content: center; padding: 12px;">
              [Phím Space] Tiếp tục câu tiếp theo ▶
            </button>
          </div>
        `;

        fbPlaceholder.querySelector('#btn-next-grammar').addEventListener('click', () => {
          window.autopilotWorkout.nextGrammarQuestion();
        });
      });
    });
  }

  // STAGE 3: LISTENING, DICTATION & SPEECH-TO-TEXT SHADOWING
  function renderStage3Dictation(session) {
    const item = session.currentItem;
    if (!item) return;

    const isJp = item.lang === 'ja' || !!item.audioText.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/);

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="listening-center-player">
        <div class="audio-wave-animation">
          <div class="wave-bar speaking"></div>
          <div class="wave-bar speaking" style="animation-delay: 0.1s;"></div>
          <div class="wave-bar speaking" style="animation-delay: 0.2s;"></div>
          <div class="wave-bar speaking" style="animation-delay: 0.3s;"></div>
          <div class="wave-bar speaking" style="animation-delay: 0.4s;"></div>
        </div>

        <div class="audio-controls-row">
          <button class="btn-autopilot-glow" id="btn-play-dictation-audio" style="padding: 10px 24px; font-size: 0.9rem;">
            🔊 [R] Phát lại Audio
          </button>
          <button class="speed-selector-btn ${state.dictationSpeed === 0.8 ? 'active' : ''}" data-speed="0.8">[S] 0.8x</button>
          <button class="speed-selector-btn ${state.dictationSpeed === 1.0 ? 'active' : ''}" data-speed="1.0">1.0x (Chuẩn)</button>
          <button class="speed-selector-btn ${state.dictationSpeed === 1.2 ? 'active' : ''}" data-speed="1.2">1.2x (Nhanh)</button>
        </div>
      </div>

      <div class="dictation-mask-hint">${item.displayMask}</div>

      <input type="text" class="dictation-input-box" id="dictation-input" placeholder="Gõ câu bạn nghe được tại đây rồi nhấn Enter..." autocomplete="off" />

      <div style="display: flex; gap: 12px; margin-bottom: 14px;">
        <button class="btn-autopilot-glow" id="btn-submit-dictation" style="flex: 1; justify-content: center; padding: 12px;">
          Kiểm tra chính tả & Nối âm
        </button>
      </div>

      <!-- Shadowing Speech Recognition Studio -->
      <div class="shadowing-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-weight: 700; color: #cbd5e1; font-size: 0.9rem;">🎙️ Luyện Nói Đuổi (Shadowing & Chấm Điểm Phát Âm):</span>
          <button class="mic-record-btn" id="btn-toggle-shadow-rec">
            🎤 [Phím V] Bắt Đầu Nói
          </button>
        </div>
        <div id="shadowing-feedback-zone" style="color: var(--text-muted); font-size: 0.88rem;">
          Nhấn nút Micro hoặc giữ phím <strong>V</strong> để nhại lại theo tốc độ băng. Hệ thống sẽ so sánh từng từ và chấm điểm Fluency %.
        </div>
      </div>

      <div id="dictation-feedback-placeholder" style="margin-top: 18px;"></div>
    `;

    workoutBody.appendChild(container);

    const inputEl = container.querySelector('#dictation-input');
    const playBtn = container.querySelector('#btn-play-dictation-audio');
    const submitBtn = container.querySelector('#btn-submit-dictation');
    const speedBtns = container.querySelectorAll('.speed-selector-btn');
    const micBtn = container.querySelector('#btn-toggle-shadow-rec');
    const shadowZone = container.querySelector('#shadowing-feedback-zone');

    setTimeout(() => inputEl.focus(), 200);

    playBtn.addEventListener('click', () => {
      window.autopilotWorkout.playCurrentDictationAudio(state.dictationSpeed);
    });

    speedBtns.forEach(sb => {
      sb.addEventListener('click', () => {
        state.dictationSpeed = parseFloat(sb.dataset.speed);
        speedBtns.forEach(b => b.classList.remove('active'));
        sb.classList.add('active');
        window.autopilotWorkout.playCurrentDictationAudio(state.dictationSpeed);
      });
    });

    // Shadowing Microphone Toggle
    micBtn.addEventListener('click', () => {
      if (window.shadowingEngine.isRecording) {
        window.shadowingEngine.stop();
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '🎤 [Phím V] Bắt Đầu Nói';
      } else {
        const langCode = isJp ? 'ja-JP' : 'en-US';
        micBtn.classList.add('recording');
        micBtn.innerHTML = '🔴 Đang nghe... Hãy đọc to câu!';

        window.shadowingEngine.start(item.audioText, langCode, (res) => {
          shadowZone.innerHTML = `
            <div style="margin-bottom: 6px;">
              <strong>Độ trôi chảy (Fluency):</strong> 
              <span style="font-weight: 800; color: ${res.fluencyScore >= 80 ? '#34d399' : '#fbbf24'};">${res.fluencyScore}%</span>
            </div>
            <div class="shadowing-tokens">
              ${res.tokens.map(t => `
                <span class="token-word ${t.matched ? 'matched' : 'missed'}">
                  ${t.matched ? '✓' : '✕'} ${t.word}
                </span>
              `).join('')}
            </div>
          `;
          if (res.isFinal) {
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '🎤 Nói Lại Lần Nữa';
            if (res.fluencyScore >= 80) window.soundEngine.playCorrect();
          }
        });
      }
    });

    const handleSubmit = () => {
      const val = inputEl.value;
      const res = window.autopilotWorkout.verifyDictation(val);
      submitBtn.disabled = true;
      inputEl.disabled = true;

      const fb = container.querySelector('#dictation-feedback-placeholder');
      fb.innerHTML = `
        <div class="grammar-feedback-card">
          <div class="feedback-title ${res.isCorrect ? 'correct' : 'wrong'}">
            ${res.isCorrect ? '✓ CHÍNH XÁC! BẮT TRỌN TỪ KHÓA BÀI NGHE' : '✕ CẦN CHÚ Ý CÁC TỪ KHÓA BỊ NUỐT ÂM'}
          </div>
          <div style="margin-bottom: 8px; font-size: 1.05rem; font-weight: 700; color: #fff;">
            "${res.targetText}"
          </div>
          <div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px;">
            ✦ Dịch nghĩa: ${res.translation}
          </div>
          <div class="feedback-rule-box">
            <strong>Mẹo nối âm / Bẫy nghe:</strong> ${res.tip}
          </div>
          <button class="btn-autopilot-glow" id="btn-next-dictation" style="margin-top: 16px; width: 100%; justify-content: center; padding: 12px;">
            Chuyển câu tiếp theo ▶
          </button>
        </div>
      `;

      fb.querySelector('#btn-next-dictation').addEventListener('click', () => {
        window.autopilotWorkout.nextDictationQuestion();
      });
    };

    submitBtn.addEventListener('click', handleSubmit);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
  }

  // STAGE 4: DEBRIEF & WEAKNESS SCAN
  function renderStage4Debrief(session) {
    const report = window.autopilotWorkout.getDebriefReport();
    triggerCelebrationConfetti();

    const container = document.createElement('div');
    container.className = 'debrief-container';
    container.innerHTML = `
      <div class="debrief-hero-score">
        <div class="score-circle" style="--acc-val: ${report.accuracy};">
          <div class="score-inner">
            <span class="score-percent">${report.accuracy}%</span>
            <span class="score-label">CHÍNH XÁC</span>
          </div>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px;">
          🎉 Hoàn Thành Buổi Học ${session.isMicro ? 'Cấp Tốc 5 Phút' : 'Autopilot'} Hôm Nay!
        </h2>
        <div style="display: flex; justify-content: center; gap: 16px; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">
          <span>⏱ Tốc độ TB: <strong>${report.telemetrySummary.avgResponseSec}s / câu</strong></span>
          <span>⚡ Phản xạ siêu tốc: <strong>${report.telemetrySummary.instantRate}%</strong></span>
          <span>⚠️ Phân vân: <strong>${report.telemetrySummary.slowRecallCount} câu</strong></span>
        </div>
      </div>

      ${report.primaryWeakness ? `
        <div class="debrief-weakness-alert">
          <div class="weakness-heading">
            <span>⚠️ AI Quét Lỗ Hổng: Phát hiện điểm yếu dạng bài</span>
          </div>
          <div class="weakness-body">
            Trong buổi hôm nay bạn có bẫy làm sai ở: <strong>${report.primaryWeakness}</strong>. Hệ thống đã đưa vào Sổ tay 3-Strike Mastery.
          </div>
          <button class="btn-ai-patch-glow" id="btn-debrief-patch-now">
            ⚡ AI Tự Động Vá Lỗ Hổng Này Ngay (Zero Prompt)
          </button>
        </div>
      ` : `
        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: var(--radius-md); padding: 18px; text-align: left;">
          <h4 style="color: #34d399; margin-bottom: 4px;">🌟 Thần kinh thép phòng thi!</h4>
          <p style="color: #cbd5e1; font-size: 0.92rem;">Bạn không mắc phải bất kỳ lỗi nghiêm trọng nào trong buổi tập này. Giữ vững phong độ!</p>
        </div>
      `}

      <div style="display: flex; gap: 14px; justify-content: center; margin-top: 10px;">
        <button class="btn-autopilot-glow" id="btn-finish-workout" style="padding: 14px 32px;">
          ✓ Hoàn Tất & Về Bảng Điều Khiển
        </button>
      </div>
    `;

    workoutBody.appendChild(container);

    container.querySelector('#btn-finish-workout').addEventListener('click', () => {
      window.autopilotWorkout.exitWorkout();
      updateStatsDisplay();
      renderMistakes();
      renderAIWeaknesses();
      renderHeatmap();
    });

    const btnPatch = container.querySelector('#btn-debrief-patch-now');
    if (btnPatch && report.primaryWeakness) {
      btnPatch.addEventListener('click', () => {
        window.autopilotWorkout.exitWorkout();
        launchAdaptiveAIDrill(report.primaryWeakness, report.track);
      });
    }
  }

  // ----------------------------------------------------
  // HANDS-FREE COMMUTE PODCAST MODE (RADIO RẢNH TAY)
  // ----------------------------------------------------
  function setupPodcastListener() {
    window.podcastManager.onTrackChange = ({ item, index, total, step }) => {
      if (podcastTrackTitle) {
        const title = item.kanji || item.word || item.audioText;
        podcastTrackTitle.textContent = `${title} (${index + 1}/${total})`;
      }
      if (podcastStepBadge) {
        const stepLabels = {
          1: "Lần 1: Nghe từ/câu gốc (1.0x)",
          3: "Lần 2: Nghĩa tiếng Việt & Mẹo nhớ",
          4: "Lần 3: Câu ví dụ thực tế (1.1x)"
        };
        podcastStepBadge.textContent = stepLabels[step] || "Đang phát...";
      }
    };

    if (btnPodcastToggle) {
      btnPodcastToggle.addEventListener('click', () => {
        if (podcastPlayerWidget.style.display === 'none' || !podcastPlayerWidget.style.display) {
          podcastPlayerWidget.style.display = 'flex';
          const items = (state.currentTrack === 'JLPT') ? window.JLPT_DATA.vocabBank : window.TOEIC_DATA.vocabBank;
          window.podcastManager.setPlaylist(items);
          window.podcastManager.start();
          podcastDisc.classList.add('spinning');
          btnPodcastPlayPause.textContent = '⏸';
        } else {
          window.podcastManager.stop();
          podcastPlayerWidget.style.display = 'none';
          podcastDisc.classList.remove('spinning');
        }
      });
    }

    if (btnPodcastPlayPause) {
      btnPodcastPlayPause.addEventListener('click', () => {
        if (window.podcastManager.isPaused) {
          window.podcastManager.resume();
          btnPodcastPlayPause.textContent = '⏸';
          podcastDisc.classList.add('spinning');
        } else {
          window.podcastManager.pause();
          btnPodcastPlayPause.textContent = '▶';
          podcastDisc.classList.remove('spinning');
        }
      });
    }

    if (btnPodcastNext) {
      btnPodcastNext.addEventListener('click', () => window.podcastManager.next());
    }
    if (btnPodcastPrev) {
      btnPodcastPrev.addEventListener('click', () => window.podcastManager.prev());
    }
  }

  // ----------------------------------------------------
  // 15-MINUTE MINI MOCK EXAM CONTROLLER
  // ----------------------------------------------------
  function prepareMockExamUI() {
    if (!mockExamContainer) return;
    mockExamContainer.style.display = 'none';
    mockExamPrelaunch.style.display = 'block';
    mockScoreResultBox.style.display = 'none';
  }

  function runMockExam() {
    mockExamPrelaunch.style.display = 'none';
    mockExamContainer.style.display = 'grid';
    mockScoreResultBox.style.display = 'none';

    const questions = window.mockExamSimulator.generateExam(state.currentTrack);
    renderMockQuestion(0);
    renderMockNavigator();

    window.mockExamSimulator.onTick = (secLeft) => {
      const mins = Math.floor(secLeft / 60);
      const secs = secLeft % 60;
      if (mockTimerEl) {
        mockTimerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (secLeft <= 60) mockTimerEl.style.color = '#f87171';
      }
    };

    window.mockExamSimulator.onComplete = (report) => {
      displayMockReport(report);
    };

    window.mockExamSimulator.startExam();
  }

  function renderMockNavigator() {
    if (!mockQNavPills) return;
    mockQNavPills.innerHTML = '';
    const total = window.mockExamSimulator.questions.length;

    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = `nav-pill-btn ${i === window.mockExamSimulator.currentIndex ? 'active' : ''} ${window.mockExamSimulator.userAnswers[i] !== undefined ? 'answered' : ''}`;
      btn.textContent = i + 1;
      btn.addEventListener('click', () => {
        window.mockExamSimulator.currentIndex = i;
        renderMockQuestion(i);
        renderMockNavigator();
      });
      mockQNavPills.appendChild(btn);
    }
  }

  function renderMockQuestion(idx) {
    const q = window.mockExamSimulator.questions[idx];
    if (!q || !mockQArea) return;

    mockQArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span class="badge-tag" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">
          ${q.part} • CÂU ${idx + 1}/25
        </span>
        ${q.audio ? `<button class="audio-replay-btn" id="btn-mock-q-audio" style="margin-bottom: 0;">🔊 Nghe Audio</button>` : ''}
      </div>

      ${q.passageHtml ? `
        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 16px; font-size: 0.92rem; line-height: 1.6;">
          ${q.passageHtml}
        </div>
      ` : ''}

      <div class="grammar-q-text" style="margin-bottom: 16px;">${q.q}</div>

      <div class="grammar-options-grid">
        ${q.options.map((opt, optIdx) => `
          <button class="option-btn mock-opt-btn ${window.mockExamSimulator.userAnswers[idx] === optIdx ? 'selected-correct' : ''}" data-opt="${optIdx}">
            <span class="option-letter">${String.fromCharCode(65 + optIdx)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    if (q.audio) {
      mockQArea.querySelector('#btn-mock-q-audio').addEventListener('click', () => {
        window.speechEngine.speak(q.audio, state.currentTrack === 'JLPT' ? 'ja' : 'en', 1.0);
      });
    }

    const opts = mockQArea.querySelectorAll('.mock-opt-btn');
    opts.forEach(b => {
      b.addEventListener('click', () => {
        const chosen = parseInt(b.dataset.opt, 10);
        window.mockExamSimulator.selectAnswer(idx, chosen);
        opts.forEach(ob => ob.classList.remove('selected-correct'));
        b.classList.add('selected-correct');
        renderMockNavigator();
      });
    });
  }

  function displayMockReport(report) {
    mockExamContainer.style.display = 'none';
    mockScoreResultBox.style.display = 'block';

    const est = report.scoreEstimator;
    triggerCelebrationConfetti();

    mockScoreResultBox.innerHTML = `
      <div class="debrief-hero-score" style="text-align: center; margin-bottom: 24px;">
        <span class="badge-tag" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; font-size: 0.85rem; margin-bottom: 12px;">
          🏆 KẾT QUẢ THI THỬ 15 PHÚT
        </span>
        <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 4px;">
          Điểm Dự Kiến: ${est.totalScore} / ${est.maxScore}
        </h2>
        <div style="font-size: 1.05rem; font-weight: 700; color: ${est.targetMet ? '#34d399' : '#f87171'}; margin-bottom: 16px;">
          ${est.verdict}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; max-width: 600px; margin: 0 auto; text-align: left;">
          ${est.subScores.map(sub => `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 12px;">
              <div style="font-size: 0.8rem; color: var(--text-muted);">${sub.name}</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: ${sub.isCutoffWarning ? '#f87171' : '#fff'};">
                ${sub.score} / ${sub.max}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 14px;">
        <button class="btn-autopilot-glow" id="btn-close-mock-report" style="padding: 12px 28px;">
          Quay lại Bảng Điều Khiển
        </button>
      </div>
    `;

    mockScoreResultBox.querySelector('#btn-close-mock-report').addEventListener('click', () => {
      switchTab('autopilot');
      updateStatsDisplay();
    });
  }

  // ----------------------------------------------------
  // ADAPTIVE AI REMEDIAL DRILL MODAL
  // ----------------------------------------------------
  async function launchAdaptiveAIDrill(trapName, track = 'TOEIC') {
    remedialModal.classList.add('active');
    remedialModalBody.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 36px; animation: spin 1s infinite linear;">🤖</div>
        <h3 style="margin-top: 14px; color: var(--text-main);">AI Đang Phân Tích & Sinh Bộ Bài Tập Vá Lỗ Hổng...</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 6px;">
          Mục tiêu: Đập tan bẫy <strong>"${trapName}"</strong> mà không cần bạn nhập bất kỳ prompt nào.
        </p>
      </div>
    `;

    try {
      const generated = await window.adaptiveAIEngine.generateRemedialWorkout(trapName, track);
      state.currentRemedialSession = {
        questions: generated.questions,
        currentIndex: 0,
        score: 0,
        trap: trapName,
        track
      };
      renderRemedialQuestion();
    } catch (e) {
      remedialModalBody.innerHTML = `
        <div style="color: #f87171; padding: 20px;">
          Lỗi khởi tạo bài tập: ${e.message}.
        </div>
      `;
    }
  }

  function renderRemedialQuestion() {
    const session = state.currentRemedialSession;
    if (!session) return;

    if (session.currentIndex >= session.questions.length) {
      remedialModalBody.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">
            Lỗ Hổng Đã Được Vá Triệt Để!
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Bạn đã hoàn thành bộ câu hỏi thích ứng chuyên sâu cho bẫy: <strong>${session.trap}</strong>.
          </p>
          <button class="btn-autopilot-glow" id="btn-close-remedial-done" style="margin: 0 auto;">
            ✓ Xác Nhận & Đóng
          </button>
        </div>
      `;
      remedialModalBody.querySelector('#btn-close-remedial-done').addEventListener('click', () => {
        remedialModal.classList.remove('active');
        updateStatsDisplay();
        renderMistakes();
      });
      return;
    }

    const q = session.questions[session.currentIndex];
    remedialModalBody.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span class="badge-tag" style="background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4);">
          ⚡ AI ADAPTIVE DRILL (${session.currentIndex + 1}/${session.questions.length})
        </span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${session.trap}</span>
      </div>

      <div class="grammar-question-box">
        <div class="grammar-q-text">${q.question}</div>
      </div>

      <div class="grammar-options-grid">
        ${q.options.map((opt, idx) => `
          <button class="option-btn remedial-option-btn" data-index="${idx}">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="remedial-feedback-box"></div>
    `;

    const btns = remedialModalBody.querySelectorAll('.remedial-option-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.disabled = true);
        const choice = parseInt(btn.dataset.index, 10);
        const isCorrect = (choice === q.answer);

        if (isCorrect) {
          window.soundEngine.playCorrect();
          btn.classList.add('selected-correct');
          session.score++;
        } else {
          window.soundEngine.playWrong();
          btn.classList.add('selected-wrong');
          btns[q.answer].classList.add('selected-correct');
        }

        const fb = remedialModalBody.querySelector('#remedial-feedback-box');
        fb.innerHTML = `
          <div class="grammar-feedback-card">
            <div class="feedback-title ${isCorrect ? 'correct' : 'wrong'}">
              ${isCorrect ? '✓ CHÍNH XÁC' : '✕ CHƯA ĐÚNG'}
            </div>
            <div class="feedback-explanation">${q.explanationVi}</div>
            <div class="feedback-rule-box">
              <strong>Bí quyết nhận diện bẫy:</strong> ${q.ruleVi}
            </div>
            <button class="btn-autopilot-glow" id="btn-next-remedial" style="margin-top: 14px; width: 100%; justify-content: center; padding: 10px;">
              Câu tiếp theo ▶
            </button>
          </div>
        `;

        fb.querySelector('#btn-next-remedial').addEventListener('click', () => {
          session.currentIndex++;
          renderRemedialQuestion();
        });
      });
    });
  }

  // ----------------------------------------------------
  // GLOBAL ZERO-MOUSE KEYBOARD SHORTCUTS
  // ----------------------------------------------------
  function setupGlobalKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore when typing inside input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Alt + S : Zen Mode Toggle
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        toggleZenMode();
        return;
      }

      // Inside Autopilot Workout
      if (window.autopilotWorkout.active) {
        const stage = window.autopilotWorkout.currentStage;

        // Space: Advance / Flip card
        if (e.code === 'Space') {
          e.preventDefault();
          const nextBtn = document.getElementById('btn-next-grammar') || document.getElementById('btn-next-dictation');
          if (nextBtn) nextBtn.click();
          return;
        }

        // 1, 2, 3, 4 keys
        if (['1', '2', '3', '4'].includes(e.key)) {
          const num = parseInt(e.key, 10);
          if (stage === 1) {
            // Rate SRS
            if (num === 1) window.autopilotWorkout.rateVocabCard(1);
            else if (num === 2) window.autopilotWorkout.rateVocabCard(2);
            else if (num === 3) window.autopilotWorkout.rateVocabCard(3);
          } else if (stage === 2) {
            // Select option A, B, C, D
            const optBtns = document.querySelectorAll('.option-btn');
            if (optBtns[num - 1] && !optBtns[num - 1].disabled) {
              optBtns[num - 1].click();
            }
          }
          return;
        }

        // R: Replay Audio
        if (e.key === 'r' || e.key === 'R') {
          if (stage === 1) window.autopilotWorkout.playCurrentVocabAudio();
          else if (stage === 3) window.autopilotWorkout.playCurrentDictationAudio(state.dictationSpeed);
          return;
        }

        // S: Slow Audio (0.8x)
        if (e.key === 's' || e.key === 'S') {
          if (stage === 3) window.autopilotWorkout.playCurrentDictationAudio(0.8);
          return;
        }

        // V: Shadowing mic toggle
        if (e.key === 'v' || e.key === 'V') {
          const micBtn = document.getElementById('btn-toggle-shadow-rec');
          if (micBtn) micBtn.click();
          return;
        }
      }
    });
  }

  // ----------------------------------------------------
  // EVENT LISTENERS & BACKUP / RESTORE
  // ----------------------------------------------------
  function setupEventListeners() {
    trackButtons.forEach(btn => {
      btn.addEventListener('click', () => setTrack(btn.dataset.track));
    });

    navTabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    if (btnStartHeroAutopilot) {
      btnStartHeroAutopilot.addEventListener('click', () => startAutopilotSession(false));
    }
    if (btnStartMicroAutopilot) {
      btnStartMicroAutopilot.addEventListener('click', () => startAutopilotSession(true));
    }

    if (btnStartMockExam) {
      btnStartMockExam.addEventListener('click', runMockExam);
    }
    if (btnSubmitMock) {
      btnSubmitMock.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn nộp bài thi thử ngay bây giờ không?')) {
          window.mockExamSimulator.submitExam();
        }
      });
    }

    if (btnCloseWorkout) {
      btnCloseWorkout.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn tạm dừng buổi học Autopilot này không?')) {
          window.autopilotWorkout.exitWorkout();
        }
      });
    }

    // Audio White Noise Toggle
    if (whiteNoiseBtn) {
      whiteNoiseBtn.addEventListener('click', () => {
        const isRunning = window.soundEngine.toggleWhiteNoise();
        whiteNoiseBtn.textContent = isRunning ? '🌧️ Noise: Bật' : '🌧️ Noise: Tắt';
        whiteNoiseBtn.classList.toggle('active', isRunning);
      });
    }

    // Zen Mode Toggle Logic & Buttons (Header & Floating Exit Button)
    function toggleZenMode(forceState = null) {
      state.isZenMode = (forceState !== null) ? forceState : !state.isZenMode;
      document.body.classList.toggle('zen-mode', state.isZenMode);
      if (zenModeBtn) {
        zenModeBtn.textContent = state.isZenMode ? '🧘 Zen: Bật' : '🧘 Zen';
        zenModeBtn.classList.toggle('active', state.isZenMode);
      }
    }

    if (zenModeBtn) {
      zenModeBtn.addEventListener('click', () => toggleZenMode());
    }
    if (zenExitFloatingBtn) {
      zenExitFloatingBtn.addEventListener('click', () => toggleZenMode(false));
    }

    // Mute Toggle
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        window.soundEngine.muted = !window.soundEngine.muted;
        muteBtn.textContent = window.soundEngine.muted ? '🔇' : '🔊';
      });
    }

    // Settings Modal
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    }
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    }
    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener('click', () => {
        const key = geminiKeyInput.value.trim();
        window.adaptiveAIEngine.setApiKey(key);
        alert('Đã lưu cấu hình Google Gemini API Key thành công!');
        settingsModal.classList.remove('active');
      });
    }

    // Backup Data (Export All)
    if (btnBackupData) {
      btnBackupData.addEventListener('click', () => {
        const backupObj = {
          srs: localStorage.getItem('autopilot_srs_records'),
          mistakes: localStorage.getItem('autopilot_mistakes_notebook_v2'),
          streak: localStorage.getItem('autopilot_streak'),
          words: localStorage.getItem('autopilot_words_count'),
          heatmap: localStorage.getItem('autopilot_activity_heatmap'),
          date: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `autopilot_study_backup_${Date.now()}.json`;
        a.click();
      });
    }

    // Restore Data (Import)
    if (btnRestoreData && restoreFileInput) {
      btnRestoreData.addEventListener('click', () => restoreFileInput.click());
      restoreFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.srs) localStorage.setItem('autopilot_srs_records', data.srs);
            if (data.mistakes) localStorage.setItem('autopilot_mistakes_notebook_v2', data.mistakes);
            if (data.streak) localStorage.setItem('autopilot_streak', data.streak);
            if (data.words) localStorage.setItem('autopilot_words_count', data.words);
            if (data.heatmap) localStorage.setItem('autopilot_activity_heatmap', data.heatmap);
            alert('Khôi phục dữ liệu học tập thành công!');
            location.reload();
          } catch (err) {
            alert('File sao lưu không đúng định dạng!');
          }
        };
        reader.readAsText(file);
      });
    }

    // Phase Filters
    phaseFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        phaseFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentPhaseFilter = btn.dataset.phase;
        renderSyllabus();
      });
    });

    // Vocab Vault Search & Filter Listeners
    const vocabSearchBox = document.getElementById('vocab-search-box');
    if (vocabSearchBox) {
      vocabSearchBox.addEventListener('input', (e) => {
        state.currentVocabSearch = e.target.value;
        renderVocabVault();
      });
    }

    const vocabFilterPills = document.querySelectorAll('.vocab-filter-pill');
    vocabFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        vocabFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.currentVocabFilter = pill.dataset.filter;
        renderVocabVault();
      });
    });

    const btnQuickDrill = document.getElementById('btn-quick-flashcard-drill');
    if (btnQuickDrill) {
      btnQuickDrill.addEventListener('click', () => {
        startAutopilotSession(false);
      });
    }

    if (mistakeTrackFilter) mistakeTrackFilter.addEventListener('change', renderMistakes);
    if (mistakeTagFilter) mistakeTagFilter.addEventListener('change', renderMistakes);
    if (mistakeStatusFilter) mistakeStatusFilter.addEventListener('change', renderMistakes);

    if (btnExportMistakes) {
      btnExportMistakes.addEventListener('click', () => {
        const json = window.mistakeNotebook.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `autopilot_mistakes_${Date.now()}.json`;
        a.click();
      });
    }

    if (btnAiGenerateNow) {
      btnAiGenerateNow.addEventListener('click', () => {
        const topWeakness = window.adaptiveAIEngine.diagnoseWeakness(state.currentTrack).topTrap;
        launchAdaptiveAIDrill(topWeakness, state.currentTrack);
      });
    }

    // Eco / Lite Mode Toggle (Disables GPU blur & heavy effects for battery & low heat)
    const ecoModeBtn = document.getElementById('eco-mode-btn');
    if (ecoModeBtn) {
      // Auto-detect mobile devices
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobileDevice) {
        document.body.classList.add('eco-mode');
        ecoModeBtn.textContent = '🍃 Eco: Bật';
      }

      ecoModeBtn.addEventListener('click', () => {
        const isEco = document.body.classList.toggle('eco-mode');
        ecoModeBtn.textContent = isEco ? '🍃 Eco: Bật' : '🍃 Eco: Tắt';
      });
    }

    // Furigana Toggle Button (あ/漢)
    const furiganaBtn = document.getElementById('furigana-btn');
    if (furiganaBtn) {
      furiganaBtn.addEventListener('click', () => {
        const isHidden = window.instantDictionary.toggleFurigana();
        furiganaBtn.textContent = isHidden ? '漢 Chỉ Kanji' : 'あ/漢 Furigana';
        furiganaBtn.style.color = isHidden ? '#fb7185' : '#60a5fa';
      });
    }

    // Cloud Sync Modal & Actions (6-Digit PIN)
    const cloudSyncModal = document.getElementById('cloud-sync-modal');
    const btnOpenCloudSync = document.getElementById('btn-open-cloud-sync');
    const closeCloudSyncBtn = document.getElementById('close-cloud-sync-btn');
    const cloudPinInput = document.getElementById('cloud-pin-input');
    const btnCloudPush = document.getElementById('btn-cloud-push');
    const btnCloudPull = document.getElementById('btn-cloud-pull');
    const btnGeneratePin = document.getElementById('btn-generate-pin');
    const cloudSyncStatus = document.getElementById('cloud-sync-status');

    if (cloudPinInput) {
      cloudPinInput.value = window.cloudSync.getPin() || '';
    }

    if (btnOpenCloudSync && cloudSyncModal) {
      btnOpenCloudSync.addEventListener('click', () => cloudSyncModal.classList.add('active'));
    }
    if (closeCloudSyncBtn && cloudSyncModal) {
      closeCloudSyncBtn.addEventListener('click', () => cloudSyncModal.classList.remove('active'));
    }

    if (btnGeneratePin && cloudPinInput) {
      btnGeneratePin.addEventListener('click', () => {
        const newPin = window.cloudSync.generateRandomPin();
        cloudPinInput.value = newPin;
      });
    }

    if (btnCloudPush && cloudPinInput) {
      btnCloudPush.addEventListener('click', async () => {
        const pin = cloudPinInput.value.trim();
        if (!pin) {
          alert('Vui lòng nhập hoặc tạo Mã PIN 6 số trước khi đẩy!');
          return;
        }
        btnCloudPush.disabled = true;
        btnCloudPush.textContent = 'Đang đẩy lên...';
        try {
          const res = await window.cloudSync.pushToCloud(pin);
          if (cloudSyncStatus) {
            cloudSyncStatus.innerHTML = `<span style="color: #34d399;">✓ Đã đồng bộ lên Cloud thành công lúc ${res.timestamp}! Trên điện thoại chỉ cần nhập mã PIN <strong>${pin}</strong> để kéo về.</span>`;
          }
          window.soundEngine.playCorrect();
        } catch (e) {
          alert(`Lỗi đồng bộ: ${e.message}`);
        } finally {
          btnCloudPush.disabled = false;
          btnCloudPush.textContent = '⬆️ Đẩy Lên Đám Mây (Lưu PIN)';
        }
      });
    }

    if (btnCloudPull && cloudPinInput) {
      btnCloudPull.addEventListener('click', async () => {
        const pin = cloudPinInput.value.trim();
        if (!pin) {
          alert('Vui lòng nhập Mã PIN 6 số cần kéo dữ liệu về!');
          return;
        }
        btnCloudPull.disabled = true;
        btnCloudPull.textContent = 'Đang kéo về...';
        try {
          await window.cloudSync.pullFromCloud(pin);
          if (cloudSyncStatus) {
            cloudSyncStatus.innerHTML = `<span style="color: #34d399;">✓ Kéo dữ liệu từ Cloud về thành công! Ứng dụng sẽ tự tải lại...</span>`;
          }
          window.soundEngine.playCorrect();
          setTimeout(() => location.reload(), 800);
        } catch (e) {
          alert(`Lỗi: ${e.message}`);
        } finally {
          btnCloudPull.disabled = false;
          btnCloudPull.textContent = '⬇️ Kéo Về Thiết Bị Này';
        }
      });
    }

    // Mobile Bottom Navigation Bar Buttons
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mobileNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchTab(btn.dataset.tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    if (closeRemedialBtn) {
      closeRemedialBtn.addEventListener('click', () => remedialModal.classList.remove('active'));
    }

    // Modal background click and ESC key
    [remedialModal, settingsModal, cloudSyncModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.isZenMode) {
          toggleZenMode(false);
          return;
        }
        if (remedialModal && remedialModal.classList.contains('active')) remedialModal.classList.remove('active');
        if (settingsModal && settingsModal.classList.contains('active')) settingsModal.classList.remove('active');
        if (cloudSyncModal && cloudSyncModal.classList.contains('active')) cloudSyncModal.classList.remove('active');
      }
    });

    window.addEventListener('mistakes-updated', () => {
      updateStatsDisplay();
    });
  }

  // ----------------------------------------------------
  // CONFETTI CELEBRATION ENGINE
  // ----------------------------------------------------
  function triggerCelebrationConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#a855f7', '#06b6d4'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 3,
        dx: (Math.random() - 0.5) * 16,
        dy: (Math.random() - 0.7) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.08 + 0.04,
        alpha: 1
      });
    }

    let animationFrame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.25;
        p.tiltAngle += p.tiltAngleInc;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        p.alpha -= 0.008;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    draw();
  }

  initApp();
});
